// tests/bar.cjs - «Il Bar del Borgo»: hub, turno (clic automatici), fine turno, sera con ospite, migliorie, tutti i 15 episodi
const L = require("./lib.cjs");
async function run(w) {
  const { browser, page, errors } = await L.setup({ w });
  await page.waitForFunction(() => window.__bar, null, { timeout: 8000 }).catch(() => errors.push("window.__bar mancante"));
  await page.evaluate(() => window.__bar.reset());
  await page.evaluate(() => window.__bar.open()); await page.waitForSelector(".brOv canvas");
  await page.waitForTimeout(400); if (w === 390) await L.shot(page, "bar_hub");
  // turno: clic a rotazione sui 4 prodotti
  await page.evaluate(() => document.getElementById("go").click());
  await page.waitForTimeout(600);
  const end = Date.now() + 60000; let shot = false;
  while (Date.now() < end) {
    const done = await page.evaluate(() => !!document.getElementById("ev"));
    if (done) break;
    await page.evaluate(() => document.querySelectorAll(".brIt button").forEach((b) => b.onpointerdown && b.onpointerdown({ preventDefault() {} })));
    if (!shot && w === 390 && Date.now() > end - 52000) { shot = true; await L.shot(page, "bar_turno"); }
    await page.waitForTimeout(120);
  }
  if (!(await page.evaluate(() => !!document.getElementById("ev")))) errors.push("turno non finito");
  const s1 = await page.evaluate(() => window.__bar.state());
  if (!(s1.cash > 0 && s1.shifts === 1)) errors.push("turno senza incasso: " + JSON.stringify(s1));
  if (w === 390) await L.shot(page, "bar_fine");
  await page.evaluate(() => document.getElementById("ev").click()); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "bar_sera");
  // sera: scorri ogni riga, scegli la prima opzione, chiudi
  for (let i = 0; i < 8; i++) {
    const r = await page.evaluate(() => { const n = document.getElementById("nx"), k = document.querySelector("[data-k]"), ok = document.getElementById("ok"); if (n) { n.click(); return "n"; } if (k) { k.click(); return "k"; } if (ok) { ok.click(); return "ok"; } return ""; });
    if (r === "ok") break; await page.waitForTimeout(150);
  }
  const s2 = await page.evaluate(() => window.__bar.state());
  if (s2.day !== 2) errors.push("giorno non avanzato: " + s2.day);
  // migliorie con cassa piena, tutte comprabili, scena aggiornata
  await page.evaluate(() => { const s = window.__bar.state(); s.cash = 5000; s.rep = 170; localStorage.setItem("ali-di-rondine.bar", JSON.stringify(s)); });
  await page.evaluate(() => { document.querySelector(".brOv").remove(); window.__bar.open(); }); await page.waitForTimeout(300);
  await page.evaluate(() => document.getElementById("up").click()); await page.waitForTimeout(200);
  for (let k = 0; k < 14; k++) { const ok = await page.evaluate(() => { const b = document.querySelector("[data-k]:not([disabled])"); if (b) { b.click(); return true; } return false; }); if (!ok) break; await page.waitForTimeout(40); }
  const s3 = await page.evaluate(() => window.__bar.state());
  if (JSON.stringify(s3.up) !== JSON.stringify({ mac: 3, tav: 3, tv: 2, ins: 3, gia: 3 })) errors.push("migliorie incomplete: " + JSON.stringify(s3.up));
  if (w === 390) await L.shot(page, "bar_migliorie");
  await page.evaluate(() => document.getElementById("bk").click()); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "bar_hub_full");
  await page.evaluate(() => document.getElementById("gs").click()); await page.waitForTimeout(200);
  if (w === 390) await L.shot(page, "bar_ospiti");
  // turno completo con tutto sbloccato (derby): non deve dare errori
  await page.evaluate(() => document.getElementById("bk").click()); await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById("go").click()); await page.waitForTimeout(9000);
  if (w === 390) await L.shot(page, "bar_turno_full");
  // tutti i 15 episodi: cuori e stelle impostati, si apre direttamente la sera
  for (const g of ["alberto", "rosa", "santo", "violetta", "pallini"]) for (let h = 0; h < 3; h++) {
    await page.evaluate(([g, h]) => { document.querySelector(".brOv") && document.querySelector(".brOv").remove(); const s = window.__bar.state(); s.rep = 400; s.hearts = {}; s.last = ""; ["alberto", "rosa", "santo", "violetta", "pallini"].forEach((o) => { s.hearts[o] = 3; }); s.hearts[g] = h; localStorage.setItem("ali-di-rondine.bar", JSON.stringify(s)); window.__bar.open(null, { evening: true }); }, [g, h]);
    await page.waitForTimeout(120);
    let seenName = "";
    for (let i = 0; i < 8; i++) {
      const r = await page.evaluate(() => { const n = document.getElementById("nx"), k = document.querySelector("[data-k]"), ok = document.getElementById("ok"); if (n) { n.click(); return "n"; } if (k) { k.click(); return "k"; } if (ok) { ok.click(); return "ok"; } return ""; }).catch(() => "");
      if (r === "ok") break; await page.waitForTimeout(60);
    }
    const hh = await page.evaluate((g) => window.__bar.state().hearts[g], g);
    if (hh !== h + 1) errors.push(g + " ep" + h + ": cuori " + hh);
    if (w === 390 && h === 2) await L.shot(page, "bar_ep_" + g);
  }
  await browser.close(); return errors;
}
(async () => { for (const w of [390, 320]) { const e = await run(w); L.check("Il Bar del Borgo (" + w + " px)", e); } })();
