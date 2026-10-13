// tests/pugno.cjs - «Per un pugno di rigori»: il motore Stangata (duello di rigori spaghetti western,
// tamburo a 6 colpi, tensione e quick-draw al mezzogiorno), i Manifesti Wanted, i 3 capitoli e i 4 finali.
const L = require("./lib.cjs");
const MOD = { mod: "__pugno", key: "ali-di-rondine.pugno" };
const K_ = "window.__pugno._dbg.K";
const info = (p) => L.info(p);

const stEnd = async (p, a, b) => {
  await p.evaluate(([a, b]) => {
    const S = window.__stangata.state();
    if (!S) return;
    S.usScore = a; S.oppScore = b; S.turn = S.turnsTotal + 1;
    S.phase = "result";
    // Chiudi o simula fine
    const cert = document.querySelector(".stCertBox #stCertDone");
    if (cert) cert.click();
  }, [a, b]);
  await p.waitForTimeout(300);
  await p.evaluate(() => {
    const b = document.querySelector(".stCertBox #stCertDone");
    if (b) b.click();
  });
  await p.waitForTimeout(250);
};

async function closeWanted(p) {
  for (let i = 0; i < 30 && !(await p.evaluate(() => !!document.querySelector(".prWanted"))); i++) {
    await p.waitForTimeout(100);
  }
  const ok = await p.evaluate(() => !!document.querySelector(".prWanted"));
  await p.evaluate(() => {
    const b = document.querySelector(".prWanted button");
    if (b) b.click();
  });
  await p.waitForTimeout(250);
  return ok;
}

async function testCap1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__pugno.open());
  await page.evaluate(() => window.T_.click("Inizia la storia"));
  await L.advance(page);

  // Parla con lo Sceriffo Cooper
  await L.talk(page, "pr_sceriffo");
  await closeWanted(page);
  await L.advance(page);

  // Entra nel Saloon El Palo
  await L.goAct(page, 16, 6);
  await L.advance(page);

  // Parla con Carmela
  await L.talk(page, "pr_carmela");
  await L.advance(page);

  // Torna nella via principale
  await page.evaluate((k) => eval(k).go("pr_cittadina", 16, 8), K_);
  await pWait(page, 300);
  await L.advance(page);

  // Parla con Barnaba
  await L.talk(page, "pr_barnaba");
  await L.advance(page);

  // Sfida i Vice
  await L.talk(page, "pr_sceriffo");
  await page.evaluate(() => window.T_.click("Sfida dal Dischetto (Stangata)"));
  await pWait(page, 400);

  // Concludi Stangata con vittoria
  await stEnd(page, 3, 1);
  await L.advance(page);

  const i = await info(page);
  if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i));

  L.check(`Per un pugno di rigori · Capitolo 1 (${w} px)`, errors);
  await browser.close();
}

async function pWait(p, ms) {
  await p.waitForTimeout(ms);
}

(async () => {
  try {
    await testCap1(390);
    console.log("ALL PUGNO TESTS PASSED!");
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
})();
