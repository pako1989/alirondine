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
const S2 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, cp_strada: 1, cp_fortino: 1, cp_cantina: 1 }, ch: 2, step: { 1: 4 }, done: { 1: "ok" }, flags: { cp_c1_done: 1 } };
async function zones2(w) {
  const { browser, page, errors } = await start(w, S2, "Inizia il Capitolo 2");
  await page.evaluate((k) => eval(k).F.set("cp_grata", true), K_);
  for (const z of ["cp_strada", "cp_fortino", "cp_cantina"]) {
    try { await go(page, z); await L.shot(page, "cp2_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Compagnia · capitolo 2 zone (${w} px)`, errors); await browser.close();
}
async function flow2(w, via) {
  const { browser, page, errors } = await start(w, S2, "Inizia il Capitolo 2");
  await page.evaluate((k) => { eval(k).tactics.play = (o, cb) => { window.__tacLog = { foes: o.foes.length, units: o.units.length }; setTimeout(() => cb({ win: true, lost: 0 }), 10); }; }, K_);
  await go(page, "cp_strada", 10, 10); await L.talk(page, "cp_bruno"); await L.advance(page, ["Stammi dietro"]);
  let i = await L.info(page); if (i.step[2] !== 1) errors.push("dopo Bruno: " + JSON.stringify(i.step));
  await go(page, "cp_strada", 17, 12); await L.talk(page, "cp_gervasio"); await L.advance(page, ["Niente"]);
  i = await L.info(page); if (i.step[2] !== 2) errors.push("dopo Gervasio: " + JSON.stringify(i.step));
  if (via === "assalto") { await go(page, "cp_fortino", 13, 10); await L.talk(page, "cp_aurelio"); await L.advance(page, ["Assalto"]); await L.advance(page).catch(() => {}); await L.advance(page).catch(() => {}); const lg = await page.evaluate(() => window.__tacLog); if (!lg || lg.foes < 5) errors.push("battaglia mal configurata: " + JSON.stringify(lg)); }
  else { await go(page, "cp_cantina", 7, 6); await L.talk(page, "cp_ottavia"); await L.advance(page, ["Chiedi il registro"]); await L.advance(page).catch(() => {}); await L.advance(page).catch(() => {}); }
  i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso (" + via + "): " + JSON.stringify([i.done, i.step]));
  L.check(`Compagnia · capitolo 2 ${via} (${w} px)`, errors); await browser.close();
}
const S3 = { v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, cp_convento: 1, cp_biblioteca: 1 }, ch: 3, step: { 1: 4, 2: 3 }, done: { 1: "ok", 2: "ok" }, flags: { cp_c1_done: 1, cp_c2_done: 1 } };
async function zones3(w) {
  const { browser, page, errors } = await start(w, S3, "Inizia il Capitolo 3");
  for (const z of ["cp_convento", "cp_biblioteca"]) {
    try { await go(page, z); await L.shot(page, "cp3_" + z + "_" + w); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Compagnia · capitolo 3 zone (${w} px)`, errors); await browser.close();
}
async function flow3(w) {
  const { browser, page, errors } = await start(w, S3, "Inizia il Capitolo 3");
  await page.evaluate((k) => { eval(k).tactics.play = (o, cb) => { window.__tacLog = { foes: o.foes.length, units: o.units.length }; setTimeout(() => cb({ win: true, lost: 0 }), 10); }; }, K_);
  await go(page, "cp_convento", 5, 15); await L.talk(page, "cp_anselmo"); await L.advance(page, ["Niente"]);
  let i = await L.info(page); if (i.step[3] !== 1) errors.push("dopo Anselmo: " + JSON.stringify(i.step));
  await go(page, "cp_biblioteca", 8, 7); await L.talk(page, "cp_pio"); await L.advance(page);
  i = await L.info(page); if (i.step[3] !== 2) errors.push("dopo Pio: " + JSON.stringify(i.step));
  await go(page, "cp_convento", 19, 10); await L.talk(page, "cp_brando"); await L.advance(page, ["Difendi"]); await L.advance(page).catch(() => {}); await L.advance(page).catch(() => {});
  i = await L.info(page); if (i.step[3] !== 3) errors.push("dopo battaglia: " + JSON.stringify(i.step));
  await go(page, "cp_convento", 13, 12); await L.talk(page, "cp_ludovico"); await L.advance(page, ["Siamo la Compagnia"]); await L.advance(page).catch(() => {}); await L.advance(page).catch(() => {});
  i = await L.info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Compagnia · capitolo 3 (${w} px)`, errors); await browser.close();
}
(async () => { for (const w of [390, 1000]) { await zonesTest(w); await flow(w); await zones2(w); await flow2(w, "assalto"); await flow2(w, "cantina"); await zones3(w); await flow3(w); } await realBattle(390); })().catch((e) => { console.error("✗ compagnia:", e.message); process.exit(1); });
