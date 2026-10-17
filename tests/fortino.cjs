// tests/fortino.cjs - «Colpo al Fortino»: raggiungibilità delle zone, tre capitoli giocati, quattro finali, motore Laser & Rimbalzo a pilota automatico
const L = require("./lib.cjs");
const MOD = { mod: "__fortino", key: "ali-di-rondine.fortino" };
const K_ = "window.__fortino._dbg.K";
const info = (p) => L.info(p);
const mockMatch = (p, win = true) => p.evaluate((w) => {
  window.__fortinoMatch.start = (o) => {
    setTimeout(() => {
      const res = { a: w ? 3 : 0, b: w ? 0 : 2, win: w, quit: false, data: {} };
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
    const D = window.__fortino._dbg, z = window.__borgoApi.TRZ[zid], spec = D.ZONES[zid].spec, m = window.__tr.trMap(z), T = window.T_, st = spec.start, bad = [];
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
  await page.evaluate(() => window.__fortino.open());
  await page.evaluate(() => window.T_.click("Inizia la storia"));
  await L.advance(page);

  const chk = async (n, v, why) => {
    const s = (await info(page)).step[n] || 0;
    if (s !== v) errors.push(why + ": step " + s + " invece di " + v);
  };

  await mockMatch(page, true);
  const zones = {
    1: ["fo_condotti", "fo_quadri"],
    2: ["fo_corridoio", "fo_caveau"],
    3: ["fo_tribuna", "fo_tetti"]
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
  await goEnter("fo_condotti");
  if (w === 390) await L.shot(page, "fo_condotti");

  await L.talk(page, "fo_lupin"); await L.advance(page, [/Seguiamo i condotti/]); await chk(1, 1, "Lupin c1");
  await L.talk(page, "fo_turing"); await L.advance(page); await chk(1, 2, "Daria c1");
  await L.talk(page, "fo_guard1"); await L.advance(page);

  await goEnter("fo_quadri");
  await L.talk(page, "fo_lupin");
  await L.advance(page, [/Avvia Sfida Laser/]);

  {
    const i = await info(page);
    if (!i.done[1] || i.ch !== 2) errors.push("capitolo 1 non concluso: " + JSON.stringify([i.done, i.ch]));
  }

  // Capitolo 2
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 2"));
  await L.advance(page);
  if ((await L.zone(page)) !== "fo_corridoio") errors.push("cap.2 non parte dal corridoio: " + (await L.zone(page)));
  for (const z of zones[2]) {
    const bad = await reach(page, z);
    if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", "));
  }
  await goEnter("fo_corridoio");
  await L.talk(page, "fo_lupin"); await L.advance(page, [/Usa il neutralizzatore/]); await chk(2, 1, "Lupin c2");
  await L.talk(page, "fo_turing"); await L.advance(page); await chk(2, 2, "Daria c2");
  await L.talk(page, "fo_guard2"); await L.advance(page);

  await goEnter("fo_caveau");
  await L.talk(page, "fo_gargoyle");
  await L.advance(page, [/Disattiva il Caveau/]);

  {
    const i = await info(page);
    if (!i.done[2] || i.ch !== 3) errors.push("capitolo 2 non concluso: " + JSON.stringify([i.done, i.ch]));
  }

  // Capitolo 3
  await page.evaluate(() => window.T_.click("Inizia il Capitolo 3"));
  await L.advance(page);
  if ((await L.zone(page)) !== "fo_tribuna") errors.push("cap.3 non parte dalla tribuna: " + (await L.zone(page)));
  for (const z of zones[3]) {
    const bad = await reach(page, z);
    if (bad.length) errors.push(z + " irraggiungibile: " + bad.join(", "));
  }
  await goEnter("fo_tribuna");
  if (w === 390) await L.shot(page, "fo_tribuna");

  await L.talk(page, "fo_lupin"); await L.advance(page, [/Coordinati con Rupi/]); await chk(3, 1, "Lupin c3");
  await L.talk(page, "fo_gargoyle"); await L.advance(page); await chk(3, 2, "Rupi c3");
  await L.talk(page, "fo_turing"); await L.advance(page);

  await goEnter("fo_tetti");
  await L.talk(page, "fo_boss");
  await L.advance(page, [/Sfida Finale a Laser/]);
  await chk(3, 3, "Valori sconfitto");

  // Primo finale (incastro)
  await L.talk(page, "fo_boss");
  await L.advance(page, [/Consegna il dossier/]);
  {
    const i = await info(page);
    if (!i.ends.includes("incastro")) errors.push("finale incastro non registrato: " + JSON.stringify(i.ends));
  }

  // Test tutti e 4 i finali
  const fin = async (kind, pref) => {
    await page.evaluate(([k]) => {
      const K = eval(k);
      K.setStep(3, 3);
      K.F.set("fo_chip_count", 6);
      K.enterZone("fo_tetti");
    }, [K_]);
    await page.waitForTimeout(450);
    await L.talk(page, "fo_boss");
    await L.advance(page, [pref]);
    const i = await info(page);
    if (!i.ends.includes(kind) || i.done[3] !== kind) {
      errors.push("finale " + kind + ": " + JSON.stringify([i.done, i.ends]));
    }
  };

  await fin("incastro", /Consegna il dossier/);
  await fin("popolo", /Lancia il trofeo/);
  await fin("notte", /Svanisci nella notte/);
  await fin("segreto", /sequenza antica 1912/);

  {
    const i = await info(page);
    if (i.ends.length !== 4) errors.push("finali trovati: " + JSON.stringify(i.ends));
  }

  L.check(`Colpo al Fortino · tre capitoli e quattro finali (${w} px)`, errors);
  await browser.close();
}

async function motore() {
  const { browser, page, errors } = await L.setup({ ...MOD });
  const r = await page.evaluate(async () => {
    const out = [];
    for (let k = 0; k < 8; k++) {
      let res = null;
      window.__fortinoMatch.start({
        auto: true,
        targetGoals: 2,
        turns: 5,
        opp: { name: "Ranger", color: "#38bdf8" },
        onDone: (x) => { res = x; }
      });
      for (let i = 0; i < 400 && !res; i++) await new Promise((q) => setTimeout(q, 50));
      out.push(res ? [res.a, res.win] : null);
      if (!res) {
        const st = window.__fortinoMatch.state;
        if (st) st.finish(false);
      }
    }
    return out;
  });
  if (r.some((x) => !x)) errors.push("partita non conclusa: " + JSON.stringify(r));
  const goals = r.filter(Boolean).reduce((n, [a]) => n + a, 0);
  const wins = r.filter((x) => x && x[1]).length;
  if (goals === 0) errors.push("mai un gol in 8 partite: " + JSON.stringify(r));
  console.log("  gol/vittorie Laser & Rimbalzo:", JSON.stringify(r));
  L.check("Laser & Rimbalzo · partite a pilota automatico", errors);
  await browser.close();
}

(async () => {
  await storia(390);
  await motore();
})().catch((e) => {
  console.error("✗ fortino:", e.message);
  process.exit(1);
});
