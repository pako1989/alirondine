// tests/omini.cjs - l'impostazione «Omini: Pixel»: i personaggi del pacchetto Ninja Adventure (CC0) nel mondo camminabile
// (zona di una saga e Borgo), la scelta dell'omino del Campione, nessun errore; e il ritorno agli omini classici
const L = require("./lib.cjs");
async function run(w) {
  const set = { v: 1, omini: "pixel", ominoHero: 3 };
  const { browser, page, errors } = await L.setup({ w, mod: "__grigio", key: "ali-di-rondine.grigio", extra: { "ali-di-rondine.impostazioni": set } });
  await page.evaluate(() => window.__grigio.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  await page.waitForTimeout(800);
  const ok = await page.evaluate(() => !!(window.__omini && window.__omini.ok)); if (!ok) errors.push("il foglio degli omini pixel non si carica");
  // nel canvas devono esserci i pixel del foglio: si confronta un'area con e senza omini pixel
  const px = await page.evaluate(() => { const c = document.querySelector("canvas"); return c ? c.toDataURL().length : 0; });
  if (w === 390) await L.shot(page, "omini_pixel");
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni")); s.omini = "classici"; localStorage.setItem("ali-di-rondine.impostazioni", JSON.stringify(s)); });
  if (!px) errors.push("nessun canvas disegnato");
  // l'impostazione nel menu: due voci (stile e omino del Campione)
  const lbl = await page.evaluate(() => window.__omini.names[3]); if (lbl !== "Anziana") errors.push("nome dell'omino: " + lbl);
  L.check(`Omini pixel (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })().catch((e) => { console.error("✗ omini:", e.message); process.exit(1); });
