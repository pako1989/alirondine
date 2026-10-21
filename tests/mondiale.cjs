// tests/mondiale.cjs - «Mondiale Giovanile»: Catena (core), reclutamento a due vie, capitoli 1-4, partite, 4 finali
const L = require("./lib.cjs");
const MOD = { mod: "__mondiale", key: "ali-di-rondine.mondiale" };
const K_ = "window.__mondiale._dbg.K";
const info = (p) => L.info(p);
const adv = (p, prefs) => L.advance(p, prefs).catch((e) => { if (!/Torna a camminare/.test(e.message)) throw e; });
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(500); await L.advance(p).catch(() => {}); }
const SAVE = (zone, ch, step, done, flags, st) => ({ v: 1, diffSet: true, intro: { ch1: 1, ch2: 1, ch3: 1, ch4: 1, [zone]: 1 }, ch, step, done, flags: Object.assign({}, flags || {}), st: Object.assign({ grinta: 40, intesa: 30 }, st || {}) });
const CREW = (ids) => Object.fromEntries(ids.flatMap((id, i) => [["cr_" + id, i + 1], ["cf_" + id, 1]]));
// partita Catena: aspetta il minigioco, la chiude con l'esito voluto, preme «Continua»
async function catena(page, win, errors) {
  await page.waitForFunction(() => window.__catena && window.__catena.state, null, { timeout: 6000 }).catch(() => errors.push("Catena non partita"));
  await page.evaluate((w) => window.__catena.state && window.__catena.state.finish(w), win); await page.waitForTimeout(250);
  await page.evaluate(() => document.querySelector("#catGo") && document.querySelector("#catGo").click()); await page.waitForTimeout(400); await adv(page);
}
// blocchi decorativi (alberi, case, tribune): non servono vicini liberi, gli altri oggetti sì
const reach = async (p, z) => (await L.reachAll(p, z)).filter((b) => !/^oggetto [APTMRWYJEOZ] /.test(b));
const HELP = [/^🤝/], CHAL = [/^⛓ Sfidalo/];
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__mondiale.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await adv(page);
  if (w === 390) await L.shot(page, "mg_colle");
  { const bad = await reach(page, "mg_colle"); if (bad.length) errors.push("colle: " + bad.join(", ")); }
  await L.talk(page, "mg_gallo"); await adv(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo Gallo: " + JSON.stringify(i.step));
  await go(page, "mg_villaggio", 2, 12); if (w === 390) await L.shot(page, "mg_villaggio");
  { const bad = await reach(page, "mg_villaggio"); if (bad.length) errors.push("villaggio: " + bad.join(", ")); }
  await L.talk(page, "mg_mara"); await adv(page);
  await L.talk(page, "mg_elio"); await adv(page, HELP);
  await L.talk(page, "mg_nina"); await adv(page, CHAL).catch(() => {}); await catena(page, true, errors);
  await L.talk(page, "mg_bruno"); await adv(page, HELP);
  for (const [z, x, y, n] of [["mg_spogliatoio", 9, 9, "mg_teo"], ["mg_mensa", 8, 8, "mg_sandro"]]) { await go(page, z, x, y); if (w === 390) await L.shot(page, z); const bad = await reach(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); await L.talk(page, n); await adv(page, HELP); }
  const cnt = await page.evaluate((k) => eval(k).crew.count(), K_); if (cnt !== 5) errors.push("compagni " + cnt);
  await go(page, "mg_colle", 12, 11); await L.talk(page, "mg_gallo"); await adv(page); await catena(page, false, errors);
  i = await info(page); if (i.step[1] !== 1) errors.push("Catena persa ma capitolo avanzato: " + JSON.stringify(i.step));
  await L.talk(page, "mg_gallo"); await adv(page); await catena(page, true, errors);
  i = await info(page); if (i.step[1] !== 2) errors.push("dopo la prova: " + JSON.stringify(i.step));
  await L.stubMatch(page, true); await L.talk(page, "mg_gallo"); await adv(page); await page.waitForTimeout(500); await adv(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "mg_amichevole") errors.push("amichevole non partita");
  i = await info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Mondiale · capitolo 1 (${w} px)`, errors); await browser.close();
}
async function c2(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("mg_spiaggia", 2, { 1: 3, 2: 0 }, { 1: "ok" }, Object.assign({ mg_c1_done: true }, CREW(["mg_elio", "mg_nina", "mg_bruno", "mg_teo"]))) });
  await page.evaluate(() => window.__mondiale.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await go(page, "mg_spiaggia", 2, 11); if (w === 390) await L.shot(page, "mg_spiaggia");
  for (const z of ["mg_spiaggia", "mg_quartiere", "mg_stadio", "mg_chiosco", "mg_casa"]) { const st = { mg_spiaggia: [2, 11], mg_quartiere: [2, 11], mg_stadio: [2, 11], mg_chiosco: [8, 8], mg_casa: [7, 8] }[z]; await go(page, z, st[0], st[1]); if (w === 390) await L.shot(page, z); const bad = await reach(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
  await go(page, "mg_spiaggia", 2, 11); await L.talk(page, "mg_gallo"); await adv(page);
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo Gallo: " + JSON.stringify(i.step));
  await go(page, "mg_chiosco", 8, 8); await L.talk(page, "mg_bia"); await adv(page);
  i = await info(page); if (i.step[2] !== 1) errors.push("Bia ha dato il pass senza Tico: " + JSON.stringify(i.step));
  await go(page, "mg_quartiere", 14, 12); await L.talk(page, "mg_tico"); await adv(page, CHAL).catch(() => {}); await catena(page, true, errors);
  if (!(await page.evaluate((k) => eval(k).crew.has("mg_tico"), K_))) errors.push("Tico non reclutato");
  await go(page, "mg_casa", 7, 8); await L.talk(page, "mg_zefa"); await adv(page);
  await go(page, "mg_chiosco", 8, 8); await L.talk(page, "mg_bia"); await adv(page);
  i = await info(page); if (i.step[2] !== 2) errors.push("dopo Bia: " + JSON.stringify(i.step));
  await go(page, "mg_stadio", 2, 11); await L.stubMatch(page, true); await L.talk(page, "mg_duarte"); await adv(page); await page.waitForTimeout(500); await adv(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "mg_rio") errors.push("partita col Brasile non partita");
  i = await info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Mondiale · capitolo 2 (${w} px)`, errors); await browser.close();
}
const CREW5 = ["mg_elio", "mg_nina", "mg_bruno", "mg_teo", "mg_sandro"];
async function c3(w, alt) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("mg_stazione", 3, alt ? { 1: 3, 2: 5, 3: 2 } : { 1: 3, 2: 5, 3: 0 }, { 1: "ok", 2: "ok" }, Object.assign({ mg_c1_done: true, mg_c2_done: true }, CREW(CREW5.concat(["mg_tico"])))) });
  await page.evaluate(() => window.__mondiale.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await go(page, "mg_stazione", 2, 11); if (w === 390 && !alt) await L.shot(page, "mg_stazione");
  if (!alt) for (const [z, x, y] of [["mg_stazione", 2, 11], ["mg_allenamento", 2, 11], ["mg_stadio_nord", 2, 11], ["mg_officina", 8, 8], ["mg_hotel", 9, 9]]) { await go(page, z, x, y); if (w === 390) await L.shot(page, z); const bad = await reach(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
  let i;
  if (!alt) {
    await go(page, "mg_stazione", 2, 11); await L.talk(page, "mg_mara"); await adv(page);
    i = await info(page); if (i.step[3] !== 1) errors.push("dopo Mara: " + JSON.stringify(i.step));
    await go(page, "mg_officina", 8, 8); await L.talk(page, "mg_lukas"); await adv(page, HELP);
    await L.talk(page, "mg_lukas"); await adv(page);
    i = await info(page); if (i.step[3] !== 2) errors.push("dopo Lukas: " + JSON.stringify(i.step));
    await page.evaluate(() => { window.__noGuards = true; });
    await go(page, "mg_allenamento", 2, 11); const g = await page.evaluate(() => window.__tr.TW.z.npcs.filter((n) => /wache/.test(n.id)).length); if (g !== 3) errors.push("guardie " + g);
    await L.goAct(page, 30, 6).catch((e) => errors.push("armadietto: " + e.message)); await adv(page);
  } else {
    await page.evaluate(() => { window.__noGuards = true; });
    await go(page, "mg_allenamento", 26, 8); await L.talk(page, "mg_falk"); await adv(page, [/Continua/]).catch(() => {}); await catena(page, true, errors);
  }
  i = await info(page); if (i.step[3] !== 3) errors.push("tablet non recuperato: " + JSON.stringify(i.step));
  await go(page, "mg_hotel", 9, 9); await L.talk(page, "mg_mara"); await adv(page);
  i = await info(page); if (i.step[3] !== 4) errors.push("dopo Mara 2: " + JSON.stringify(i.step));
  await go(page, "mg_stadio_nord", 2, 11); await L.stubMatch(page, true); await L.talk(page, "mg_wolff"); await adv(page); await page.waitForTimeout(500); await adv(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "mg_nord") errors.push("semifinale non partita");
  i = await info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Mondiale · capitolo 3${alt ? " (via Falk)" : ""} (${w} px)`, errors); await browser.close();
}
async function c4(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("mg_tokyo", 4, { 1: 3, 2: 5, 3: 5, 4: 0 }, { 1: "ok", 2: "ok", 3: "ok" }, Object.assign({ mg_c1_done: true, mg_c2_done: true, mg_c3_done: true }, CREW(CREW5.concat(["mg_tico", "mg_lukas"])))) });
  await page.evaluate(() => window.__mondiale.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await go(page, "mg_tokyo", 2, 11); if (w === 390) await L.shot(page, "mg_tokyo");
  for (const [z, x, y] of [["mg_tokyo", 2, 11], ["mg_tempio", 15, 19], ["mg_ryokan", 9, 9], ["mg_konbini", 7, 8], ["mg_stadio_tokyo", 2, 11]]) { await go(page, z, x, y); if (w === 390) await L.shot(page, z); const bad = await reach(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
  await go(page, "mg_tokyo", 2, 11); await L.talk(page, "mg_gallo"); await adv(page);
  let i = await info(page); if (i.step[4] !== 1) errors.push("dopo Gallo: " + JSON.stringify(i.step));
  await go(page, "mg_tempio", 15, 12); await L.talk(page, "mg_ren"); await adv(page, [/^⛓ Accetta/]).catch(() => {}); await catena(page, true, errors);
  i = await info(page); if (i.step[4] !== 2) errors.push("dopo Ren: " + JSON.stringify(i.step));
  await go(page, "mg_konbini", 7, 8); await L.talk(page, "mg_nina"); await adv(page); await L.talk(page, "mg_bruno"); await adv(page);
  await go(page, "mg_ryokan", 9, 9); await L.talk(page, "mg_elio"); await adv(page, [/^⛓ Allenati/]).catch(() => {}); await catena(page, true, errors);
  await L.talk(page, "mg_yuki"); await adv(page, [/divertirci/]);
  i = await info(page); if (i.step[4] !== 3) errors.push("dopo Yuki: " + JSON.stringify(i.step));
  await go(page, "mg_stadio_tokyo", 2, 11); await L.stubMatch(page, true); await L.talk(page, "mg_ren"); await adv(page); await page.waitForTimeout(500); await adv(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "mg_finale") errors.push("finale non partita");
  i = await info(page); if (!i.done[4]) errors.push("capitolo 4 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Mondiale · capitolo 4 (${w} px)`, errors); await browser.close();
}
async function ending(w, id, win, st, perf) {
  const { browser, page, errors } = await L.setup({ w, ...MOD, save: SAVE("mg_stadio_tokyo", 4, { 1: 3, 2: 5, 3: 5, 4: 3 }, { 1: "ok", 2: "ok", 3: "ok" }, Object.assign({ mg_c1_done: true, mg_c2_done: true, mg_c3_done: true, ch_perf: perf || 0 }, CREW(CREW5)), st) });
  await page.evaluate(() => window.__mondiale.open()); await page.evaluate(() => window.T_.click("Continua")).catch(() => {}); await adv(page);
  await go(page, "mg_stadio_tokyo", 2, 11); await L.stubMatch(page, win); await L.talk(page, "mg_ren"); await adv(page); await page.waitForTimeout(500); await adv(page).catch(() => {});
  const i = await info(page); if (!(i.ends || []).includes(id)) errors.push("finale " + id + " non registrato: " + JSON.stringify(i.ends));
  L.check(`Mondiale · finale ${id} (${w} px)`, errors); await browser.close();
}
// il minigioco giocato davvero (senza scorciatoie): sceglie una corsia libera, poi l'angolo lontano dal portiere
async function catenaReale(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  const res = await page.evaluate(async () => {
    const out = { wins: 0, tries: 0, perfect: 0 }; const team = [{ id: "hero", n: "Campione", icon: "⭐", rk: "jolly" }, { id: "a", n: "Elio", icon: "🎯", rk: "regista" }, { id: "b", n: "Nina", icon: "💨", rk: "ala" }, { id: "c", n: "Bruno", icon: "🔥", rk: "punta" }];
    const syn = (a, b) => (a === "jolly" || b === "jolly" ? 1 : ({ "regista>ala": 2, "ala>punta": 2 })[a + ">" + b] || 0);
    for (let k = 0; k < 3; k++) {
      let r = null; window.__catena.start({ level: 1 + k, tutorial: false, team, syn, roles: { jolly: "J", regista: "R", ala: "A", punta: "P" }, onDone: (x) => { r = x; } });
      const st = window.__catena.state; const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
      for (let p = 0; p < 3; p++) { for (let t = 0; t < 400; t++) { const b = st.blockedNow; const i = b.indexOf(false); if (i >= 0) { st.pass(i); break; } await wait(30); } }
      for (let t = 0; t < 600; t++) { if (st.phase !== "shot") break; const kx = st.keeperX; const side = kx > 190 ? -1 : 1; if (Math.abs(kx - 190) > 30) { st.shoot(side); break; } await wait(30); }
      await wait(50); document.querySelector("#catGo") && document.querySelector("#catGo").click(); await wait(100); out.tries++; if (r && r.win) out.wins++; if (r && r.perfect) out.perfect++;
    }
    return out;
  });
  if (res.wins < 2) errors.push("Catena giocata davvero: vinte " + res.wins + "/" + res.tries);
  const tu = await page.evaluate(async () => {
    const wait = (ms) => new Promise((ok) => setTimeout(ok, ms)), out = {}; localStorage.removeItem("ali-di-rondine.catena");
    window.__catena.start({ level: 1, onDone: () => {} }); await wait(100); const st = window.__catena.state; out.tut = st.tut(); out.pages = 1;
    document.querySelector('.tut [data-a="n"]').click(); await wait(50); document.querySelector('.tut [data-a="n"]').click(); await wait(50); out.p3 = !!document.querySelector('.tut [data-a="pr"]');
    document.querySelector('.tut [data-a="pr"]').click(); await wait(100); out.practice = st.practice && !st.tut();
    for (let t = 0; t < 400; t++) { const i = st.blockedNow.indexOf(false); if (i >= 0) { st.pass(i); break; } await wait(30); } out.pass = st.passes === 1;
    document.querySelector(".hp").click(); await wait(50); out.help = st.tut(); document.querySelector('.tut [data-a="x"]').click(); await wait(50); out.closed = !st.tut();
    st.finish(false); await wait(50); out.again = !!document.querySelector("#catRe") && !!document.querySelector("#catGo2"); document.querySelector("#catGo2").click(); await wait(50); out.real = st.practice === false;
    st.finish(true); await wait(50); document.querySelector("#catGo").click(); await wait(50); out.gone = !document.querySelector("#catOv");
    return out;
  });
  { const bad = Object.keys(tu).filter((k) => !tu[k]); if (bad.length) errors.push("Catena spiegazione/prova: " + bad.join(",") + " " + JSON.stringify(tu)); }
  L.check(`Mondiale · Catena d'attacco giocabile (${w} px)`, errors); await browser.close();
}
(async () => {
  await c1(390);
  await c2(390);
  await c3(390);
  await c3(390, true);
  await c4(390);
  await catenaReale(390);
  await ending(390, "oro", true, {}, 0);
  await ending(390, "argento", false, {}, 0);
  await ending(390, "squadra", true, { intesa: 60 }, 0);
  await ending(390, "segreto", true, { intesa: 60 }, 3);
})().catch((e) => { console.error("✗ mondiale:", e.message); process.exit(1); });
