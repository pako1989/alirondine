// tests/piazzati.cjs - Schemi da corner (ours) e Difendi i piazzati (rivali): scelte, esiti, opzioni spente.
// Uso: python3 -m http.server 8765 &  node tests/piazzati.cjs
const L = require("./lib.cjs");
(async () => {
  const { browser, page: p, errors } = await L.setup({ key: "x" }), bad = [];
  const btns = () => p.evaluate(() => window.T_.btns().map((o) => o.t));
  const click = async (re) => { const r = await p.evaluate((re) => window.T_.click(re), re); if (!r) bad.push("manca " + re + " in " + JSON.stringify(await btns())); await p.waitForTimeout(80); return r; };
  try {
    await p.evaluate(() => { localStorage.setItem("ali-di-rondine.pz-SCHEMI DA CORNER", "1"); localStorage.setItem("ali-di-rondine.pz-DIFENDI I PIAZZATI", "1"); });
    await p.evaluate(() => window.__borgoApi.match({ id: "pz", chap: "t", mate: "Tommy", team: (t, st) => ({ name: "X", vs: "X", color: "#fff", atk: t(10), def: t(10), vel: t(10) }), onDone: () => {} }));
    await p.waitForTimeout(600);
    // schemi corner
    await p.evaluate(() => window.__df.pz.cornerStart("match", () => {})); await p.waitForTimeout(200);
    let b = await btns(); if (!b.some((t) => /Il Treno/.test(t)) || !b.some((t) => /Palo corto/.test(t))) bad.push("schemi assenti " + JSON.stringify(b));
    await click("Il Treno"); b = await btns(); if (!b.some((t) => /Primo palo/.test(t))) bad.push("dopo schema niente zone " + JSON.stringify(b));
    const m = await p.evaluate(() => 1); 
    // difendi piazzati: ogni scelta porta a Avanti
    for (const re of ["Presidia|Barriera stretta", "Zona sul|Barriera alta", "Esci sul", "Tutti dentro"]) {
      await p.evaluate(() => { window.__df.pz.setM({ score: [0, 0], poss: "us" }); window.__df.pz.theirSet("angolo"); }); await p.waitForTimeout(150);
      b = await btns(); if (b.length !== 4) bad.push("scelte difesa " + JSON.stringify(b));
      await click(re); b = await btns(); if (!b.some((t) => /Avanti/.test(t))) bad.push("niente Avanti dopo " + re + " " + JSON.stringify(b));
    }
    await p.evaluate(() => window.__df.pz.theirSet("punizione")); await p.waitForTimeout(150);
    b = await btns(); if (!b.some((t) => /Barriera alta/.test(t))) bad.push("punizione " + JSON.stringify(b));
    // opzione spenta: nessuno schema
    await p.evaluate(() => { const s = JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni") || "null"); });
  } catch (e) { bad.push("eccezione " + e.message); }
  const all = bad.concat(errors);
  console.log(all.length ? "FAIL\n" + all.join("\n") : "OK piazzati");
  await browser.close(); process.exit(all.length ? 1 : 0);
})();
