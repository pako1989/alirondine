// tests/montagna.cjs - «Piccolo Borgo di Montagna»: il motore Ritagli (calcio a marionette di carta ritagliata stop-motion,
// molla posteriore, contrasti a forbice), la Bacheca delle Emergenze del Comune, i 3 capitoli e i 4 finali.
const L = require("./lib.cjs");
const MOD = { mod: "__montagna", key: "ali-di-rondine.montagna" };
const K_ = "window.__montagna._dbg.K";
const info = (p) => L.info(p);

const rtStart = async (p) => {
  await p.waitForTimeout(300);
  const ok = await p.evaluate(() => {
    const b = document.querySelector(".rtOv .ov .goB");
    if (b) { b.click(); return true; }
    return false;
  });
  await p.waitForTimeout(250);
  return ok;
};

const rtEnd = async (p, a, b) => {
  await p.evaluate(([a, b]) => {
    const S = window.__ritagli.state;
    if (!S) return;
    S.a = a; S.b = b; S.turn = S.turnsTotal + 1;
    S.phase = "aim";
    document.querySelector(".rtOv #rtShoot").click();
  }, [a, b]);
  await p.waitForTimeout(350);
  await p.evaluate(() => {
    const b = document.querySelector(".rtOv .ov .goB");
    if (b) b.click();
  });
  await p.waitForTimeout(250);
};

async function closeNews(p) {
  for (let i = 0; i < 30 && !(await p.evaluate(() => !!document.querySelector(".bmNews"))); i++) {
    await p.waitForTimeout(100);
  }
  const ok = await p.evaluate(() => !!document.querySelector(".bmNews"));
  await p.evaluate(() => {
    const b = document.querySelector(".bmNews button");
    if (b) b.click();
  });
  await p.waitForTimeout(250);
  return ok;
}

async function testCap1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__montagna.open());
  await page.evaluate(() => window.T_.click("Inizia la storia"));
  await L.advance(page);

  {
    const bad = await L.reachAll(page, "bm_piazza");
    if (bad.length) errors.push("bm_piazza irraggiungibile: " + bad.join(", "));
  }

  // Parla con Sbruffo
  await L.talk(page, "bm_sbruffo");
  await L.advance(page);

  // Entra nel Bar di Boris
  await L.goAct(page, 5, 6);
  await L.advance(page);
  if ((await L.zone(page)) !== "bm_bar") errors.push("non si entra nel bar di Boris");

  // Parla con Boris
  await L.talk(page, "bm_boris");
  await L.advance(page);

  // Torna in piazza
  await page.evaluate((k) => eval(k).go("bm_piazza", 5, 8), K_);
  await pWait(page, 400);
  await L.advance(page);

  // Parla con Valanga e avvia partita parrocchiale
  await L.talk(page, "bm_valanga");
  await page.evaluate(() => window.T_.click("Mettimi alla prova"));
  await pWait(page, 400);

  if (!(await rtStart(page))) errors.push("Ritagli non si apre");

  // Testa pulsanti azione di Ritagli
  await page.evaluate(() => {
    const b = document.querySelector(".rtOv #rtScissors");
    if (b) b.click();
  });
  await pWait(page, 300);

  // Concludi con vittoria
  await rtEnd(page, 2, 0);
  await closeNews(page);
  await L.advance(page);

  const i = await info(page);
  if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i));

  L.check(`Piccolo Borgo · Capitolo 1 (${w} px)`, errors);
  await browser.close();
}

async function testCap2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "completato" }, diffSet: true, intro: { ch1: 1, bm_piazza: 1, bm_bar: 1 }, st: { fiducia: 3, assurdo: 2, boris: 3 }, flags: { bm_e_corriera: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__montagna.open());
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2"));
  await L.advance(page);

  // Parla con Wendy in piazza
  await L.talk(page, "bm_wendy");
  await L.advance(page);

  // Entra in municipio con Wendy
  await L.goAct(page, 23, 6);
  await L.advance(page);
  if ((await L.zone(page)) !== "bm_municipio") errors.push("non si entra in municipio");

  // Trova lo scaldabagno
  await L.talk(page, "bm_wendy");
  await page.evaluate(() => window.T_.click("Apri il faldone"));
  await pWait(page, 300);
  await closeNews(page);
  await L.advance(page);

  // Vai al Lago Ghiacciato
  await page.evaluate((k) => eval(k).go("bm_lago", 16, 18), K_);
  await pWait(page, 400);
  await L.advance(page);

  // Sfida Tarcisio
  await L.talk(page, "bm_tarcisio");
  await page.evaluate(() => window.T_.click("Sfida i Boscaioli"));
  await pWait(page, 400);

  if (!(await rtStart(page))) errors.push("Ritagli non si apre al lago");
  await rtEnd(page, 3, 1);
  await closeNews(page);
  await L.advance(page);

  const i = await info(page);
  if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify(i));

  L.check(`Piccolo Borgo · Capitolo 2 (${w} px)`, errors);
  await browser.close();
}

async function testCap3(w) {
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "completato", 2: "completato" }, diffSet: true, intro: { ch1: 1, ch2: 1 }, st: { fiducia: 7, assurdo: 5, boris: 5 }, flags: { bm_scaldabagno_scoperto: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__montagna.open());
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3"));
  await L.advance(page);

  // Parla con Wendy poi con Boris per la finale
  await L.talk(page, "bm_wendy");
  await L.advance(page);
  await L.talk(page, "bm_boris");
  await page.evaluate(() => window.T_.click("Fischio d'inizio"));
  await pWait(page, 400);

  if (!(await rtStart(page))) errors.push("Ritagli finale non si apre");
  await rtEnd(page, 4, 1);
  await closeNews(page);
  await L.advance(page);

  // Scegli finale boiler / scaldabagno
  await page.evaluate(() => window.T_.click("Mostra a tutti l'etichetta"));
  await pWait(page, 400);
  await L.advance(page);

  const i = await info(page);
  if (!i.done[3] || !i.flags.bm_fin_scaldabagno) errors.push("capitolo 3 non concluso: " + JSON.stringify(i));

  L.check(`Piccolo Borgo · Capitolo 3 (${w} px)`, errors);
  await browser.close();
}

async function pWait(p, ms) {
  await p.waitForTimeout(ms);
}

(async () => {
  try {
    await testCap1(390);
    await testCap2(390);
    await testCap3(390);
    console.log("ALL MONTAGNA TESTS PASSED!");
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
})();
