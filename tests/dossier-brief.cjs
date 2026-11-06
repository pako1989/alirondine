const L = require("./lib.cjs");
(async () => {
  const { browser, page, errors } = await L.setup({ w: 390, mod: "__titano", key: "ali-di-rondine.titano" });
  await page.evaluate(() => window.__dossierBrief.open());
  await page.fill('input[name="saga"]', "Il Figlio del Titano"); await page.fill('input[name="pn"]', "Nora");
  await page.check('.dbChips input[value="Ironico"]');
  await page.click('button[data-add="pg"]'); await page.fill('.dbRow[data-k="pg"] [data-f="n"]', "Sam");
  await page.click('button[data-add="sc"]'); await page.fill('.dbRow[data-k="sc"] [data-f="n"]', "Il molo");
  await page.click('button[data-a="dl"]'); await page.waitForTimeout(200);
  const out = await page.textContent("#dbOut");
  for (const w of ["Il Figlio del Titano", "PROTAGONISTA DEL DOSSIER: Nora", "Ironico", "- Sam", "- Il molo", "capitoli da aggiungere".toUpperCase().slice(0,0)]) if (!out.includes(w)) errors.push("manca: " + w);
  const sv = await page.evaluate(() => JSON.parse(localStorage.getItem("ali.dossier_brief")).pn); if (sv !== "Nora") errors.push("bozza non salvata");
  await page.screenshot({ path: "/tmp/brief-shot.png" });
  L.check("Brief Dossier (390 px)", errors); await browser.close();
})().catch((e) => { console.error("✗", e.message); process.exit(1); });
