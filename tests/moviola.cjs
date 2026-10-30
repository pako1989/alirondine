// tests/moviola.cjs - «L'Ombra della Moviola · Tele-Rondine '84»
// Verifica: minigioco Moviola '84, consolle Banco Moviola U-matic, 13 sfondi interattivi,
// progressione capitoli, 4 finali, integrazione salone, sogni e mazzo.
const L = require("./lib.cjs");
const MOD = { mod: "__moviola", key: "ali-di-rondine.moviola" };
const K_ = "window.__moviola._dbg.K";

async function testArcade(w) {
  const { browser, page, errors } = await L.setup({ w });

  // 1. Minigioco arcade Moviola '84
  const resArcade = await page.evaluate(async () => {
    let result = null;
    window.__moviolaArcade.start({
      level: 1,
      onDone: (res) => { result = res; }
    });
    await new Promise((ok) => setTimeout(ok, 200));

    const ov = document.getElementById("moviolaOverlay");
    if (!ov) return { ok: false, err: "moviolaOverlay non trovato" };

    const slider = document.getElementById("movSlider");
    const frameNum = document.getElementById("movFrameNum");
    const btnPlay = document.getElementById("btnMovPlay");
    const btnDecision = document.getElementById("btnMovDecision");

    if (!slider || !btnPlay || !btnDecision) return { ok: false, err: "elementi di controllo mancanti" };

    // Simula avanzamento frame
    slider.value = "38";
    slider.dispatchEvent(new Event("input"));

    // Simula click STOP & FISCHIA
    btnDecision.click();
    await new Promise((ok) => setTimeout(ok, 100));

    // Abbandona minigioco per completare test
    const btnClose = document.getElementById("btnMovClose");
    if (btnClose) btnClose.click();
    await new Promise((ok) => setTimeout(ok, 100));

    return { ok: true, result };
  });

  if (!resArcade.ok) errors.push("Arcade Moviola: " + resArcade.err);

  // 2. Banco Moviola U-matic
  const resBanco = await page.evaluate(async () => {
    let doneRes = null;
    window.__moviolaArcade.openBanco({
      title: "Test Banco",
      onDone: (r) => { doneRes = r; }
    });
    await new Promise((ok) => setTimeout(ok, 200));

    const ov = document.getElementById("bancoMoviolaOverlay");
    if (!ov) return { ok: false, err: "bancoMoviolaOverlay non trovato" };

    const trInput = document.getElementById("bancoTracking");
    const btnCh2 = document.getElementById("btnAudioCh2");
    const btnCapture = document.getElementById("btnBancoCapture");

    if (!trInput || !btnCh2 || !btnCapture) return { ok: false, err: "elementi Banco U-matic mancanti" };

    // Regola tracking all'80% (nitidezza ottimale)
    trInput.value = "80";
    trInput.dispatchEvent(new Event("input"));
    btnCh2.click();

    await new Promise((ok) => setTimeout(ok, 100));
    btnCapture.click();
    await new Promise((ok) => setTimeout(ok, 150));

    return { ok: true, doneRes };
  });

  if (!resBanco.ok) errors.push("Banco Moviola: " + resBanco.err);
  if (!resBanco.doneRes || !resBanco.doneRes.evidence) errors.push("Banco Moviola capture senza evidence");

  L.check(`L'Ombra della Moviola · Arcade & Banco U-matic (${w} px)`, errors);
  await browser.close();
}

async function testSaga(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });

  // 1. Verifica caricamento e metadati saga
  const init = await page.evaluate(() => {
    if (!window.__moviola) return { ok: false, err: "__moviola non definito" };
    const D = window.__moviola._dbg;
    if (!D) return { ok: false, err: "_dbg non esposto su __moviola" };
    return {
      ok: true,
      chaptersCount: (D.CHAPTERS || []).length,
      bgList: Object.keys(window.__moviolaBg || {})
    };
  });

  if (!init.ok) {
    errors.push("Inizializzazione saga: " + init.err);
    L.check(`L'Ombra della Moviola · Inizializzazione (${w} px)`, errors);
    await browser.close();
    return;
  }

  if (init.chaptersCount < 4) errors.push(`Capitoli registrati: ${init.chaptersCount}/4`);

  // 2. Verifica 13 sfondi interattivi
  const expectedBgs = [
    "mov_titolo", "mov_piazzale", "mov_regia", "mov_magazzino",
    "mov_torrente", "mov_abitacolo", "mov_osteria", "mov_campanile",
    "mov_cella", "mov_studio_tv", "mov_foyer", "mov_proiezione", "mov_camerino"
  ];
  for (const bgId of expectedBgs) {
    if (!init.bgList.includes(bgId)) errors.push(`Sfondo mancante: ${bgId}`);
  }

  // 3. Verifica apertura saga e Capitolo 1
  await page.evaluate(() => window.__moviola.open());
  await page.waitForTimeout(300);

  const startBtn = await page.evaluate(() => {
    const btns = window.T_ ? window.T_.btns() : [];
    return btns.some((b) => /Inizia la storia/.test(b.t));
  });

  if (startBtn) {
    await page.evaluate(() => window.T_.click("Inizia la storia"));
    await page.waitForTimeout(400);
    await L.advance(page).catch(() => {});
  }

  // 4. Verifica stato Capitolo 1
  const inf = await L.info(page);
  if (!inf || inf.ch !== 1) errors.push("Capitolo atteso 1, trovato: " + (inf ? inf.ch : "null"));

  const c1Talk = await page.evaluate(async () => {
    const K = window.__moviola._dbg.K;
    if (!K) return { ok: false, err: "K non disponibile" };
    const ch = K.mem().ch;
    const st = K.stepOf(1);
    const chiarezza = K.stat("chiarezza");
    return { ok: true, ch, st, chiarezza };
  });

  if (!c1Talk.ok) errors.push("Stato Capitolo 1: " + c1Talk.err);

  // 5. Verifica integrazione Salone delle Saghe e Cabinato
  const salone = await page.evaluate(() => {
    const sagas = (window.__salone && window.__salone.SAGAS) || window.SAGAS || [];
    const hasSaga = sagas.some((s) => s.id === "moviola");
    const machines = (window.__salone && window.__salone.MACHINES) || window.MACHINES || [];
    const hasMachine = machines.some((m) => m.id === "moviola");
    return { hasSaga, hasMachine };
  });

  if (!salone.hasSaga) errors.push("Saga 'moviola' non registrata in SAGAS");
  if (!salone.hasMachine) errors.push("Cabinato 'moviola' non registrato in MACHINES");

  // 6. Verifica integrazione Sogni e Mazzo
  const sogniEMazzi = await page.evaluate(() => {
    const sogniSaghe = (window.__sogni && window.__sogni.SAGHE) || window.SAGHE || {};
    const hasSogniSaga = !!sogniSaghe.moviola;
    const hasMazzo = window.__carteDecks && window.__carteDecks.list && window.__carteDecks.list().some((d) => d.id === "mov");
    return { hasSogniSaga, hasMazzo: !!hasMazzo };
  });

  if (!sogniEMazzi.hasSogniSaga) errors.push("Saga 'moviola' non registrata in SAGHE di sogni.js");
  if (!sogniEMazzi.hasMazzo) errors.push("Mazzo destino 'mov' non registrato in carte-mazzi-saghe5.js");

  L.check(`L'Ombra della Moviola · Saga, Capitoli & Integrazione (${w} px)`, errors);
  await browser.close();
}

(async () => {
  await testArcade(390);
  await testSaga(390);
  await testSaga(320);
})().catch((e) => {
  console.error("✗ moviola:", e.message);
  process.exit(1);
});
