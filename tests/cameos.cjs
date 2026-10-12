// tests/cameos.cjs - gli ospiti da altre saghe compaiono (e parlano) solo se quella saga è stata giocata
const L = require("./lib.cjs");
async function valle() {
  const { browser, page, errors } = await L.setup({ w: 390, mod: "__vento", key: "ali-di-rondine.vento" });
  await page.evaluate(() => { localStorage.setItem("ali-di-rondine.detective", JSON.stringify({ v: 1, done: { 1: "esca" }, ch: 2 })); localStorage.setItem("ali-di-rondine.muro", JSON.stringify({ v: 1, done: { 1: "ok" }, ch: 2 })); localStorage.setItem("ali-di-rondine.vento", JSON.stringify({ v: 1, ch: 1, step: { 1: 2 }, intro: { ch1: 1, ve_valle: 1, ve_prato: 1 }, flags: { ve_chiave: true } })); window.__vento._dbg.mem; });
  await page.evaluate(() => { window.__vento.open(); }); await page.evaluate(() => window.T_.click("Continua la storia")); await L.advance(page);
  await L.goAct(page, 6, 19); await L.advance(page); void ("locanda npc:", await page.evaluate(() => window.__tr.TW.z.npcs.map((n) => n.id).join(",")));
  await L.talk(page, "dc_agata"); const log = await L.advance(page); void ("agata:", log.length, "battute"); await L.shot(page, "cameo_agata");
  await L.goAct(page, 10, 12); await L.advance(page); await L.goAct(page, 36, 13); await L.advance(page); await L.talk(page, "mu_teo"); await L.advance(page);
  L.check("ospiti nella Valle", errors); await browser.close();
}
async function detective() {
  const { browser, page, errors } = await L.setup({ w: 390, mod: "__detective", key: "ali-di-rondine.detective" });
  await page.evaluate(() => { ["vento", "cristalli", "libro-finali"].forEach((k) => localStorage.setItem("ali-di-rondine." + k, JSON.stringify({ v: 1, done: { 1: "ok" }, ch: 2 }))); localStorage.setItem("ali-di-rondine.detective", JSON.stringify({ v: 1, ch: 1, step: { 1: 1 }, intro: { ch1: 1, dc_citta: 1, dc_stadio: 1 }, flags: { dc_distintivo: true } })); });
  await page.evaluate(() => window.__detective.open()); await page.evaluate(() => window.T_.click("Continua la storia")); await L.advance(page);
  await L.goAct(page, 7, 9); await L.advance(page); await L.talk(page, "lb_virgola"); await L.advance(page); await L.shot(page, "cameo_virgola"); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 25, 9); await L.advance(page); await L.talk(page, "ve_selva"); await L.advance(page); await L.goAct(page, 10, 12); await L.advance(page);
  await L.goAct(page, 39, 12); await L.advance(page); await L.talk(page, "cr_aira"); await L.advance(page); await L.shot(page, "cameo_aira");
  L.check("ospiti nel Detective", errors); await browser.close();
}
(async () => { await valle(); await detective(); })().catch((e) => { console.error("✗ ospiti:", e.message); process.exit(1); });
