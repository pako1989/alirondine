// tests/mondi.cjs - «Il Torneo dei Mondi»: le porte che si aprono finendo le saghe, le sfide nei motori dei mondi,
// la squadra mista con i vantaggi, la staffetta tra motori e i finali
const L = require("./lib.cjs");
const MOD = { mod: "__mondi", key: "ali-di-rondine.mondi" };
const KEYS = { torneo: "ali-di-rondine.torneo", cronache: "ali-di-rondine.cronache", mantello: "ali-di-rondine.mantello", stagione: "ali-di-rondine.stagione", lampioni: "ali-di-rondine.lampioni", vento: "ali-di-rondine.vento", detective: "ali-di-rondine.detective", dopo: "ali-di-rondine.dopo", spazio: "ali-di-rondine.spazio", muro: "ali-di-rondine.muro", cristalli: "ali-di-rondine.cristalli", doppio: "ali-di-rondine.doppio-turno", libro: "ali-di-rondine.libro-finali" };
const fin = (ids) => Object.fromEntries(ids.map((id) => [KEYS[id], { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["x"], diffSet: true, flags: {} }]));
const end = async (p, sel, a, b) => { await p.evaluate(([sel, a, b]) => { const S = (window[sel] || {}).state; S.a = a; S.b = b; S.finish(); }, [sel, a, b]); await p.waitForTimeout(200); await p.evaluate(() => { const bt = document.querySelector(".btOv .ov button, .naOv .ov button, .luOv .ov button, .vgOv .ov button, .atbOv .ov button"); if (bt) bt.click(); }); await p.waitForTimeout(250); };
const startOv = (p) => p.evaluate(() => { const bt = document.querySelector(".btOv .ov button, .naOv .ov button, .luOv .ov button, .vgOv .ov button, .atbOv .ov button"); if (bt) bt.click(); });
async function c12(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, extra: fin(["mantello", "stagione", "vento"]) });
  await page.evaluate(() => window.__mondi.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  { const bad = await L.reachAll(page, "tm_atrio"); if (bad.length) errors.push("tm_atrio irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "tm_atrio");
  await L.talk(page, "tm_custode"); await L.advance(page);
  const open = await page.evaluate(() => window.__mondi._dbg.K.openWorlds().map((x) => x.id).join()); if (open !== "mantello,stagione,vento") errors.push("porte aperte sbagliate: " + open);
  // la porta del Torneo è chiusa (saga non finita)
  await L.goAct(page, 4, 3); await L.advance(page); if (await page.evaluate(() => !!document.querySelector(".vgOv"))) errors.push("la porta chiusa fa giocare");
  // il Mantello: si gioca a Super-Bottoni contro il Dottor Fuorigioco
  await L.goAct(page, 12, 3); await page.evaluate(() => window.T_.click("Accetta la sfida")); await page.waitForTimeout(500);
  const bt = await page.evaluate(() => { const S = window.__bottoni.state; return S && S.o.oppPower; }); if (bt !== "specchio") errors.push("la sfida del Mantello non è a Super-Bottoni: " + bt);
  if (w === 390) await L.shot(page, "tm_sfida");
  await startOv(page); await page.waitForTimeout(200); await end(page, "__bottoni", 2, 0); await L.advance(page);
  // il Vento: campo classico (partita del gioco)
  await L.stubMatch(page, true); await L.goAct(page, 25, 3); await page.evaluate(() => window.T_.click("Accetta la sfida")); await page.waitForTimeout(300); await L.advance(page);
  let i = await L.info(page); if (!i.flags.sig_mantello || !i.flags.sig_vento) errors.push("sigilli mancanti: " + JSON.stringify(i.flags));
  await L.talk(page, "tm_custode"); await L.advance(page, ["Per giocare con tutti"]);
  i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso");
  // capitolo 2: la squadra mista
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  for (const id of ["mg_bullone", "sf_ada"]) { await L.talk(page, id); await L.advance(page, ["^Prendi"]); }
  const party = await page.evaluate(() => window.__tr.TW.z.npcs.filter((n) => n.ghost).map((n) => n.id).join()); if (party !== "mg_bullone,sf_ada") errors.push("squadra mista: " + party);
  // il vantaggio: con Bullone, a Super-Bottoni un tiro in più
  await L.goAct(page, 12, 3); await page.evaluate(() => window.T_.click("Sfida di nuovo")); await page.waitForTimeout(500);
  const shots = await page.evaluate(() => window.__bottoni.state.o.shots); if (shots !== 9) errors.push("Bullone non dà il tiro in più: " + shots);
  await startOv(page); await page.waitForTimeout(200); await end(page, "__bottoni", 1, 0); await L.advance(page);
  await L.talk(page, "tm_custode"); await L.advance(page, ["Rondini dei Mondi"]);
  i = await L.info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i.step));
  L.check(`Il Torneo dei Mondi · capitoli 1 e 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const all = Object.keys(KEYS), fl = { ally_mg_bullone: true, sf_ally: false, ally_sf_ada: true, ally_nl_fiammetta: true }; all.forEach((id) => (fl["sig_" + id] = true));
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "cuore", 2: "rondini" }, diffSet: true, intro: { ch1: 1, ch2: 1, tm_atrio: 1 }, st: {}, flags: fl };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save, extra: fin(all) });
  await page.evaluate(() => window.__mondi.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  await L.talk(page, "tm_custode"); await page.evaluate(() => window.T_.click("Gioca la staffetta")); await page.waitForTimeout(300); await L.advance(page).catch(() => {});
  // tre frazioni: Vignette, ATB, Super-Bottoni (i primi tre motori dei mondi aperti)
  const seen = [];
  for (let k = 0; k < 3; k++) {
    await page.waitForTimeout(500); await L.advance(page).catch(() => {}); await page.waitForTimeout(300);
    const which = await page.evaluate(() => ["__vignette", "__atb", "__bottoni", "__nastro", "__luci"].find((m) => window[m] && window[m].state));
    seen.push(which); if (!which) { errors.push("frazione " + (k + 1) + " non avviata"); break; }
    await startOv(page); await page.waitForTimeout(200); await end(page, which, 1, 0);
  }
  if (seen.join() !== "__vignette,__atb,__bottoni") errors.push("motori della staffetta: " + seen.join());
  await L.advance(page);
  if (w === 390) await L.shot(page, "tm_fine");
  const ends = ["Il Custode si porta", "È ora di tornare", "Non chiudere le porte", "La squadra mista resta"];
  for (const e of ends) {
    await page.evaluate(() => { const K = window.__mondi._dbg.K; K.setStep(3, 1); K.enterZone("tm_atrio"); }); await page.waitForTimeout(400); await L.advance(page);
    await L.talk(page, "tm_custode"); await L.advance(page, [e]);
  }
  const n = await page.evaluate(() => window.__mondi._dbg.K.mem().ends.length); if (n < 4) errors.push("finali trovati " + n + " su 4");
  L.check(`Il Torneo dei Mondi · staffetta e i 4 finali (${w} px)`, errors); await browser.close();
}
(async () => { await c12(390); await c12(320); await c3(390); await c3(320); })().catch((e) => { console.error("✗ mondi:", e.message); process.exit(1); });
