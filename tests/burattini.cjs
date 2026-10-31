// tests/burattini.cjs - «La Giostra dei Burattini»: percorso capitolo 1, raggiungibilità zone, motore partita e 4 finali
const L = require("./lib.cjs");
const MOD = { mod: "__burattini", key: "ali-di-rondine.burattini" };

const mockMatch = (p, win = true) => p.evaluate((w) => {
  if (!window.__burattiniPartita) return false;
  const orig = window.__burattiniPartita.start;
  window.__burattiniPartita.start = (o) => {
    setTimeout(() => {
      const res = { a: w ? 2 : 0, b: w ? 0 : 2, win: w, quit: false };
      if (o.onDone) o.onDone(res);
      else if (o.done) o.done(res);
    }, 40);
    return true;
  };
  return true;
}, win);

async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__burattini.open());
  await page.evaluate(() => window.T_.click("Inizia la storia"));
  await L.advance(page);

  const bad = await L.reachAll(page, "bur_vicolo");
  if (bad.length) errors.push("bur_vicolo irraggiungibile: " + bad.join(", "));

  await mockMatch(page, true);

  // Parla con Taddeo davanti alla bottega
  await L.talk(page, "bur_taddeo");
  await L.advance(page);

  // Parla con Colombina davanti alla taverna
  await L.talk(page, "bur_colombina");
  await L.advance(page);

  // Torna da Taddeo
  await L.talk(page, "bur_taddeo");
  await L.advance(page);

  // Sfida Gervaso sulla pedana
  await L.talk(page, "bur_gervaso");
  await L.advance(page, ["Pronto a giocare!"]);
  await page.waitForTimeout(300);
  await L.advance(page);

  // Parla con Taddeo per chiudere il capitolo 1
  await L.talk(page, "bur_taddeo");
  await L.advance(page);

  const inf = await L.info(page);
  if (!inf.done || !inf.done[1]) errors.push("Capitolo 1 non completato: " + JSON.stringify(inf));

  if (w === 390) await L.shot(page, "burattini_c1");
  L.check(`Burattini · Capitolo 1 (${w} px)`, errors);
  await browser.close();
}

async function testFinale(end) {
  const save = {
    v: 1, ch: 4, step: { 1: 5, 2: 5, 3: 5, 4: 3 },
    done: { 1: "popolare", 2: "popolare", 3: "popolare" },
    ends: [], diffSet: true,
    flags: { bur_m4_win: 1 },
    intro: { ch1: 1, ch2: 1, ch3: 1, ch4: 1, bur_piazza: 1 },
    zone: "bur_piazza",
    items: end === "segreto" ? ["p1", "p2", "p3"] : [],
    st: { morale: end === "popolare" ? 6 : end === "accademia" ? -4 : 0, arte: end === "segreto" ? 35 : 15, stima: 20 }
  };
  const { browser, page, errors } = await L.setup({ w: 390, ...MOD, save });
  await page.evaluate(() => window.__burattini.open());
  await page.evaluate(() => window.T_.click("Continua la storia"));
  await L.advance(page);

  await L.talk(page, "bur_duca");
  const opt = end === "popolare" ? "Consacra il teatro al Popolo" :
              end === "accademia" ? "Firma il patto dell'Accademia Ducale" :
              end === "carovana" ? "Parti con la Carovana di Gervaso" :
              "Libera l'Anima di Pioppo";
  await L.advance(page, [opt]);

  const inf = await L.info(page);
  if (!inf.ends || !inf.ends.includes(end)) {
    errors.push(`Finale «${end}» non ottenuto: ${JSON.stringify(inf.ends)}`);
  }
  L.check(`Burattini · Finale «${end}»`, errors);
  await browser.close();
}

async function minigiocoEngine() {
  const { browser, page, errors } = await L.setup({ w: 390, ...MOD });
  const hasEngine = await page.evaluate(() => !!(window.__burattiniPartita && window.__burattiniPartita.start));
  if (!hasEngine) errors.push("window.__burattiniPartita non registrato");

  const startRes = await page.evaluate(() => {
    return new Promise((resolve) => {
      let doneCalled = false;
      window.__burattiniPartita.start({
        title: "Test Unit",
        opp: "Fantoccio Test",
        half: 10,
        onDone: (res) => { doneCalled = true; resolve({ ok: true, res }); }
      });
      setTimeout(() => {
        if (window.__burattiniPartita.finish) window.__burattiniPartita.finish();
        const btn = document.querySelector("#burOv .chiudi");
        if (btn) btn.click();
      }, 100);
    });
  });

  if (!startRes || !startRes.ok) errors.push("Minigioco non avviato o non terminato correttamente");
  L.check("Burattini · Motore Partita a Fili", errors);
  await browser.close();
}

(async () => {
  console.log("-> minigiocoEngine");
  await minigiocoEngine();
  console.log("-> c1(390)");
  await c1(390);
  console.log("-> c1(320)");
  await c1(320);
  for (const f of ["popolare", "accademia", "carovana", "segreto"]) {
    console.log("-> testFinale", f);
    await testFinale(f);
  }
  console.log("-> all done");
  process.exit(0);
})().catch((e) => {
  console.error("✗ burattini test:", e.message);
  process.exit(1);
});
