// tests/conte.cjs - «Il Conte di Montecalcio»: zone raggiungibili, capitoli 1-4 giocati (Maschere, Sospetto, prove, accusa), tre finali e minigioco Ballo in Maschera
const L = require("./lib.cjs");
const MOD = { mod: "__conte", key: "ali-di-rondine.conte" };
const K_ = "window.__conte._dbg.K";
const ZONES = ["ct_piazza", "ct_bar", "ct_palazzo", "ct_camerino", "ct_mercato", "ct_sede", "ct_stadio", "ct_spogliatoio", "ct_sagrestia", "ct_giardino", "ct_sala"];
const INTRO = { ch1: 1, ch2: 1, ch3: 1, ch4: 1 }; ZONES.forEach((z) => (INTRO[z] = 1));
const OPEN = { ct_open2: 1, ct_open3: 1, ct_open4: 1, ct_has_mercante: 1, ct_has_custode: 1 };
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(450); await L.advance(p).catch(() => {}); }
async function start(w, save) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__conte.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, []).catch(() => {}); return r;
}
const stubMatch = (p, win) => p.evaluate((win) => { window.__ml = []; window.__borgoApi.matchPick = (cfg) => { window.__ml.push(cfg.id); setTimeout(() => cfg.onDone({ win, a: win ? 2 : 0, b: win ? 0 : 1 }), 10); }; }, win);
const st = async (p, errors, ch, n, what) => { const i = await L.info(p); if ((i.step[ch] || 0) !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
const talk = async (p, id, labels) => { await L.talk(p, id); await L.advance(p, labels || []); };
// guida i dialoghi: clicca in ordine le scelte della sequenza, altrimenti «Continua»; si ferma sulla mappa
async function drive(p, seq, max = 250) {
  let i = 0;
  for (let n = 0; n < max; n++) {
    await p.waitForTimeout(70);
    const r = await p.evaluate(([seq, i]) => { const T = window.T_; if (T.walk()) return "walk"; if (i < seq.length && T.click(seq[i])) return "seq"; for (const q of ["^Continua ▸", "^Avanti", "^Ok", "^Prosegui"]) if (T.click(q)) return "go"; return T.btns().length ? "stuck" : "wait"; }, [seq, i]);
    if (r === "walk") return i; if (r === "seq") i++; if (r === "stuck") { drive.last = await p.evaluate(() => window.T_.btns().map((b) => b.t)); return -1; }
  }
  return -2;
}
const flag = (p, k) => p.evaluate(([K_, k]) => eval(K_).F.is(k), [K_, k]);
const setF = (p, o) => p.evaluate(([K_, o]) => { const K = eval(K_); Object.keys(o).forEach((k) => K.F.set(k, o[k])); }, [K_, o]);
const mask = (p, id) => p.evaluate(([K_, id]) => { const K = eval(K_); K.mask.set(id, true); }, [K_, id]);
const obj = (p, z, key) => p.evaluate(([k, z, key]) => { const K = eval(k), c = Object.values(window.__conte._dbg.CHAPTERS).map((x) => x.obj || {}), f = c.map((o) => o[z + ":" + key]).find(Boolean); if (!f) throw new Error("oggetto " + z + ":" + key); f(); }, [K_, z, key]);

async function zones(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: INTRO, ch: 4, step: { 1: 7, 2: 4, 3: 4, 4: 0 }, done: { 1: "ok", 2: "ok", 3: "ok" }, flags: OPEN });
  for (const z of ZONES) {
    try { await go(page, z); if (w === 390 && /piazza|mercato|stadio|giardino|sala|palazzo/.test(z)) await L.shot(page, "ct_" + z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Conte · zone (${w} px)`, errors); await browser.close();
}

async function flow1(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: INTRO });
  try {
    await go(page, "ct_piazza", 15, 16); await talk(page, "ct_brandolini", ["Il piacere"]); await st(page, errors, 1, 1, "dopo il Sindaco");
    await go(page, "ct_bar", 7, 8); await talk(page, "ct_gino", ["Mi dica solo"]); await st(page, errors, 1, 2, "dopo Gino");
    await go(page, "ct_palazzo", 8, 9); await talk(page, "ct_ersilia", ["Voglio vedere i conti"]); await st(page, errors, 1, 3, "dopo Ersilia");
    if (!(await page.evaluate((k) => eval(k).hasClue("ct_registro"), K_))) errors.push("manca la prova ct_registro");
    await talk(page, "ct_ottavia"); await st(page, errors, 1, 4, "dopo Ottavia");
    await go(page, "ct_piazza", 15, 16); await talk(page, "ct_nina", ["Vorrei vedere"]); await st(page, errors, 1, 5, "dopo Nina");
    await talk(page, "ct_ettore"); await st(page, errors, 1, 6, "dopo Ettore");
    await go(page, "ct_camerino", 2, 5); await obj(page, "ct_camerino", "x"); await L.advance(page).catch(() => {}); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    if (!(await flag(page, "ct_has_mercante")) || !(await flag(page, "ct_open2"))) errors.push("maschere o Mercato non sbloccati");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Conte · capitolo 1 (${w} px)`, errors); await browser.close();
}

async function flow2(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: INTRO, ch: 2, step: { 1: 7 }, done: { 1: "ok" }, flags: OPEN });
  try {
    await stubMatch(page, true);
    await go(page, "ct_mercato", 2, 10);
    await talk(page, "ct_pina"); await st(page, errors, 2, 0, "Pina con la faccia del Conte non deve parlare");
    await mask(page, "mercante");
    await talk(page, "ct_pina"); await st(page, errors, 2, 1, "dopo Pina");
    await go(page, "ct_sede", 7, 8); await talk(page, "ct_tullio"); await st(page, errors, 2, 2, "dopo Tullio");
    await go(page, "ct_mercato", 2, 10); await talk(page, "ct_remo", ["Si gioca"]); await page.waitForTimeout(300); await L.advance(page).catch(() => {}); await st(page, errors, 2, 3, "dopo la partita con Remo");
    await go(page, "ct_sede", 7, 8); await talk(page, "ct_tullio");
    if (!(await page.evaluate((k) => eval(k).hasClue("ct_busta"), K_))) errors.push("manca la prova ct_busta");
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Conte · capitolo 2 (${w} px)`, errors); await browser.close();
}

async function flow3(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: INTRO, ch: 3, step: { 1: 7, 2: 4 }, done: { 1: "ok", 2: "ok" }, flags: OPEN });
  try {
    await go(page, "ct_stadio", 15, 19); await talk(page, "ct_nina"); await st(page, errors, 3, 0, "Nina senza tuta");
    await mask(page, "custode"); await talk(page, "ct_nina"); await st(page, errors, 3, 1, "dopo l'assunzione");
    await go(page, "ct_spogliatoio", 7, 8); await obj(page, "ct_spogliatoio", "C:2,1"); await L.advance(page).catch(() => {}); await obj(page, "ct_spogliatoio", "T:12,7"); await L.advance(page).catch(() => {}); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    await st(page, errors, 3, 2, "dopo spogliatoio");
    await go(page, "ct_sagrestia", 6, 7); await talk(page, "ct_cosimo"); await st(page, errors, 3, 3, "dopo Don Cosimo");
    await go(page, "ct_stadio", 15, 19); await talk(page, "ct_nina", ["Il nove"]);
    const i = await L.info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    if (!(await flag(page, "ct_nina_truth"))) errors.push("la verità a Nina non è registrata");
    for (const c of ["ct_lettera", "ct_referto"]) if (!(await page.evaluate(([k, c]) => eval(k).hasClue(c), [K_, c]))) errors.push("manca la prova " + c);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Conte · capitolo 3 (${w} px)`, errors); await browser.close();
}

const ALL = { ev_ct_registro: true, ev_ct_busta: true, ev_ct_lettera: true, ev_ct_referto: true, ev_ct_timbro: true };
async function flow4(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: INTRO, ch: 4, step: { 1: 7, 2: 4, 3: 4 }, done: { 1: "ok", 2: "ok", 3: "ok" }, flags: Object.assign({}, OPEN, ALL, { ct_nina_truth: 1 }) });
  try {
    await stubMatch(page, true);
    await page.evaluate(() => { window.__ballo.start = (o) => { setTimeout(() => o.onDone({ win: true, a: 10, b: 14, susp: 1 }), 10); return true; }; });
    await go(page, "ct_giardino", 15, 19); await talk(page, "ct_ettore", ["Il Valzer"]); await page.waitForTimeout(300); await L.advance(page).catch(() => {}); await st(page, errors, 4, 1, "dopo il Ballo");
    await go(page, "ct_sala", 9, 10); await talk(page, "ct_ersilia"); await st(page, errors, 4, 2, "dopo Ersilia");
    // ending verità: tre round di accusa con le prove giuste, poi la partita (finta, vinta)
    await L.talk(page, "ct_brandolini"); const dr = await drive(page, ["La Verità", "Il sigillo", "La lettera", "Il referto"]); if (dr < 4 && !(drive.last || []).some((t) => /^Continua la storia/.test(t))) errors.push("accusa a round interrotta: " + dr + " " + JSON.stringify(drive.last));
    const i = await L.info(page); if (i.done[4] !== "verita") errors.push("finale verità non raggiunto: " + JSON.stringify([i.done, i.step, i.ends]));
    if (!(await page.evaluate(() => (window.__ml || []).includes("ct_finale")))) errors.push("la partita finale non è partita");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Conte · capitolo 4 e finale verità (${w} px)`, errors); await browser.close();
}

async function endings() {
  // conto: due prove bastano; custode: segreto, serve tutto in regola
  for (const id of ["conto", "custode"]) {
    const fl = Object.assign({}, OPEN, id === "custode" ? { ev_ct_registro: true, ev_ct_busta: true, ev_ct_lettera: true, ct_nina_truth: 1 } : { ev_ct_registro: true, ev_ct_busta: true });
    const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: INTRO, ch: 4, step: { 1: 7, 2: 4, 3: 4, 4: 2 }, done: { 1: "ok", 2: "ok", 3: "ok" }, flags: fl });
    try {
      await go(page, "ct_sala", 9, 10);
      if (id === "custode") { const lbl = await page.evaluate(() => 0); }
      await L.talk(page, "ct_brandolini"); await drive(page, [id === "conto" ? "Il Conto Saldato" : "Il Custode"]);
      const i = await L.info(page); if (i.done[4] !== id) errors.push("finale " + id + " non raggiunto: " + JSON.stringify([i.done, i.ends]));
    } catch (e) { errors.push(e.message.slice(0, 300)); }
    L.check(`Conte · finale ${id}`, errors); await browser.close();
  }
  // il finale segreto non deve comparire senza le condizioni (Sospetto alto)
  const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: INTRO, ch: 4, step: { 1: 7, 2: 4, 3: 4, 4: 2 }, done: { 1: "ok", 2: "ok", 3: "ok" }, flags: Object.assign({}, OPEN, { ev_ct_registro: true, ev_ct_busta: true, ev_ct_lettera: true }) });
  try {
    await go(page, "ct_sala", 9, 10);
    await L.talk(page, "ct_brandolini"); for (let k = 0; k < 12 && !(await page.evaluate(() => window.T_.btns().some((b) => /Verità/.test(b.t)))); k++) { await page.evaluate(() => window.T_.click("^Continua ▸")); await page.waitForTimeout(120); }
    const t = await page.evaluate(() => window.T_.btns().map((b) => b.t)); if (t.some((x) => /^🔑/.test(x))) errors.push("il finale segreto compare senza le condizioni: " + JSON.stringify(t));
    if (!t.some((x) => /Conto/.test(x))) errors.push("manca il finale Conto: " + JSON.stringify(t));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Conte · finale segreto nascosto", errors); await browser.close();
}

async function masks() {
  const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: INTRO, ch: 2, step: { 1: 7 }, done: { 1: "ok" }, flags: Object.assign({}, OPEN) });
  try {
    const r = await page.evaluate((k) => {
      const K = eval(k), out = {};
      K.mask.meet("x1", true); K.mask.set("mercante", true); out.diff = K.mask.meet("x1", true); out.susp = K.stat("sospetto");
      K.mask.set("conte", true); K.mask.meet("x2", true); K.mask.set("custode", true); K.inv.give("ct_baffi"); out.cov = K.mask.meet("x2", true); out.susp2 = K.stat("sospetto"); out.baffi = K.inv.has("ct_baffi");
      out.again = K.mask.meet("x2", true); return out;
    }, K_);
    if (r.diff !== "diff" || r.susp !== 1) errors.push("faccia diversa: " + JSON.stringify(r));
    if (r.cov !== "covered" || r.susp2 !== 1 || r.baffi) errors.push("baffi di scena: " + JSON.stringify(r));
    if (r.again !== "same") errors.push("lo stesso PNG non deve accorgersi due volte: " + JSON.stringify(r));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Conte · Maschere e Sospetto", errors); await browser.close();
}

async function ballo() {
  const { browser, page, errors } = await start(390, { v: 1, diffSet: true, intro: INTRO });
  try {
    await page.evaluate(() => { window.__bo = null; window.__ballo.start({ n: 8, diff: 0, seed: 11, calm: true, tutorial: false, onDone: (r) => (window.__bo = r) }); });
    await page.waitForTimeout(300);
    // saluta giusto ogni invitato quando entra nella zona
    for (let k = 0; k < 400; k++) {
      const done = await page.evaluate(() => {
        const S = window.__ballo.state; if (!S || S.over) return true;
        S.tick(0.25); const g = S.guests(); const q = g.find((x) => x.st === "walk" && x.x >= 140 && x.x <= 240 && x.c >= 0); if (q) S.press(q.c); return false;
      });
      if (done) break;
    }
    const s = await page.evaluate(() => ({ over: window.__ballo.state.over, g: window.__ballo.state.greeted(), n: window.__ballo.state.need(), sp: window.__ballo.state.susp() }));
    if (!s.over || s.g < s.n || s.sp) errors.push("ballo giocato bene ma non vinto: " + JSON.stringify(s));
    await page.screenshot({ path: L.OUT + "/ct_ballo.png" });
    await page.click("#baGo"); await page.waitForTimeout(200);
    const o = await page.evaluate(() => window.__bo); if (!o || !o.win) errors.push("onDone senza vittoria: " + JSON.stringify(o));
    // perdi: tocca sempre la faccia sbagliata
    await page.evaluate(() => { window.__bo = null; window.__ballo.start({ n: 8, diff: 0, seed: 11, calm: true, tutorial: false, onDone: (r) => (window.__bo = r) }); });
    await page.waitForTimeout(200);
    for (let k = 0; k < 400; k++) {
      const done = await page.evaluate(() => { const S = window.__ballo.state; if (!S || S.over) return true; S.tick(0.25); const q = S.guests().find((x) => x.st === "walk" && x.x >= 140 && x.x <= 240); if (q) S.press((Math.max(0, q.c) + 1) % 3); return false; });
      if (done) break;
    }
    const l = await page.evaluate(() => ({ over: window.__ballo.state.over, sp: window.__ballo.state.susp() })); if (!l.over || l.sp < 4) errors.push("sbagliando sempre dovresti essere smascherato: " + JSON.stringify(l));
    await page.click("#baGo"); await page.waitForTimeout(200);
    const o2 = await page.evaluate(() => window.__bo); if (!o2 || o2.win) errors.push("onDone dovrebbe dare sconfitta: " + JSON.stringify(o2));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Conte · minigioco Ballo in Maschera", errors); await browser.close();
}

(async () => {
  const only = process.argv[2] || "";
  const run = (n, f) => (!only || n.includes(only)) && f();
  await run("zone", () => zones(390)); await run("zone", () => zones(1280));
  await run("c1", () => flow1(390)); await run("c2", () => flow2(390)); await run("c3", () => flow3(390)); await run("c4", () => flow4(390));
  await run("fin", endings); await run("maschere", masks); await run("ballo", ballo);
})().catch((e) => { console.error("✗ conte:", e.message); process.exit(1); });
