// tests/gala.cjs - «Il Rapimento del Pallone d'Oro»: Registro delle Presenze, stanze, ping-pong, capitoli, finali
const L = require("./lib.cjs");
const MOD = { mod: "__gala", key: "ali-di-rondine.gala" };
const K_ = "window.__gala._dbg.K";
const info = (p) => L.info(p);
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; });
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
const SAVE = (zone, ch, step, done, flags, st, clk) => ({ v: 1, diffSet: true, intro: { ch1: 1, [zone]: 1 }, ch, step, done, flags: Object.assign({}, flags || {}), st: Object.assign({ intuito: 30, garbo: 20 }, st || {}) });
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__gala.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  if (w === 390) await L.shot(page, "pd_giardino");
  { const bad = await L.reachAll(page, "pd_giardino"); if (bad.length) errors.push("giardino: " + bad.join(", ")); }
  await L.talk(page, "pd_delmonte"); await adv(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Delmonte: " + JSON.stringify(i.step));
  for (const [z, x, y, n] of [["pd_salone", 12, 14, "salone"], ["pd_pranzo", 2, 6, "pranzo"], ["pd_cucina", 8, 10, "cucina"]]) {
    await go(page, z, x, y); if (w === 390) await L.shot(page, z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(n + ": " + bad.join(", "));
  }
  await go(page, "pd_pranzo", 2, 6);
  for (const id of ["pd_livia", "pd_zeno", "pd_clio", "pd_arturo"]) { await L.talk(page, id); await adv(page); }
  i = await info(page); if (i.step[1] !== 2) errors.push("dopo quattro ospiti: " + JSON.stringify(i.step));
  await L.goAct(page, 17, 5).catch((e) => errors.push("tavolo: " + e.message)); await adv(page, ["Livia"]);
  i = await info(page); if (i.step[1] !== 3) errors.push("dopo la cena: " + JSON.stringify(i.step));
  await go(page, "pd_salone", 12, 14); await L.talk(page, "pd_delmonte").catch(() => {}); await adv(page);
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Gala · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("pd_salone", 2, { 1: 3 }, { 1: "ok" }, { pd_c1_done: true }, { intuito: 40, garbo: 30 }) });
  await page.evaluate(() => window.__gala.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await page.evaluate(([k]) => eval(k).clock.set(1, 1), [K_]).catch((e) => errors.push("clock: " + e.message));
  for (const [z, x, y] of [["pd_biblioteca", 16, 7], ["pd_studio", 8, 9], ["pd_cantina", 10, 10], ["pd_serra", 9, 10], ["pd_boudoir", 7, 8], ["pd_pingpong", 14, 8]]) {
    await go(page, z, x, y); if (w === 390) await L.shot(page, z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", "));
  }
  L.check(`Gala · capitolo 2 geometria (${w} px)`, errors); await browser.close();
}
async function c2flow(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("pd_salone", 2, { 1: 3 }, { 1: "ok" }, { pd_c1_done: true }, { intuito: 40, garbo: 30 }) });
  await page.evaluate(() => window.__gala.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  const ev = (f, a) => page.evaluate(f, a);
  await ev(([k]) => eval(k).clock.set(1, 1), [K_]);
  // ricerche reali: libreria, studio, cantina, serra
  for (const [z, sx, sy, x, y, id] of [["pd_biblioteca", 16, 7, 13, 4, "pd_lettera"], ["pd_studio", 8, 9, 8, 4, "pd_polizza"], ["pd_cantina", 10, 10, 15, 2, "pd_replica"], ["pd_serra", 9, 10, 13, 6, "x"]]) {
    await go(page, z, sx, sy); await L.goAct(page, x, y).catch((e) => errors.push(z + ": " + e.message)); await adv(page);
    if (id !== "x") { const has = await ev(([k, id]) => eval(k).inv.has(id), [K_, id]); if (!has) errors.push("oggetto non preso: " + id); }
  }
  // testimoni: Teresa (cucina) e Clio
  const where = (id) => ev(([id]) => { const z = ["pd_giardino", "pd_salone", "pd_pranzo", "pd_cucina", "pd_biblioteca", "pd_studio", "pd_cantina", "pd_serra", "pd_boudoir", "pd_pingpong"].find((z) => window.__galaWho(z, 1).includes(id)); return z; }, [id]);
  for (const [id, prefs] of [["pd_teresa", ["Dov'eri"]], ["pd_teresa", ["Hai visto"]], ["pd_clio", ["Hai visto"]], ["pd_ospite", ["Hai visto"]], ["pd_delmonte", ["Dov'eri"]], ["pd_arturo", ["Dov'eri"]], ["pd_zeno", ["Dov'eri"]], ["pd_livia", ["Dov'eri"]], ["pd_gualtiero", ["Dov'eri"]]]) {
    const z = await where(id); if (!z) { errors.push("senza luogo: " + id); continue; }
    const st = await ev(([k, z]) => { eval(k).go(z); return 1; }, [K_, z]); await page.waitForTimeout(500); await adv(page).catch(() => {});
    await L.talk(page, id).catch((e) => errors.push("talk " + id + ": " + e.message)); await adv(page, prefs).catch((e) => errors.push("adv " + id + ": " + e.message.slice(0, 120)));
  }
  const n = await ev(([k]) => ({ f: eval(k).alibi.found(), c: eval(k).alibi.conflicts().length, d: eval(k).dossier.list("pallone").length }), [K_]);
  if (n.c < 4) errors.push("contraddizioni previste < 4: " + JSON.stringify(n));
  if (n.d < 3) errors.push("prove < 3: " + JSON.stringify(n));
  await ev(([k]) => { const K = eval(k); K.alibi.conflicts().forEach((c) => localStorage.setItem("_x", "1") || K.F.set(`al_f_${c.p}_${c.s}`, true)); }, [K_]);
  const z = await where("pd_delmonte");
  if (z) { await ev(([k, z]) => eval(k).go(z), [K_, z]); await page.waitForTimeout(500); await adv(page).catch(() => {}); await L.talk(page, "pd_delmonte"); await adv(page, ["convoca tutti", "Continua"]).catch((e) => errors.push("convoca: " + e.message.slice(0, 160))); }
  const i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]) + JSON.stringify(n));
  L.check(`Gala · capitolo 2 flusso (${w} px)`, errors); await browser.close();
}
async function c3(w, which) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("pd_salone", 3, { 2: 2 }, { 1: "ok", 2: "ok" }, { pd_c1_done: true, pd_c2_done: true }, { intuito: 50, garbo: 40 }) });
  await page.evaluate(() => window.__gala.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await page.evaluate(([k, which]) => {
    const K = eval(k); K.clock.set(1, 3);
    if (which === "giustizia" || which === "segreto") {
      [["pd_delmonte", 1], ["pd_arturo", 1], ["pd_livia", 1], ["pd_zeno", 1], ["pd_gualtiero", 1], ["pd_livia", 2]].forEach(([p, s]) => { K.alibi.claim(p, s, "pd_giardino"); K.alibi.see(p, "pd_cantina", s); K.F.set(`al_f_${p}_${s}`, true); });
      ["polizza", "ricevuta", "replica"].concat(which === "segreto" ? ["chiave", "lettera"] : []).forEach((x) => K.dossier.add("pallone", x));
    }
    if (which === "segreto") { K.F.set("pd_pp_won", true); K.F.set("pd_livia_conf", true); }
    if (which === "silenzio") K.F.set("pd_livia_conf", true);
  }, [K_, which]);
  await page.evaluate(([k]) => eval(k).go("pd_salone"), [K_]); await page.waitForTimeout(500); await adv(page).catch(() => {});
  const [id, prefs] = { giustizia: ["pd_delmonte", ["Accusalo"]], segreto: ["pd_delmonte", ["Svela tutto"]], capro: ["pd_gualtiero", ["È stato lui"]], silenzio: ["pd_livia", ["Accetta il patto"]] }[which];
  await L.talk(page, id).catch((e) => errors.push("talk: " + e.message)); await adv(page, prefs.concat(["Continua"])).catch((e) => { if (!/BLOCCO/.test(e.message)) errors.push(e.message.slice(0, 200)); });
  const i = await info(page); if (!i.ends.includes(which)) errors.push("finale non registrato " + which + ": " + JSON.stringify(i).slice(0, 300));
  L.check(`Gala · capitolo 3, finale ${which} (${w} px)`, errors); await browser.close();
}
(async () => {
  await c1(390);
  await c2(390);
  await c2flow(390);
  for (const f of ["giustizia", "segreto", "capro", "silenzio"]) await c3(390, f);
})().catch((e) => { console.error("✗ gala:", e.message); process.exit(1); });
