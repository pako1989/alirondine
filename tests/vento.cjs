// tests/vento.cjs - «La Valle del Vento Gentile»: i tre capitoli dall'inizio alla fine e i quattro finali
const L = require("./lib.cjs");
const MOD = { mod: "__vento", key: "ali-di-rondine.vento" };
const leave = (p) => p.evaluate(() => [...document.querySelectorAll(".scPitch .ov button")].forEach((b) => b.click()));
const finishPitch = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__sagaCore.pitchState; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await leave(p); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__vento.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["ve_valle", "ve_prato"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await L.goAct(page, 5, 7); await L.advance(page); await L.talk(page, "ve_gualdo"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 24, 7); await L.advance(page); await L.talk(page, "ve_selva"); await L.advance(page, ["Sì"]); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 36, 13); await L.advance(page); await L.talk(page, "ve_sbuffo"); await page.evaluate(() => window.T_.click("Accetta")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(300); await finishPitch(page, 2, 1);
  await L.advance(page); await L.talk(page, "ve_gualdo"); await L.advance(page, ["Riporterò"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step));
  L.check(`Vento · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c3(end) {
  const base = { v: 1, ch: 3, step: { 1: 4, 2: 6, 3: 3 }, done: { 1: "promessa", 2: "ok" }, flags: { ve_chiave: true, ve_turbina_prova: true }, intro: { ch1: 1, ch2: 1, ch3: 1, ve_valle: 1, ve_prato: 1, ve_bosco: 1, ve_colle: 1 }, zone: "ve_prato", st: { selva: end === "soffio" ? 6 : 3, gioia: 9, turbine: end === "turbine" ? 5 : 2 } };
  if (end === "turbine") base.flags.ve_patto = true;
  const { browser, page, errors } = await L.setup({ w: 390, ...MOD, save: base });
  await page.evaluate(() => window.__vento.open()); await page.evaluate(() => window.T_.click("Continua la storia")); await L.advance(page);
  if (end === "soffio") await page.evaluate(() => { const D = window.__vento._dbg; D.K.soffi = () => ({ got: 16, tot: 16 }); D.mem().lore = Object.keys(D.LORE); D.K.save(); });
  await L.talk(page, "ve_mormorio");
  if (end === "turbine") await L.advance(page, ["Lasciamo fare alla Compagnia"]);
  else { await page.evaluate(() => window.T_.click("Si gioca!")); await page.waitForTimeout(500); await leave(page); await page.waitForTimeout(300); await finishPitch(page, 3, 3); await L.advance(page, [end === "custode" ? "Resto" : end === "soffio" ? "ultima partita" : "Riparto"]); }
  const i = await L.info(page); if (!i.ends.includes(end)) errors.push("finale non trovato: " + end + " · " + JSON.stringify(i.ends));
  L.check(`Vento · finale «${end}»`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); for (const e of ["vento", "custode", "turbine", "soffio"]) await c3(e); })().catch((e) => { console.error("✗ vento:", e.message); process.exit(1); });
