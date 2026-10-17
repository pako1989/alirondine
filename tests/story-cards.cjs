// tests/story-cards.cjs - Test automatico per la modalità alternativa «Story Cards / Cronache del Molo»
const L = require("./lib.cjs");

async function run(w) {
  const { browser, page, errors } = await L.setup({ w });
  try {
    // 1. Apri il Salone
    await page.evaluate(() => window.__salone.open(() => {}));
    await page.waitForTimeout(350);

    const btn = await page.evaluate(() => !!document.querySelector('.salOv [data-go="cards"]'));
    if (!btn) errors.push("Pulsante Cronache del Molo non trovato nel Salone");

    // 2. Clicca per aprire Story Cards
    await page.evaluate(() => document.querySelector('.salOv [data-go="cards"]').click());
    await page.waitForTimeout(300);

    const title = await page.evaluate(() => {
      const h = document.querySelector(".scBar h2");
      return h ? h.innerText : "";
    });
    if (!title.includes("Cronache del Molo")) errors.push("Titolo modale non corretto: " + title);

    if (w === 390) await L.shot(page, "story_cards_main");

    // 3. Apri l'Archivio
    await page.evaluate(() => document.querySelector("#scOpenArchivio").click());
    await page.waitForTimeout(250);

    const totalCards = await page.evaluate(() => document.querySelectorAll(".scThumb").length);
    if (totalCards !== 18) errors.push("Numero di carte nell'archivio diverso da 18: " + totalCards);

    // Filtra per 'amb'
    await page.evaluate(() => document.querySelector('[data-f="amb"]').click());
    await page.waitForTimeout(150);
    const ambCount = await page.evaluate(() => document.querySelectorAll(".scThumb").length);
    if (ambCount !== 3) errors.push("Numero di carte ambientazione diverso da 3: " + ambCount);

    // Torna indietro
    await page.evaluate(() => document.querySelector("#scBackMain").click());
    await page.waitForTimeout(200);

    // 4. Avvia una Run di carte
    await page.evaluate(() => document.querySelector("#scStartRun").click());
    await page.waitForTimeout(300);

    if (w === 390) await L.shot(page, "story_cards_step0");

    // Step 0 -> Step 1
    const s0Btn = await page.evaluate(() => !!document.querySelector("#scStep1Next"));
    if (!s0Btn) errors.push("Pulsante continua Step 0 non trovato");
    await page.evaluate(() => document.querySelector("#scStep1Next").click());
    await page.waitForTimeout(300);

    if (w === 390) await L.shot(page, "story_cards_step1");

    // Step 1: Scelta A o B
    const choiceA = await page.evaluate(() => !!document.querySelector("#scChoiceA"));
    if (!choiceA) errors.push("Pulsanti scelta non trovati");
    await page.evaluate(() => document.querySelector("#scChoiceA").click());
    await page.waitForTimeout(300);

    if (w === 390) await L.shot(page, "story_cards_step2");

    // Step 2: Sfida di tempismo
    const actBtn = await page.evaluate(() => !!document.querySelector("#scActionBtn"));
    if (!actBtn) errors.push("Pulsante azione tiro non trovato");
    await page.evaluate(() => document.querySelector("#scActionBtn").click());
    await page.waitForTimeout(800);

    if (w === 390) await L.shot(page, "story_cards_step3");

    // Step 3: Epilogo e Ricompensa
    const finishBtn = await page.evaluate(() => !!document.querySelector("#scFinishRun"));
    if (!finishBtn) errors.push("Pulsante conclusione non trovato");
    await page.evaluate(() => document.querySelector("#scFinishRun").click());
    await page.waitForTimeout(300);

    // Verifica che siamo tornati alla schermata principale di Story Cards
    const backToMain = await page.evaluate(() => !!document.querySelector("#scStartRun"));
    if (!backToMain) errors.push("Ritorno al menu principale delle carte fallito");

    // Chiudi modale
    await page.evaluate(() => document.querySelector(".scClose").click());
    await page.waitForTimeout(200);
  } catch (e) {
    errors.push("eccezione test: " + e.message);
  }

  L.check(`story-cards.cjs @ ${w}px`, errors);
  await browser.close();
  return errors.length === 0;
}

(async () => {
  const ok390 = await run(390);
  const ok320 = await run(320);
  process.exit(ok390 && ok320 ? 0 : 1);
})().catch((e) => {
  console.error("✗ story-cards.cjs:", e.message);
  process.exit(1);
});
