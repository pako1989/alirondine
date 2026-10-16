// tests/fiume.cjs - «La Carovana del Fiume d'Argento»: raggiungibilità delle zone, tre capitoli giocati, quattro finali, motore Corrente & Rinvio
const L = require("./lib.cjs");
const MOD = { mod: "__fiume", key: "ali-di-rondine.fiume" };
const K_ = "window.__fiume._dbg.K";
const info = (p) => L.info(p);
const mockMatch = (p, win = true) => p.evaluate((w) => {
  window.__corrente.start = (o) => {
    setTimeout(() => {
      const res = { a: w ? 2 : 0, b: w ? 1 : 2, win: w, quit: false, data: {} };
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
    const D = window.__fiume._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
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
  await page.evaluate(() => window.__fiume.open());
  await page.evaluate(() => window.T_.click("Inizia la storia"));
  await L.advance(page);

  const chk = async (n, v, why) => {
    const s = (await info(page)).step[n] || 0;
    if (s !== v) errors.push(why + ": step " + s + " invece di " + v);
  };

  await mockMatch(page, true);
  const zones = {
    1: ["fa_molo", "fa_chiatta"],
    2: ["fa_chiuse", "fa_sala_macchine"],
    3: ["fa_delta", "fa_arena_delta"]
  };

  const goEnter = async (z) => {
    await page.evaluate(([k, z]) => eval(k).enterZone(z), [K_, z]);
    await page.waitForTimeout(400);
  };

  for (const z of zones[1]) {
    const bad = await reach(page, z);
    if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", "));
  }

  // Capitolo 1
  await goEnter("fa_molo");
  if (w === 390) await L.shot(page, "fa_molo");
  await L.talk(page, "fa_roderico");
  await L.advance(page);
  await chk(1, 1, "Roderico c1");

  await L.talk(page, "fa_mirella");
  await L.advance(page);
  await chk(1, 2, "Mirella c1");

  await goEnter("fa_chiatta");
  await L.talk(page, "fa_vanni");
  await L.advance(page);
  await chk(1, 3, "Vanni c1");

  await L.talk(page, "fa_roderico");
  await L.advance(page, [/Sfida i Portuali/]);
  {
    const i = await info(page);
    if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch]));
  }

  // Capitolo 2
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2"));
  await L.advance(page);
  if ((await L.zone(page)) !== "fa_chiuse") errors.push("cap.2 non parte dalle chiuse: " + (await L.zone(page)));

  for (const z of zones[2]) {
    const bad = await reach(page, z);
    if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", "));
  }

  await goEnter("fa_chiuse");
  await L.talk(page, "fa_malacarne");
  await L.advance(page);
  await chk(2, 1, "Malacarne c2");

  await goEnter("fa_sala_macchine");
  await L.talk(page, "fa_silvia");
  await L.advance(page);
  await chk(2, 2, "Silvia c2");

  await goEnter("fa_chiuse");
  await L.talk(page, "fa_mirella");
  await L.advance(page);
  await chk(2, 3, "Mirella c2");

  await L.talk(page, "fa_malacarne");
  await L.advance(page, [/Sfida la Guardia/]);
  {
    const i = await info(page);
    if (!i.done[2] || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.ch]));
  }

  // Capitolo 3
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3"));
  await L.advance(page);
  if ((await L.zone(page)) !== "fa_delta") errors.push("cap.3 non parte dal delta: " + (await L.zone(page)));

  for (const z of zones[3]) {
    const bad = await reach(page, z);
    if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", "));
  }

  await goEnter("fa_delta");
  if (w === 390) await L.shot(page, "fa_delta");

  await L.talk(page, "fa_roderico");
  await L.advance(page);
  await chk(3, 1, "Roderico c3");

  await L.talk(page, "fa_mirella");
  await L.advance(page);
  await chk(3, 2, "Mirella c3");

  await goEnter("fa_arena_delta");
  await L.talk(page, "fa_malacarne");
  await L.advance(page);
  await chk(3, 3, "Malacarne c3");



  // Prova dei 4 finali
  const fin = async (kind, pref) => {
    await page.evaluate(([k]) => {
      const K = eval(k);
      K.setStep(3, 3);
      K.enterZone("fa_arena_delta");
    }, [K_]);
    await page.waitForTimeout(450);
    await L.talk(page, "fa_roderico");
    await L.advance(page, [/Gioca la Finalissima/, pref]);
    const i = await info(page);
    if (!i.ends.includes(kind) || i.done[3] !== kind) errors.push("finale " + kind + ": " + JSON.stringify([i.done, i.ends]));
  };

  await fin("mercantile", /La Grande Rotta Mercantile/);
  await fin("franca", /La Bandiera della Fratellanza/);
  await fin("sentinella", /La Sentinella/);
  await fin("segreto", /Il Mistero del Delta d'Oro/);

  {
    const i = await info(page);
    if (i.ends.length !== 4) errors.push("finali: " + JSON.stringify(i.ends));
  }

  L.check(`La Carovana del Fiume d'Argento · tre capitoli e quattro finali (${w} px)`, errors);
  await browser.close();
}

async function motore() {
  const { browser, page, errors } = await L.setup({ ...MOD });
  const r = await page.evaluate(async () => {
    const out = [];
    for (let k = 0; k < 6; k++) {
      let res = null;
      window.__corrente.start({ auto: true, fast: true, bonus: k > 2 ? { at: 2, df: 2, te: 2 } : null, onDone: (x) => { res = x; } });
      for (let i = 0; i < 400 && !res; i++) await new Promise((q) => setTimeout(q, 50));
      out.push(res ? [res.a, res.b] : null);
      if (!res) window.__corrente.state.finish();
    }
    return out;
  });
  if (r.some((x) => !x)) errors.push("partita non conclusa: " + JSON.stringify(r));
  const tot = r.filter(Boolean).reduce((n, [a, b]) => n + a + b, 0);
  if (tot === 0) errors.push("mai un punto in 6 partite: " + JSON.stringify(r));
  if (tot / 6 > 16) errors.push("troppi punti: " + JSON.stringify(r));
  console.log("  punteggi:", JSON.stringify(r));
  L.check("Corrente & Rinvio · partite a pilota automatico", errors);
  await browser.close();
}

(async () => {
  await storia(390);
  await motore();
})().catch((e) => {
  console.error("✗ fiume:", e.message);
  process.exit(1);
});
