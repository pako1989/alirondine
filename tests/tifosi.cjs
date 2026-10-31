// tests/tifosi.cjs - «La Notte dei Tifosi Morti»: zone raggiungibili, capitoli giocati con l'Assedio finto, un Assedio vero (movimento, calcio, livelli, capo), il Bivio dei Poteri
const L = require("./lib.cjs");
const MOD = { mod: "__tifosi", key: "ali-di-rondine.tifosi" };
const K_ = "window.__tifosi._dbg.K";
const ONLY = process.argv[2] || "";
async function go(p, z, x, y) { await p.evaluate(([k, z, x, y]) => eval(k).go(z, x, y), [K_, z, x, y]); await p.waitForTimeout(450); await L.advance(p).catch(() => {}); }
async function start(w, save) {
  const r = await L.setup({ w, ...MOD, save });
  await r.page.evaluate(() => window.__tifosi.open()); await r.page.waitForTimeout(500);
  await L.advance(r.page, []).catch(() => {}); return r;
}
// l'Assedio finto: vince (o perde) subito e registra le opzioni con cui è stato chiamato
const stub = (p, win = true) => p.evaluate((win) => { window.__asLog = []; window.__assedio.start = (o) => { window.__asLog.push({ arena: o.arena, boss: o.boss, allies: (o.allies || []).map((a) => a.pow), perks: o.perks }); setTimeout(() => o.onDone({ win, a: 40, b: 120, data: { kills: 40 } }), 10); return true; }; }, win);
const st = async (p, errors, ch, n, what) => { const i = await L.info(p); if (i.step[ch] !== n) errors.push(what + ": " + JSON.stringify(i.step)); };
async function zones(w, save, list, tag) {
  const { browser, page, errors } = await start(w, save);
  for (const z of list) {
    try { await go(page, z); if (w === 390) await L.shot(page, "zt_" + z); const bad = await L.reachAll(page, z); if (bad.length) errors.push(z + ": " + bad.join(", ")); }
    catch (e) { errors.push(z + ": " + e.message.slice(0, 140)); }
  }
  L.check(`Tifosi Morti · zone ${tag} (${w} px)`, errors); await browser.close();
}
const S1 = { v: 1, diffSet: true, intro: { ch1: 1, zt_stadio: 1, zt_spogliatoi: 1, zt_magazzino: 1 } };
async function flow1(w, alt) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await stub(page, true);
    await go(page, "zt_stadio", 16, 13); await L.talk(page, "zt_nadia"); await L.advance(page, [alt ? "Prima ci mettiamo" : "Prima troviamo"]); await st(page, errors, 1, 1, "dopo Nadia");
    await L.talk(page, "zt_mister"); await L.advance(page);
    await go(page, "zt_spogliatoi", 4, 7); await L.talk(page, "zt_pippo"); await L.advance(page, [alt ? "finestrella" : "Apri al tre"]); await st(page, errors, 1, 2, "dopo Pippo");
    await go(page, "zt_spogliatoi", 12, 3); await L.talk(page, "zt_cesaroni"); await L.advance(page);
    if (!(await page.evaluate((k) => eval(k).perks.lv("fischietto"), K_))) errors.push("fischietto non dato dal Bivio");
    await go(page, "zt_magazzino", 4, 5); await L.talk(page, "zt_gaspare"); await L.advance(page, [alt ? "Quanti ne servono" : "Tutti"]); await st(page, errors, 1, 3, "dopo Gaspare");
    const c = await page.evaluate((k) => eval(k).crew.list(), K_); if (c.length !== 4) errors.push("gruppo: " + JSON.stringify(c));
    await go(page, "zt_stadio", 16, 13); await L.talk(page, "zt_nadia"); await L.advance(page, ["Si comincia", "Liv"]);
    await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const log = await page.evaluate(() => window.__asLog); if (!log.length || log[0].arena !== "campo" || log[0].boss !== "tamburo" || log[0].allies.length !== 3 || !log[0].perks.fischietto) errors.push("assedio chiamato male: " + JSON.stringify(log));
    const i = await L.info(page); if (i.done[1] !== "ok") errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
    const pk = await page.evaluate((k) => eval(k).perks.list().reduce((a, x) => a + x.lv, 0), K_); if (pk < 2) errors.push("Bivio dopo la notte non scelto: " + pk);
    const ax = await page.evaluate((k) => [eval(k).stat("squadra"), eval(k).stat("pelle")], K_); if (alt ? !(ax[1] > ax[0]) : !(ax[0] > ax[1])) errors.push("Peso sbagliato: " + JSON.stringify(ax));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Tifosi Morti · capitolo 1${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
const C1 = { cr_n: 4, cr_zt_nadia: 1, cf_zt_nadia: 1, cr_zt_pippo: 2, cf_zt_pippo: 1, cr_zt_tonino: 3, cf_zt_tonino: 1, cr_zt_gaspare: 4 };
const S2 = { v: 1, diffSet: true, intro: Object.assign({ ch2: 1, zt_tribuna: 1, zt_stampa: 1, zt_bar: 1 }, S1.intro), ch: 2, step: { 1: 4 }, done: { 1: "ok" }, flags: Object.assign({ zt_c1_done: 1, zt_n1: 1, pk_fischietto: 1 }, C1) };
async function flow2(w, alt) {
  const { browser, page, errors } = await start(w, S2);
  try {
    await stub(page, true);
    await go(page, "zt_stampa", 9, 6); await L.talk(page, "zt_rebecca"); await L.advance(page); await st(page, errors, 2, 1, "dopo Rebecca");
    if (alt) { await go(page, "zt_bar", 7, 5); await L.talk(page, "zt_mimmo"); await L.advance(page, ["Il Borgo canta"]); await L.talk(page, "zt_franca"); await L.advance(page); }
    else { await go(page, "zt_bar", 6, 5); await L.talk(page, "zt_franca"); await L.advance(page); await go(page, "zt_bar", 8, 6); await L.talk(page, "zt_mimmo"); await L.advance(page, ["Impari il coro"]); }
    await st(page, errors, 2, 2, "dopo pile e Mimmo");
    await go(page, "zt_stampa", 9, 6); await L.talk(page, "zt_rebecca"); await L.advance(page, [alt ? "Aspetta" : "Adesso"]); await st(page, errors, 2, 3, "dopo la diretta");
    await go(page, "zt_tribuna", 16, 5); await L.goAct(page, 15, 3);
    await L.advance(page, [alt ? "Resti col suo" : "Forzi il cancelletto"]); await st(page, errors, 2, 4, "dopo il palco VIP");
    const f = await page.evaluate(() => window.__tifosi._dbg.K.F.is("zt_furgone_saputo")); if (!f) errors.push("furgone non saputo");
    const c = await page.evaluate((k) => eval(k).crew.list(), K_); if (c.length !== 7) errors.push("gruppo: " + JSON.stringify(c));
    await go(page, "zt_stampa", 9, 6); await L.talk(page, "zt_rebecca"); await L.advance(page, ["Si comincia", "Liv"]);
    await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const log = await page.evaluate(() => window.__asLog); if (!log.length || log[0].arena !== "tribuna" || log[0].boss !== "megafono") errors.push("assedio chiamato male: " + JSON.stringify(log));
    const i = await L.info(page); if (i.done[2] !== "ok") errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
    const fl = await page.evaluate(() => ["zt_coro", "zt_diretta", "zt_bellotti_con"].map((x) => window.__tifosi._dbg.K.F.is(x))); if (alt ? fl.some(Boolean) : !fl.every(Boolean)) errors.push("scelte: " + JSON.stringify(fl));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Tifosi Morti · capitolo 2${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
const C2 = Object.assign({}, C1, { cr_n: 7, cr_zt_mimmo: 5, cr_zt_rebecca: 6, cr_zt_ernesto: 7 });
const S3 = { v: 1, diffSet: true, intro: Object.assign({ ch3: 1, zt_curva: 1, zt_sottocurva: 1 }, S2.intro), ch: 3, step: { 1: 4, 2: 5 }, done: { 1: "ok", 2: "ok" }, flags: Object.assign({}, S2.flags, { zt_c2_done: 1, zt_n2: 1, zt_furgone_saputo: 1, zt_bellotti_con: 1 }, C2) };
async function flow3(w, alt) {
  const s = JSON.parse(JSON.stringify(S3)); if (!alt) s.flags.zt_coro = 1;
  const { browser, page, errors } = await start(w, s);
  try {
    await stub(page, true);
    await go(page, "zt_curva", 16, 20); await L.talk(page, "zt_mimmo"); await L.advance(page, ["Si passa di corsa"]); await st(page, errors, 3, 1, "dopo Mimmo");
    await go(page, "zt_sottocurva", 12, 4); await L.goAct(page, 13, 3); await L.advance(page); await st(page, errors, 3, 2, "dopo il cassetto");
    await go(page, "zt_curva", 16, 3); await L.talk(page, "zt_pippo"); await L.advance(page, [alt ? "ultimo minuto" : "Ti chiudiamo"]); await st(page, errors, 3, 3, "dopo Pippo");
    if (await page.evaluate((k) => eval(k).crew.has("zt_pippo"), K_)) errors.push("Pippo ancora nel gruppo");
    await L.talk(page, "zt_gaspare"); await L.advance(page, ["Si comincia", "Liv"]);
    await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const log = await page.evaluate(() => window.__asLog); if (!log.length || log[0].arena !== "curva" || log[0].boss !== "ringhio" || log[0].allies.includes("muro")) errors.push("assedio chiamato male: " + JSON.stringify(log));
    const i = await L.info(page); if (i.done[3] !== "ok") errors.push("capitolo 3 non concluso: " + JSON.stringify([i.done, i.step]));
    const fl = await page.evaluate(() => ["zt_pippo_attesa", "zt_pippo_minuto", "zt_coro"].map((x) => window.__tifosi._dbg.K.F.is(x))); if (alt ? (fl[0] || !fl[1] || fl[2]) : (!fl[0] || fl[1] || !fl[2])) errors.push("scelte: " + JSON.stringify(fl));
    if (!alt) { await go(page, "zt_sottocurva", 10, 6); await L.talk(page, "zt_pippo"); await L.advance(page); }
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Tifosi Morti · capitolo 3${alt ? " (vie alternative)" : ""} (${w} px)`, errors); await browser.close();
}
const S4 = { v: 1, diffSet: true, intro: Object.assign({ ch4: 1, zt_parcheggio: 1, zt_pullman: 1, zt_furgone: 1 }, S3.intro), ch: 4, step: { 1: 4, 2: 5, 3: 4 }, done: { 1: "ok", 2: "ok", 3: "ok" }, flags: Object.assign({}, S3.flags, { zt_c3_done: 1, zt_n3: 1, cr_zt_pippo: 0, cf_zt_pippo: 0 }) };
async function flow4(w, want, extra) {
  const s = JSON.parse(JSON.stringify(S4)); Object.assign(s.flags, extra || {});
  const { browser, page, errors } = await start(w, s);
  try {
    await stub(page, true);
    if (extra && extra.__boss) await page.evaluate((k) => { for (let i = 0; i < 8; i++) eval(k).inv.give("zt_bossolo"); }, K_);
    await go(page, "zt_parcheggio", 15, 19); await L.talk(page, "zt_gaspare"); await L.advance(page); await st(page, errors, 4, 1, "dopo Gaspare");
    await go(page, "zt_pullman", 3, 4); await L.talk(page, "zt_nello"); await L.advance(page); await st(page, errors, 4, 2, "dopo Nello");
    await go(page, "zt_furgone", 7, 3); await L.goAct(page, 7, 1); await L.advance(page);
    await go(page, "zt_furgone", 3, 3); await L.goAct(page, 2, 2); await L.advance(page); await st(page, errors, 4, 3, "dopo i cavi");
    const blu = await page.evaluate(() => window.__tifosi._dbg.K.F.is("zt_blu")); if (!!(extra && extra.__boss) !== blu) errors.push("fumo blu: " + blu);
    await go(page, "zt_pullman", 3, 4); await L.talk(page, "zt_nello"); await L.advance(page, ["Si comincia", "Liv", want]);
    await page.waitForTimeout(300); await L.advance(page).catch(() => {});
    const log = await page.evaluate(() => window.__asLog); if (!log.length || log[0].arena !== "parcheggio" || log[0].boss !== "mascotte") errors.push("assedio chiamato male: " + JSON.stringify(log));
    const i = await L.info(page); if (!i.done[4] || !String(i.done[4]).length) errors.push("finale non raggiunto: " + JSON.stringify([i.done, i.step]));
    else if (want && !{ "Il fumo blu": "fumogeno", "Tutti sul pullman": "pullman", "Il coro": "coro", "Il magazziniere": "magazziniere" }[want].includes(i.done[4])) errors.push("finale sbagliato: " + i.done[4]);
    if (w === 390) await L.shot(page, "zt_fine_" + i.done[4]);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Tifosi Morti · capitolo 4 · ${want} (${w} px)`, errors); await browser.close();
}
// un Assedio vero: spiegazione, movimento, calcio automatico, livello con scelta, capo, fine
async function real(w) {
  const { browser, page, errors } = await start(w, S1);
  try {
    await page.evaluate(() => { window.__asRes = null; window.__assedio.start({ title: "Prova", arena: "campo", time: 20, mix: ["tifoso", "corridore"], boss: "tamburo", allies: [{ id: "zt_tonino", n: "Tonino", pow: "bomber" }, { id: "zt_nadia", n: "Nadia", pow: "cura" }], perks: { sciarpa: 1 }, onDone: (r) => { window.__asRes = r; } }); });
    await page.waitForTimeout(400);
    if (w === 390) await L.shot(page, "zt_assedio_tut");
    const t0 = await page.evaluate(() => window.__assedio.state.tut()); if (t0) await page.evaluate(() => { const b = [...document.querySelectorAll("#asOv .tut button")].find((x) => /Gioca|Salta/.test(x.innerText)); if (b) b.click(); });
    const h0 = await page.evaluate(() => window.__assedio.state.hero());
    // un trascinamento vero sul canvas
    const box = await page.locator("#asOv canvas").first().boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 4 }); await page.waitForTimeout(700); await page.mouse.up();
    const h1 = await page.evaluate(() => window.__assedio.state.hero()); if (!(h1[0] > h0[0] + 5)) errors.push("il trascinamento non muove il Campione: " + JSON.stringify([h0, h1]));
    await page.evaluate(() => window.__assedio.state.god());
    await page.evaluate(() => window.__assedio.state.tick(8)); await page.waitForTimeout(100);
    const k1 = await page.evaluate(() => ({ kills: window.__assedio.state.kills, pk: window.__assedio.state.perks() })); if (!(k1.kills >= 1) || k1.pk.sciarpa !== 1) errors.push("niente calci o poteri di partenza persi: " + JSON.stringify(k1));
    if (w === 390) await L.shot(page, "zt_assedio_gioco");
    await page.evaluate(() => window.__assedio.state.xp(200)); await page.waitForTimeout(150);
    const pk = await page.evaluate(() => [window.__assedio.state.phase, window.__assedio.state.pick]); if (pk[0] !== "pick" || !pk[1] || pk[1].length !== 3) errors.push("il livello non offre 3 poteri: " + JSON.stringify(pk));
    if (w === 390) await L.shot(page, "zt_assedio_livello");
    await page.evaluate(() => document.querySelector('#asOv [data-p="1"]').click()); await page.waitForTimeout(100);
    const ph = await page.evaluate(() => window.__assedio.state.phase); if (ph !== "play" && ph !== "pick") errors.push("dopo la scelta: " + ph);
    await page.evaluate(() => window.__assedio.state.toBoss()); await page.evaluate(() => window.__assedio.state.tick(1)); const b = await page.evaluate(() => window.__assedio.state.boss); if (!b || b[0] !== "tamburo") errors.push("il capo non arriva: " + JSON.stringify(b));
    if (w === 390) await L.shot(page, "zt_assedio_capo");
    await page.evaluate(() => window.__assedio.state.tick(90)); await page.waitForTimeout(1200);
    const ph2 = await page.evaluate(() => window.__assedio.state.phase); if (ph2 !== "end") { errors.push("il capo non cade in 90 s di gioco: " + ph2 + " " + JSON.stringify(await page.evaluate(() => window.__assedio.state.boss))); await page.evaluate(() => window.__assedio.state.finish(true)); }
    await page.waitForTimeout(200); await page.evaluate(() => document.querySelector("#asGo").click()); await page.waitForTimeout(300);
    const r = await page.evaluate(() => window.__asRes); if (!r || !r.win || !r.data || !(r.data.kills > 0)) errors.push("risultato: " + JSON.stringify(r));
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Tifosi Morti · Assedio vero (${w} px)`, errors); await browser.close();
}
(async () => {
  const want = (k) => !ONLY || ONLY === k;
  if (want("real")) { await real(390); await real(320); }
  if (want("zone1")) { await zones(390, S1, ["zt_stadio", "zt_spogliatoi", "zt_magazzino"], "cap. 1"); await zones(320, S1, ["zt_stadio"], "cap. 1"); }
  if (want("c1")) { await flow1(390, false); await flow1(320, true); }
  if (want("zone2")) { await zones(390, S2, ["zt_stadio", "zt_tribuna", "zt_stampa", "zt_bar"], "cap. 2"); }
  if (want("c2")) { await flow2(390, false); await flow2(320, true); }
  if (want("zone3")) { await zones(390, S3, ["zt_stadio", "zt_curva", "zt_sottocurva"], "cap. 3"); }
  if (want("c3")) { await flow3(390, false); await flow3(320, true); }
  if (want("zone4")) { await zones(390, S4, ["zt_parcheggio", "zt_pullman", "zt_furgone"], "cap. 4"); await zones(320, S4, ["zt_parcheggio"], "cap. 4"); }
  if (want("c4")) {
    await flow4(390, "Il fumo blu", { __boss: 1, zt_diretta: 1, zt_pippo_attesa: 1, zt_coro: 1 });
    await flow4(320, "Tutti sul pullman", {});
    await flow4(390, "Il coro", { zt_coro: 1 });
    await flow4(320, "Il magazziniere", {});
  }

})();
