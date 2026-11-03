// tests/cabina-regia.cjs - Verifica E2E «La Cabina di Regia del Salone»
const L = require("./lib.cjs");

(async () => {
  const extra = {
    "ali-di-rondine.mantello": {
      v: 1,
      ch: 4,
      step: { 1: 5, 2: 5, 3: 5, 4: 5 },
      done: { 1: "segreto", 2: "amica", 3: "eroe", 4: "finale" },
      ends: ["eroe"],
      diffSet: true,
      flags: {},
    },
  };

  const { browser, page, errors } = await L.setup({ w: 390, extra });
  const ev = (f, a) => page.evaluate(f, a);

  const initInfo = await ev(() => {
    const R = window.__regia;
    if (!R) return null;
    return {
      tot: R.totals(),
      mantelloOpen: R.isUnlocked("mantello"),
      romaOpen: R.isUnlocked("roma"),
      spazioHasReel: !!R.forSaga("spazio"),
    };
  });
  if (!initInfo || initInfo.tot.totalReels < 60) {
    errors.push("catalogo Cabina di Regia incompleto: " + JSON.stringify(initInfo));
  }
  if (!initInfo.mantelloOpen || initInfo.romaOpen || !initInfo.spazioHasReel) {
    errors.push("stato sblocco saghe errato: " + JSON.stringify(initInfo));
  }

  await ev(() => window.__regia.open(() => {}));
  await page.waitForTimeout(250);
  const hubCheck = await ev(() => {
    const lockRoma = document.querySelector('.rgOv [data-lock="roma"]');
    const openMant = document.querySelector('.rgOv [data-reel="mantello"]');
    return {
      hasLockRoma: !!lockRoma,
      lockTxt: lockRoma ? lockRoma.innerText : "",
      hasOpenMant: !!openMant,
    };
  });
  if (!hubCheck.hasLockRoma || !hubCheck.hasOpenMant) {
    errors.push("voci catalogo mancanti: " + JSON.stringify(hubCheck));
  }
  if (/pretoriani|imperatore/i.test(hubCheck.lockTxt)) {
    errors.push("spoiler presente su pellicola sigillata: " + hubCheck.lockTxt);
  }

  await ev(() => {
    window.__regia.close();
    window.__salone.openSaga("mantello");
  });
  await page.waitForTimeout(250);
  const detailOk = await ev(() => !!document.querySelector('.salOv [data-regia-box="mantello"] [data-regia-free="mantello"]'));
  if (!detailOk) errors.push("blocco Cabina di Regia assente nella scheda saga conclusa");

  await ev(() => window.__salone.openSaga("roma"));
  await page.waitForTimeout(200);
  const detailLocked = await ev(() => ({
    freeBtn: !!document.querySelector('.salOv [data-regia-free="roma"]'),
    lockNote: !!document.querySelector(".salOv .salRegiaLock"),
  }));
  if (detailLocked.freeBtn || !detailLocked.lockNote) {
    errors.push("gating scheda saga non conclusa errato: " + JSON.stringify(detailLocked));
  }

  const coins0 = await ev(() => window.bCoins());
  await ev(() => {
    window.__salone.close();
    window.__regia.openReel("mantello");
  });
  await page.waitForTimeout(250);
  await ev(() => document.querySelector("#rgBtnFree").click());
  await page.waitForTimeout(300);
  await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); });
  await page.waitForTimeout(300);
  await ev(() => { const S = window.__bottoni.state; S.a = 2; S.b = 0; S.finish(); });
  await page.waitForTimeout(300);
  await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); });
  await page.waitForTimeout(350);

  const afterFree = await ev(() => ({
    fxLeft: !!document.getElementById("rgStageFx") || !!document.getElementById("rgClapHud"),
    st: window.__regia.stats("mantello"),
    coins: window.bCoins(),
  }));
  if (afterFree.fxLeft || !afterFree.st || afterFree.st.freeCount !== 1 || afterFree.coins !== coins0) {
    errors.push("esito Rivincita Libera anomalo: " + JSON.stringify(afterFree));
  }

  for (const cid of ["c1", "c2", "c3"]) {
    await ev((c) => window.__regia.playCondition("mantello", c), cid);
    await page.waitForTimeout(300);
    if (cid === "c2" || cid === "c3") {
      const hasStageFx = await ev(() => !!document.getElementById("rgStageFx") && !!document.getElementById("rgClapHud"));
      if (!hasStageFx) errors.push("effetto scenico non attivo durante " + cid);
    }
    await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); });
    await page.waitForTimeout(300);
    await ev(() => { const S = window.__bottoni.state; S.a = 3; S.b = 0; S.finish(); });
    await page.waitForTimeout(300);
    await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); });
    await page.waitForTimeout(350);
  }

  const after3 = await ev(() => ({
    fxLeft: !!document.getElementById("rgStageFx") || !!document.getElementById("rgClapHud"),
    coins: window.bCoins(),
    st: window.__regia.stats("mantello"),
    cos: window.__borgoApi.cosOwned(),
  }));
  if (after3.fxLeft) errors.push("overlay scenico rimasto dopo fine partita");
  if (after3.coins !== coins0 + 140) {
    errors.push(`monete attese ${coins0 + 140}, trovate ${after3.coins}`);
  }
  if (!after3.st.gold || after3.st.count !== 3) {
    errors.push("Pellicola d'Oro 3/3 non registrata: " + JSON.stringify(after3.st));
  }
  if (!after3.cos.includes("rg_maglia_ciak") || !after3.cos.includes("rg_occhiali_moviola")) {
    errors.push("cosmetici Guardaroba non sbloccati: " + JSON.stringify(after3.cos));
  }

  await ev(() => window.__regia.playCondition("mantello", "c1"));
  await page.waitForTimeout(250);
  await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); });
  await page.waitForTimeout(250);
  await ev(() => { const S = window.__bottoni.state; S.a = 2; S.b = 0; S.finish(); });
  await page.waitForTimeout(250);
  await ev(() => { const b = document.querySelector(".btOv .ov button"); if (b) b.click(); });
  await page.waitForTimeout(300);
  const coinsRepeat = await ev(() => window.bCoins());
  if (coinsRepeat !== coins0 + 140) {
    errors.push("farming monete indebito al replay della stessa condizione: " + coinsRepeat);
  }

  await ev(() => {
    window.__regia.setOn(false);
    window.__regia.openReel("mantello");
  });
  await page.waitForTimeout(200);
  const offCheck = await ev(() => ({
    condBtns: document.querySelectorAll(".rgOv [data-cond]").length,
    freeBtn: !!document.querySelector("#rgBtnFree"),
    playCondBlocked: window.__regia.playCondition("mantello", "c1"),
  }));
  if (offCheck.condBtns !== 0 || !offCheck.freeBtn || offCheck.playCondBlocked !== false) {
    errors.push("toggle Solo rivincita libera non rispettato: " + JSON.stringify(offCheck));
  }
  await ev(() => window.__regia.setOn(true));

  L.check("cabina di regia del salone", errors);
  await browser.close();
})().catch((e) => {
  console.error("✗ cabina-regia:", e.message);
  process.exit(1);
});
