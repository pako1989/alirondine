// tests/leo.cjs - «L'Estate del Muro»: zone raggiungibili (in entrambe le versioni), Il Ricordo (versione vera, Pagine vere, diario), capitolo 1 giocato con la partita finta
const L = require("./lib.cjs");
const MOD = { mod: "__leo", key: "ali-di-rondine.leo" };
const K_ = "window.__leo._dbg.K";
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__leo.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
const st = async (p, errors, ch, n, what) => { const i = await L.info(p); if (i.step[ch] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
const S1 = { v: 1, diffSet: true, intro: { ch1: 1, lm_borgo: 1, lm_casa: 1 } };
const S2 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, lm_borgo: 1, lm_casa: 1, lm_trattoria: 1 }, ch: 2, step: { 1: 4 }, done: { 1: "ok" }, flags: { lm_c1_done: 1 } };
async function zones2(w) {
  const { browser, page, errors } = await start(w, S2);
  try {
    await go(page, "lm_trattoria"); if (w === 390) await L.shot(page, "lm_trattoria");
    let bad = await L.reachAll(page, "lm_trattoria"); if (bad.length) errors.push("trattoria: " + bad.join(", "));
    await page.evaluate((k) => eval(k).setEra("lm_trattoria", "vero"), K_); await page.waitForTimeout(600);
    if (w === 390) await L.shot(page, "lm_trattoria_vero");
    const t = await page.evaluate((k) => [eval(k).recall.isTrue("lm_trattoria"), eval(k).at(12, 1), eval(k).at(5, 8), eval(k).at(14, 5), eval(k).at(7, 8)], K_); if (!t[0] || t.slice(1).some((c) => c !== "§")) errors.push("discrepanze trattoria: " + JSON.stringify(t));
    bad = await L.reachAll(page, "lm_trattoria"); if (bad.length) errors.push("trattoria (vera): " + bad.join(", "));
    await go(page, "lm_borgo", 15, 8);
    await L.goAct(page, 15, 6).catch((e) => errors.push("porta trattoria: " + e.message)); await L.advance(page).catch(() => {});
    const z = await L.zone(page); if (z !== "lm_trattoria") errors.push("la porta del Borgo non porta in trattoria: " + z);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`L'Estate del Muro · zone cap. 2 (${w} px)`, errors); await browser.close();
}
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, S2);
  try {
    await go(page, "lm_trattoria", 8, 9); await L.talk(page, "lm_papa"); await L.advance(page); await st(page, errors, 2, 1, "dopo Papà");
    for (const id of ["lm_turista", "lm_capitano", "lm_famiglia"]) { await L.talk(page, id); await L.advance(page); }
    await st(page, errors, 2, 2, "con i tre ordini");
    await L.talk(page, "lm_papa"); await L.advance(page); await st(page, errors, 2, 3, "dopo i piatti");
    await L.talk(page, "lm_turista"); await L.advance(page); await L.talk(page, "lm_famiglia"); await L.advance(page);
    await L.talk(page, "lm_capitano"); await L.advance(page, [alt ? "Sono stato io" : "inciampato"]); await st(page, errors, 2, 4, "serviti i tre tavoli");
    await L.talk(page, "lm_papa"); await L.advance(page, [alt ? "leggendaria" : "Faticosa"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
    const c = await page.evaluate((k) => eval(k).F.is("lm_copri"), K_); if (c !== !!alt) errors.push("scelta del vassoio: " + c);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`L'Estate del Muro · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
async function zones(w) {
  const { browser, page, errors } = await start(w, S1);
  for (const z of ["lm_borgo", "lm_casa"]) {
    try { await go(page, z); if (w === 390) await L.shot(page, "lm_" + z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  // la versione vera della stessa zona: raggiungibile, con le discrepanze
  try {
    await go(page, "lm_borgo", 5, 8);
    await page.evaluate((k) => eval(k).setEra("lm_borgo", "vero"), K_); await page.waitForTimeout(600);
    if (w === 390) await L.shot(page, "lm_borgo_vero");
    const t = await page.evaluate((k) => [eval(k).recall.isTrue("lm_borgo"), eval(k).at(26, 17), eval(k).at(21, 13)], K_);
    if (!t[0] || t[1] !== "§" || t[2] !== "§") errors.push("versione vera/discrepanze: " + JSON.stringify(t));
    const bad = await L.reachAll(page, "lm_borgo"); if (bad.length) errors.push("lm_borgo (vero): " + bad.join(", "));
  } catch (e) { errors.push("vero: " + e.message.slice(0, 160)); }
  L.check(`L'Estate del Muro · zone (${w} px)`, errors); await browser.close();
}
async function ricordo(w) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await go(page, "lm_borgo", 5, 8);
    const b0 = await page.evaluate((k) => { const r = eval(k).recall; return [r.has("lm_borgo"), r.has("lm_casa"), r.count("lm_borgo")[1]]; }, K_); if (!b0[0] || b0[1] || b0[2] !== 4) errors.push("recall base: " + JSON.stringify(b0));
    await page.evaluate((k) => eval(k).recall.toggle(), K_); await page.waitForTimeout(600);
    await L.goAct(page, 26, 17); await L.advance(page);
    const c1 = await page.evaluate((k) => [eval(k).recall.found("c1_muro"), eval(k).recall.count("lm_borgo")[0], eval(k).at(26, 17)], K_); if (!c1[0] || c1[1] !== 1 || c1[2] !== ":") errors.push("pagina vera non registrata: " + JSON.stringify(c1));
    await page.evaluate((k) => eval(k).recall.toggle(), K_); await page.waitForTimeout(600);
    const t = await page.evaluate((k) => [eval(k).recall.isTrue("lm_borgo"), eval(k).at(26, 17)], K_); if (t[0] || t[1] !== "M") errors.push("ritorno alla versione raccontata: " + JSON.stringify(t));
    const h = await page.evaluate((k) => eval(k).recall.html(), K_); if (!/Il muro era basso/.test(h)) errors.push("diario senza la pagina: " + h.slice(0, 120));
    await page.evaluate((k) => eval(k).recall.toggle(), K_); await page.waitForTimeout(500);
    await page.evaluate((k) => { ["c1_scarpa", "c1_pallone", "c1_cartello"].forEach((id) => eval(k).recall.mark(id)); }, K_);
    const n = await page.evaluate((k) => eval(k).recall.count("lm_borgo"), K_); if (n[0] !== 4 || n[1] !== 4) errors.push("conteggio: " + JSON.stringify(n));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`L'Estate del Muro · Il Ricordo (${w} px)`, errors); await browser.close();
}
async function flow1(w, alt) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await L.stubMatch(page, !alt);
    await page.evaluate(() => { window.__tdLog = []; window.__tornadritto.start = (o) => { window.__tdLog.push({ rounds: o.rounds, need: o.need }); setTimeout(() => o.onDone({ win: true, a: 2, b: 4, data: { catches: 2, perfect: 1, throws: 4, best: 2 } }), 30); return true; }; });
    await go(page, "lm_borgo", 5, 8); await L.talk(page, "lm_nico"); await L.advance(page); await st(page, errors, 1, 1, "dopo Nico");
    await L.talk(page, "lm_ottavio"); await L.advance(page, [alt ? "Ti racconto" : "Reggi la cassa"]); await st(page, errors, 1, 2, "dopo Ottavio");
    if (!(await page.evaluate((k) => eval(k).inv.has("lm_pompa"), K_))) errors.push("pompa non ricevuta");
    await L.talk(page, "lm_dario"); await L.advance(page, [alt ? "Non voglio" : "Se il pallone"]); await st(page, errors, 1, 3, "dopo Dario");
    await L.talk(page, "lm_gege"); await L.advance(page, alt ? ["Sbirci", "leggendaria"] : ["Peschi a occhi", "sudata"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const ax = await page.evaluate((k) => [eval(k).stat("leggenda"), eval(k).stat("verita")], K_); if (alt ? !(ax[0] > ax[1]) : !(ax[1] > ax[0])) errors.push("Peso sbagliato: " + JSON.stringify(ax));
    if (!alt) { const t = await page.evaluate(() => window.__tdLog.length); if (t !== 1) errors.push("la sfida del muro non parte: " + t); }
    const m = await page.evaluate(() => window.__lastMatch && window.__lastMatch.id); if (m !== "lm_granchi") errors.push("partita non lanciata: " + m);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`L'Estate del Muro · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// il minigioco «Torna Dritto»: si apre, un tiro vero cambia lo stato, esiste un tiro che torna dritto, il vento si vede, la fine chiude con il risultato
async function muro(w) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await page.evaluate(() => { window.__tdRes = null; window.__tornadritto.start({ title: "Prova", tutorial: false, rounds: 400, need: 2, wind: 0.0001, waves: false, onDone: (r) => { window.__tdRes = r; } }); });
    await page.waitForTimeout(400);
    if (w === 390) await L.shot(page, "lm_muro_inizio");
    // un tiro vero col puntatore: trascina da Leo verso il muro
    const box = await page.evaluate(() => { const r = document.querySelector("#tdOv canvas").getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
    const px = (x, y) => [box[0] + x / 380 * box[2], box[1] + y / 230 * box[3]];
    const [sx, sy] = px(68, 164), [ex, ey] = px(68 + 120, 164 - 30);
    await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.move(ex, ey, { steps: 4 }); await page.mouse.up();
    const t0 = await page.evaluate(() => [window.__tornadritto.state.throws, !!window.__tornadritto.state.ball]); if (t0[0] !== 1 || !t0[1]) errors.push("il tiro col puntatore non parte: " + JSON.stringify(t0));
    await page.evaluate(() => window.__tornadritto.state.tick(6));
    // cerca un tiro che torna dritto (senza vento)
    let found = null;
    for (let ang = 4; ang <= 40 && !found; ang += 2) for (let pw = 0.5; pw <= 1 && !found; pw += 0.05) {
      const r = await page.evaluate(([ang, pw]) => { const S = window.__tornadritto.state, c0 = S.catches; S.shoot(Math.cos(ang * Math.PI / 180), -Math.sin(ang * Math.PI / 180), pw); S.tick(7); return S.catches > c0; }, [ang, pw]);
      if (r) found = [ang, pw];
    }
    if (!found) errors.push("nessun tiro torna dritto: la macchia rossa è irraggiungibile?");
    if (w === 390) await L.shot(page, "lm_muro_gioco");
    await page.evaluate(() => window.__tornadritto.state.finish(true)); await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelector("#tdGo, #tdGo2").click()); await page.waitForTimeout(300);
    const r = await page.evaluate(() => window.__tdRes); if (!r || typeof r.win !== "boolean" || !r.data || !(r.data.throws >= 1)) errors.push("risultato: " + JSON.stringify(r));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`L'Estate del Muro · Torna Dritto (${w} px)`, errors); await browser.close();
}
(async () => {
  const only = process.argv[2] || "";
  for (const w of [390, 320]) {
    if (!only || only === "zone") await zones(w);
    if (!only || only === "ricordo") await ricordo(w);
    if (!only || only === "muro") await muro(w);
    if (!only || only === "zone2") await zones2(w);
    if (!only || only === "c2") { await flow2(w, false); if (w === 390) await flow2(w, true); }
    if (!only || only === "c1") { await flow1(w, false); if (w === 390) await flow1(w, true); }
  }
})();
