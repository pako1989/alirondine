// tests/circuiti.cjs - «Neo-Rondine 2099»: Terminali di Hacking, droni e furtivo, piastre elettrificate, Circuito EMP, interni, capitoli, finali
const L = require("./lib.cjs");
const MOD = { mod: "__circuiti", key: "ali-di-rondine.circuiti" };
const K_ = "window.__circuiti._dbg.K";
const info = (p) => L.info(p);
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; });
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
const stat = (p, a) => p.evaluate(([k, a]) => eval(k).stat(a), [K_, a]);
const setStat = (p, a, n) => p.evaluate(([k, a, n]) => { const K = eval(k); K.bond(a, n - K.stat(a)); }, [K_, a, n]);
async function emp(p, win = true) {
  await p.waitForSelector("#emOv", { timeout: 5000 });
  await p.evaluate((w) => window.__emp.state.finish(w), win); await p.waitForTimeout(150); await p.click("#emGo"); await p.waitForTimeout(300);
  await L.advance(p).catch(() => {});
}
const SAVE = (zone, ch, step, done, flags, st) => ({ v: 1, diffSet: true, intro: { ch1: 1, [zone]: 1 }, ch, step, done, flags: flags || {}, st: Object.assign({ energia: 40, hackeraggio: 30, fama: 10 }, st || {}) });
const click = async (p, t) => { await p.evaluate((t) => window.T_.click(t), t); await p.waitForTimeout(200); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__circuiti.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  if (w === 390) await L.shot(page, "nr_vicoli");
  { const bad = await L.reachAll(page, "nr_vicoli"); if (bad.length) errors.push("nr_vicoli: " + bad.join(", ")); }
  await L.talk(page, "nr_kira"); await adv(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Kira: " + JSON.stringify(i.step));
  await go(page, "nr_bar", 8, 10); if (w === 390) await L.shot(page, "nr_bar"); { const bad = await L.reachAll(page, "nr_bar"); if (bad.length) errors.push("bar: " + bad.join(", ")); }
  await L.talk(page, "nr_bolt"); await adv(page);
  i = await info(page); if (i.step[1] !== 2) errors.push("dopo Bullone: " + JSON.stringify(i.step));
  if (!(await page.evaluate((k) => eval(k).inv.has("nr_cella"), K_))) errors.push("cella al litio mancante");
  await go(page, "nr_vicoli", 12, 9);
  // il terminale costa Hacking e devia il drone
  const h0 = await stat(page, "hackeraggio");
  await page.evaluate((k) => eval(k).api.trAct && 0, K_);
  await page.evaluate((k) => { const K = eval(k); K.hack.run("Prova", [{ id: "dev_nr_vicoli_0", label: "Deviare", cost: 10, run: () => K.done() }]); }, K_); await page.waitForTimeout(300);
  await click(page, "Deviare"); await page.waitForTimeout(300); await adv(page).catch(() => {});
  const h1 = await stat(page, "hackeraggio"); if (h1 !== h0 - 10) errors.push(`Hacking ${h0} → ${h1}`);
  if (!(await page.evaluate((k) => eval(k).hack.on("dev_nr_vicoli_0"), K_))) errors.push("drone non deviato");
  await setStat(page, "energia", 40); await go(page, "nr_vicoli", 25, 13);
  await L.talk(page, "nr_volt").catch(() => {});
  await page.evaluate((k) => eval(k).F.set("nr_forzata", true), K_);
  await go(page, "nr_officina", 10, 14); if (w === 390) await L.shot(page, "nr_officina"); { const bad = await L.reachAll(page, "nr_officina"); if (bad.length) errors.push("officina: " + bad.join(", ")); }
  await L.talk(page, "nr_jax"); await adv(page);
  i = await info(page); if (i.step[1] !== 3) errors.push("dopo Jax: " + JSON.stringify(i.step));
  await L.talk(page, "nr_jax"); await adv(page); await emp(page, false);
  i = await info(page); if (i.step[1] !== 3) errors.push("sconfitta avanza: " + JSON.stringify(i.step));
  await L.talk(page, "nr_jax"); await adv(page); await emp(page, true);
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step, i.st]));
  L.check(`Circuiti · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("nr_monorotaia", 2, { 1: 4 }, { 1: "ok" }, { nr_c1_done: true }, { fama: 25 }) });
  await page.evaluate(() => window.__circuiti.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await adv(page);
  if (w === 390) await L.shot(page, "nr_monorotaia");
  // cancello chiuso: la guardia lascia passare chi ha Fama 20
  await page.evaluate((k) => eval(k).F.set("nr_gate", true), K_); await go(page, "nr_monorotaia", 4, 10);
  { const bad = await L.reachAll(page, "nr_monorotaia"); if (bad.length) errors.push("monorotaia: " + bad.join(", ")); }
  await L.talk(page, "nr_nyx"); await adv(page, ["Consegna il file"]);
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo Nyx: " + JSON.stringify(i.step));
  if (!(await page.evaluate((k) => eval(k).dossier.has("vektor", "chip"), K_))) errors.push("chip non nel Dossier");
  await go(page, "nr_cabina", 2, 7); if (w === 390) await L.shot(page, "nr_cabina"); { const bad = await L.reachAll(page, "nr_cabina"); if (bad.length) errors.push("cabina: " + bad.join(", ")); }
  await page.evaluate((k) => eval(k).go("nr_cupola", 4, 20), K_); await page.waitForTimeout(500); await L.advance(page).catch(() => {});
  await page.evaluate((k) => eval(k).setStep(2, 3), K_);
  await go(page, "nr_cupola", 4, 20); if (w === 390) await L.shot(page, "nr_cupola");
  await page.evaluate((k) => eval(k).hack.set("laser_nr_cupola"), K_); await go(page, "nr_cupola", 4, 20);
  { const bad = await L.reachAll(page, "nr_cupola"); if (bad.length) errors.push("cupola: " + bad.join(", ")); }
  await go(page, "nr_vip", 8, 11); if (w === 390) await L.shot(page, "nr_vip"); { const bad = await L.reachAll(page, "nr_vip"); if (bad.length) errors.push("vip: " + bad.join(", ")); }
  await go(page, "nr_cupola", 4, 20);
  await L.talk(page, "nr_zero"); await adv(page); await emp(page, false);
  i = await info(page); if (i.step[2] !== 3) errors.push("sconfitta avanza: " + JSON.stringify(i.step));
  await L.talk(page, "nr_zero"); await adv(page); await emp(page, true);
  i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Circuiti · capitolo 2 (${w} px)`, errors); await browser.close();
}
async function c3(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("nr_terrazza", 3, { 2: 4 }, { 1: "ok", 2: "ok" }, { nr_c1_done: true, nr_c2_done: true }, { fama: 30 }) });
  await page.evaluate(() => window.__circuiti.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await adv(page);
  if (w === 390) await L.shot(page, "nr_terrazza");
  await page.evaluate((k) => eval(k).F.set("nr_gate3", true), K_);
  { const bad = await L.reachAll(page, "nr_terrazza"); if (bad.length) errors.push("terrazza: " + bad.join(", ")); }
  await L.talk(page, "nr_vektor"); await adv(page, ["Rifiuta"]);
  let i = await info(page); if (i.step[3] !== 1) errors.push("dopo Vektor: " + JSON.stringify(i.step));
  await go(page, "nr_hangar", 10, 12); if (w === 390) await L.shot(page, "nr_hangar"); { const bad = await L.reachAll(page, "nr_hangar"); if (bad.length) errors.push("hangar: " + bad.join(", ")); }
  await L.talk(page, "nr_vance"); await adv(page, ["Più tardi"]);
  i = await info(page); if (i.step[3] !== 2) errors.push("dopo Vance: " + JSON.stringify(i.step));
  if (!(await page.evaluate((k) => eval(k).dossier.has("vektor", "microfilm"), K_))) errors.push("microfilm mancante");
  await go(page, "nr_terrazza", 15, 19);
  await L.talk(page, "nr_zero"); await adv(page); await emp(page, false);
  i = await info(page); if (i.step[3] !== 2) errors.push("sconfitta avanza: " + JSON.stringify(i.step));
  await L.talk(page, "nr_zero"); await adv(page); await emp(page, true);
  i = await info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Circuiti · capitolo 3 (${w} px)`, errors); await browser.close();
}
async function c4(w, fine) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("nr_penthouse", 4, { 3: 4 }, { 1: "ok", 2: "ok", 3: "ok" }, { nr_c1_done: true, nr_c2_done: true, nr_c3_done: true, nr_rifiuta: true }, { fama: 40, hackeraggio: 60 }) });
  await page.evaluate(() => window.__circuiti.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await adv(page);
  if (w === 390 && fine === "libero") await L.shot(page, "nr_penthouse");
  await page.evaluate((k) => { const K = eval(k); K.hack.set("laser_nr_penthouse"); K.hack.set("pol_nr_penthouse"); }, K_); await go(page, "nr_penthouse", 11, 15);
  { const bad = await L.reachAll(page, "nr_penthouse"); if (bad.length) errors.push("penthouse: " + bad.join(", ")); }
  await L.talk(page, "nr_kira"); await adv(page);
  let i = await info(page); if (i.step[4] !== 1) errors.push("dopo Kira: " + JSON.stringify(i.step));
  await page.evaluate((k) => eval(k).F.set("nr_sent_off", true) && 0, K_); await page.evaluate((k) => eval(k).setStep(4, 2), K_);
  await go(page, "nr_nucleo", 8, 12); if (w === 390 && fine === "libero") await L.shot(page, "nr_nucleo"); { const bad = await L.reachAll(page, "nr_nucleo"); if (bad.length) errors.push("nucleo: " + bad.join(", ")); }
  await L.talk(page, "nr_vektor"); await adv(page);
  i = await info(page); if (i.step[4] !== 3) errors.push("dopo Vektor: " + JSON.stringify(i.step));
  if (fine === "segreto") await page.evaluate((k) => eval(k).inv.give("nr_datapad", 6, true), K_);
  await L.goAct(page, 8, 3).catch((e) => errors.push("consolle: " + e.message));
  const pick = { libero: /Carica il virus/, corporativo: /Firma il contratto/, segreto: /Inserisci la sequenza/ }[fine];
  await adv(page, [pick.source]);
  i = await info(page); if (i.done[4] !== fine) errors.push(`finale ${fine}: ` + JSON.stringify([i.done, i.ends]));
  L.check(`Circuiti · capitolo 4 · finale ${fine} (${w} px)`, errors); await browser.close();
}
async function minigioco(w) {
  const { browser, page, errors } = await L.setup({ w });
  await page.evaluate(() => { window.__dn = null; window.__emp.start({ title: "Prova", level: 1, oppName: "Test", onDone: (r) => { window.__dn = r; } }); });
  await page.waitForSelector("#emOv");
  const l0 = await page.evaluate(() => window.__emp.state.left); await page.evaluate(() => window.__emp.state.fire(0, 70)); await page.waitForTimeout(200);
  const l1 = await page.evaluate(() => window.__emp.state.left); if (l1 !== l0 - 1) errors.push(`tiro non scalato: ${l0} → ${l1}`);
  await page.waitForTimeout(6000);
  const ov = await page.evaluate(() => window.__emp.state && window.__emp.state.over); if (ov) errors.push("partita finita dopo un solo tiro");
  await page.evaluate(() => window.__emp.state.force(80)); await page.evaluate(() => window.__emp.state.finish(true)); await page.click("#emGo"); await page.waitForTimeout(150);
  const r = await page.evaluate(() => window.__dn); if (!r || !r.win) errors.push("finish(true) senza vittoria: " + JSON.stringify(r));
  L.check(`Circuiti · minigioco EMP (${w} px)`, errors); await browser.close();
}
(async () => {
  await minigioco(390);
  await c1(390); await c1(320); await c2(390); await c3(390); await c4(390, "libero"); await c4(390, "corporativo"); await c4(390, "segreto");
})().catch((e) => { console.error("✗ circuiti:", e.message); process.exit(1); });
