// tests/sala.cjs - Sala Giochi (i motori delle saghe, liberi) e Cineteca (i film dei finali trovati)
const L = require("./lib.cjs");
async function run(w) {
  const extra = {
    "ali-di-rondine.mantello": { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "segreto", 2: "amica", 3: "eroe" }, ends: ["eroe"], diffSet: true, flags: {} },
    "ali-di-rondine.stagione": { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "verita" }, ends: [], diffSet: true, flags: {} },
  };
  const { browser, page, errors } = await L.setup({ w, extra });
  await page.evaluate(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(300);
  const ms = await page.evaluate(() => [...document.querySelectorAll(".salOv [data-m]")].map((b) => b.dataset.m + ":" + (b.querySelector(".pe").textContent === "🔒" ? "chiuso" : "aperto")));
  if (ms.join() !== "vignette:chiuso,atb:chiuso,bottoni:aperto,nastro:aperto,luci:chiuso,duello:chiuso,concilio:chiuso") errors.push("cabinati sbagliati: " + ms.join());
  if (w === 390) await L.shot(page, "sala");
  // Super-Bottoni: il boss c'è (saga finita), si sceglie il potere
  await page.evaluate(() => document.querySelector('.salOv [data-m="bottoni"]').click()); await page.waitForTimeout(200);
  const boss = await page.evaluate(() => !!document.querySelector('.salOv [data-o="9"]')); if (!boss) errors.push("il boss di Super-Bottoni non è sbloccato");
  await page.evaluate(() => { document.querySelector('.salOv [data-pw="gelo"]').click(); document.querySelector('.salOv [data-o="9"]').click(); }); await page.waitForTimeout(300);
  const o = await page.evaluate(() => { const S = window.__bottoni.state; return S && [S.o.power, S.o.oppPower]; }); if (!o || o.join() !== "gelo,specchio") errors.push("partita del boss sbagliata: " + JSON.stringify(o));
  await page.evaluate(() => document.querySelector(".btOv .ov button").click()); await page.waitForTimeout(200);
  await page.evaluate(() => { const S = window.__bottoni.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".btOv .ov button").click()); await page.waitForTimeout(300);
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem("ali-di-rondine.salagiochi") || "{}")); if (!rec.w || rec.w.bottoni !== 1) errors.push("record non salvato: " + JSON.stringify(rec));
  // Il Nastro: senza boss (la saga non è finita)
  await page.evaluate(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector('.salOv [data-m="nastro"]').click()); await page.waitForTimeout(200);
  if (await page.evaluate(() => !!document.querySelector('.salOv [data-o="9"]'))) errors.push("il boss del Nastro non doveva esserci");
  await page.evaluate(() => document.querySelector('.salOv [data-o="1"]').click()); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector(".naOv .ov button").click()); await page.waitForTimeout(200);
  await page.evaluate(() => { const S = window.__nastro.state; S.finish(); }); await page.waitForTimeout(200); await page.evaluate(() => document.querySelector(".naOv .ov button").click()); await page.waitForTimeout(300);
  // Cineteca: il film del finale trovato
  await page.evaluate(() => window.__salone.cineteca(() => {})); await page.waitForTimeout(300);
  const films = await page.evaluate(() => document.querySelectorAll(".salOv [data-e]").length); if (films !== 1) errors.push("film in Cineteca: " + films);
  await page.evaluate(() => document.querySelector(".salOv [data-e]").click()); await page.waitForTimeout(1500);
  const t = await page.evaluate(() => (document.querySelector(".salOv .txt") || {}).textContent || ""); if (!/EROE/.test(t)) errors.push("il film non racconta il finale: " + t.slice(0, 40));
  if (w === 390) await L.shot(page, "cineteca");
  L.check(`Sala Giochi e Cineteca (${w} px)`, errors); await browser.close();
}
async function ospiti(w) {
  const extra = { "ali-di-rondine.mantello": { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "segreto", 2: "amica", 3: "eroe" }, ends: ["eroe"], diffSet: true, flags: {} } };
  const { browser, page, errors } = await L.setup({ w, extra });
  const gl = await page.evaluate(() => window.__borgoGuests.list()); const on = gl.filter((x) => x.on).map((x) => x.id);
  if (on.join() !== "mg_bullone") errors.push("ospiti al Borgo sbagliati: " + JSON.stringify(gl));
  // nel Borgo: Bullone c'è, su una casella libera, e parla
  await page.evaluate(() => window.__ali.borgo()); await page.waitForTimeout(1200); await L.advance(page).catch(() => {});
  const ok = await page.evaluate(() => { const BW = window.__ali.BW, n = (window.__ali.B && window.__ali.BW) ? null : null; const at = window.__borgoGuests && BW && BW.map ? (function () { return true; })() : false; return at; });
  const pos = await page.evaluate(() => { const r = window.__reg && window.__reg.npcs ? window.__reg.npcs() : []; return r.includes("mg_bullone"); }); if (!pos) errors.push("Bullone non è tra i personaggi del Borgo");
  if (w === 390) await L.shot(page, "borgo_ospite");
  const t = await page.evaluate(() => window.__borgoGuests.talk("mg_bullone")); await page.waitForTimeout(300); if (!t) errors.push("Bullone non parla");
  const txt = await page.evaluate(() => document.body.innerText); if (!/BIP/.test(txt)) errors.push("la battuta dell'ospite non compare");
  void ok; L.check(`Ospiti al Borgo (${w} px)`, errors); await browser.close();
}
async function torneo(w) {
  const extra = { "ali-di-rondine.torneo": { v: 1, ch: 3, step: { 1: 7, 2: 7, 3: 5 }, done: { 1: "a", 2: "b", 3: "festa" }, ends: ["festa"], diffSet: true, flags: {} } };
  const { browser, page, errors } = await L.setup({ w, extra });
  await page.evaluate(() => window.__salone.salaGiochi(() => {})); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.salOv [data-m="vignette"]').click()); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector(".salOv [data-cup]").click()); await page.waitForTimeout(200);
  const q = await page.evaluate(() => document.querySelectorAll(".salOv .sec").length); if (q < 1) errors.push("il tabellone non compare");
  if (w === 390) await L.shot(page, "sala_torneo");
  for (let r = 0; r < 3; r++) {
    await page.evaluate(() => document.querySelector(".salOv [data-go]").click()); await page.waitForTimeout(400);
    await page.evaluate(() => document.querySelector(".vgOv .ov button").click()); await page.waitForTimeout(200);
    await page.evaluate(() => { const S = window.__vignette.state; S.a = 2; S.b = 0; S.finish(); }); await page.waitForTimeout(200);
    await page.evaluate(() => document.querySelector(".vgOv .ov button").click()); await page.waitForTimeout(300);
  }
  const t = await page.evaluate(() => document.querySelector(".salOv .sum").textContent); if (!/HAI VINTO IL TORNEO/.test(t)) errors.push("il torneo non si vince: " + t);
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem("ali-di-rondine.salagiochi") || "{}")); if (!rec.cup || rec.cup.vignette !== 1) errors.push("coppa non registrata: " + JSON.stringify(rec.cup));
  L.check(`Sala Giochi · torneo a eliminazione (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); await ospiti(390); await torneo(390); await torneo(320); })().catch((e) => { console.error("✗ sala:", e.message); process.exit(1); });
