// tests/smoke.cjs - il gioco si apre senza errori a 390 e 320 px; home, Salone, Guardaroba e Album rispondono
const L = require("./lib.cjs");
(async () => {
  for (const w of [390, 320]) {
    const { browser, page, errors } = await L.setup({ w, h: 800 });
    const home = await page.evaluate(() => { window.title && window.title(); return [...document.querySelectorAll("#choices button")].map((b) => b.innerText.split("\n")[0]); });
    if (!home.some((t) => /Salone delle Saghe/.test(t))) errors.push("home: manca il Salone delle Saghe (" + home.join(" | ") + ")");
    if (!home.some((t) => /^Partite ·/.test(t))) errors.push("home: manca il pulsante «Partite» per cambiare salvataggio");
    for (const k of ["open", "guardaroba", "album"]) {
      await page.evaluate((k) => window.__salone[k](() => {}), k); await page.waitForTimeout(250);
      const ok = await page.evaluate(() => !!document.querySelector(".salOv")); if (!ok) errors.push("Salone: non si apre " + k);
      await page.evaluate(() => document.querySelector(".salOv .x").click()); await page.waitForTimeout(150);
    }
    const sagas = await page.evaluate(() => ["__dopo", "__vento", "__detective", "__muro", "__cristalli", "__doppioTurno", "__libroFinali"].filter((m) => !window[m]));
    if (sagas.length) errors.push("saghe non caricate: " + sagas.join(", "));
    L.check(`avvio, home e Salone a ${w} px`, errors); await browser.close();
  }
})().catch((e) => { console.error("✗ smoke:", e.message); process.exit(1); });
