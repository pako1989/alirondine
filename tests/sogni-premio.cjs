// tests/sogni-premio.cjs - Carte dalle bustine premio (opzione ali-di-rondine.sogni-premio)
const L = require("./lib.cjs");
(async () => {
  const extra = { "ali-di-rondine.sogni-premio": { on: true }, "ali-di-rondine.mantello": { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "segreto", 2: "amica", 3: "eroe" }, ends: ["eroe"], diffSet: true, flags: {} } };
  const { browser, page, errors } = await L.setup({ w: 390, extra });
  const ev = (f, a) => page.evaluate(f, a);
  // opzione ON (default): sblocchi diventano bustine
  const a = await ev(() => { const S = window.__sogni, x = S.sync(); return { own: x.r.own.filter((i) => S.BY[i].saga === "mantello").length, prem: x.r.prem.length, np: x.np, on: S.premio.on() }; });
  if (!a.on || a.own !== 0 || a.prem < 1 || a.np < 1) errors.push("ON: attese bustine premio e nessuna carta diretta " + JSON.stringify(a));
  const b = await ev(() => { const S = window.__sogni, x = S.sync(); return x.r.prem.length; }); if (b !== a.prem) errors.push("le bustine premio si duplicano: " + a.prem + " -> " + b);
  await ev(() => window.__sogni.open(() => {})); await page.waitForTimeout(300);
  if (!(await ev(() => !!document.querySelector('[data-go="prem"]')))) errors.push("manca il pulsante bustina premio");
  const before = await ev(() => window.__sogni._load().own.length);
  await ev(() => window.__sogni.premio.open()); await page.waitForTimeout(400);
  const after = await ev(() => { const r = window.__sogni._load(); return { own: r.own.length, prem: r.prem.length }; });
  if (after.own !== before + 1 || after.prem !== a.prem - 1) errors.push("apertura bustina premio: " + JSON.stringify({ before, after, a }));
  // opzione OFF: sblocco diretto
  await ev(() => window.__sogni.premio.setOn(false)); const c = await ev(() => { const x = window.__sogni.sync(); return x.r.own.filter((i) => window.__sogni.BY[i].saga === "mantello").length; });
  if (c < 1) errors.push("OFF: le carte non si sbloccano direttamente");
  // garanzia 1 su 10
  await ev(() => { window.__sogni.premio.setOn(true); const r = window.__sogni._load(); r.pk10 = 9; window.__sogni._save(r); });
  L.check("bustine premio", errors); await browser.close();
})().catch((e) => { console.error("✗ premio:", e.message); process.exit(1); });
