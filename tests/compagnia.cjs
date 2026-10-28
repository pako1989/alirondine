// tests/compagnia.cjs - «La Compagnia del Pallone Spezzato»: zone raggiungibili, capitolo 1, battaglia a griglia vera (apertura) e vittoria simulata
const L = require("./lib.cjs");
const MOD = { mod: "__compagnia", key: "ali-di-rondine.compagnia" };
const K_ = "window.__compagnia._dbg.K";
const ZONES = ["cp_campo", "cp_tenda", "cp_mulini", "cp_locanda"];
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function start(w, save, pick) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__compagnia.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, pick ? [pick] : []).catch(() => {}); return r;
}
async function zonesTest(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  for (const z of ZONES) {
    try { await go(page, z); await L.shot(page, "cp_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Compagnia · zone (${w} px)`, errors); await browser.close();
}
async function flow(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 } });
  await page.evaluate((k) => { eval(k).tactics.play = (o, cb) => { window.__tacLog = { foes: o.foes.length, units: o.units.length }; setTimeout(() => cb({ win: true, lost: 0 }), 10); }; }, K_);
  await go(page, "cp_tenda", 7, 8); await L.talk(page, "cp_dorotea"); await L.advance(page, ["Agli ordini"]);
  let i = await L.info(page); if (i.step[1] !== 1) errors.push("dopo Dorotea: " + JSON.stringify(i.step));
  await go(page, "cp_campo", 10, 14); await L.talk(page, "cp_ludovico"); await L.advance(page);
  i = await L.info(page); if (i.step[1] !== 2) errors.push("dopo Ludovico: " + JSON.stringify(i.step));
  await go(page, "cp_locanda", 8, 9); await L.talk(page, "cp_fiamma"); await L.advance(page, ["Offri di pagare"]);
  i = await L.info(page); if (i.step[1] !== 3) errors.push("dopo Fiamma: " + JSON.stringify(i.step));
  await go(page, "cp_mulini", 20, 11); await L.talk(page, "cp_brando"); await L.advance(page, ["Combatti"]); await L.advance(page).catch(() => {}); await L.advance(page).catch(() => {});
  i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  const lg = await page.evaluate(() => window.__tacLog); if (!lg || lg.foes < 4 || lg.units < 4) errors.push("battaglia mal configurata: " + JSON.stringify(lg));
  L.check(`Compagnia · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function realBattle(w) {
  const { browser, page, errors } = await start(w, { v: 1, diffSet: true, intro: { ch1: 1 }, ch: 1, step: { 1: 3 }, flags: {} });
  await go(page, "cp_mulini", 20, 11); await L.talk(page, "cp_brando");
  for (let k = 0; k < 6; k++) { const hit = await page.evaluate(() => { const b = [...document.querySelectorAll("#choices button")].find((x) => /Combatti/.test(x.innerText)); if (b) { b.click(); return 1; } const c = [...document.querySelectorAll("#choices button")].find((x) => /^Continua/.test(x.innerText.trim())); if (c) c.click(); return 0; }); if (hit) break; await page.waitForTimeout(400); }
  await page.waitForTimeout(1500);
  const st = await page.evaluate(() => { const s = window.__tattica && window.__tattica.state && window.__tattica.state(); return s ? { ok: true, units: (s.units || []).length } : { ok: false }; });
  if (!st.ok) errors.push("battaglia vera non aperta"); else if (st.units < 6) errors.push("poche unità in campo: " + st.units);
  await L.shot(page, "cp_battaglia_" + w);
  L.check(`Compagnia · battaglia vera (${w} px)`, errors); await browser.close();
}
(async () => { for (const w of [390, 1000]) { await zonesTest(w); await flow(w); } await realBattle(390); })().catch((e) => { console.error("✗ compagnia:", e.message); process.exit(1); });
