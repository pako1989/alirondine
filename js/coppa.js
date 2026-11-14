// js/coppa.js - «LA COPPA MALEDETTA»: modalità a run (roguelite), torneo a eliminazione in cinque turni.
// Dopo ogni vittoria la Coppa offre tre carte coperte: benedizioni (aiutano), maledizioni (fanno male ma pagano in Pegni e monete) e sigilli (cambiano una regola).
// Le scelte restano per tutta la run. Se perdi una partita la run finisce: il Pegno guadagnato resta e sblocca benedizioni di partenza (meta-progresso).
// Le partite sono quelle del motore comune (a turni, Action HD, Gabbia, Azione 3v3) con i modificatori cfg.mod di window.__borgoApi.matchPick (game.js: apiMatch).
// Modificatori usati: st (somme alle statistiche), guts (moltiplicatore grinta), score (punteggio di partenza), easy, gkBoost (negativo = portiere rivale più debole),
// usLate (nostri gol dal 75' doppi), themFirst2 (il primo gol loro vale doppio). Più oppK (forza avversari) gestito qui.
// Opzione in Impostazioni (accesa di base): window.__coppa.on() / setOn(v). Salvataggio proprio: ali-di-rondine.coppa (+ .opt).
(function () {
  "use strict";
  if (window.__coppa) return;
  const KEY = "ali-di-rondine.coppa", OPT = KEY + ".opt", TITLE = "La Coppa Maledetta";
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const readJ = (k, d) => safe(() => { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }, d);
  const writeJ = (k, v) => safe(() => localStorage.setItem(k, JSON.stringify(v)), 0);
  const api = () => window.__borgoApi || null;
  const coins = (n) => safe(() => { if (n > 0 && typeof window.addCoins === "function") window.addCoins(n); return n; }, 0);
  const rngPick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------------------------------------------------------------- le carte della Coppa
  // t: b (benedizione) · m (maledizione) · s (sigillo). mod: modificatori sommati nella run. pegno: Pegno extra a fine run. coin: monete subito.
  const CARDS = {
    scarpini: { t: "b", e: "👟", n: "Scarpini di Cuoio", d: "Tiro +4.", mod: { st: { tiro: 4 } } },
    polmoni: { t: "b", e: "🫁", n: "Polmoni del Parroco", d: "Grinta ×1,3.", mod: { guts: 1.3 } },
    ginocchio: { t: "b", e: "🦵", n: "Ginocchio Buono", d: "Dribbling +4 e Contrasto +3.", mod: { st: { drib: 4, contr: 3 } } },
    lingua: { t: "b", e: "🗣️", n: "Lingua d'Argento", d: "Passaggio +5.", mod: { st: { pass: 5 } } },
    ubriaco: { t: "b", e: "🍷", n: "Portiere Ubriaco", d: "Il portiere rivale para peggio (−5).", mod: { gkBoost: -5 } },
    vantaggio: { t: "b", e: "🎁", n: "Un Gol di Cortesia", d: "Parti ogni partita in vantaggio 1–0.", mod: { startUs: 1 } },
    arbitro: { t: "b", e: "🧑‍⚖️", n: "Arbitro Distratto", d: "Gli avversari sono più morbidi in difesa.", mod: { easy: true } },
    mezzogiorno: { t: "b", e: "🕛", n: "Gol del Mezzogiorno", d: "Dal 75' i tuoi gol valgono doppio.", mod: { usLate: true } },
    piombo: { t: "m", e: "⚫", n: "Palla di Piombo", d: "Dribbling −5, Passaggio −4. +45 monete e +2 Pegni.", mod: { st: { drib: -5, pass: -4 } }, pegno: 2, coin: 45 },
    sotto: { t: "m", e: "📉", n: "Sempre Sotto", d: "Parti sotto 0–1 in ogni partita. +3 Pegni.", mod: { startThem: 1 }, pegno: 3, coin: 30 },
    doppio: { t: "m", e: "🔔", n: "Il Gol Doppio", d: "Il primo gol subito vale doppio. +3 Pegni.", mod: { themFirst2: true }, pegno: 3, coin: 30 },
    magro: { t: "m", e: "🥣", n: "Digiuno", d: "Grinta ×0,75. +2 Pegni e +40 monete.", mod: { guts: 0.75 }, pegno: 2, coin: 40 },
    ruggine: { t: "m", e: "🦴", n: "Ruggine", d: "Tiro −6 e Contrasto −4. +4 Pegni.", mod: { st: { tiro: -6, contr: -4 } }, pegno: 4, coin: 20 },
    custodi: { t: "m", e: "👹", n: "Avversari Famelosi", d: "Gli avversari sono più forti (+10%). +4 Pegni.", mod: { oppK: 0.1 }, pegno: 4, coin: 25 },
    patto: { t: "s", e: "📜", n: "Patto di Cera", d: "Ogni vittoria dà +10 monete. Avversari +5%.", mod: { oppK: 0.05, winCoin: 10 }, pegno: 1 },
    reliquia: { t: "s", e: "🕯️", n: "Cero di Evaristo", d: "Una volta, se perdi, riparti dal turno con una carta in meno.", mod: { life: 1 }, pegno: 0 },
    scambio: { t: "s", e: "🎲", n: "Dado Truccato", d: "Ogni carta nuova offerta è a tua scelta tra 4 invece di 3.", mod: { offer: 1 }, pegno: 0 }
  };
  // benedizioni di partenza che si sbloccano coi Pegni (si scelgono a inizio run)
  const STARTERS = [
    { id: "scarpini", need: 0 }, { id: "polmoni", need: 0 }, { id: "ginocchio", need: 10 }, { id: "lingua", need: 20 },
    { id: "ubriaco", need: 35 }, { id: "mezzogiorno", need: 55 }, { id: "vantaggio", need: 80 }
  ];
  // ---------------------------------------------------------------- i cinque turni
  const ROUNDS = [
    { t: "Ottavi", bg: "cm_tabellone", opp: "La Corale di Valpiana", col: "#9ca3af", k: 0.72, names: ["Sor Pio", "Il Sagrestano", "Ottone", "Don Ciccio", "Baldo"] },
    { t: "Quarti", bg: "cm_tabellone", opp: "Il Dopolavoro Ferroviario", col: "#2f6fb3", k: 0.84, names: ["Zelindo", "Il Fuochista", "Manlio", "Tarcisio", "Ruggero"] },
    { t: "Semifinale", bg: "cm_altare", opp: "I Gemelli di Capo Nebbia", col: "#a855f7", k: 0.96, names: ["Gemello Primo", "Gemello Secondo", "Nebbiolo", "Il Terzo", "Mirko"] },
    { t: "Finale", bg: "cm_campo", opp: "L'Associazione Evaristo '31", col: "#b3202c", k: 1.08, names: ["Evaristo", "Il Custode", "L'Ombra Destra", "L'Ombra Sinistra", "Il Numero Zero"] },
    { t: "La Coppa", bg: "cm_campo", opp: "Chi Alzò la Coppa", col: "#0a0f0c", k: 1.22, names: ["Il Primo", "Il Capitano del '31", "Il Portiere Senza Volto", "La Mano Sinistra", "L'Ultimo"], boss: true }
  ];
  const FINALS = {
    alzata: ["🏆 La Coppa alzata", "La Coppa è tua. Pesa meno di quanto pensassi, e ti accorgi tardi che è perché dentro c'è già qualcosa."],
    rifiutata: ["🕯️ La Coppa lasciata", "Non la alzi. La riporti sul piedistallo. Evaristo spegne un cero: per la prima volta dal '31, il tabellone resta bianco."],
    maledetta: ["🌑 La Coppa Maledetta", "Hai tre maledizioni su cinque e la Coppa in mano. Ti sorride. Anche questo è un tipo di vittoria."]
  };

  // ---------------------------------------------------------------- stato
  let M = null, R = null, BACK = null;
  const fresh = () => ({ pegni: 0, runs: 0, wins: 0, best: 0, ends: [], seen: [], run: null });
  const load = () => { M = Object.assign(fresh(), readJ(KEY, {})); R = M.run; return M; };
  const save = () => { if (M) { M.run = R; writeJ(KEY, M); } };
  const opt = () => readJ(OPT, {});
  const optSet = (o) => writeJ(OPT, Object.assign(opt(), o));
  const unlocked = () => STARTERS.filter((s) => M.pegni >= s.need);

  function sumMods(picks) {
    const m = { st: {}, guts: 1, oppK: 0, winCoin: 0, life: 0, offer: 0, startUs: 0, startThem: 0, easy: false, usLate: false, themFirst2: false, gkBoost: 0 };
    picks.forEach((id) => {
      const c = CARDS[id]; if (!c) return; const x = c.mod;
      if (x.st) Object.keys(x.st).forEach((k) => { m.st[k] = (m.st[k] || 0) + x.st[k]; });
      if (x.guts) m.guts *= x.guts;
      ["oppK", "winCoin", "life", "offer", "startUs", "startThem", "gkBoost"].forEach((k) => { if (x[k]) m[k] += x[k]; });
      ["easy", "usLate", "themFirst2"].forEach((k) => { if (x[k]) m[k] = true; });
    });
    return m;
  }
  const A = () => api();
  function scene(bg, html, opts) { const a = A(); if (!a) return; a.scene(bg, "voce", html, opts, TITLE); }
  const cardHtml = (id) => { const c = CARDS[id]; return `${c.e} <b>${esc(c.n)}</b> <i>(${c.t === "b" ? "benedizione" : c.t === "m" ? "maledizione" : "sigillo"})</i>: ${esc(c.d)}`; };
  const picksHtml = () => (R.picks.length ? R.picks.map((id) => `· ${cardHtml(id)}`).join("<br>") : "<i>Nessuna carta. Per ora la Coppa ti guarda soltanto.</i>");

  // ---------------------------------------------------------------- menu
  function menuEntry(back) {
    const m = load();
    return { label: "🏆 La Coppa Maledetta", sub: m.run ? `Run in corso · turno ${m.run.round + 1}/5 · ${m.pegni} Pegni` : `Torneo roguelite: ogni vittoria una carta, benedizione o maledizione · ${m.pegni} Pegni`, cls: "hot", fn: () => open(back) };
  }
  function open(back) {
    BACK = typeof back === "function" ? back : BACK || window.title; load();
    const o = opt(); if (!o.cut) { optSet({ cut: true }); if (window.__presa && window.__presa.cutin) return window.__presa.cutin("LA COPPA MALEDETTA", "Cinque turni · una carta a ogni vittoria", menu); }
    menu();
  }
  function leave() { const b = BACK; BACK = null; if (typeof b === "function") b(); else if (window.title) window.title(); }
  function menu() {
    load();
    let txt = `<b>${TITLE}</b><br>Sotto la sede del Borgo c'è una Coppa del 1931 che nessuno ha mai davvero vinto. Cinque turni a eliminazione. Dopo ogni vittoria tre carte coperte: ne scegli <b>una</b>. Benedizioni aiutano, maledizioni fanno male ma pagano in <b>Pegni</b>, i sigilli cambiano le regole. Se perdi, la run finisce. I Pegni restano e sbloccano benedizioni di partenza.`;
    txt += `<br><br>Pegni <b>${M.pegni}</b> · Run ${M.runs} · Vinte ${M.wins} · Turno più lontano ${M.best}/5 · Finali ${M.ends.length}/3`;
    const opts = [];
    if (R) opts.push({ label: "▶ Continua la run", sub: `Turno ${R.round + 1}/5 · ${R.picks.length} carte`, cls: "hot", fn: hub });
    opts.push({ label: R ? "Nuova run (abbandona quella in corso)" : "▶ Nuova run", sub: "Scegli una benedizione di partenza", cls: R ? "" : "hot", fn: starterPick });
    opts.push({ label: "🎞️ Finali", sub: `${M.ends.length}/3`, fn: finali });
    opts.push({ label: "📖 Come si gioca", fn: guida });
    opts.push({ label: "◂ Esci", fn: leave });
    scene("cm_cripta", txt, opts);
  }
  function guida() {
    scene("cm_cripta", `<b>Come si gioca</b><br>· Una run = cinque partite a eliminazione: Ottavi, Quarti, Semifinale, Finale e <b>La Coppa</b>.<br>· Ogni partita si gioca come vuoi: a turni, Action HD, Gabbia o Azione 3v3. Le carte valgono in tutte.<br>· Dopo ogni vittoria: tre carte coperte, ne scegli una. <b>Benedizione</b>: ti aiuta. <b>Maledizione</b>: ti ostacola ma dà Pegni e monete. <b>Sigillo</b>: cambia una regola.<br>· Se perdi: run finita. Se hai il <i>Cero di Evaristo</i>, ti rialzi una volta.<br>· Pegni: restano per sempre e sbloccano benedizioni di partenza. Più maledizioni porti in fondo, più ne guadagni.<br>· La difficoltà cresce a ogni turno e con le maledizioni.<br>· Tre finali: alza la Coppa, rifiutala, o vincila carica di maledizioni.`, [{ label: "◂ Indietro", fn: menu }]);
  }
  function finali() {
    scene("cm_cripta", `<b>Finali</b><br>${Object.keys(FINALS).map((k) => M.ends.includes(k) ? `<b>${FINALS[k][0]}</b>: ${FINALS[k][1]}` : `🔒 <b>???</b>`).join("<br><br>")}`, [{ label: "◂ Indietro", fn: menu }]);
  }

  // ---------------------------------------------------------------- la run
  function starterPick() {
    const ok = unlocked();
    scene("cm_altare", `<b>Una benedizione di partenza.</b> Evaristo apre una scatola di latta e ti mostra cosa ha. ${ok.length < STARTERS.length ? `<br><span style="color:var(--dim)">Altre ${STARTERS.length - ok.length} si sbloccano coi Pegni (prossima a ${STARTERS.find((s) => s.need > M.pegni).need}).</span>` : ""}`,
      ok.map((s) => ({ label: `${CARDS[s.id].e} ${CARDS[s.id].n}`, sub: CARDS[s.id].d, cls: "hot", fn: () => newRun(s.id) })).concat([{ label: "◂ Indietro", fn: menu }]));
  }
  function newRun(starter) {
    M.runs++; R = { round: 0, picks: [starter], pegni: 0, wins: 0, life: 0, log: [] }; save(); intro();
  }
  function intro() {
    scene("cm_cripta", `Evaristo accende l'ultimo cero. «Il tabellone è nuovo. Il gesso no. Cinque turni, e poi la Coppa decide.»<br><br>${picksHtml()}`, [{ label: "Al primo turno ▸", cls: "hot", fn: hub }]);
  }
  function hub() {
    if (!R) return menu();
    const rd = ROUNDS[R.round], m = sumMods(R.picks);
    scene(rd.bg, `<b>${rd.t}</b>${rd.boss ? " · <b>l'ultima</b>" : ""} · <i>${esc(rd.opp)}</i><br>Le tue carte:<br>${picksHtml()}<br><span style="color:var(--dim)">Forza avversari ${Math.round((rd.k + m.oppK) * 100)}% · Pegni della run ${R.pegni}${m.life && !R.life ? " · 🕯️ ancora una vita" : ""}</span>`,
      [{ label: `⚽ Gioca ${rd.t}`, sub: `contro ${rd.opp}`, cls: "hot", fn: play }, { label: "◂ Esci (la run resta)", fn: menu }]);
  }
  function play() {
    const a = A(), rd = ROUNDS[R.round], m = sumMods(R.picks);
    if (!a || !a.matchPick) return hub();
    const k = rd.k + m.oppK, mod = { st: m.st, guts: m.guts, easy: m.easy, gkBoost: m.gkBoost, usLate: m.usLate, themFirst2: m.themFirst2, score: [m.startUs, m.startThem] };
    a.matchPick({ id: "coppa_" + R.round, chap: `${TITLE} · ${rd.t}`, intro: `${rd.t}: contro <em>${esc(rd.opp)}</em>. ${rd.boss ? "Dall'altra parte c'è chi la Coppa l'ha già alzata. Nessuno ricorda come." : "Il tabellone è a gesso."}`, mate: "Tommy", us: "Borgo", alt: "hd,cage,az", bg: rd.bg, oppNames: rd.names, mod,
      team: (t, st) => ({ name: rd.opp, vs: rd.opp, color: rd.col, atk: t(st.tiro * k), def: t((st.contrasto || st.contr || st.tiro) * k), vel: t(st.drib * k) }),
      onDone: (r) => result(!!(r && r.win)) });
  }
  function result(win) {
    const m = sumMods(R.picks), rd = ROUNDS[R.round];
    if (win) {
      R.wins++; R.log.push(rd.t); if (R.round + 1 > M.best) M.best = R.round + 1;
      const wc = m.winCoin ? coins(m.winCoin) : 0;
      if (R.round >= ROUNDS.length - 1) return end(true);
      R.round++; save();
      return offer(wc);
    }
    if (m.life && !R.life) { R.life = 1; R.picks.splice(Math.max(1, R.picks.length - 1) - (R.picks.length > 1 ? 1 : 0), R.picks.length > 1 ? 1 : 0); save(); return scene("cm_altare", `Perdi. Il cero di Evaristo si spegne da solo, e il tabellone si cancella di un turno. <b>Ti rialzi.</b> Ma una carta è sparita nel buio.<br><br>${picksHtml()}`, [{ label: "Riprova ▸", cls: "hot", fn: hub }]); }
    end(false);
  }
  function offer(wc) {
    const m = sumMods(R.picks), n = 3 + (m.offer ? 1 : 0), pool = Object.keys(CARDS).filter((id) => !R.picks.includes(id));
    const mal = shuffle(pool.filter((id) => CARDS[id].t === "m")), ben = shuffle(pool.filter((id) => CARDS[id].t === "b")), sig = shuffle(pool.filter((id) => CARDS[id].t === "s"));
    let out = [ben[0], mal[0], (rngPick([0, 1, 2]) === 0 ? sig[0] : ben[1]) || mal[1]].filter(Boolean);
    while (out.length < n) { const x = shuffle(pool.filter((id) => !out.includes(id)))[0]; if (!x) break; out.push(x); }
    out = shuffle(out);
    scene("cm_altare", `<b>Vittoria.</b> ${wc ? `+${wc} monete dal Patto. ` : ""}Sul tavolo, ${n} carte coperte. Ne scegli una. Le altre tornano nel buio.<br><span style="color:var(--dim)">${R.picks.length} carte in mano · prossimo turno: ${esc(ROUNDS[R.round].t)}</span>`,
      out.map((id) => ({ label: `${CARDS[id].e} ${CARDS[id].n}`, sub: `${{ b: "Benedizione", m: "Maledizione", s: "Sigillo" }[CARDS[id].t]} · ${CARDS[id].d}`, cls: CARDS[id].t === "m" ? "" : "hot", fn: () => take(id) })));
  }
  function take(id) {
    const c = CARDS[id]; R.picks.push(id); R.pegni += c.pegno || 0; if (c.coin) coins(c.coin); save();
    scene("cm_altare", `${cardHtml(id)}<br>${c.pegno ? `<br>+${c.pegno} Pegni${c.coin ? ` · +${c.coin} monete` : ""}.` : ""}`, [{ label: "Avanti ▸", cls: "hot", fn: hub }]);
  }
  function end(won) {
    const mal = R.picks.filter((id) => CARDS[id].t === "m").length, bonus = won ? 6 + R.pegni : Math.ceil(R.pegni / 2) + R.wins;
    M.pegni += bonus; let finale = null;
    if (won) { M.wins++; finale = mal >= 3 ? "maledetta" : (R.picks.includes("reliquia") ? "rifiutata" : "alzata"); if (!M.ends.includes(finale)) M.ends.push(finale); coins(80 + mal * 15); }
    const txt = won ? `<b>${FINALS[finale][0]}</b><br>${FINALS[finale][1]}<br><br>Monete: ${80 + mal * 15} · Pegni guadagnati: <b>${bonus}</b> (totale ${M.pegni})` : `<b>La run finisce al turno ${R.wins + 1}.</b> Il gesso si cancella da solo. Evaristo spegne un cero e ne accende un altro, senza guardarti.<br><br>Pegni guadagnati: <b>${bonus}</b> (totale ${M.pegni}). Restano tuoi.`;
    R = null; save();
    scene(won ? "cm_campo" : "cm_cripta", txt, [{ label: "▶ Nuova run", cls: "hot", fn: starterPick }, { label: "◂ Menu", fn: menu }]);
  }

  window.__coppa = {
    on: () => opt().on !== false, setOn: (v) => { const first = v && !opt().seenOn; optSet({ on: !!v, seenOn: true }); return first; },
    open, menuEntry, CARDS, ROUNDS, TITLE,
    _dbg: { load, state: () => ({ M, R }), sumMods, newRun: (s) => { load(); newRun(s || "scarpini"); }, result, take, offer, hub, play, end, STARTERS, FINALS, CHAPTERS: { 1: {} } }
  };
})();
