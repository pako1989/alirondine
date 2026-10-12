// tests/stagione.cjs - «Stagione Infinita»: la giornata che si ripete (orari, orologio, riavvolgimento), Il Nastro, capitoli e finali
const L = require("./lib.cjs");
const MOD = { mod: "__stagione", key: "ali-di-rondine.stagione" };
const naStart = (p) => p.evaluate(() => { const b = document.querySelector(".naOv .ov button"); if (b) b.click(); });
const naEnd = async (p, a, b) => { await p.evaluate(([a, b]) => { const S = window.__nastro.state; S.a = a; S.b = b; S.finish(); }, [a, b]); await p.waitForTimeout(200); await naStart(p); await p.waitForTimeout(200); };
const waitRewind = (p) => p.waitForFunction(() => !document.querySelector("canvas[style*='z-index:400']"), null, { timeout: 15000 });
const clock = async (p, w) => { await L.goAct(p, 18, 11); await L.advance(p, ["Aspetta fino"]); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__stagione.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  for (const z of ["sf_piazza", "sf_stadio", "sf_videoteca"]) { const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "sf_piazza");
  await L.talk(page, "sf_gatto"); await L.advance(page);
  await L.talk(page, "sf_mira"); await L.advance(page);
  // l'orologio fa passare il tempo, e i personaggi cambiano posto
  await clock(page); const m1 = await page.evaluate(() => window.T_.npcAt("sf_mira")); if (String(m1) !== "13,13") errors.push("Mira non segue il suo orario: " + m1);
  if ((await page.evaluate(() => window.__stagione._dbg.K.ora())) !== 1) errors.push("l'orologio non fa passare il tempo");
  await clock(page); await clock(page);
  await L.goAct(page, 35, 12); await L.advance(page); if ((await L.zone(page)) !== "sf_stadio") errors.push("non si arriva al Lido");
  if (w === 390) await L.shot(page, "sf_stadio");
  await L.talk(page, "sf_bruno"); await page.evaluate(() => window.T_.click("Gioca la finale")); await page.waitForTimeout(500); await naStart(page);
  // un bivio vero: si aspetta la pausa e si sceglie con il pulsante
  await page.waitForFunction(() => window.__nastro.state && window.__nastro.state.phase === "bivio", null, { timeout: 8000 });
  if (w === 390) await L.shot(page, "sf_nastro");
  await page.evaluate(() => document.querySelector('.naOv .pad button[data-k="1"]').dispatchEvent(new PointerEvent("pointerdown")));
  const ch = await page.evaluate(() => window.__nastro.state.data.bivi && Object.keys(window.__nastro.state.mem).length); if (!ch) errors.push("il bivio non registra la scelta");
  await naEnd(page, 1, 0); await L.advance(page); await waitRewind(page); await page.waitForTimeout(300); await L.advance(page);
  const st = await page.evaluate(() => { const K = window.__stagione._dbg.K; return [K.giro(), K.ora(), Object.keys(K.mem().flags).filter((k) => /^nm_/.test(k)).length, window.__borgoApi.trZone()]; });
  if (st[0] !== 2 || st[1] !== 0 || !st[2] || st[3] !== "sf_piazza") errors.push("il riavvolgimento non riporta alla domenica mattina con la memoria: " + JSON.stringify(st));
  // la seconda domenica: Ada è ai cancelli del Lido al mattino
  await L.goAct(page, 35, 12); await L.advance(page); await L.talk(page, "sf_ada"); await L.advance(page, ["È la seconda domenica"]);
  const i = await L.info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify(i.step)); if (!i.flags.mem_gatto_0) errors.push("il gatto non è ricordato");
  L.check(`Stagione Infinita · capitolo 1 (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); })().catch((e) => { console.error("✗ stagione:", e.message); process.exit(1); });
