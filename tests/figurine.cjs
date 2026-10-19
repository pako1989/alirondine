// tests/figurine.cjs - «Cacciatori di Figurine»: Album (cattura per carattere, evoluzione), lotta a turni, Rotta, Rapporti, interni, finali
const L = require("./lib.cjs");
const MOD = { mod: "__figurine", key: "ali-di-rondine.figurine" };
const K_ = "window.__figurine._dbg.K";
const info = (p) => L.info(p);
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; }); // il motore di lotta si apre sopra la scena «Torna a camminare»
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function travel(p, to) { await p.evaluate(([k, to]) => eval(k).route.go(to, () => {}), [K_, to]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function fight(p, win = true) {
  await p.waitForSelector("#fgOv", { timeout: 5000 });
  await p.evaluate((w) => window.__lotta.state.finish(w), win); await p.waitForTimeout(150); await p.click("#fgGo"); await p.waitForTimeout(300);
  await L.advance(p).catch(() => {});
}
const own = (p, id) => p.evaluate(([k, id]) => eval(k).catch.own(id), [K_, id]);
const SAVE = (ch, step, done, ids, extra) => {
  const flags = Object.assign({ rt_at: "fg_borgo", ca_n: ids.length }, extra || {});
  ids.forEach((id, i) => { flags["ca_" + id] = i + 1; flags["ct_" + id] = i < 3 ? 1 : 0; });
  return { v: 1, diffSet: true, intro: { ch1: 1, fg_borgo: 1 }, ch, step, done, flags, st: { scorte: 6, fama: 2 } };
};
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__figurine.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  if (w === 390) await L.shot(page, "fg_borgo");
  { const bad = await L.reachAll(page, "fg_borgo"); if (bad.length) errors.push("fg_borgo: " + bad.join(", ")); }
  await go(page, "fg_borgo_i0", 10, 10); { const bad = await L.reachAll(page, "fg_borgo_i0"); if (bad.length) errors.push("edicola: " + bad.join(", ")); }
  await L.talk(page, "fg_ginestra"); await adv(page, ["Zolla"]);
  let i = await info(page); if (i.step[1] !== 1 || !(await own(page, "fg_zolla"))) errors.push("dopo Ginestra: " + JSON.stringify(i.step));
  await go(page, "fg_borgo_i1", 10, 10); await L.talk(page, "fg_ottone"); await adv(page);
  await go(page, "fg_prato", 15, 3); if (w === 390) await L.shot(page, "fg_prato");
  { const bad = await L.reachAll(page, "fg_prato"); if (bad.length) errors.push("fg_prato: " + bad.join(", ")); }
  await L.talk(page, "fg_piuma"); await adv(page, ["Parli piano"]);
  if (!(await own(page, "fg_piuma"))) errors.push("Piuma (timida) non catturata parlando");
  await L.talk(page, "fg_tonino"); await adv(page, ["La sfidi"]);
  await fight(page, true);
  if (!(await own(page, "fg_tonino"))) errors.push("Tonino non catturato con la sfida");
  i = await info(page); if (i.step[1] !== 2) errors.push("album 3/3 non porta a Nives: " + JSON.stringify(i.step));
  await L.talk(page, "fg_nives"); await adv(page, ["Accetti la lotta"]); await fight(page, true);
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Cacciatori di Figurine · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE(2, { 1: 2 }, { 1: "ok" }, ["fg_zolla", "fg_piuma", "fg_tonino"]) });
  await page.evaluate(() => window.__figurine.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await adv(page);
  await go(page, "fg_borgo_i0", 10, 10); await L.talk(page, "fg_ginestra"); await adv(page);
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo Ginestra: " + JSON.stringify(i.step));
  await go(page, "fg_borgo", 15, 12); { const bad = await L.reachAll(page, "fg_borgo"); if (bad.length) errors.push("fg_borgo (patch c2): " + bad.join(", ")); }
  await travel(page, "fg_bosco"); if (w === 390) await L.shot(page, "fg_bosco");
  { const bad = await L.reachAll(page, "fg_bosco"); if (bad.length) errors.push("fg_bosco: " + bad.join(", ")); }
  await L.talk(page, "fg_ghirigoro"); await adv(page, ["Giochi con lei"]);
  await L.talk(page, "fg_raffica"); await adv(page, ["La sfidi"]); await fight(page, true);
  i = await info(page); if (i.step[2] !== 2) errors.push("album 5/5 non porta alla radura: " + JSON.stringify(i.step));
  await go(page, "fg_radura", 14, 3); { const bad = await L.reachAll(page, "fg_radura"); if (bad.length) errors.push("fg_radura: " + bad.join(", ")); }
  await L.talk(page, "fg_anselmo"); await adv(page, ["Le riporterò a casa"]);
  i = await info(page); if (i.step[2] !== 3) errors.push("dopo Anselmo: " + JSON.stringify(i.step));
  await go(page, "fg_bosco", 15, 4); await L.talk(page, "fg_nives"); await adv(page, ["Accetti la lotta"]); await fight(page, true);
  i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Cacciatori di Figurine · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w, libera) {
  const save = SAVE(3, { 1: 2, 2: 3 }, { 1: "ok", 2: "ok" }, ["fg_zolla", "fg_piuma", "fg_tonino", "fg_ghirigoro", "fg_orsa"], { rt_at: "fg_bosco" }); save.step[2] = 3;
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__figurine.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await adv(page);
  await L.talk(page, "fg_nives"); await adv(page, ["Restiamo"]);
  let i = await info(page); if (i.step[3] !== 1) errors.push("dopo Nives: " + JSON.stringify(i.step));
  await travel(page, "fg_citta"); if (w === 390) await L.shot(page, "fg_citta");
  { const bad = await L.reachAll(page, "fg_citta"); if (bad.length) errors.push("fg_citta: " + bad.join(", ")); }
  await go(page, "fg_citta_i0", 10, 10); await L.talk(page, "fg_gilda"); await adv(page);
  await go(page, "fg_citta_i1", 10, 10); { const bad = await L.reachAll(page, "fg_citta_i1"); if (bad.length) errors.push("sede: " + bad.join(", ")); }
  await L.talk(page, "fg_vetrino"); await adv(page, ["Dimostralo"]); await fight(page, true);
  i = await info(page); if (i.step[3] !== 3) errors.push("dopo la Prova: " + JSON.stringify(i.step));
  await L.talk(page, "fg_vetrino"); await adv(page, [libera ? "Le liberi" : "Le lasci"]);
  i = await info(page); if (i.done[3] !== (libera ? "libera" : "tiene")) errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Cacciatori di Figurine · capitolo 3 ${libera ? "libera" : "tiene"} (${w} px)`, errors); await browser.close();
}
async function c4(w, libera) {
  const ids = ["fg_zolla", "fg_piuma", "fg_tonino", "fg_ghirigoro", "fg_orsa", "fg_svolazzo", "fg_notturno", "fg_sorriso", "fg_raffica", "fg_caldana", "fg_sipario", "fg_muraglia"];
  const save = SAVE(4, { 1: 2, 2: 3, 3: 4 }, { 1: "ok", 2: "ok", 3: libera ? "libera" : "tiene" }, ids, { rt_at: "fg_citta", fg_libera: libera ? 1 : 0, fg_decided: 1 });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__figurine.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await adv(page);
  await travel(page, "fg_lega"); if (w === 390) await L.shot(page, "fg_lega");
  { const bad = await L.reachAll(page, "fg_lega"); if (bad.length) errors.push("fg_lega: " + bad.join(", ")); }
  await L.talk(page, "fg_rosa"); await adv(page);
  for (let k = 0; k < 3; k++) { await L.talk(page, "fg_rosa"); await adv(page, ["Entra in campo"]); await fight(page, true); }
  const i = await info(page); const want = libera ? "custode" : "campione";
  if (!i.ends.includes(want) || !i.ends.includes("album")) errors.push("finali attesi " + want + "+album: " + JSON.stringify([i.done, i.ends]));
  L.check(`Cacciatori di Figurine · capitolo 4 ${want} (${w} px)`, errors); await browser.close();
}
(async () => { await c1(390); await c1(320); await c2(390); await c2(320); await c3(390, true); await c3(320, false); await c4(390, true); await c4(320, false); })();
