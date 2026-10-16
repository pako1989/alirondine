// tests/bilancia.cjs - «La Bilancia delle Tre Corone»: dopo il capitolo 1 «Avanti» porta nella zona del capitolo 2 (non resta nella Sala del Consiglio)
const L = require("./lib.cjs");
(async () => {
  const { browser, page, errors } = await L.setup({ w: 390, key: "ali-di-rondine.bilancia-feudi", save: { ch: 1, zone: "feudi_sala_consiglio_ch1", done: { 1: "consiglio_wolffort_moralita" }, intro: { ch1: 1 } } });
  await page.evaluate(() => window.__bilanciaFeudi.open()); await page.waitForTimeout(600);
  await page.evaluate(() => window.T_.click("Inizia Capitolo 2")); await page.waitForTimeout(600);
  await L.advance(page, [/Entra nel Cortile|Entra/]); await page.waitForTimeout(800);
  const z = await page.evaluate(() => window.__borgoApi.trZone());
  if (z !== "feudi_glenbrook_ch2") errors.push("dopo il cap.1 la zona è " + z + " invece di feudi_glenbrook_ch2");
  L.check("Bilancia · avanzamento al capitolo 2", errors); await browser.close();
})().catch((e) => { console.error("✗ bilancia:", e.message); process.exit(1); });
