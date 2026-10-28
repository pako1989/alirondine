// js/tavolo.js - «Il Tavolo di Sotto»: modalità a run, gioco di carte del calcio contro un arbitro mascherato (ispirata a Inscryption e Slay the Spire).
// Il mazzo nasce dalle tue carte della Squadra dei Sogni (js/sogni.js): più carte hai, più il tavolo è vario. Quattro corsie, un tabellone che pende:
// chi arriva a +5 vince. Le carte forti costano «panchine»: mandi giù le tue carte in campo per farle entrare. Tre atti, una mappa a bivi, tre boss che
// cambiano le regole. Se perdi tutta la run, l'Arbitro tiene la tua carta migliore finché non lo batti. Salvataggio indipendente: ali-di-rondine.tavolo.
(function () {
  "use strict";
  if (window.__tavolo) return;
  const KEY = "ali-di-rondine.tavolo", LANES = 4, WIN = 5, MAXKEPT = 3;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const S = () => window.__sogni;
  const rngOf = (seed) => { let s = (seed >>> 0) || 7; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
  const coins = (n) => safe(() => window.addCoins && window.addCoins(n), 0);

  // ------------------------------------------------------------ carte
  const SIG = {
    smarcato: ["🪽", "Smarcato", "Tira in porta anche se c'è qualcuno davanti. Solo un portiere lo ferma."],
    contrasto: ["🦶", "Contrasto", "Chi lo colpisce perde 1 di fiato."],
    assist: ["🤝", "Assist", "Le carte nelle corsie accanto tirano +1."],
    parata: ["🧤", "Parata", "Ferma anche i tiri degli smarcati."],
    rimbalzo: ["🔁", "Rimbalzo", "La prima volta che esce dal campo, torna in mano."],
    visione: ["👁️", "Visione", "Quando entra in campo, peschi una carta."]
  };
  const ROLE_SIG = { A: "smarcato", D: "contrasto", C: "assist", P: "parata", B: "rimbalzo" };
  const nameOf = (id) => String(safe(() => S().name(id), id) || id).split(",")[0];
  function fromSogni(c) {
    const e = safe(() => S().eff(c), c) || c;
    const atk = e.at >= 85 ? 3 : e.at >= 70 ? 2 : e.at >= 55 ? 1 : 0;
    const res = (e.df >= 85 ? 4 : e.df >= 72 ? 3 : e.df >= 60 ? 2 : 1) + (c.role === "P" ? 1 : 0);
    const sum = atk + res, sig = [ROLE_SIG[c.role] || "assist"].concat(e.te >= 85 ? ["visione"] : []);
    return { id: c.id, n: nameOf(c.id), atk, res, cost: sum >= 6 ? 3 : sum >= 4 ? 2 : sum >= 3 ? 1 : 0, sig, rar: c.rar || "c", up: 0 };
  }
  const RISERVA = () => ({ id: "riserva", n: "Riserva del Borgo", e: "🧢", atk: 1, res: 1, cost: 0, sig: [], rar: "c", up: 0 });
  const RACCATTA = () => ({ id: "rp", n: "Raccattapalle", e: "🧹", atk: 0, res: 1, cost: 0, sig: [], rar: "c", up: 0 });
  const OMB = {
    ala: { n: "Ala d'Ombra", e: "🦇", atk: 1, res: 1 }, mediano: { n: "Mediano d'Ombra", e: "🧱", atk: 1, res: 3 }, bomber: { n: "Bomber d'Ombra", e: "💀", atk: 2, res: 2 },
    terzino: { n: "Terzino d'Ombra", e: "🪨", atk: 0, res: 4, sig: ["contrasto"] }, fantasma: { n: "Fantasma", e: "👻", atk: 1, res: 1, sig: ["smarcato"] },
    capitano: { n: "Capitano d'Ombra", e: "🎩", atk: 3, res: 3 }, bandierina: { n: "Bandierina", e: "🚩", atk: 1, res: 2 }, replay: { n: "Replay", e: "📼", atk: 2, res: 1, sig: ["smarcato"] },
    maschera: { n: "Maschera", e: "🎭", atk: 2, res: 4, sig: ["parata"] }
  };
  const POOL = { 1: ["ala", "ala", "mediano", "fantasma", "bomber"], 2: ["ala", "mediano", "bomber", "terzino", "fantasma", "replay"], 3: ["ala", "mediano", "bomber", "terzino", "fantasma", "bomber", "capitano"] };
  const BOSS = {
    1: { id: "guardalinee", n: "Il Guardalinee", e: "🚩", rule: "Fuorigioco: ogni turno una tua corsia ha la bandierina alzata e non tira.", pool: ["bandierina", "ala", "mediano", "bomber"],
      intro: ["Dal buio esce un uomo magro con una bandierina in mano. Non dice niente. La alza. La abbassa. La rialza.", "«Fuorigioco», sussurra l'Arbitro. «Il mio guardalinee non sbaglia mai. È per questo che non lo invitano più da nessuna parte.»"] },
    2: { id: "moviola", n: "La Moviola", e: "📼", rule: "Revisione: ogni turno il tuo primo gol vale 1 in meno.", pool: ["replay", "bomber", "terzino", "fantasma"],
      intro: ["Sul tavolo si accende un vecchio televisore. Dentro, una partita in bianco e nero che va avanti e indietro, avanti e indietro.", "«Rivediamo l'azione», dice l'Arbitro. «La rivediamo finché non mi piace.»"] },
    3: { id: "arbitro", n: "L'Arbitro di Sotto", e: "🎭", rule: "Seconda frazione: a metà partita il tavolo cambia.", pool: ["maschera", "mediano", "bomber", "fantasma", "terzino", "ala"],
      intro: ["L'Arbitro si siede dall'altra parte del tavolo. Si aggiusta la maschera. Mescola le carte senza guardarle.", "«Ultima partita. Se vinci, ti dico chi sono. Se perdi, la tua carta migliore resta qui. Come le altre.» Indica una scatola piena di carte. Alcune hanno facce che conosci."] }
  };
  const NODES = { partita: ["⚽", "Partita", "Una sfida al tavolo. Vinci e scegli una carta nuova."], mercato: ["🛒", "Mercato nero", "Tre carte rare della tua collezione: una è tua."], spogliatoio: ["🔥", "Spogliatoio", "Potenzi una carta. La seconda volta, rischi che si stiri."], pegni: ["⛓️", "Banco dei Pegni", "Lasci una carta e passi i suoi sigilli a un'altra."], biglietto: ["✉️", "Un biglietto", "Qualcuno ha lasciato un messaggio sul tavolo."], boss: ["👑", "Il boss", "Chi regge il tavolo di quest'atto."] };

  // ------------------------------------------------------------ salvataggio
  const load = () => Object.assign({ runs: 0, wins: 0, best: 0, kept: [], ends: [], seen: false, run: null }, safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {});
  const save = (m) => safe(() => localStorage.setItem(KEY, JSON.stringify(m)), 0);
  let M = null, R = null, B = null, root = null, BACK = null;
  const persist = () => { M.run = R; save(M); };

  function collection() {
    safe(() => S().sync && S().sync(), 0);
    const own = (safe(() => S()._load().own, []) || []).filter((id) => !M.kept.includes(id)), by = safe(() => S().BY, {}) || {};
    let list = own.map((id) => by[id]).filter(Boolean);
    if (list.length < 4) list = list.concat(["leo", "nico", "tommy", "ruggeri", "dario", "sara"].filter((id) => !own.includes(id) && !M.kept.includes(id)).map((id) => by[id]).filter(Boolean)).slice(0, Math.max(4, list.length));
    return list;
  }
  function starter() {
    const col = collection(), team = (safe(() => S()._load().team, []) || []).filter((id) => col.some((c) => c.id === id));
    const pick = team.map((id) => col.find((c) => c.id === id)).concat(col.filter((c) => !team.includes(c.id)).sort((a, b) => (a.at + a.df) - (b.at + b.df))).slice(0, 4);
    return pick.map(fromSogni).concat([RISERVA(), RISERVA()]);
  }
  function genMap(rnd, act) {
    const ty = ["partita", "mercato", "spogliatoio", "pegni", "biglietto"], fl = [];
    for (let i = 0; i < 4; i++) { const a = i === 0 || i === 2 ? "partita" : ty[Math.floor(rnd() * ty.length)]; let b = ty[1 + Math.floor(rnd() * (ty.length - 1))]; if (b === a) b = a === "partita" ? "mercato" : "partita"; fl.push([a, b]); }
    fl.push(["boss"]); return fl;
  }
  const RND = () => { const r = rngOf(R.seed + R.act * 997 + R.floor * 131 + (R.tick = (R.tick || 0) + 1) * 7919); return r; };

  // ------------------------------------------------------------ battaglia
  const inst = (c, side) => Object.assign({}, c, { hp: c.res, side, uid: Math.random().toString(36).slice(2, 8), sig: (c.sig || []).slice() });
  const ombra = (k) => inst(Object.assign({ id: "o_" + k, sig: [] }, OMB[k], { cost: 0 }), "o");
  function startBattle(boss) {
    const deck = R.deck.map((c) => Object.assign({}, c)), rnd = RND();
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    B = { boss: boss ? BOSS[R.act] : null, act: R.act, mine: Array(LANES).fill(null), theirs: Array(LANES).fill(null), queue: Array(LANES).fill(null), hand: [], pile: deck, rp: 10, scale: 0, turn: 0, phase: "play", sel: null, sac: [], log: [], hint: "", rnd, phase2: false, used: {} };
    B.hand.push(inst(RACCATTA(), "p")); for (let i = 0; i < 3 && B.pile.length; i++) B.hand.push(inst(B.pile.shift(), "p"));
    enemyQueue(); B.hint = "Tocca una carta in mano, poi una tua corsia. Le carte con 🔻 costano panchine: prima tocca chi mandi giù.";
    if (boss) story(B.boss.intro.concat(["Regola del tavolo: " + B.boss.rule]), render); else render();
  }
  function enemyQueue() {
    const pool = B.phase2 ? null : (B.boss ? B.boss.pool : POOL[B.act]), n = B.turn === 0 ? 1 + (B.boss && B.act > 2 ? 1 : 0) : B.rnd() < 0.16 + 0.08 * B.act ? 2 : B.rnd() < 0.8 ? 1 : 0;
    for (let k = 0; k < n; k++) {
      const free = [0, 1, 2, 3].filter((i) => !B.queue[i]); if (!free.length) break;
      const lane = free[Math.floor(B.rnd() * free.length)];
      if (B.phase2) { const src = phase2Pool(); B.queue[lane] = src[Math.floor(B.rnd() * src.length)](); }
      else B.queue[lane] = ombra(pool[Math.floor(B.rnd() * pool.length)]);
    }
  }
  // la seconda frazione: l'Arbitro gioca le carte che ha trattenuto (o le tue, rovesciate)
  function phase2Pool() {
    const by = safe(() => S().BY, {}) || {}, ids = M.kept.filter((id) => by[id]).concat(R.deck.filter((c) => c.id !== "riserva").map((c) => c.id)).slice(0, 6);
    const f = ids.map((id) => () => { const c = by[id] ? fromSogni(by[id]) : R.deck.find((x) => x.id === id); const o = inst(Object.assign({}, c, { n: (c.n || "?") + " d'ombra", atk: Math.min(3, (c.atk | 0) + 1), shade: true }), "o"); return o; });
    return f.length ? f : [() => ombra("maschera")];
  }
  const offside = () => (B.boss && B.boss.id === "guardalinee" ? (B.turn + R.seed) % LANES : -1);
  const atkOf = (row, i) => { const c = row[i]; if (!c) return 0; let a = c.atk; [i - 1, i + 1].forEach((j) => { if (row[j] && row[j].sig.includes("assist")) a += 1; }); return a; };
  function hit(side, i) {
    const A = side === "p" ? B.mine : B.theirs, D = side === "p" ? B.theirs : B.mine, c = A[i];
    if (!c) return; const a = atkOf(A, i); if (a <= 0) return;
    if (side === "p" && i === offside()) { B.log.push(`🚩 ${c.n}: fuorigioco, non tira.`); return; }
    const t = D[i], direct = !t || (c.sig.includes("smarcato") && !t.sig.includes("parata"));
    if (direct) {
      let g = a; if (side === "p" && B.boss && B.boss.id === "moviola" && !B.used.mov) { B.used.mov = true; g = Math.max(0, g - 1); B.log.push("📼 La Moviola rivede: il gol vale 1 in meno."); }
      B.scale += side === "p" ? g : -g; if (g) B.log.push(`${side === "p" ? "⚽" : "🥅"} ${c.n} tira in porta: ${side === "p" ? "+" : "−"}${g}.`); return;
    }
    t.hp -= a; B.log.push(`💥 ${c.n} colpisce ${t.n} (−${a}).`);
    if (t.sig.includes("contrasto")) { c.hp -= 1; B.log.push(`🦶 ${t.n} contrasta: ${c.n} −1.`); if (c.hp <= 0) out(A, i); }
    if (t.hp <= 0) out(D, i);
  }
  function out(row, i) {
    const c = row[i]; row[i] = null; if (!c) return;
    if (c.side === "p" && c.sig.includes("rimbalzo") && !B.used["rb_" + c.uid]) { B.used["rb_" + c.uid] = true; B.hand.push(Object.assign(c, { hp: c.res })); B.log.push(`🔁 ${c.n} rimbalza in mano.`); return; }
    B.log.push(`🪑 ${c.n} esce dal campo.`);
  }
  function bell() {
    if (!B || B.phase !== "play") return; B.log = []; B.sel = null; B.sac = []; B.used.mov = false;
    for (let i = 0; i < LANES; i++) hit("p", i);
    if (check()) return;
    for (let i = 0; i < LANES; i++) if (!B.theirs[i] && B.queue[i]) { B.theirs[i] = B.queue[i]; B.queue[i] = null; }
    for (let i = 0; i < LANES; i++) hit("o", i);
    if (check()) return;
    B.turn++; enemyQueue(); B.phase = B.pile.length || B.rp ? "draw" : "play";
    B.hint = B.phase === "draw" ? "Pesca: dal mazzo o un raccattapalle." : "Niente da pescare. Gioca e fischia."; render();
  }
  function check() {
    if (B.scale >= WIN && B.boss && B.boss.id === "arbitro" && !B.phase2) {
      B.phase2 = true; B.scale = 0; B.theirs.fill(null); B.queue.fill(null); enemyQueue(); B.turn++; B.phase = "draw";
      story(["L'Arbitro ride. Una risata lunga, che non finisce dove dovrebbe.", "Le luci si abbassano. Il tavolo si gira da solo: il panno verde diventa rosso. Dall'altra parte, adesso, ci sono le tue carte. Con gli occhi vuoti.", "«Seconda frazione», dice. «Il punteggio riparte. Il campo no.»"], render);
      return true;
    }
    if (B.scale >= WIN) { B.phase = "end"; render(); setTimeout(() => winBattle(), 0); return true; }
    if (B.scale <= -WIN) { B.phase = "end"; render(); setTimeout(() => loseBattle(), 0); return true; }
    return false;
  }
  function draw(src) {
    if (!B || B.phase !== "draw") return false;
    if (src === "rp" && B.rp > 0) { B.rp--; B.hand.push(inst(RACCATTA(), "p")); }
    else if (src === "mazzo" && B.pile.length) B.hand.push(inst(B.pile.shift(), "p"));
    else return false;
    B.phase = "play"; B.hint = "Gioca le carte, poi 🔔 Fischio."; render(); return true;
  }
  // gioca: indice in mano, corsia, corsie da mandare in panchina
  function play(hi, lane, sacs) {
    const c = B && B.phase === "play" && B.hand[hi]; if (!c) return false; sacs = (sacs || []).slice(0, c.cost);
    if (sacs.length < c.cost || sacs.some((s) => !B.mine[s])) return false;
    if (B.mine[lane] && !sacs.includes(lane)) return false;
    sacs.forEach((s) => { B.log.push(`🪑 ${B.mine[s].n} va in panchina per far entrare ${c.n}.`); B.mine[s] = null; });
    B.mine[lane] = c; B.hand.splice(hi, 1); B.sel = null; B.sac = [];
    if (c.sig.includes("visione") && B.pile.length) { B.hand.push(inst(B.pile.shift(), "p")); B.log.push(`👁️ ${c.n} vede il gioco: peschi una carta.`); }
    B.hint = "Altre carte, o 🔔 Fischio."; render(); return true;
  }
  function tapHand(i) {
    if (B.phase !== "play") return; const c = B.hand[i]; if (!c) return;
    const onBoard = B.mine.filter(Boolean).length;
    if (c.cost > onBoard) { B.hint = `${c.n} costa ${c.cost} panchin${c.cost > 1 ? "e" : "a"}: ti servono ${c.cost} carte in campo da mandare giù.`; return render(); }
    B.sel = B.sel === i ? null : i; B.sac = []; B.hint = B.sel == null ? "" : c.cost ? `Tocca ${c.cost} tue carte in campo da mandare in panchina.` : "Tocca una tua corsia libera."; render();
  }
  function tapLane(i) {
    if (B.phase !== "play" || B.sel == null) return; const c = B.hand[B.sel];
    if (B.sac.length < c.cost) { if (!B.mine[i]) return; B.sac = B.sac.includes(i) ? B.sac.filter((x) => x !== i) : B.sac.concat(i); B.hint = B.sac.length < c.cost ? `Ancora ${c.cost - B.sac.length} da mandare giù.` : "Ora tocca la corsia dove entra."; return render(); }
    play(B.sel, i, B.sac);
  }
  function winBattle() {
    const boss = !!B.boss; R.battles = (R.battles || 0) + 1; coins(boss ? 40 : 15); B = null;
    if (boss) {
      if (R.act >= 3) return pact();
      R.act++; R.floor = 0; R.candles = 2; R.map = genMap(RND(), R.act); M.best = Math.max(M.best, R.act); persist();
      return story([`Il boss si alza dal tavolo e sparisce nel buio. L'Arbitro accende un fiammifero nuovo: due fiammiferi, di nuovo.`, `Atto ${["", "I", "II", "III"][R.act]}. Il tavolo si allunga, le ombre pure.`], showMap);
    }
    R.floor++; persist(); reward("Vinta. L'Arbitro spinge verso di te tre carte coperte. Ne puoi tenere una.", false);
  }
  function loseBattle() {
    R.candles--; const boss = !!B.boss; B = null;
    if (R.candles > 0) { persist(); return story(["Il tabellone pende tutto dalla sua parte. L'Arbitro si sporge e soffia su uno dei tuoi fiammiferi.", "«Ne hai ancora uno. Rigiochiamo.»"], () => startBattle(boss)); }
    runOver();
  }
  function runOver() {
    const best = R.deck.filter((c) => c.id !== "riserva" && !String(c.id).startsWith("o_")).sort((a, b) => (b.atk + b.res) - (a.atk + a.res))[0];
    if (best && !M.kept.includes(best.id)) { M.kept.push(best.id); while (M.kept.length > MAXKEPT) M.kept.shift(); }
    M.run = null; R = null; save(M);
    story(["L'ultimo fiammifero si spegne. Nel buio senti solo le carte che vengono mescolate.", best ? `«Questa la tengo io», dice l'Arbitro. Prende ${esc(best.n)} e la mette nella scatola. «Vieni a riprendertela. Se ci riesci.»` : "«Niente da tenere. Che peccato.»"], menu);
  }
  function pact() {
    R.phase = "pact"; persist();
    story(["L'Arbitro posa le carte. Si toglie un guanto, poi l'altro. Ti guarda attraverso i buchi della maschera.", "«Hai vinto. Ti avevo promesso chi sono. Sono quello che ha vinto prima di te.»", "«Il tavolo ha bisogno di qualcuno dall'altra parte. Io sono stanco. Tu sei bravo. Fai due più due.»"], () => choose("Ti porge la maschera.", [
      ["🎭 Prendi la maschera", "Siedi dall'altra parte. Le carte restano a te.", () => finish("maschera")],
      ["💡 Accendi la luce", "Trovi l'interruttore. Il tavolo, finalmente, si vede tutto.", () => finish("luce")]
    ]));
  }
  function finish(e) {
    M.wins++; M.best = 3; if (!M.ends.includes(e)) M.ends.push(e); const back = M.kept.slice(); M.kept = []; M.run = null; R = null; save(M); coins(200);
    story(e === "maschera"
      ? ["Ti infili la maschera. È calda, come se qualcuno l'avesse appena tolta. Lo era.", "L'Arbitro si alza, si stira la schiena, e se ne va su per le scale senza voltarsi. Fuori, per la prima volta da anni, qualcuno lo sente fischiettare.", back.length ? "Nella scatola trovi le tue carte trattenute. Le rimetti nel mazzo. Il prossimo che scende, lo aspetterai tu." : "Il prossimo che scende, lo aspetterai tu.", "FINALE: «La Maschera». +200 monete."]
      : ["Il tuo dito trova l'interruttore. Una lampadina da quaranta watt si accende sopra il tavolo.", "Il capanno è solo il magazzino sotto la tribuna: reti, coni, un tavolo da ping-pong coperto da un panno verde. L'Arbitro è un vecchio custode con una maschera di carnevale. Ha gli occhi lucidi.", "«Grazie», dice. «Non sapevo più come si accendeva.» Ti restituisce tutte le carte della scatola, una per una, come si restituiscono le lettere.", "FINALE: «La Luce». +200 monete."], menu);
  }

  // ------------------------------------------------------------ nodi della mappa
  function offer(n, rare) {
    const rnd = RND(), inDeck = R.deck.map((c) => c.id); let pool = collection().filter((c) => !inDeck.includes(c.id));
    if (rare) { const r = pool.filter((c) => c.rar && c.rar !== "c"); if (r.length >= n) pool = r; }
    const out = []; while (out.length < n && pool.length) out.push(fromSogni(pool.splice(Math.floor(rnd() * pool.length), 1)[0]));
    while (out.length < n) out.push(rare ? Object.assign(RISERVA(), { n: "Riserva d'Oro", e: "🏅", atk: 2, res: 2, cost: 1 }) : RISERVA());
    return out;
  }
  function reward(txt, rare) {
    const o = offer(3, rare);
    choose(txt, o.map((c) => [`${c.e || "🃏"} ${c.n} · ⚽${c.atk} 💨${c.res}${c.cost ? " 🔻" + c.cost : ""}`, c.sig.map((s) => SIG[s][1]).join(", ") || "Nessun sigillo", () => { R.deck.push(c); persist(); showMap(); }]).concat([["↩ Nessuna", "Il mazzo resta com'è", () => showMap()]]));
  }
  function node(k) {
    const t = R.map[R.floor] && R.map[R.floor][k]; if (!t) return;
    R.path = (R.path || []).concat(t); persist();
    if (t === "partita") return startBattle(false);
    if (t === "boss") return startBattle(true);
    const next = () => { R.floor++; persist(); showMap(); };
    if (t === "mercato") { R.floor++; persist(); return reward("Un banco al buio, una candela. Tre carte rare sotto un panno. Il venditore non ha faccia, solo mani.", true); }
    if (t === "spogliatoio") return choose("Uno spogliatoio senza finestre. Una panca, un massaggiatore che non parla. Chi mandi sul lettino?", R.deck.map((c, i) => [`${c.e || "🃏"} ${c.n} · ⚽${c.atk} 💨${c.res}${c.up ? " · già trattata" : ""}`, c.up ? "Rischio: può stirarsi" : "Nessun rischio, la prima volta", () => choose(`${c.n} sul lettino.`, [
      ["⚽ +1 Tiro", "Più potenza", () => train(i, "atk", next)], ["💨 +2 Fiato", "Più resistenza", () => train(i, "res", next)]
    ])]).concat([["↩ Nessuno", "Esci dallo spogliatoio", next]]));
    if (t === "pegni") {
      if (R.deck.length < 3) { return story(["Il Banco dei Pegni è chiuso. Sul vetro: «Torna con più carte»."], next); }
      return choose("Il Banco dei Pegni: «Lasci una carta. I suoi sigilli passano a un'altra. Le carte non si lamentano. Quasi mai.»", R.deck.map((c, i) => [`${c.e || "🃏"} ${c.n}`, c.sig.map((s) => SIG[s][0] + " " + SIG[s][1]).join(", ") || "Niente sigilli", () => choose(`Chi riceve i sigilli di ${c.n}?`, R.deck.map((d, j) => (j === i ? null : [`${d.e || "🃏"} ${d.n}`, d.sig.map((s) => SIG[s][1]).join(", ") || "Niente sigilli", () => { const gained = c.sig.filter((s) => !d.sig.includes(s)); d.sig = d.sig.concat(gained); R.deck.splice(i, 1); persist(); story([`${c.n} resta al Banco. ${d.n} ${gained.length ? "ora ha: " + gained.map((s) => SIG[s][0] + " " + SIG[s][1]).join(", ") : "non impara niente di nuovo"}.`], next); }])).filter(Boolean).concat([["↩ Ci ripenso", "", () => node(k)]]))]).concat([["↩ Non lascio niente", "", next]]));
    }
    if (t === "biglietto") {
      const ev = [
        ["«Lascia una Riserva sul tavolo. Prendine una migliore.»", [["Accetta", "Scambi una Riserva con una Riserva d'Oro", () => { const i = R.deck.findIndex((c) => c.id === "riserva"); if (i >= 0) R.deck.splice(i, 1, Object.assign(RISERVA(), { n: "Riserva d'Oro", e: "🏅", atk: 2, res: 2, cost: 1 })); persist(); story([i >= 0 ? "Sotto il biglietto, una carta dorata. Era lì da prima? Non lo sai." : "Non hai Riserve da lasciare. Il biglietto, offeso, si accartoccia."], next); }], ["Ignoralo", "", next]]],
        ["«Un fiammifero in più. In cambio, la prossima carta che peschi è mia.»", [["Accetta", "+1 fiammifero (massimo 3), perdi una carta a caso", () => { R.candles = Math.min(3, R.candles + 1); const i = Math.floor(RND()() * R.deck.length); const lost = R.deck.length > 3 ? R.deck.splice(i, 1)[0] : null; persist(); story([`Un fiammifero nuovo, acceso. ${lost ? lost.n + " non c'è più nel mazzo." : "Il mazzo è troppo piccolo: l'Arbitro rinuncia, ridendo."}`], next); }], ["Rifiuta", "", next]]],
        ["«Il raccattapalle più vecchio del Borgo vuole giocare. Ha settant'anni e un tiro da vent'anni.»", [["Prendilo", "Una carta ⚽2 💨1 senza costo", () => { R.deck.push({ id: "veterano", n: "Raccattapalle Veterano", e: "👴", atk: 2, res: 1, cost: 0, sig: [], rar: "r", up: 0 }); persist(); story(["Il vecchio si sistema il cappello. «Finalmente mi fanno entrare.»"], next); }], ["Lascialo riposare", "", next]]]
      ][Math.floor(RND()() * 3)];
      return choose(ev[0], ev[1]);
    }
  }
  function train(i, k, then) {
    const c = R.deck[i]; if (!c) return then();
    if (c.up && RND()() < 0.4) { R.deck.splice(i, 1); persist(); return story([`${c.n} si stira durante l'esercizio. Il massaggiatore scuote la testa. Esce dal mazzo.`], then); }
    if (k === "atk") c.atk += 1; else c.res += 2; c.up = (c.up || 0) + 1; persist(); story([`${c.n}: ${k === "atk" ? "+1 Tiro" : "+2 Fiato"}. Si sente nuovo.`], then);
  }

  // ------------------------------------------------------------ interfaccia
  function css() {
    if (document.getElementById("tvCss")) return; const s = document.createElement("style"); s.id = "tvCss";
    s.textContent = `#tvOv{position:fixed;inset:0;z-index:9500;background:#070b09;color:#e7e5e4;font-family:'Trebuchet MS',system-ui,sans-serif;overflow:auto;-webkit-overflow-scrolling:touch}
#tvOv .wr{max-width:560px;margin:0 auto;padding:10px 10px 90px}#tvOv h2{margin:4px 0 6px;font-size:19px;color:#fde68a}#tvOv .sum{color:#a8a29e;font-size:13px;line-height:1.45;margin:6px 0}
#tvOv .top{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:13px;color:#d6d3d1}#tvOv .x{background:#292524;color:#e7e5e4;border:1px solid #57534e;border-radius:8px;padding:6px 10px;font-size:13px}
#tvOv .felt{background:radial-gradient(ellipse at 50% 30%,#1f5135,#0d2418 70%);border:2px solid #3f2a14;border-radius:12px;padding:8px;box-shadow:inset 0 0 40px #000a;margin-top:6px}
#tvOv.red .felt{background:radial-gradient(ellipse at 50% 30%,#5b1414,#1c0505 70%);border-color:#7f1d1d}#tvOv.red{filter:saturate(.8)}
#tvOv .scale{display:grid;grid-template-columns:repeat(11,1fr);gap:2px;margin:6px 0}#tvOv .scale i{height:12px;border-radius:3px;background:#292524}#tvOv .scale i.z{background:#57534e}#tvOv .scale i.on{background:#fde047;box-shadow:0 0 8px #fde047}#tvOv .scale i.p{background:#14532d}#tvOv .scale i.o{background:#7f1d1d}
#tvOv .row{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin:4px 0}#tvOv .slot{min-height:92px;border:1px dashed #ffffff26;border-radius:8px;position:relative;background:#0003}#tvOv .slot.q{min-height:64px;opacity:.75}
#tvOv .slot.sel{outline:2px solid #fde047}#tvOv .slot.sac{outline:2px solid #ef4444}#tvOv .flag{position:absolute;top:-4px;right:-2px;font-size:16px}
#tvOv .cd{background:linear-gradient(180deg,#f5f0e1,#d9cfb4);color:#1c1917;border-radius:7px;padding:3px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;font-size:10px;line-height:1.1;border:2px solid #78716c}
#tvOv .cd.o{background:linear-gradient(180deg,#3f3f46,#18181b);color:#e7e5e4;border-color:#000}#tvOv .cd.sh{background:linear-gradient(180deg,#7f1d1d,#1c0505);color:#fecaca}
#tvOv .cd .im{width:38px;height:38px;border-radius:6px;object-fit:cover;background:#0002;display:flex;align-items:center;justify-content:center;font-size:24px}#tvOv .cd b{font-size:10px;text-align:center;margin:2px 0;max-width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
#tvOv .cd .st{display:flex;gap:6px;font-weight:700;font-size:11px}#tvOv .cd .sg{font-size:11px;min-height:12px}#tvOv .cd .cs{position:absolute;top:2px;left:4px;font-size:10px;color:#b91c1c;font-weight:700}
#tvOv .hand{display:flex;gap:6px;overflow-x:auto;padding:6px 2px 4px}#tvOv .hand .slot{flex:0 0 78px;min-height:104px;border-style:solid;border-color:#0000}
#tvOv .hint{font-size:12.5px;color:#fde68a;min-height:18px;margin:6px 2px}#tvOv .log{font-size:11.5px;color:#a8a29e;line-height:1.4;max-height:86px;overflow:auto;margin:4px 2px}
#tvOv .bt{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}#tvOv .bt button,#tvOv .ch button{flex:1 1 30%;background:#1c1917;color:#fde68a;border:1px solid #a16207;border-radius:9px;padding:10px 8px;font-size:14px;font-weight:700}
#tvOv .bt button:disabled{opacity:.4}#tvOv .bt button.go{background:#a16207;color:#1c1917}#tvOv .ch{display:flex;flex-direction:column;gap:7px;margin-top:10px}#tvOv .ch button{text-align:left}#tvOv .ch button small{display:block;font-weight:400;color:#a8a29e;font-size:12px;margin-top:2px}
#tvOv .story{background:#0c0a09;border:1px solid #44403c;border-radius:10px;padding:12px;font-size:14.5px;line-height:1.55;margin-top:10px;min-height:90px}#tvOv .map{display:flex;flex-direction:column-reverse;gap:4px;margin:8px 0}#tvOv .map div{display:flex;gap:6px;justify-content:center;font-size:12px;color:#78716c}#tvOv .map div.cur{color:#fde68a}#tvOv .map div.done{color:#4d7c0f}
#tvOv .kept{font-size:12px;color:#fca5a5;margin:6px 0}`;
    document.head.appendChild(s);
  }
  function shell() {
    css(); if (!root) { root = document.createElement("div"); root.id = "tvOv"; document.body.appendChild(root); }
    root.classList.toggle("red", !!(B && B.phase2)); root.innerHTML = `<div class="wr"></div>`; return root.querySelector(".wr");
  }
  function close() { if (root) root.remove(); root = null; B = null; const b = BACK; BACK = null; if (b) safe(b, 0); }
  function cardHtml(c, extra) {
    if (!c) return "";
    const u = c.id && !String(c.id).match(/^(o_|rp$|riserva$|veterano$)/) ? safe(() => S().port(c.id), null) : null;
    return `<div class="cd ${c.side === "o" ? (c.shade ? "sh" : "o") : ""}">${c.cost ? `<span class="cs">${"🔻".repeat(c.cost)}</span>` : ""}${u ? `<img class="im" alt="" src="${u}">` : `<div class="im">${c.e || "🃏"}</div>`}<b>${esc(c.n)}</b><div class="st"><span>⚽${c.side ? (extra != null ? extra : c.atk) : c.atk}</span><span>💨${c.side ? c.hp : c.res}</span></div><div class="sg">${(c.sig || []).map((s) => SIG[s] ? SIG[s][0] : "").join("")}</div></div>`;
  }
  function story(lines, then) {
    const w = shell(); let i = 0;
    const show = () => { w.innerHTML = `<div class="top"><h2>🎭 Il Tavolo di Sotto</h2></div><div class="story">${lines[i]}</div><div class="bt"><button type="button" class="go" data-n="1">${i < lines.length - 1 ? "Continua ▸" : "Avanti"}</button></div>`; w.querySelector("[data-n]").onclick = () => { if (++i < lines.length) show(); else then(); }; };
    show();
  }
  function choose(q, opts) {
    const w = shell();
    w.innerHTML = `<div class="top"><h2>🎭 Il Tavolo di Sotto</h2>${R ? `<span>${"🕯️".repeat(R.candles)} · Atto ${["", "I", "II", "III"][R.act]}</span>` : ""}</div><div class="story">${q}</div><div class="ch">${opts.map((o, i) => `<button type="button" data-o="${i}">${o[0]}${o[1] ? `<small>${esc(o[1])}</small>` : ""}</button>`).join("")}</div>`;
    w.querySelectorAll("[data-o]").forEach((b) => (b.onclick = () => opts[+b.dataset.o][2]()));
  }
  function render() {
    if (!B) return; const w = shell(), off = offside();
    const sc = Array.from({ length: 11 }, (_, k) => k - 5).map((v) => `<i class="${v === Math.max(-5, Math.min(5, B.scale)) ? "on" : v === 0 ? "z" : v > 0 ? "p" : "o"}"></i>`).join("");
    const lane = (row, i, kind) => `<div class="slot${kind === "q" ? " q" : ""}${kind === "m" && B.sac.includes(i) ? " sac" : ""}" data-${kind}="${i}">${kind === "m" && i === off ? `<span class="flag">🚩</span>` : ""}${cardHtml(row[i], row[i] ? atkOf(row, i) : null)}</div>`;
    w.innerHTML = `<div class="top"><span>${B.boss ? `${B.boss.e} <b>${esc(B.boss.n)}</b>` : `⚽ Partita · Atto ${["", "I", "II", "III"][B.act]}`}</span><span>${"🕯️".repeat(R.candles)} <button type="button" class="x" data-q="1">✕</button></span></div>
      <div class="felt"><div class="sum" style="margin:0;color:#d6d3d1">Tabellone: <b>${B.scale > 0 ? "+" : ""}${B.scale}</b> · a +5 vinci, a −5 perdi${B.boss ? " · " + esc(B.boss.rule) : ""}</div><div class="scale">${sc}</div>
      <div class="row">${[0, 1, 2, 3].map((i) => lane(B.queue, i, "q")).join("")}</div>
      <div class="row">${[0, 1, 2, 3].map((i) => lane(B.theirs, i, "t")).join("")}</div>
      <div class="row">${[0, 1, 2, 3].map((i) => lane(B.mine, i, "m")).join("")}</div></div>
      <div class="hint">${esc(B.hint)}</div>
      <div class="hand">${B.hand.map((c, i) => `<div class="slot${B.sel === i ? " sel" : ""}" data-h="${i}">${cardHtml(c)}</div>`).join("")}</div>
      <div class="bt">${B.phase === "draw" ? `<button type="button" class="go" data-d="mazzo" ${B.pile.length ? "" : "disabled"}>🃏 Mazzo (${B.pile.length})</button><button type="button" class="go" data-d="rp" ${B.rp ? "" : "disabled"}>🧹 Raccattapalle (${B.rp})</button>` : `<button type="button" class="go" data-b="1" ${B.phase === "play" ? "" : "disabled"}>🔔 Fischio</button>${B.sel != null ? `<button type="button" data-u="1">✋ Annulla</button>` : ""}`}<button type="button" data-g="1">❔ Sigilli</button></div>
      <div class="log">${B.log.map(esc).join("<br>")}</div>`;
    w.querySelectorAll("[data-h]").forEach((e) => (e.onclick = () => tapHand(+e.dataset.h)));
    w.querySelectorAll("[data-m]").forEach((e) => (e.onclick = () => tapLane(+e.dataset.m)));
    w.querySelectorAll("[data-d]").forEach((e) => (e.onclick = () => draw(e.dataset.d)));
    const bb = w.querySelector("[data-b]"); if (bb) bb.onclick = bell;
    const ub = w.querySelector("[data-u]"); if (ub) ub.onclick = () => { B.sel = null; B.sac = []; B.hint = ""; render(); };
    w.querySelector("[data-g]").onclick = () => { const keep = B; story([Object.keys(SIG).map((k) => `${SIG[k][0]} <b>${SIG[k][1]}</b>: ${SIG[k][2]}`).join("<br>") + "<br><br>🔻 = panchine: quante tue carte in campo mandi giù per farla entrare. ⚽ Tiro · 💨 Fiato."], () => { B = keep; render(); }); };
    w.querySelector("[data-q]").onclick = () => choose("Lasci il tavolo a metà partita? La run resta salvata: la partita ricomincia da capo quando torni.", [["🚪 Esci", "", () => { B = null; persist(); menu(); }], ["↩ Resta", "", render]]);
  }
  function showMap() {
    if (!R) return menu(); if (R.phase === "pact") return pact();
    const w = shell(), fl = R.map[R.floor] || [];
    w.innerHTML = `<div class="top"><h2>🎭 Atto ${["", "I", "II", "III"][R.act]}</h2><span>${"🕯️".repeat(R.candles)} · 🃏 ${R.deck.length} <button type="button" class="x" data-q="1">✕</button></span></div>
      <p class="sum">Scegli la strada. Il tavolo ti aspetta in fondo a ognuna.</p>
      <div class="map">${R.map.map((f, i) => `<div class="${i === R.floor ? "cur" : i < R.floor ? "done" : ""}">${f.map((t) => NODES[t][0] + " " + NODES[t][1]).join(" · ")}</div>`).join("")}</div>
      <div class="ch">${fl.map((t, k) => `<button type="button" data-k="${k}">${NODES[t][0]} ${NODES[t][1]}<small>${esc(t === "boss" ? BOSS[R.act].n + " · " + BOSS[R.act].rule : NODES[t][2])}</small></button>`).join("")}<button type="button" data-v="1">🃏 Guarda il mazzo<small>${R.deck.length} carte</small></button></div>`;
    w.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => node(+b.dataset.k)));
    w.querySelector("[data-v]").onclick = () => { const w2 = shell(); w2.innerHTML = `<div class="top"><h2>🃏 Il mazzo</h2></div><div class="hand" style="flex-wrap:wrap">${R.deck.map((c) => `<div class="slot">${cardHtml(c)}</div>`).join("")}</div><div class="bt"><button type="button" class="go" data-b="1">◂ Mappa</button></div>`; w2.querySelector("[data-b]").onclick = showMap; };
    w.querySelector("[data-q]").onclick = () => { persist(); menu(); };
  }
  function newRun() {
    R = { seed: (Date.now() % 1e9) | 0, act: 1, floor: 0, candles: 2, deck: starter(), path: [], tick: 0 };
    R.map = genMap(RND(), 1); M.runs++; persist();
    const first = !M.seen; M.seen = true; save(M);
    story(first ? ["Sotto la tribuna del vecchio stadio c'è una porta che non avevi mai notato. Dietro, scale. In fondo, una lampadina spenta e un tavolo coperto di panno verde.", "Dall'altra parte del tavolo, un uomo con la maschera da arbitro. Non si vede la faccia. Si vede il fischietto.", "«Si gioca con le tue carte», dice. «Quelle della tua squadra dei sogni. Se perdi, una resta qui.» Accende due fiammiferi. «Hai due vite. Come tutti, prima di imparare.»"] : ["Scendi le scale. La lampadina è ancora spenta. L'Arbitro ha già mescolato.", "«Di nuovo qui. Bene. Le carte ti aspettavano.»"], showMap);
  }
  function menu() {
    M = load(); R = M.run; B = null; const w = shell(), by = safe(() => S().BY, {}) || {};
    w.innerHTML = `<div class="top"><h2>🎭 Il Tavolo di Sotto</h2><button type="button" class="x" data-q="1">✕ Esci</button></div>
      <p class="sum">Un gioco di carte del calcio contro un arbitro mascherato, sotto la tribuna. Il mazzo nasce dalla tua Squadra dei Sogni. Quattro corsie, un tabellone che pende: a +5 vinci. Le carte forti costano panchine. Tre atti, tre boss che cambiano le regole.</p>
      <p class="sum">Run: ${M.runs} · Vinte: ${M.wins} · Atto più lontano: ${M.best || 0}/3${M.ends.length ? " · Finali: " + M.ends.map((e) => (e === "maschera" ? "🎭 La Maschera" : "💡 La Luce")).join(", ") : ""}</p>
      ${M.kept.length ? `<div class="kept">📦 L'Arbitro tiene: ${M.kept.map((id) => esc(by[id] ? nameOf(id) : id)).join(", ")}. Vinci una run per riaverle.</div>` : ""}
      <div class="ch">${R ? `<button type="button" data-g="c">▶ Continua la run<small>Atto ${["", "I", "II", "III"][R.act]} · ${"🕯️".repeat(R.candles)} · ${R.deck.length} carte</small></button>` : ""}<button type="button" data-g="n">🎴 ${R ? "Nuova run (abbandona quella in corso)" : "Nuova run"}<small>Mazzo iniziale: 4 carte della tua squadra + 2 Riserve</small></button><button type="button" data-g="h">❔ Come si gioca</button></div>`;
    w.querySelector("[data-q]").onclick = close;
    const c = w.querySelector('[data-g="c"]'); if (c) c.onclick = showMap;
    w.querySelector('[data-g="n"]').onclick = newRun;
    w.querySelector('[data-g="h"]').onclick = () => story(["<b>Il turno.</b> Peschi (dal mazzo o un raccattapalle), giochi carte nelle tue quattro corsie, poi suoni 🔔 Fischio: ogni tua carta tira nella sua corsia. Se davanti c'è un avversario, gli toglie fiato; se la corsia è libera, è gol e il tabellone pende verso di te.", "<b>Le panchine 🔻.</b> Le carte forti costano panchine: per farle entrare mandi giù altrettante carte che hai già in campo. I raccattapalle (⚽0 💨1) servono proprio a questo.", "<b>L'avversario.</b> In alto vedi le carte che sta per giocare: scendono in campo dopo il tuo fischio. A +5 vinci, a −5 perdi un fiammifero. Senza fiammiferi la run finisce, e l'Arbitro tiene la tua carta migliore.", "<b>La mappa.</b> Tra una partita e l'altra scegli la strada: mercato, spogliatoio, banco dei pegni, biglietti misteriosi. In fondo a ogni atto, un boss con una regola sua."], menu);
  }
  function open(back) { BACK = back || null; M = load(); menu(); }

  window.__tavolo = {
    open, close, menu, newRun, node, draw, play, bell, tapHand, tapLane, fromSogni, SIG, BOSS, load, save,
    state: () => ({ R, B, M }),
    _battle: (boss) => startBattle(!!boss), _win: () => { if (B) { B.scale = WIN; check(); } }, _lose: () => { if (B) { B.scale = -WIN; check(); } }
  };
})();
