// tests/toon3d.cjs - Cel shading 3D (opzione «Grafica 3D», spenta di partenza) + pulsante Calcio a 11 3D nell'Arena
const L = require("./lib.cjs");
(async () => {
  for (const on of [false, true]) {
    const { browser, page, errors } = await L.setup({ w: 390, h: 844, extra: { "ali-di-rondine.impostazioni": { cel3d: on } } });
    await page.evaluate(() => window.openStadium3D()); await page.waitForTimeout(1500);
    const st = await page.evaluate(() => window.__toon3d.stats());
    if (on && !(st.pairs > 0)) errors.push("cel shading acceso ma nessun materiale toon");
    if (!on && st.pairs) errors.push("cel shading spento ma materiali toon presenti");
    if (on) {
      await page.evaluate(() => window.closeStadium3D && window.closeStadium3D());
      await page.evaluate(() => window.__arena.open()); await page.waitForTimeout(300);
      if (!(await page.$('[data-go="c11"]'))) errors.push("pulsante Calcio a 11 3D assente nell'Arena");
      else { await page.click('[data-go="c11"]'); await page.waitForTimeout(300); if (!(await page.$(".c11Ov"))) errors.push("Calcio a 11 3D non si apre dall'Arena"); }
    }
    L.check(`Cel shading 3D ${on ? "acceso" : "spento"}`, errors); await browser.close();
  }
})();
