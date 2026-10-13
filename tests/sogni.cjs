// tests/sogni.cjs - «La Squadra dei Sogni»: le carte che si sbloccano giocando, la bustina, la squadra e l'intesa, il Torneo dei Sogni
// nei motori delle saghe (con i vantaggi della squadra), la carta del Campione dei Sogni e la Maglia nel guardaroba
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
const uno = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "a" }, ends: [], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin, "ali-di-rondine.trono": uno } });
  await page.evaluate(() => window.__salone.open(() => {})); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.querySelector('.salOv [data-go="sogni"]')))) errors.push("manca la Squadra dei Sogni nel Salone");
  await page.evaluate(() => document.querySelector('.salOv [data-go="sogni"]').click()); await page.waitForTimeout(400);
  const own = await page.evaluate(() => window.__sogni._load().own);
  ["cm_saverio", "cm_pio", "cm_leone", "cm_bastiano", "tc_brunilde", "tc_gualtiero"].forEach((id) => { if (!own.includes(id)) errors.push("carta non sbloccata: " + id); });
  if (own.includes("tc_ardo")) errors.push("carta rara del Trono sbloccata con un solo capitolo");
  if (w === 390) await L.shot(page, "sogni");
  // la squadra e l'intesa: quattro del Campetto (6 coppie) + Brunilde
  for (const id of ["cm_bastiano", "cm_leone", "cm_saverio", "cm_pio", "tc_brunilde"]) { await page.evaluate((id) => document.querySelector(`.sgOv .coll [data-c="${id}"]`).click(), id); await page.waitForTimeout(80); }
  const I = await page.evaluate(() => window.__sogni.intesa(window.__sogni._load().team).n); if (I !== 6) errors.push("intesa: " + I);
  // la bustina
  await page.evaluate(() => window.addCoins(500)); await page.evaluate(() => window.__sogni.open()); await page.waitForTimeout(200);
  const n0 = (await page.evaluate(() => window.__sogni._load().own)).length; await page.evaluate(() => document.querySelector('.sgOv [data-go="pack"]').click()); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "sogni_bustina");
  const n1 = (await page.evaluate(() => window.__sogni._load().own)).length; if (n1 !== n0 + 1) errors.push("la bustina non dà una carta");
  await page.evaluate(() => document.querySelector(".sgOv [data-ok]").click()); await page.waitForTimeout(200);
  // il Torneo dei Sogni: il Concilio (credibilità e corvi dalla squadra) e il Duello (grinta dall'intesa)
  await page.evaluate(() => document.querySelector('.sgOv [data-go="tour"]').click()); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "sogni_torneo");
  await page.evaluate(() => document.querySelector('.sgOv [data-i="4"]').click()); await page.waitForTimeout(400);
  const co = await page.evaluate(() => { const S = window.__concilio.state; return S ? [S.cred, S.ravens] : null; }); if (!co || co.join() !== "7,2") errors.push("Concilio dei Sogni: " + co);
  await page.evaluate(() => document.querySelector(".coOv .ov button").click()); await page.waitForTimeout(100);
  await page.evaluate(() => { const S = window.__concilio.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".coOv .ov button").click()); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => window.__sogni._load().won.includes(4)))) errors.push("sfida del Concilio non registrata");
  await page.evaluate(() => { const b = document.querySelector(".sgOv [data-ok]"); if (b) b.click(); }); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.sgOv [data-i="6"]').click()); await page.waitForTimeout(400);
  const du = await page.evaluate(() => { const S = window.__duello.state; return S ? S.gutsMax : null; }); if (du !== 124) errors.push("Duello dei Sogni, grinta: " + du);
  await page.evaluate(() => document.querySelector(".duOv .ov button").click()); await page.waitForTimeout(100); await page.evaluate(() => window.__duello.state.finish(true)); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".duOv .ov button").click()); await page.waitForTimeout(300);
  // tutte vinte: la carta del Campione dei Sogni e la Maglia
  await page.evaluate(() => { const r = window.__sogni._load(); r.won = [0, 1, 2, 3, 4, 5, 6, 7]; localStorage.setItem("ali-di-rondine.sogni", JSON.stringify(r)); window.__sogni.open(); }); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.sgOv [data-go="tour"]').click()); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".sgOv [data-hero]").click()); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "sogni_campione");
  if (!(await page.evaluate(() => window.__borgoApi.cosOwned().includes("sg_maglia")))) errors.push("Maglia dei Sogni non sbloccata");
  L.check(`La Squadra dei Sogni (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })().catch((e) => { console.error("✗ sogni:", e.message); process.exit(1); });
