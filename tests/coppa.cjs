// tests/coppa.cjs - «La Coppa Maledetta»: run intera (5 turni) con partite finte, carte, perdita, vita extra, finali, sfondi.
// Uso: python3 -m http.server 8765 &  node tests/coppa.cjs
const L = require("./lib.cjs");
(async () => {
  const { browser, page: p, errors } = await L.setup({ key: "ali-di-rondine.coppa", extra: { "ali-di-rondine.coppa.opt": { on: true, cut: true } } });
  const bad = [];
  const btns = () => p.evaluate(() => window.T_.btns().map((o) => o.t));
  const click = async (re) => { const r = await p.evaluate((re) => window.T_.click(re), re); if (!r) bad.push("manca " + re + " in " + JSON.stringify(await btns())); await p.waitForTimeout(60); return r; };
  try {
    const ok = await p.evaluate(() => !!window.__coppa && window.__coppa.on());
    if (!ok) bad.push("modulo assente");
    const bgs = await p.evaluate(() => ["cm_cripta", "cm_tabellone", "cm_altare", "cm_campo"].map((k) => !!window.__lbBg.LB[k]));
    if (bgs.includes(false)) bad.push("sfondi non registrati " + bgs);
    await p.evaluate(() => window.__coppa.open()); await p.waitForTimeout(300);
    await click("Nuova run"); await click("Scarpini"); await click("Al primo turno");
    for (let r = 0; r < 5; r++) {
      await p.evaluate(() => { window.__borgoApi.matchPick = (cfg) => { window.__mod = cfg.mod; setTimeout(() => cfg.onDone({ a: 2, b: 0, win: true, recap: "" }), 20); }; });
      await click("^⚽ Gioca"); await p.waitForTimeout(150);
      const m = await p.evaluate(() => window.__mod); if (!m || !m.st) bad.push("mod assente turno " + r);
      if (r < 4) { const b = await btns(); if (!b.some((t) => /Benedizione|Maledizione|Sigillo/.test(t))) bad.push("offerta carte assente " + JSON.stringify(b)); await click("Benedizione|Maledizione|Sigillo"); await click("Avanti"); }
    }
    const b = await btns(); if (!b.some((t) => /Nuova run/.test(t))) bad.push("fine run " + JSON.stringify(b));
    const st = await p.evaluate(() => window.__coppa._dbg.state().M); if (st.wins !== 1 || st.pegni < 6 || !st.ends.length) bad.push("stato dopo vittoria " + JSON.stringify(st));
    // sconfitta
    await click("Nuova run"); await click("Scarpini"); await click("Al primo turno");
    await p.evaluate(() => { window.__borgoApi.matchPick = (cfg) => setTimeout(() => cfg.onDone({ a: 0, b: 1, win: false, recap: "" }), 20); });
    await click("^⚽ Gioca"); await p.waitForTimeout(150);
    const b2 = await btns(); if (!b2.some((t) => /Nuova run/.test(t))) bad.push("sconfitta " + JSON.stringify(b2));
    // modificatori reali sul motore: partita vera con punteggio di partenza e statistiche
    const real = await p.evaluate(() => { const a = window.__borgoApi; let st0; a.match({ id: "t", chap: "t", mate: "Tommy", mod: { st: { tiro: 5 }, score: [1, 0], guts: 2 }, team: (t, st) => { st0 = st.tiro; return { name: "X", vs: "X", color: "#fff", atk: t(10), def: t(10), vel: t(10) }; }, onDone: () => {} }); return { st0, sc: window.__ali && window.__ali.M ? window.__ali.M.score : null }; });
    if (real.st0 == null) bad.push("apiMatch non chiamata");
    console.log("real", JSON.stringify(real));
  } catch (e) { bad.push("eccezione " + e.message); }
  const all = bad.concat(errors);
  console.log(all.length ? "FAIL\n" + all.join("\n") : "OK coppa");
  await browser.close(); process.exit(all.length ? 1 : 0);
})();
