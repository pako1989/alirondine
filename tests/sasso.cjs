// tests/sasso.cjs - «Sette per Sasso Nero»: zone raggiungibili, capitoli giocati con la notte finta, una «Ultima Notte» vera (ondate, porte, granaio), Le Costruzioni
const L = require("./lib.cjs");
const MOD = { mod: "__sasso", key: "ali-di-rondine.sasso" };
const K_ = "window.__sasso._dbg.K";
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__sasso.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
// la notte finta: vince (o perde) subito e registra le porte con cui è stata chiamata
const stub = (p, win = true, fell = []) => p.evaluate(([win, fell]) => { window.__ntLog = []; window.__notte.start = (o) => { window.__ntLog.push({ gates: o.gates, waves: (o.waves || []).length, rain: !!o.rain }); setTimeout(() => o.onDone({ win, a: win ? 80 : 0, b: 1, data: { fell, kills: 30, granaio: win ? 80 : 0, gates: {} } }), 10); return true; }; }, [win, fell]);
const st = async (p, errors, ch, n, what) => { const i = await L.info(p); if (i.step[ch] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
const crew = (p) => p.evaluate((k) => eval(k).crew.list(), K_);
async function zones(w, save, pick, list, tag) {
  const { browser, page, errors } = await start(w, save, pick);
  for (const z of list) {
    try { await go(page, z); if (w === 390) await L.shot(page, "sn_" + z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Sasso Nero · zone ${tag} (${w} px)`, errors); await browser.close();
}
const S1 = { v: 1, diffSet: true, intro: { ch1: 1, sn_villaggio: 1, sn_casa: 1, sn_citta: 1, sn_locanda: 1, sn_dojo: 1 } };
async function flow1(w, alt) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await go(page, "sn_casa", 6, 6); await L.talk(page, "sn_gisaku"); await L.advance(page, [alt ? "Un samurai" : "Basta che"]); await st(page, errors, 1, 1, "dopo Gisaku");
    if (!(await page.evaluate((k) => eval(k).inv.has("sn_kemari"), K_))) errors.push("palla da kemari non ricevuta");
    await go(page, "sn_citta", 5, 19); await L.talk(page, "sn_kanbei"); await L.advance(page, [alt ? "Entro io" : "Calcio la palla"]); await st(page, errors, 1, 2, "dopo Kanbei");
    await go(page, "sn_citta", 14, 16); await L.talk(page, "sn_gonta"); await L.advance(page, [alt ? "Garantisco" : "Paghi la multa"]);
    await go(page, "sn_locanda", 7, 5); await L.talk(page, "sn_oste"); await L.advance(page);
    await L.talk(page, "sn_yumi"); await L.advance(page, [alt ? "Lasciala stare" : "Ti siedi fra loro"]);
    await st(page, errors, 1, 3, "con tre compagni");
    if (!alt) { await L.talk(page, "sn_ren"); await L.advance(page, ["Paghi"]); }
    await go(page, "sn_dojo", 6, 5); await L.talk(page, "sn_hayate"); await L.advance(page, [alt ? "Non duello" : "Accetti il duello"]);
    const c = await crew(page); const want = alt ? 4 : 5; if (c.length !== want) errors.push("compagni: " + JSON.stringify(c));
    const riso = await page.evaluate((k) => eval(k).stat("riso"), K_); if (riso !== (alt ? 6 : 1)) errors.push("riso rimasto: " + riso);
    await go(page, "sn_villaggio", 29, 11); await L.talk(page, "sn_rikichi"); await L.advance(page, [alt ? "Suoni il tamburo" : "Palleggi"]); await L.advance(page).catch(() => {});
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const ax = await page.evaluate((k) => [eval(k).stat("onore"), eval(k).stat("pieta")], K_); if (alt ? !(ax[0] > ax[1]) : !(ax[1] > ax[0])) errors.push("Peso sbagliato: " + JSON.stringify(ax));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
// una notte vera: si apre, la spiegazione si chiude, il Campione corre e calcia, le ondate arrivano, la fine chiude
async function real(w) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await page.evaluate(() => { window.__ntRes = null; window.__notte.start({ title: "Prova", gates: { n: { def: 2, tower: true, who: { id: "sn_kiku", n: "Kiku", pow: "arco" } }, e: { ditch: true, trap: 2, who: { n: "Okuma", pow: "muro" } }, s: { who: { n: "Shino", pow: "cura" } }, o: {} }, waves: [[["base", 3, "o"]], [["lesto", 2, "n"], ["capo", 1, "e"]]], onDone: (r) => { window.__ntRes = r; } }); });
    await page.waitForTimeout(400);
    if (w === 390) await L.shot(page, "sn_notte_tut");
    const t0 = await page.evaluate(() => window.__notte.state.tut()); if (t0) await page.evaluate(() => { const b = [...document.querySelectorAll("#ntOv .tut button")].find((x) => /Gioca|Salta/.test(x.innerText)); if (b) b.click(); });
    await page.evaluate(() => window.__notte.state.tick(3.5)); await page.waitForTimeout(100);
    const w0 = await page.evaluate(() => ({ wave: window.__notte.state.wave, foes: window.__notte.state.foes })); if (w0.wave !== 0 || !(w0.foes > 0)) errors.push("la prima ondata non parte: " + JSON.stringify(w0));
    // il Campione va alla porta ovest (senza difese) e calcia
    await page.evaluate(() => { const b = document.querySelector('#ntOv button[data-g="o"]'); b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); });
    await page.evaluate(() => window.__notte.state.tick(14)); await page.waitForTimeout(100);
    const k1 = await page.evaluate(() => ({ kills: window.__notte.state.kills, hero: window.__notte.state.hero() })); if (!(k1.kills >= 1) || !(k1.hero[0] < 90)) errors.push("il Campione non corre o non calcia: " + JSON.stringify(k1));
    if (w === 390) await L.shot(page, "sn_notte_gioco");
    await page.evaluate(() => window.__notte.state.tick(40)); await page.waitForTimeout(100);
    const g = await page.evaluate(() => window.__notte.state.gates()); if (!g.find((x) => x[0] === "n" && x[2] === 22)) errors.push("la palizzata non rinforza la porta: " + JSON.stringify(g));
    await page.evaluate(() => window.__notte.state.finish(true)); await page.waitForTimeout(300);
    if (w === 390) await L.shot(page, "sn_notte_fine");
    await page.evaluate(() => document.querySelector("#ntGo").click()); await page.waitForTimeout(300);
    const r = await page.evaluate(() => window.__ntRes); if (!r || !r.win || !r.data || !Array.isArray(r.data.fell)) errors.push("risultato della notte: " + JSON.stringify(r));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · Ultima Notte vera (${w} px)`, errors); await browser.close();
}
// Le Costruzioni: i cantieri compaiono quando servono, si costruisce col legno, resta e si smonta
async function build(w) {
  const { browser, page, errors } = await start(w, Object.assign({}, S1, { ch: 1, step: { 1: 4 }, done: { 1: "ok" }, st: { legno: 6 }, flags: { sn_c1_done: 1 } }));
  try {
    await go(page, "sn_villaggio", 14, 4);
    const t0 = await page.evaluate((k) => eval(k).at(14, 3), K_); if (t0 === "O") errors.push("il cantiere si vede prima del tempo");
    await page.evaluate((k) => { eval(k).F.set("sn_cantieri", true); eval(k).go("sn_villaggio", 14, 4); }, K_); await page.waitForTimeout(500);
    const t1 = await page.evaluate((k) => eval(k).at(14, 3), K_); if (t1 !== "O") errors.push("cantiere vuoto non disegnato: " + t1);
    if (w === 390) await L.shot(page, "sn_cantiere");
    await L.goAct(page, 14, 3); await L.advance(page, ["Palizzata"]);
    const k1 = await page.evaluate((k) => [eval(k).build.at("n1"), eval(k).stat("legno"), eval(k).at(14, 3), eval(k).build.list("n").length], K_);
    if (k1[0] !== "palizzata" || k1[1] !== 3 || k1[2] !== "P" || k1[3] !== 1) errors.push("costruzione: " + JSON.stringify(k1));
    await page.evaluate((k) => eval(k).go("sn_casa", 6, 6), K_); await page.waitForTimeout(400); await page.evaluate((k) => eval(k).go("sn_villaggio", 14, 4), K_); await page.waitForTimeout(400);
    if ((await page.evaluate((k) => eval(k).at(14, 3), K_)) !== "P") errors.push("la palizzata non resta");
    await L.goAct(page, 19, 3); await L.advance(page, ["◂ Lascia stare"]);
    const k2 = await page.evaluate((k) => [eval(k).build.place("n2", "torretta"), eval(k).build.place("n2", "trappola"), eval(k).build.remove("n1"), eval(k).stat("legno")], K_);
    if (k2[0] !== false || k2[1] !== true || k2[2] !== true || k2[3] !== 3) errors.push("legno e smontaggio: " + JSON.stringify(k2));
    const html = await page.evaluate((k) => eval(k).build.html(), K_); if (!/Trappola/.test(html)) errors.push("diario senza costruzioni");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · Le Costruzioni (${w} px)`, errors); await browser.close();
}
// capitolo 2: quattro compagni dal capitolo 1, al passo se ne trovano altri due (il prezzo è chi lasci indietro), poi il kemari coi contadini
const C4 = { cr_n: 4, cr_sn_kanbei: 1, cf_sn_kanbei: 1, cr_sn_gonta: 2, cf_sn_gonta: 1, cr_sn_yumi: 3, cf_sn_yumi: 1, cr_sn_hayate: 4, cf_sn_hayate: 1 };
const S2 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, sn_villaggio: 1, sn_casa: 1, sn_citta: 1, sn_locanda: 1, sn_dojo: 1, sn_passo: 1, sn_tempio: 1, sn_fucina: 1 }, ch: 2, step: { 1: 4 }, done: { 1: "ok" }, st: { riso: 2, onore: 7, pieta: 7 }, flags: Object.assign({ sn_c1_done: 1 }, C4) };
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, S2);
  try {
    await page.evaluate((k) => { window.__kmLog = []; eval(k).playMatch = (o) => { window.__kmLog.push(o.oppTeam); setTimeout(() => o.done({ win: true }), 10); }; }, K_);
    await go(page, "sn_villaggio", 17, 6); await L.talk(page, "sn_kanbei"); await L.advance(page); await st(page, errors, 2, 1, "dopo Kanbei");
    await go(page, "sn_passo", 6, 9); await L.talk(page, "sn_kiku"); await L.advance(page, [alt ? "Corvo Rosso pagherà" : "se Jirō è vivo"]);
    if (!alt) {
      await go(page, "sn_fucina", 6, 6); await L.talk(page, "sn_okuma"); await L.advance(page);
      await go(page, "sn_passo", 26, 17); await L.goAct(page, 26, 18); await L.advance(page);
      if (!(await page.evaluate((k) => eval(k).inv.has("sn_ferro"), K_))) errors.push("sabbia di ferro non presa");
      await go(page, "sn_fucina", 6, 6); await L.talk(page, "sn_okuma"); await L.advance(page);
    } else {
      await go(page, "sn_tempio", 7, 7); await L.talk(page, "sn_shino"); await L.advance(page, ["Non posso"]);
      if (!(await page.evaluate((k) => eval(k).inv.has("sn_campanella"), K_))) errors.push("campanella non ricevuta");
      if ((await crew(page)).includes("sn_shino")) errors.push("Shino è venuta lo stesso");
      await go(page, "sn_passo", 8, 15); await L.talk(page, "sn_masa"); await L.advance(page, ["Lo sfidi"]);
    }
    const c = await crew(page); if (c.length !== 6) errors.push("compagni: " + JSON.stringify(c));
    await st(page, errors, 2, 2, "con sei compagni");
    await go(page, "sn_passo", 19, 17); const t = await page.evaluate((k) => eval(k).crew.has("sn_tetsu"), K_); if (t) errors.push("Tetsu entra oltre il completo");
    await go(page, "sn_villaggio", 16, 12); await L.talk(page, "sn_gisaku"); await L.advance(page, ["Kemari coi contadini"]); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const km = await page.evaluate(() => window.__kmLog); if (!km.length) errors.push("il kemari non parte");
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Sasso Nero · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
(async () => {
  const only = process.argv[2] || "";
  for (const w of [390, 320]) {
    if (!only || only === "zone") await zones(w, S1, null, ["sn_villaggio", "sn_casa", "sn_citta", "sn_locanda", "sn_dojo"], "cap. 1");
    if (!only || only === "zone2") await zones(w, S2, null, ["sn_villaggio", "sn_passo", "sn_tempio", "sn_fucina"], "cap. 2");
    if (!only || only === "c2") { await flow2(w, false); if (w === 390) await flow2(w, true); }
    if (!only || only === "c1") { await flow1(w, false); if (w === 390) await flow1(w, true); }
    if (!only || only === "real") await real(w);
    if (!only || only === "build") await build(w);
  }
})();
