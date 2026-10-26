// tests/calcio11-3d.cjs - Test automatico per il Calcio a 11 3D
const L = require("./lib.cjs");

(async () => {
  const { browser, page, errors } = await L.setup({
    w: 390,
    h: 844
  });

  try {
    // 1. Verifica che il modulo esista
    const exists = await page.evaluate(() => !!window.__calcio11_3d);
    if (!exists) throw new Error("window.__calcio11_3d non definito");

    // 2. Apertura del menu principale Calcio a 11 3D
    await page.evaluate(() => window.__calcio11_3d.open());
    await page.waitForTimeout(400);

    const hasMenu = await page.evaluate(() => !!document.querySelector(".c11Ov"));
    if (!hasMenu) throw new Error("Menu Calcio a 11 3D non visibile");
    console.log("✓ Menu Calcio a 11 3D aperto con successo");

    // 3. Avvio di una Partita Veloce 3D
    await page.evaluate(() => {
      window.__calcio11_3d.startMatch({
        teamA: "rondine",
        teamB: "gabbiani",
        duration: 90
      });
    });
    await page.waitForTimeout(1000);

    // 4. Verifica Canvas WebGL e HUD
    const matchState = await page.evaluate(() => {
      const cv = document.querySelector("#c11Canvas");
      const score = document.querySelector("#c11Score");
      const radar = document.querySelector("#c11RadarCv");
      const camBtn = document.querySelector("#c11CamBtn");
      return {
        hasCanvas: !!cv && cv.width > 0,
        hasScore: !!score && score.textContent.includes("–"),
        hasRadar: !!radar,
        hasCamBtn: !!camBtn
      };
    });

    if (!matchState.hasCanvas) throw new Error("Canvas WebGL 3D non inizializzato");
    if (!matchState.hasScore) throw new Error("HUD del punteggio non trovato");
    if (!matchState.hasRadar) throw new Error("Radar minimappa 2D non trovato");
    if (!matchState.hasCamBtn) throw new Error("Pulsante cambio telecamera 3D non trovato");
    console.log("✓ Match 3D avviato con Canvas WebGL, HUD, Radar e Pulsante Telecamera attivi");

    // 5. Test cambio telecamera (Click su pulsante e tasto V)
    const initialCam = await page.evaluate(() => document.querySelector("#c11CamLabel")?.textContent);
    await page.evaluate(() => document.querySelector("#c11CamBtn").click());
    await page.waitForTimeout(200);
    const secondCam = await page.evaluate(() => document.querySelector("#c11CamLabel")?.textContent);
    if (initialCam === secondCam) throw new Error("Il pulsante telecamera non ha cambiato modalità");
    await page.keyboard.press("KeyV");
    await page.waitForTimeout(200);
    console.log(`✓ Telecamera cambiata con successo: ${initialCam} -> ${secondCam}`);

    // 6. Test interazione e comandi (Passaggio, Tiro, Tackle/Contrasto, Movimento)
    await page.keyboard.press("KeyD");
    await page.waitForTimeout(100);
    await page.keyboard.press("KeyJ"); // Passa
    await page.waitForTimeout(200);
    await page.keyboard.press("KeyL"); // Contrasto/Scivolata via tastiera
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      const tackBtn = document.querySelector('.c11Btn[data-b="tack"]');
      if (tackBtn) tackBtn.click();
    });
    await page.waitForTimeout(200);
    await page.keyboard.press("KeyK"); // Tira
    await page.waitForTimeout(300);

    // 6. Chiusura del match
    await page.evaluate(() => {
      const x = document.querySelector(".c11Bar .x");
      if (x) x.click();
    });
    await page.waitForTimeout(200);

    console.log("✓ Test interazione comandi e chiusura completati senza errori");
  } catch (err) {
    errors.push("Calcio a 11 3D error: " + err.message);
  } finally {
    await browser.close();
  }

  if (errors.length) {
    console.error("FAIL:", errors);
    process.exit(1);
  } else {
    console.log("PASS: Calcio a 11 3D verificato con successo.");
  }
})();
