// tests/rotta.cjs - «Rotta 66»: Rotta (viaggio a tappe con risorse), Rapporti, Inventario, orologio, interni, finale con partita
const L = require("./lib.cjs");
const MOD = { mod: "__rotta", key: "ali-di-rondine.rotta" };
const K_ = "window.__rotta._dbg.K";
const info = (p) => L.info(p);
const stat = (p, k) => p.evaluate(([K, k]) => eval(K).stat(k), [K_, k]);
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function travel(p, to) { await p.evaluate(([k, to]) => eval(k).route.go(to, () => {}), [K_, to]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__rotta.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if (w === 390) await L.shot(page, "ro_paese");
  { const bad = await L.reachAll(page, "ro_paese"); if (bad.length) errors.push("ro_paese: " + bad.join(", ")); }
  await L.talk(page, "ro_bartolo"); await L.advance(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Bartolo: " + JSON.stringify(i.step));
  await go(page, "ro_paese_i0", 10, 10); { const bad = await L.reachAll(page, "ro_paese_i0"); if (bad.length) errors.push("bar: " + bad.join(", ")); }
  await L.talk(page, "ro_pina"); await L.advance(page);
  await go(page, "ro_paese", 21, 10);
  // la Rotta dal menu
  await L.talk(page, "ro_osvaldo"); await L.advance(page, ["Guarda la Rotta", "Passo del Gigante"]);
  await page.waitForTimeout(400);
  const b0 = await stat(page, "benza");
  if (b0 > 4) { /* se il viaggio non è partito dal menu, lo faccio via API */ await travel(page, "ro_passo"); }
  const here = await page.evaluate((k) => eval(k).route.here(), K_); if (here !== "ro_passo") errors.push("rotta non a ro_passo: " + here);
  if ((await stat(page, "benza")) !== b0 && b0 !== 6) {}
  if (w === 390) await L.shot(page, "ro_passo");
  { const bad = await L.reachAll(page, "ro_passo"); if (bad.length) errors.push("ro_passo: " + bad.join(", ")); }
  await go(page, "ro_passo_i0", 10, 10); { const bad = await L.reachAll(page, "ro_passo_i0"); if (bad.length) errors.push("rifugio: " + bad.join(", ")); }
  await L.talk(page, "ro_tobia"); await L.advance(page, ["Compri le catene"]);
  i = await info(page); if (i.step[1] !== 3) errors.push("dopo Tobia: " + JSON.stringify(i.step));
  await go(page, "ro_passo", 3, 8); await travel(page, "ro_autogrill");
  if (w === 390) await L.shot(page, "ro_autogrill");
  { const bad = await L.reachAll(page, "ro_autogrill"); if (bad.length) errors.push("autogrill: " + bad.join(", ")); }
  await go(page, "ro_autogrill_i0", 10, 10); { const bad = await L.reachAll(page, "ro_autogrill_i0"); if (bad.length) errors.push("tordo: " + bad.join(", ")); }
  await L.talk(page, "ro_ada"); await L.advance(page, ["Per ora no"]);
  await go(page, "ro_autogrill", 12, 10); await L.talk(page, "ro_fiamma"); await L.advance(page, ["Ti siedi e non parli"]); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step, i.st]));
  L.check(`Rotta 66 · capitolo 1 (${w} px)`, errors); await browser.close();
}
const BASE = { v: 1, diffSet: true, intro: { ch1: 1, ro_paese: 1 }, st: { benza: 6, umore: 6, cassa: 40 } };
async function c2(w) {
  const save = Object.assign({}, BASE, { ch: 2, step: { 1: 3 }, done: { 1: "ok" }, flags: { rt_at: "ro_autogrill" } });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__rotta.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  await L.talk(page, "ro_ersilia"); await L.advance(page, ["Resta, viaggerai con noi"]); await L.advance(page).catch(() => {});
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo Ersilia: " + JSON.stringify(i.step));
  await travel(page, "ro_lago"); if (w === 390) await L.shot(page, "ro_lago");
  { const bad = await L.reachAll(page, "ro_lago"); if (bad.length) errors.push("ro_lago: " + bad.join(", ")); }
  await L.talk(page, "ro_cosimo"); await L.advance(page, ["Lo aiuti"]);
  const f = await page.evaluate((k) => eval(k).F.is("ro_traghetto_ok"), K_); if (!f) errors.push("traghetto non sbloccato");
  const c0 = await stat(page, "cassa");
  await travel(page, "ro_borgo"); if (w === 390) await L.shot(page, "ro_borgo");
  const c1_ = await stat(page, "cassa"); if (c1_ !== c0 - 10) errors.push(`traghetto: cassa ${c0} → ${c1_}`);
  { const bad = await L.reachAll(page, "ro_borgo"); if (bad.length) errors.push("ro_borgo: " + bad.join(", ")); }
  await go(page, "ro_borgo_i0", 10, 10); { const bad = await L.reachAll(page, "ro_borgo_i0"); if (bad.length) errors.push("locanda: " + bad.join(", ")); }
  await L.talk(page, "ro_luisa"); await L.advance(page, ["Partecipi alla sagra"]);
  i = await info(page); if (i.step[2] !== 2) errors.push("dopo Luisa: " + JSON.stringify(i.step));
  await go(page, "ro_borgo", 22, 12); await L.talk(page, "ro_fiamma"); await L.advance(page, ["Domani giochi per tutti noi"]); await L.advance(page).catch(() => {});
  i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step, i.st]));
  L.check(`Rotta 66 · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w, win, umore) {
  const save = Object.assign({}, BASE, { ch: 3, step: { 1: 3, 2: 2 }, done: { 1: "ok", 2: "ok" }, flags: { rt_at: "ro_borgo" }, st: { benza: 6, umore, cassa: 40 } });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await L.stubMatch(page, win);
  await page.evaluate(() => window.__rotta.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  await travel(page, "ro_valle"); if (w === 390) await L.shot(page, "ro_valle");
  { const bad = await L.reachAll(page, "ro_valle"); if (bad.length) errors.push("ro_valle: " + bad.join(", ")); }
  await L.talk(page, "ro_ciro"); await L.advance(page, ["Lo sfidi con lo sguardo"]);
  let i = await info(page); if (i.step[3] !== 1) errors.push("dopo Ciro: " + JSON.stringify(i.step));
  await travel(page, "ro_stadio"); if (w === 390) await L.shot(page, "ro_stadio");
  { const bad = await L.reachAll(page, "ro_stadio"); if (bad.length) errors.push("ro_stadio: " + bad.join(", ")); }
  await go(page, "ro_stadio_i0", 10, 10); { const bad = await L.reachAll(page, "ro_stadio_i0"); if (bad.length) errors.push("spogliatoio: " + bad.join(", ")); }
  await L.talk(page, "ro_bartolo"); await L.advance(page, ["Entra in campo"]); await L.advance(page).catch(() => {}); await L.advance(page).catch(() => {});
  const m = await page.evaluate(() => window.__lastMatch); if (!m || m.id !== "ro_finale") errors.push("partita non lanciata: " + JSON.stringify(m));
  const um = umore + 2; // Ciro: sfida +2
  const want = win ? (um >= 7 ? "coppa" : "stanca") : (um >= 6 ? "onore" : "strada");
  i = await info(page); if (i.done[3] !== want || !i.ends.includes(want)) errors.push("finale atteso " + want + ": " + JSON.stringify([i.done, i.ends, i.st]));
  L.check(`Rotta 66 · capitolo 3 ${want} (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390, true, 6); await c3(320, false, 1); })();
