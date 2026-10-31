// tests/arena-assedio.cjs - Assedio dei Sogni: bottone nell'Arena, carte come compagni, cut-in, notte vera breve, opzione in Impostazioni
const L = require("./lib.cjs");
const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };
async function run(w) {
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.campetto": fin } });
  try {
    await page.evaluate(() => { const S = window.__sogni; S.sync(); const r = S._load(); ["of_ferro", "pd_zeno"].forEach((id) => { if (!r.own.includes(id)) r.own.push(id); }); r.team = ["of_ferro", "cm_bastiano", "cm_leone", "pd_zeno", "tc_brunilde"].filter((id) => r.own.includes(id)); S._save(r); });
    await page.evaluate(() => window.__arena.open(() => {})); await page.waitForTimeout(300);
    if (!(await page.evaluate(() => !!document.querySelector('.arOv [data-go="assedio"]')))) errors.push("manca il bottone Assedio nell'Arena");
    await page.evaluate(() => document.querySelector('.arOv [data-go="assedio"]').click()); await page.waitForTimeout(300);
    const m = await page.evaluate(() => ({ cards: document.querySelectorAll("#aaOv .aaC").length, ar: document.querySelectorAll("#aaOv [data-ar]").length }));
    if (m.cards < 1 || m.cards > 3 || m.ar !== 5) errors.push("menu Assedio: " + JSON.stringify(m));
    if (w === 390) await L.shot(page, "aa_menu");
    await page.evaluate(() => { window.__aaLog = null; const E = window.__assedio, o0 = E.start; window.__assedio.start = (o) => { window.__aaLog = { arena: o.arena, allies: o.allies.map((a) => a.pow), boss: o.boss, endless: o.endless }; return o0(Object.assign(o, { time: 6, tutorial: false })); }; });
    await page.evaluate(() => document.querySelector('#aaOv [data-a="go"]').click()); await page.waitForTimeout(500);
    if (!(await page.evaluate(() => !!document.getElementById("aaCut")))) errors.push("niente cut-in");
    if (w === 390) await L.shot(page, "aa_cutin");
    await page.waitForTimeout(1600);
    const lg = await page.evaluate(() => window.__aaLog); if (!lg || lg.arena !== "arena" || !lg.allies.length || lg.boss !== "mascotte") errors.push("assedio: " + JSON.stringify(lg));
    await page.evaluate(() => { window.__assedio.state.god(); window.__assedio.state.finish(true); }); await page.waitForTimeout(600);
    await page.evaluate(() => { const b = document.querySelector("#asGo"); if (b) b.click(); }); await page.waitForTimeout(500);
    const r = await page.evaluate(() => JSON.parse(localStorage.getItem("ali-di-rondine.arena-assedio") || "{}")); if (r.wins !== 1) errors.push("vittoria non registrata: " + JSON.stringify(r));
    if (!(await page.evaluate(() => !!document.getElementById("aaOv")))) errors.push("non torna al menu Assedio");
    await page.evaluate(() => document.querySelector('#aaOv [data-solo="1"]').click()); await page.waitForTimeout(200);
    if ((await page.evaluate(() => document.querySelectorAll("#aaOv .aaC").length)) !== 0) errors.push("da solo ma con le carte");
    await page.evaluate(() => document.querySelector('#aaOv [data-a="go"]').click()); await page.waitForTimeout(2100);
    const lg2 = await page.evaluate(() => window.__aaLog); if (!lg2 || lg2.allies.length) errors.push("da solo: " + JSON.stringify(lg2));
    await page.evaluate(() => { window.__assedio.state.finish(true); }); await page.waitForTimeout(600); await page.evaluate(() => { const b = document.querySelector("#asGo"); if (b) b.click(); }); await page.waitForTimeout(400);
    await page.evaluate(() => window.__arenaAssedio.setOn(false)); await page.evaluate(() => { window.__arenaAssedio.close(); window.__arena.open(() => {}); }); await page.waitForTimeout(300);
    if (await page.evaluate(() => !!document.querySelector('.arOv [data-go="assedio"]'))) errors.push("spenta in Impostazioni ma il bottone resta");
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Assedio dei Sogni (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })();
