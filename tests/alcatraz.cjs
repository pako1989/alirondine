// tests/alcatraz.cjs - «Fuga da Alcatraz FC»: raggiungibilità delle zone, tre capitoli giocati fino in fondo, quattro finali, sfondi
const L = require("./lib.cjs");
const MOD = { mod: "__alcatraz", key: "ali-di-rondine.alcatraz" };
const K_ = "window.__alcatraz._dbg.K";
const info = (p) => L.info(p);
const mockMatch = (p, win = true) => p.evaluate((w) => { window.__alcatrazMatch.start = (o) => { setTimeout(() => o.onDone({ a: w ? 2 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} }), 30); return true; }; }, win);
async function reach(page, zid) {
  await page.evaluate(([k, z]) => { eval(k).enterZone(z); }, [K_, zid]); await page.waitForTimeout(450);
  return page.evaluate((zid) => {
    const D = window.__alcatraz._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
    const npcs = (z.npcs || []).filter((n) => !n.ghost).map((n) => n.at), seen = T.bfs(m, z, st[0], st[1], npcs);
    const adj = (x, y) => [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
    (spec.items || []).forEach(([x, y]) => { if (!adj(x, y)) bad.push("oggetto " + x + "," + y); });
    for (let s = 0; s <= 3; s++) (spec.npcs ? spec.npcs(s) : []).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at); });
    for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) if (m[y][x] === "q" && !adj(x, y)) bad.push("porta " + x + "," + y);
    return bad;
  }, zid);
}
async function storia(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__alcatraz.open()); await page.evaluate(() => window.T_.click("Inizia la storia")); await L.advance(page);
  const st = async (n) => ((await info(page)).step[n] || 0);
  const chk = async (n, v, why) => { const s = await st(n); if (s !== v) errors.push(why + ": step " + s + " invece di " + v); };
  await mockMatch(page, true);
  // ---------- capitolo 1
  for (const z of ["alc_cortile", "alc_celle"]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await page.evaluate(([k]) => eval(k).enterZone("alc_cortile"), [K_]); await page.waitForTimeout(400);
  if (w === 390) await L.shot(page, "alc_cortile");
  await L.talk(page, "alc_tonelli"); await L.advance(page); await chk(1, 1, "Tonelli");
  await L.talk(page, "alc_bruno"); await L.advance(page, [/Accetto il ruolo/]); await chk(1, 2, "Bruno");
  await L.talk(page, "alc_malick"); await L.advance(page); await chk(1, 3, "Malick");
  { const k = await page.evaluate((k) => eval(k).stat("chiavi"), K_); if (k !== 2) errors.push("chiavi dopo cap.1: " + k + " (attese 2)"); }
  await L.talk(page, "alc_cardenas"); await L.advance(page, [/Inizia la partita/]);
  { const i = await info(page); if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch])); }
  // ---------- capitolo 2
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2")); await L.advance(page);
  if ((await L.zone(page)) !== "alc_caldaie") errors.push("cap.2: non parte dalle caldaie: " + (await L.zone(page)));
  for (const z of ["alc_caldaie", "alc_cortile2"]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await page.evaluate(([k]) => eval(k).enterZone("alc_caldaie"), [K_]); await page.waitForTimeout(400);
  if (w === 390) await L.shot(page, "alc_caldaie");
  await L.talk(page, "alc_bruno"); await L.advance(page); await chk(2, 1, "Bruno cap.2");
  await L.talk(page, "alc_malick"); await L.advance(page, [/Usa un grimaldello/, /Libertà nell'ombra/]); await chk(2, 2, "scasso e bivio");
  if (!(await page.evaluate((k) => eval(k).F.get("alc_scelta_fuga"), K_))) errors.push("scelta fuga non registrata");
  await L.goAct(page, 4, 12); await L.advance(page); if ((await L.zone(page)) !== "alc_cortile2") errors.push("non si sale al cortile: " + (await L.zone(page)));
  await L.talk(page, "alc_tonelli"); await L.advance(page, [/Inizia la semifinale/]);
  { const i = await info(page); if (!i.done[2] || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.ch])); }
  { const k = await page.evaluate((k) => [eval(k).stat("chiavi"), eval(k).stat("sospetto")], K_); if (k[0] !== 2 || k[1] !== 10) errors.push("chiavi/allerta dopo cap.2: " + k + " (attesi 2,10)"); }
  // ---------- capitolo 3
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3")); await L.advance(page);
  if ((await L.zone(page)) !== "alc_molo") errors.push("cap.3: non parte dal molo: " + (await L.zone(page)));
  for (const z of ["alc_molo", "alc_cortile3"]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await page.evaluate(([k]) => eval(k).enterZone("alc_molo"), [K_]); await page.waitForTimeout(400);
  if (w === 390) await L.shot(page, "alc_molo");
  await L.talk(page, "alc_cardenas"); await L.advance(page); await chk(3, 1, "Cardenas cap.3");
  await L.goAct(page, 4, 4); await L.advance(page); if ((await L.zone(page)) !== "alc_cortile3") errors.push("molo→cortile: " + (await L.zone(page)));
  await L.talk(page, "alc_cardenas"); await L.advance(page, [/Gioca la Finale/]); await chk(3, 2, "finale giocata");
  await L.goAct(page, 26, 16); await L.advance(page); if ((await L.zone(page)) !== "alc_molo") errors.push("cortile→molo: " + (await L.zone(page)));
  // finali: dallo stesso punto, quattro scelte diverse
  const finale = async (kind, setup, pref) => {
    await page.evaluate(([k, setup]) => { const K = eval(k); K.setStep(3, 2); eval(setup); K.enterZone("alc_molo"); }, [K_, setup]);
    await page.waitForTimeout(450); await L.talk(page, "alc_cardenas"); await L.advance(page, [pref]);
    const i = await info(page); if (!i.ends.includes(kind) || i.done[3] !== kind) errors.push("finale " + kind + " non registrato: " + JSON.stringify([i.done, i.ends]));
  };
  await finale("evasione", "K.bond('sospetto', 40)", /Sali sulla motovedetta/);
  await finale("patto", "0", /Firma l'accordo/);
  await finale("barbiere", "0", /Resta sull'isola/);
  // il segreto c'è solo con chiavi >= 2 e allerta <= 25; senza non compare
  await page.evaluate(([k]) => { const K = eval(k); K.setStep(3, 2); K.bond("chiavi", 5); K.bond("sospetto", -99); K.enterZone("alc_molo"); }, [K_]); await page.waitForTimeout(450);
  await L.talk(page, "alc_cardenas"); await page.waitForTimeout(200);
  { const lab = await page.evaluate(() => { for (let i = 0; i < 8; i++) { const b = window.T_.btns().find((o) => /^Continua/.test(o.t)); if (!b) break; b.b.click(); } return window.T_.btns().map((o) => o.t); }); await page.waitForTimeout(400);
    const t = await page.evaluate(() => window.T_.btns().map((o) => o.t)); if (!t.concat(lab).some((x) => /Segreto/.test(x))) errors.push("opzione segreta assente con chiavi e allerta bassa: " + JSON.stringify(t)); }
  await L.advance(page, [/Segreto/]);
  { const i = await info(page); if (!i.ends.includes("segreto") || i.ends.length < 4) errors.push("finali: " + JSON.stringify(i.ends)); }
  L.check(`Fuga da Alcatraz FC · tre capitoli e quattro finali (${w} px)`, errors); await browser.close();
}
async function c4(w, verdetto) {
  const save = { v: 1, diffSet: true, ch: 4, step: { 1: 3, 2: 2, 3: 2 }, done: { 1: true, 2: true, 3: "evasione" }, ends: ["evasione"], flags: {}, st: { chiavi: 2, sospetto: 10 } };
  const { browser, page, errors } = await L.setup({ w, ...MOD, save });
  await mockMatch(page, true);
  await page.evaluate(() => window.__alcatraz.open()); await page.evaluate(() => window.T_.click("Inizia il Capitolo 4")); await L.advance(page);
  for (const z of ["alc_molo", "alc_cortile4", "alc_celle4"]) { const bad = await reach(page, z); if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", ")); }
  await page.evaluate(([k]) => eval(k).enterZone("alc_molo"), [K_]); await page.waitForTimeout(400);
  if (w === 390) await L.shot(page, "alc_molo_c4");
  await L.talk(page, "vs_ottone"); await L.advance(page);
  let i = await info(page); if (i.step[4] !== 1) errors.push("dopo Ottone c4: " + JSON.stringify(i.step));
  await L.goAct(page, 4, 4); await L.advance(page); if ((await L.zone(page)) !== "alc_cortile4") errors.push("molo→cortile4: " + (await L.zone(page)));
  await L.talk(page, "alc_bruno"); await L.advance(page);
  await L.goAct(page, 8, 4); await L.advance(page); if ((await L.zone(page)) !== "alc_celle4") errors.push("cortile4→celle4: " + (await L.zone(page)));
  await L.talk(page, "alc_dario"); await L.advance(page);
  i = await info(page); if (i.step[4] !== 2) errors.push("dopo Dario c4: " + JSON.stringify(i.step));
  await L.goAct(page, 4, 11); await L.advance(page); if ((await L.zone(page)) !== "alc_cortile4") errors.push("celle4→cortile4: " + (await L.zone(page)));
  await L.talk(page, "alc_cardenas"); await L.advance(page, [/Gioca la Partita/]);
  i = await info(page); if (i.step[4] !== 3) errors.push("dopo partita c4: " + JSON.stringify(i.step));
  await L.goAct(page, 26, 16); await L.advance(page); if ((await L.zone(page)) !== "alc_molo") errors.push("cortile4→molo: " + (await L.zone(page)));
  await L.talk(page, "vs_ottone"); await L.advance(page, [verdetto.label]);
  i = await info(page); if (i.done[4] !== verdetto.id) errors.push("capitolo ponte " + verdetto.id + ": " + JSON.stringify([i.done, i.ends]));
  if (verdetto.id === "scatola" && !i.ends.includes("scatola")) errors.push("finale scatola non registrato");
  L.check(`Alcatraz · capitolo ponte ${verdetto.id} (${w} px)`, errors); await browser.close();
}
// sfondi: le cinque scene ci sono, hanno punti da toccare e si disegnano senza errori
async function sfondi() {
  const { browser, page, errors } = await L.setup({ ...MOD });
  const r = await page.evaluate(() => { const LB = window.__lbBg && window.__lbBg.LB, out = []; if (!LB) return ["LB assente"]; ["alc_titolo", "alc_cortile", "alc_celle", "alc_caldaie", "alc_molo"].forEach((k) => { const d = LB[k]; if (!d) return out.push("manca " + k); if (!d.hot || d.hot.length < 3) out.push(k + ": meno di 3 punti da toccare"); }); return out; });
  r.forEach((x) => errors.push(x));
  L.check("Alcatraz · sfondi", errors); await browser.close();
}
(async () => { await storia(390); await c4(390, { id: "scatola", label: "Salta sulla barca" }); await sfondi(); })().catch((e) => { console.error("✗ alcatraz:", e.message); process.exit(1); });
