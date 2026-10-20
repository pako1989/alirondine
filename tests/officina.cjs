// tests/officina.cjs - «L'Officina dei Giganti di Ruggine»: Pressione e Sfiato (valvole, stallo), Steam Strikers, Rotta coi Tubi, interni, finali
const L = require("./lib.cjs");
const MOD = { mod: "__officina", key: "ali-di-rondine.officina" };
const K_ = "window.__officina._dbg.K";
const info = (p) => L.info(p);
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; });
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
async function travel(p, to) { await p.evaluate(([k, to]) => eval(k).route.go(to, () => {}), [K_, to]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
const lvl = (p) => p.evaluate((k) => eval(k).steam.level(), K_);
const setP = (p, n) => p.evaluate(([k, n]) => { const K = eval(k); K.bond("pressione", n - K.steam.level()); }, [K_, n]);
async function fight(p, win = true) {
  await p.waitForSelector("#stOv", { timeout: 5000 });
  await p.evaluate((w) => window.__steam.state.finish(w ? 5 : 0, w ? 1 : 4), win); await p.waitForTimeout(150); await p.click("#stGo"); await p.waitForTimeout(300);
  await L.advance(p).catch(() => {});
}
const SAVE = (ch, step, done, flags, st) => ({ v: 1, diffSet: true, intro: { ch1: 1, of_fonderia: 1 }, ch, step, done, flags: Object.assign({ rt_at: "of_fonderia" }, flags || {}), st: Object.assign({ pressione: 4, scafo: 6, fiducia: 3 }, st || {}) });
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__officina.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  if (w === 390) await L.shot(page, "of_fonderia");
  { const bad = await L.reachAll(page, "of_fonderia"); if (bad.length) errors.push("of_fonderia: " + bad.join(", ")); }
  await go(page, "of_fonderia_i0", 10, 10); { const bad = await L.reachAll(page, "of_fonderia_i0"); if (bad.length) errors.push("hangar: " + bad.join(", ")); }
  await L.talk(page, "of_rina"); await adv(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Rina: " + JSON.stringify(i.step));
  await go(page, "of_fonderia_i1", 10, 10); { const bad = await L.reachAll(page, "of_fonderia_i1"); if (bad.length) errors.push("bottega: " + bad.join(", ")); }
  await L.talk(page, "of_gasparre"); await adv(page);
  i = await info(page); if (i.step[1] !== 2) errors.push("dopo Gasparre: " + JSON.stringify(i.step));
  await go(page, "of_fonderia", 12, 10);
  await L.talk(page, "of_brontolo"); await adv(page, ["Apri la valvola"]);
  i = await info(page); if (i.step[1] !== 2) errors.push("valvola aperta senza pressione: " + JSON.stringify(i.step));
  await L.talk(page, "of_brontolo"); await adv(page, ["Alimenta"]);
  const p1 = await lvl(page); if (p1 < 5) errors.push("pressione non salita: " + p1);
  await L.talk(page, "of_brontolo"); await adv(page, ["Apri la valvola"]);
  i = await info(page); if (i.step[1] !== 3) errors.push("valvola non aperta: " + JSON.stringify([i.step, p1]));
  await L.talk(page, "of_brontolo"); await adv(page, ["Allenamento"]); await fight(page, false);
  i = await info(page); if (i.step[1] !== 3) errors.push("sconfitta avanza: " + JSON.stringify(i.step));
  await L.talk(page, "of_brontolo"); await adv(page, ["Allenamento"]); await fight(page, true);
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step, i.st]));
  L.check(`Officina · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function stallo(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE(1, { 1: 2 }, {}, {}, { pressione: 9 }) });
  await page.evaluate(() => window.__officina.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await L.talk(page, "of_brontolo"); await adv(page, ["Alimenta"]);
  const p = await lvl(page), s = await page.evaluate((k) => eval(k).stat("scafo"), K_);
  if (p > 4) errors.push("nessuno stallo (pressione " + p + ")"); if (s !== 5) errors.push("scafo dopo stallo: " + s);
  const fl = await page.evaluate((k) => eval(k).F.is("of_stall1"), K_); if (!fl) errors.push("flag stallo non segnato");
  L.check(`Officina · stallo (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const save = SAVE(2, { 1: 4 }, { 1: "ok" }, {}, { pressione: 8 });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__officina.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await adv(page);
  if (w === 390) await L.shot(page, "of_cavi");
  { const bad = await L.reachAll(page, "of_cavi"); if (bad.length) errors.push("of_cavi: " + bad.join(", ")); }
  await go(page, "of_cavi_i0", 10, 10); { const bad = await L.reachAll(page, "of_cavi_i0"); if (bad.length) errors.push("cabina: " + bad.join(", ")); }
  await L.talk(page, "of_volta"); await adv(page);
  await go(page, "of_cavi", 12, 10);
  await L.talk(page, "of_brontolo"); await adv(page, ["Valvola A"]);
  let i = await info(page); if (i.step[2] !== 2) errors.push("Valvola A: " + JSON.stringify(i.step));
  await setP(page, 8);
  await L.talk(page, "of_brontolo"); await adv(page, ["Valvola B"]);
  i = await info(page); if (i.step[2] !== 3) errors.push("Valvola B: " + JSON.stringify(i.step));
  await L.talk(page, "of_ferro"); await adv(page); await fight(page, true);
  i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  const g = await page.evaluate((k) => eval(k).F.is("of_gear2"), K_); if (!g) errors.push("ingranaggio 2 mancante");
  L.check(`Officina · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const save = SAVE(3, { 2: 4 }, { 1: "ok", 2: "ok" }, { rt_at: "of_cavi" }, { pressione: 8 });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__officina.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await adv(page);
  if (w === 390) await L.shot(page, "of_collaudo");
  { const bad = await L.reachAll(page, "of_collaudo"); if (bad.length) errors.push("of_collaudo: " + bad.join(", ")); }
  await go(page, "of_collaudo_i0", 10, 10); { const bad = await L.reachAll(page, "of_collaudo_i0"); if (bad.length) errors.push("ufficio: " + bad.join(", ")); }
  await L.talk(page, "of_vanda"); await adv(page);
  await go(page, "of_collaudo", 12, 10);
  await L.talk(page, "of_brontolo"); await adv(page, ["Collaudo"]);
  let i = await info(page); if (i.step[3] !== 2) errors.push("Collaudo: " + JSON.stringify(i.step));
  await go(page, "of_collaudo_i0", 10, 10); await L.talk(page, "of_vanda"); await adv(page, ["Rifiuti"]);
  i = await info(page); if (i.step[3] !== 3) errors.push("dopo il Patto: " + JSON.stringify(i.step));
  await L.talk(page, "of_vanda"); await adv(page); await fight(page, true);
  i = await info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  if (!(await page.evaluate((k) => eval(k).F.is("of_gear3"), K_))) errors.push("ingranaggio 3 mancante");
  L.check(`Officina · capitolo 3 (${w} px)`, errors); await browser.close();
}
async function c4(w, patto) {
  const save = SAVE(4, { 3: 4 }, { 1: "ok", 2: "ok", 3: "ok" }, patto ? { of_patto: true } : { of_gear1: true, of_gear2: true, of_gear3: true }, { pressione: 8 });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__officina.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await adv(page);
  if (w === 390) await L.shot(page, "of_caldaie");
  { const bad = await L.reachAll(page, "of_caldaie"); if (bad.length) errors.push("of_caldaie: " + bad.join(", ")); }
  await L.talk(page, "of_rina"); await adv(page);
  await L.talk(page, "of_brontolo"); await adv(page, ["Carica la caldaia"]);
  let i = await info(page); if (i.step[4] !== 2) errors.push("caldaia centrale: " + JSON.stringify(i.step));
  await L.talk(page, "of_rina"); await adv(page); await fight(page, true);
  await L.talk(page, "of_gasparre"); await adv(page); await fight(page, true);
  i = await info(page); if (i.step[4] !== 4) errors.push("dopo Beta: " + JSON.stringify(i.step));
  await L.talk(page, "of_vanda"); await adv(page); await fight(page, true); await adv(page).catch(() => {});
  i = await info(page); const want = patto ? "patto" : "nucleo"; if (i.done[4] !== want) errors.push("finale " + want + ": " + JSON.stringify([i.done, i.step]));
  L.check(`Officina · capitolo 4 ${patto ? "patto" : "nucleo"} (${w} px)`, errors); await browser.close();
}
async function rotta(w) {
  const save = SAVE(2, { 1: 4 }, { 1: "ok" }, {}, { pressione: 9 });
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await page.evaluate(() => window.__officina.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await adv(page);
  const p0 = await lvl(page); await travel(page, "of_cavi");
  const p1 = await lvl(page); if (!(p1 < p0)) errors.push(`il Tubo non costa pressione: ${p0} → ${p1}`);
  L.check(`Officina · Rotta (${w} px)`, errors); await browser.close();
}
async function guida(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__officina.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  await page.evaluate(() => window.T_.click("Menu")); await page.waitForTimeout(300); await page.evaluate(() => window.T_.click("Guida")); await page.waitForTimeout(300);
  const l = await page.evaluate(() => [...document.querySelectorAll("#choices button")].map((b) => b.innerText).join("|"));
  ["Rapporti", "Zaino", "Orologio", "Rotta", "Pressione"].forEach((k) => { if (!l.includes(k)) errors.push("guida senza " + k + ": " + l); });
  L.check(`Officina · Guida (${w} px)`, errors); await browser.close();
}
(async () => { for (const w of (process.argv[2] ? [390] : [390, 320])) { if (process.argv[2]) { await rotta(w); continue; } await c1(w); await stallo(w); await c2(w); await c3(w); await c4(w, false); await c4(w, true); await rotta(w); await guida(w); } })();
