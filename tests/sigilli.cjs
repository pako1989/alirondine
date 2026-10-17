// tests/sigilli.cjs - «L'Accademia dei Sigilli»: raggiungibilità delle zone, tre capitoli giocati, quattro finali, motore Traccia-Runa
const L = require("./lib.cjs");
const MOD = { mod: "__sigilli", key: "ali-di-rondine.sigilli" };
const K_ = "window.__sigilli._dbg.K";
const info = (p) => L.info(p);

const mockMatch = (p, win = true) => p.evaluate((w) => {
  window.__runaMatch.start = (o) => {
    setTimeout(() => {
      const res = { a: w ? 3 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} };
      if (o.done) o.done(res);
      else if (o.onDone) o.onDone(res);
    }, 30);
    return true;
  };
}, win);

async function reach(page, zid) {
  await page.evaluate(([k, z]) => { eval(k).enterZone(z); }, [K_, zid]);
  await page.waitForTimeout(450);
  return page.evaluate((zid) => {
    const D = window.__sigilli._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
    const npcs = (z.npcs || []).filter((n) => !n.ghost).map((n) => n.at), seen = T.bfs(m, z, st[0], st[1], npcs);
    const adj = (x, y) => [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => seen[y + dy] && seen[y + dy][x + dx]);
    if (T.solidAt(m, z, st[0], st[1])) bad.push("partenza su solido");
    (spec.items || []).forEach(([x, y]) => { if (T.solidAt(m, z, x, y) || !(seen[y] && seen[y][x])) bad.push("oggetto " + x + "," + y); });
    for (let s = 0; s <= 3; s++) (spec.npcs ? spec.npcs(s) : []).forEach((n) => { if (!adj(n.at[0], n.at[1])) bad.push("png " + n.id + " " + n.at); });
    for (let y = 0; y < m.length; y++) for (let x = 0; x < m[0].length; x++) if (m[y][x] === "q" && !adj(x, y)) bad.push("porta " + x + "," + y);
    return bad;
  }, zid);
}

async function storia(w) {
  const { browser, page, errors } = await L.setup({ w, ...MOD });
  await page.evaluate(() => window.__sigilli.open());
  await page.evaluate(() => window.T_.click("Inizia la storia"));
  await L.advance(page);

  const chk = async (n, v, why) => {
    const s = (await info(page)).step[n] || 0;
    if (s !== v) errors.push(why + ": step " + s + " invece di " + v);
  };

  await mockMatch(page, true);
  const zones = {
    1: ["sg_cortile", "sg_aula"],
    2: ["sg_biblioteca", "sg_cripta"],
    3: ["sg_osservatorio", "sg_torre"]
  };
  const goEnter = async (z) => {
    await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, z]);
    await page.waitForTimeout(400);
  };

  // Capitolo 1
  for (const z of zones[1]) {
    const bad = await reach(page, z);
    if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", "));
  }
  await goEnter("sg_cortile");
  if (w === 390) await L.shot(page, "sg_cortile");

  await L.talk(page, "sg_preside"); await L.advance(page); await chk(1, 1, "Preside c1");
  await L.talk(page, "sg_miriel"); await L.advance(page, [/Concentrati/]); await chk(1, 2, "Miriel c1");
  await L.talk(page, "sg_tobia"); await L.advance(page);

  await goEnter("sg_aula");
  await L.talk(page, "sg_balthazar");
  await L.advance(page, [/Inizia l'Esame/]);

  {
    const i = await info(page);
    if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch]));
  }

  // Capitolo 2
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2"));
  await L.advance(page);
  if ((await L.zone(page)) !== "sg_biblioteca") errors.push("cap.2 non parte dalla biblioteca: " + (await L.zone(page)));
  for (const z of zones[2]) {
    const bad = await reach(page, z);
    if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", "));
  }
  await goEnter("sg_biblioteca");
  await L.talk(page, "sg_archimede"); await L.advance(page); await chk(2, 1, "Archimede c2");
  await L.talk(page, "sg_miriel"); await L.advance(page, [/Varchiamo/]); await chk(2, 2, "Miriel c2");
  await L.talk(page, "sg_tobia"); await L.advance(page);

  await goEnter("sg_cripta");
  await L.talk(page, "sg_golem"); await L.advance(page);
  await L.talk(page, "sg_valerian");
  await L.advance(page, [/Traccia-Runa/]);

  {
    const i = await info(page);
    if (!i.done[2] || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.ch]));
  }

  // Capitolo 3
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3"));
  await L.advance(page);
  if ((await L.zone(page)) !== "sg_osservatorio") errors.push("cap.3 non parte dall'osservatorio: " + (await L.zone(page)));
  for (const z of zones[3]) {
    const bad = await reach(page, z);
    if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", "));
  }
  await goEnter("sg_osservatorio");
  await L.talk(page, "sg_preside"); await L.advance(page); await chk(3, 1, "Preside c3");
  await L.talk(page, "sg_miriel"); await L.advance(page); await chk(3, 2, "Miriel c3");
  await L.talk(page, "sg_tobia"); await L.advance(page);

  await goEnter("sg_torre");
  await L.talk(page, "sg_archimede"); await L.advance(page);
  await L.talk(page, "sg_valerian");
  await L.advance(page, [/Sigillo dell'Aura/]);

  {
    const i = await info(page);
    if (!i.done[3] || !i.ends.includes("luce")) errors.push("finale luce non registrato: " + JSON.stringify(i));
  }

  L.check(`Accademia dei Sigilli · storia (${w} px)`, errors);
  await browser.close();
}

async function motore(w) {
  const { browser, page, errors } = await L.setup({ w });
  await page.evaluate(() => {
    window.__runaMatch.start({
      opp: { name: "Test Opp" },
      us: "Test Hero",
      turns: 2,
      onDone(res) { window.__testRes = res; }
    });
  });
  await page.waitForTimeout(300);

  const exists = await page.evaluate(() => !!document.querySelector(".sigilli-match-ovl"));
  if (!exists) errors.push("overlay motore non aperto");

  // Simula finish()
  await page.evaluate(() => {
    const S = window.__runaMatch.state();
    if (S && S.finish) S.finish(true);
  });
  await page.waitForTimeout(300);

  // Clicca continua su esito
  await page.evaluate(() => {
    const b = document.querySelector("#sg-cont-btn");
    if (b) b.click();
  });
  await page.waitForTimeout(300);

  const res = await page.evaluate(() => window.__testRes);
  if (!res || !res.win) errors.push("risultato motore errato: " + JSON.stringify(res));

  L.check(`Accademia dei Sigilli · motore Traccia-Runa (${w} px)`, errors);
  await browser.close();
}

(async () => {
  await motore(390);
  await storia(390);
  await storia(320);
})().catch((e) => {
  console.error("✗ sigilli:", e.message);
  process.exit(1);
});
