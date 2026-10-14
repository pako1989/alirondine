// tests/dungeon.cjs - «Dungeon di Fine Stagione»: il motore delle Stanze dell'Ipogeo (partite vere, comandi, trappole, doni), la discesa
// (porte, doni, cuori, cadute, scorciatoie), le zone, tutti i PNG, i 3 capitoli, i finali, il cabinato e le partite a scelta.
const L = require("./lib.cjs");
const MOD = { mod: "__dungeon", key: "ali-di-rondine.dungeon" };
const K_ = "window.__dungeon._dbg.K";
const info = (p) => L.info(p);
const pick = async (p, re) => { await p.waitForTimeout(150); const r = await p.evaluate((re) => window.T_.click(re), re); await p.waitForTimeout(250); return r; };
const kv = (p, js) => p.evaluate(([k, js]) => { const K = eval(k); return eval(js); }, [K_, js]);
// una stanza vera: parte, salta l'intro, un passo di simulazione con i comandi, poi finisce con il punteggio voluto
async function room(page, errors, a, b, tag) {
  for (let i = 0; i < 40 && !(await page.evaluate(() => !!document.querySelector(".dgOv canvas"))); i++) await page.waitForTimeout(100);
  if (!(await page.evaluate(() => !!document.querySelector(".dgOv")))) { errors.push("la stanza non si apre " + (tag || "")); return null; }
  await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!window.__dungeon.state))) { errors.push("stanza senza stato " + (tag || "") + ": " + (await page.evaluate(() => (document.querySelector(".dgOv") || {}).innerText || "").then((t) => t.slice(0, 160).replace(/\n/g, " ")))); return null; }
  const st = await page.evaluate(() => { const S = window.__dungeon.state; S.skipIntro(); S.phase = "play"; S.manual = true; for (let i = 0; i < 240 && !S.over; i++) { S.input.x = Math.sin(i / 20); S.input.y = Math.cos(i / 30); S.update(1 / 60); } return { hero: !!S.hero, over: S.over, w: document.querySelectorAll(".dgOv canvas").length }; });
  if (!st.hero || !st.w) errors.push("stanza senza eroe o senza tela " + (tag || ""));
  await page.evaluate(([a, b]) => { const S = window.__dungeon.state; S.a = a; S.b = b; S.over = false; S.finish(false); }, [a, b]);
  await page.waitForTimeout(250);
  return st;
}
const closeRoom = async (page) => { await page.waitForTimeout(150); await page.evaluate(() => { const g = document.querySelector(".dgOv .goB"); if (g) g.click(); }); await page.waitForTimeout(300); };
// il dono: sceglie il primo dei tre
async function gift(page, errors) {
  for (let i = 0; i < 25 && !(await page.evaluate(() => !!document.querySelector(".dgOv [data-g]"))); i++) await page.waitForTimeout(100);
  const t = await page.evaluate(() => [...document.querySelectorAll(".dgOv [data-g]")].map((b) => b.innerText.replace(/\s+/g, " ")));
  if (t.length && t.length !== 3) errors.push("doni da scegliere: " + t.length); // nessuno: la porta dava i cuori
  await page.evaluate(() => { const b = document.querySelector(".dgOv [data-g]"); if (b) b.click(); }); await page.waitForTimeout(300);
  return t;
}

let _n = 0, _E = null; const step = (s) => { if (process.env.DBG) console.log("  ·", ++_n, s, _E ? "ERR:" + _E.join(" || ") : ""); };
async function c1(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD }); _E = errors;
  await page.evaluate(() => window.__dungeon.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  if ((await L.zone(page)) !== "dg_campo") errors.push("non si parte dal Campo Base: " + (await L.zone(page)));
  if (w === 390) await L.shot(page, "dg_campo");
  { const bad = await L.reachAll(page, "dg_campo"); if (bad.length) errors.push("dg_campo irraggiungibile: " + bad.join(", ")); }
  step("mister"); await L.talk(page, "dg_mister"); await L.advance(page);
  let i = await info(page); if (i.step[1] !== 1) errors.push("dopo il Mister: " + JSON.stringify(i.step));
  step("ruggine"); await L.talk(page, "dg_ruggine"); await L.advance(page, ["^Dopo"]);
  await L.stubMatch(page, true); await L.talk(page, "dg_ruggine"); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "dg_spar") errors.push("allenamento non a scelta");
  // l'allenamento nelle stanze vere
  await L.talk(page, "dg_ruggine"); await page.evaluate(() => window.T_.click("Nelle Stanze")); await room(page, errors, 2, 1, "allenamento"); await closeRoom(page); await L.advance(page).catch(() => {});
  await L.talk(page, "dg_fiamma").catch(() => {}); await L.advance(page).catch(() => {});
  step("discesa");
  await page.evaluate((k) => eval(k).runStart(1, false), K_); await page.waitForTimeout(500); await L.advance(page).catch(() => {});
  if ((await L.zone(page)) !== "dg_p1") errors.push("la discesa non porta al Piano 1: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "dg_p1"); if (bad.length) errors.push("dg_p1 irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "dg_p1");
  for (let n = 0; n < 3; n++) {
    await L.goAct(page, [8, 13, 18][n], 1); await page.waitForTimeout(300);
    const t = await page.evaluate(() => window.T_.btns().map((o) => o.t)); if (!t.some((x) => /^Entra/.test(x))) errors.push("porta " + n + " senza «Entra»: " + t.join("|"));
    await pick(page, "^Entra");
    step("porta " + n); await room(page, errors, 2, 0, "porta " + n); await closeRoom(page);
    await L.advance(page, [], 80).catch(() => {});
    await gift(page, errors).catch(() => {}); await L.advance(page).catch(() => {});
  }
  i = await info(page); if ((i.flags.dg_stanze | 0) < 3) errors.push("stanze superate non contate: " + i.flags.dg_stanze);
  step("asterio");
  await L.goAct(page, 27, 9); await page.waitForTimeout(300); step("grande " + JSON.stringify(await page.evaluate(() => [document.getElementById("choices").innerText.slice(0, 300), window.__dungeon._dbg.F.get("dg_rm"), window.__dungeon._dbg.F.get("dg_in")]))); await pick(page, "^Entra"); await L.advance(page, ["^Continua"], 40).catch(() => {});
  await room(page, errors, 2, 0, "Asterio"); await closeRoom(page); await L.advance(page, [], 30).catch(() => {});
  await pick(page, "Dagli la mano"); await L.advance(page).catch(() => {});
  step("zona " + (await L.zone(page)) + " " + JSON.stringify(await page.evaluate(() => window.T_.btns().map((o) => o.t)))); i = await info(page); if (i.step[1] !== 2) errors.push("dopo Asterio: " + JSON.stringify(i.step));
  if ((await L.zone(page)) !== "dg_campo") errors.push("dopo Asterio non si torna al Campo Base");
  step("mister"); await L.talk(page, "dg_mister"); await L.advance(page);
  i = await info(page); if (!i.done[1]) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Dungeon di Fine Stagione · capitolo 1 (${w} px)`, errors); await browser.close();
}

async function doors(page, errors) {
  for (let n = 0; n < 3; n++) {
    await L.goAct(page, [8, 13, 18][n], 1); await page.waitForTimeout(300);
    await pick(page, "^Entra"); step("porta " + n);
    await room(page, errors, 2, 0, "porta " + n); await closeRoom(page);
    await L.advance(page, [], 80).catch(() => {});
    await gift(page, errors).catch(() => {}); await L.advance(page).catch(() => {});
  }
}
async function c2(w) {
  const save = { v: 1, ch: 2, step: { 1: 5 }, done: { 1: "pieta" }, diffSet: true, intro: { ch1: 1, dg_campo: 1, dg_p1: 1 }, st: { pieta: 1 }, flags: { dg_pieta1: 1, dg_sc2: true, dg_morti: 1 } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save }); _E = errors;
  await page.evaluate(() => window.__dungeon.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if (w === 390) await L.shot(page, "dg_campo2");
  { const bad = await L.reachAll(page, "dg_campo"); if (bad.length) errors.push("dg_campo irraggiungibile: " + bad.join(", ")); }
  step("mister"); await L.talk(page, "dg_mister"); await L.advance(page);
  let i = await info(page); if (i.step[2] !== 1) errors.push("dopo il Mister: " + JSON.stringify(i.step));
  // la scorciatoia dalla Scalinata
  await L.goAct(page, 14, 1); await page.waitForTimeout(300);
  { const t = await page.evaluate(() => window.T_.btns().map((o) => o.t)); if (!t.some((x) => /Scorciatoia: Piano 2/.test(x))) errors.push("manca la scorciatoia al Piano 2: " + t.join("|")); }
  await pick(page, "Scorciatoia: Piano 2"); await gift(page, errors); await L.advance(page).catch(() => {});
  if ((await L.zone(page)) !== "dg_p2") errors.push("la scorciatoia non porta al Piano 2: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "dg_p2"); if (bad.length) errors.push("dg_p2 irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "dg_p2");
  step("meda"); await L.talk(page, "dg_meda"); await L.advance(page);
  i = await info(page); if (i.step[2] !== 2) errors.push("dopo Meda: " + JSON.stringify(i.step));
  await L.stubMatch(page, true); await L.talk(page, "dg_meda"); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "dg_brindisi") errors.push("brindisi non a scelta");
  await L.talk(page, "dg_meda"); await page.evaluate(() => window.T_.click("Nelle Stanze")); await room(page, errors, 2, 1, "brindisi"); await closeRoom(page); await L.advance(page).catch(() => {});
  step("porte"); await doors(page, errors);
  await L.goAct(page, 27, 9); await page.waitForTimeout(300); await pick(page, "^Entra"); await L.advance(page, ["^Continua"], 40).catch(() => {});
  await room(page, errors, 2, 0, "Cerbero"); await closeRoom(page); await L.advance(page, [w === 390 ? "subito" : "domani"], 60).catch(() => {});
  i = await info(page); if (i.step[2] !== 3) errors.push("dopo Cerbero: " + JSON.stringify(i.step));
  if ((await L.zone(page)) !== "dg_campo") errors.push("dopo Cerbero non si torna al Campo Base: " + (await L.zone(page)));
  step("ruggine"); await L.talk(page, "dg_ruggine"); await L.advance(page, [w === 390 ? "racconti" : "chiedi"]);
  step("mister fine"); await L.talk(page, "dg_mister"); await L.advance(page);
  i = await info(page); if (!i.done[2]) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.step]));
  L.check(`Dungeon di Fine Stagione · capitolo 2 (${w} px)`, errors); await browser.close();
}

async function c3(w) {
  const save = { v: 1, ch: 3, step: { 1: 5, 2: 5 }, done: { 1: "pieta", 2: "calma" }, diffSet: true, intro: { ch1: 1, dg_campo: 1, dg_p1: 1, dg_p2: 1 }, st: { pieta: 1, ruggine: 5 }, flags: { dg_pieta1: 1, dg_sc2: true, dg_sc3: true, dg_morti: 3, dg_cerb: true } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save }); _E = errors;
  await page.evaluate(() => window.__dungeon.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  { const bad = await L.reachAll(page, "dg_campo"); if (bad.length) errors.push("dg_campo irraggiungibile: " + bad.join(", ")); }
  step("mister"); await L.talk(page, "dg_mister"); await L.advance(page);
  let i = await info(page); if (i.step[3] !== 1) errors.push("dopo il Mister: " + JSON.stringify(i.step));
  await L.goAct(page, 14, 1); await page.waitForTimeout(300);
  await pick(page, "Scorciatoia: Piano 3"); await gift(page, errors); await L.advance(page).catch(() => {});
  if ((await L.zone(page)) !== "dg_p3") errors.push("la scorciatoia non porta al Piano 3: " + (await L.zone(page)));
  { const bad = await L.reachAll(page, "dg_p3"); if (bad.length) errors.push("dg_p3 irraggiungibile: " + bad.join(", ")); }
  if (w === 390) await L.shot(page, "dg_p3");
  step("ruggine"); await L.talk(page, "dg_ruggine"); await L.advance(page, [w === 390 ? "Resta con me" : "da solo"]);
  i = await info(page); if (i.step[3] !== 2) errors.push("dopo Ruggine: " + JSON.stringify(i.step));
  await L.stubMatch(page, true); await L.talk(page, "dg_asterio"); await page.evaluate(() => window.T_.click("Un'altra modalità")); await page.waitForTimeout(400); await L.advance(page).catch(() => {});
  if ((await page.evaluate(() => (window.__lastMatch || {}).id)) !== "dg_onore") errors.push("partita d'onore non a scelta");
  await L.talk(page, "dg_asterio"); await page.evaluate(() => window.T_.click("Nelle Stanze")); await room(page, errors, 2, 1, "onore"); await closeRoom(page); await L.advance(page).catch(() => {});
  step("porte"); await doors(page, errors);
  await L.goAct(page, 27, 9); await page.waitForTimeout(300); await pick(page, "^Entra"); await L.advance(page, ["^Continua"], 40).catch(() => {});
  await room(page, errors, 3, 1, "Cenere"); await closeRoom(page); await L.advance(page, ["^Continua", "Fischia"], 60).catch(() => {});
  i = await info(page); if (!i.done[3] || !i.ends.includes("ultimo")) errors.push("finale 1 non registrato: " + JSON.stringify([i.done, i.ends]));
  if (w === 390) await L.shot(page, "dg_finale");
  // gli altri finali: stessa scelta, condizioni diverse
  await page.evaluate(() => { const got = window.__borgoApi.trRec().got; ["dg_campo", "dg_p1", "dg_p2", "dg_p3"].forEach((z) => { got[z] = [0, 1, 2]; }); });
  for (const [re, id] of [["Il Campo Base resta", "brace"], ["ripeti quel rigore", "minuto"], ["Nessun fischio", "senzafischio"]]) {
    await page.evaluate(() => { window.__dungeon._dbg.K.finale(); }); await page.waitForTimeout(300);
    const t = await page.evaluate(() => window.T_.btns().map((o) => o.t));
    if (!t.some((x) => new RegExp(re).test(x))) errors.push("manca l'opzione " + id + ": " + t.join("|"));
    await pick(page, re); await L.advance(page, ["^Continua"], 40).catch(() => {});
    i = await info(page); if (!i.ends.includes(id)) errors.push("finale " + id + " non registrato: " + JSON.stringify(i.ends));
  }
  i = await info(page); if (i.ends.length !== 4) errors.push("finali trovati: " + i.ends.length);
  // senza le condizioni, le scelte segrete non compaiono
  await page.evaluate(() => { const D = window.__dungeon._dbg; D.mem().st.ruggine = 0; D.F.set("dg_morti", 0); window.__dungeon._dbg.K.finale(); }); await page.waitForTimeout(300);
  { const t = await page.evaluate(() => window.T_.btns().map((o) => o.t)); if (t.some((x) => /ripeti quel rigore|Nessun fischio/.test(x))) errors.push("finali segreti visibili senza condizioni: " + t.join("|")); }
  L.check(`Dungeon di Fine Stagione · capitolo 3 (${w} px)`, errors); await browser.close();
}

(async () => {
  const which = process.argv[2] || "all";
  for (const w of [390, 320]) { if (which === "all" || which === "c1") await c1(w); if (which === "all" || which === "c2") await c2(w); if (which === "all" || which === "c3") await c3(w); }
})().catch((e) => { console.error(e); process.exitCode = 1; });
