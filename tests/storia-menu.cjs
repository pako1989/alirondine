// tests/storia-menu.cjs - menu Storia ordinato (Stagioni/Compagni/Archivio) e «Nelle puntate precedenti»
const L = require("./lib.cjs");
(async () => {
  const S1 = { step: 0, season: 1, lv: 3, st: { tiro: 25, drib: 21, pass: 18, contr: 15, grinta: 130 }, f: { end: "amara", deal: "rifiutato", coach: "privato", kenji: "piano", nico: "semplice", final: "serio" } };
  const { browser, page: p, errors } = await L.setup({ w: 390, h: 800, key: "ali-di-rondine.stagione1", save: S1 });
  const B = () => p.evaluate(() => window.T_.btns().map((o) => o.t));
  const click = async (re) => { const r = await p.evaluate((re) => window.T_.click(re), re); if (!r) errors.push("manca pulsante " + re + " in " + JSON.stringify(await B())); await p.waitForTimeout(1500); return r; };
  try {
    await p.evaluate(() => window.__ali.title && window.__ali.title()); await p.waitForTimeout(800); await click("^Storia");
    let b = await B();
    for (const re of [/Stagioni/, /Compagni/, /Archivio/]) if (!b.some((t) => re.test(t))) errors.push("top senza " + re + ": " + JSON.stringify(b));
    if (b.some((t) => /Noir|Multiverso|Faro|Traversata|Leggenda del Tuo/.test(t))) errors.push("voci tolte ancora presenti");
    await L.shot(p, "storia_top");
    await click("Archivio"); b = await B(); if (!b.some((t) => /Diario di Leo/.test(t)) || !b.some((t) => /Mappa temporale/.test(t))) errors.push("archivio: " + JSON.stringify(b));
    await click("◂ Storia"); await click("Compagni"); b = await B(); if (!b.some((t) => /Squadra/.test(t)) || b.some((t) => /^Stagione/.test(t))) errors.push("compagni: " + JSON.stringify(b));
    await L.shot(p, "storia_compagni");
    await click("◂ Storia"); await click("Stagioni"); b = await B(); if (!b.some((t) => /Stagione 2/.test(t)) || !b.some((t) => /Nuova partita/.test(t))) errors.push("stagioni: " + JSON.stringify(b));
    await click("^Stagione 2"); await p.waitForTimeout(600);
    const tx = await p.evaluate(() => document.body.innerText);
    if (!/Nelle puntate precedenti/.test(tx)) errors.push("recap S2 assente");
    await L.shot(p, "storia_recap");
  } catch (e) { errors.push("eccezione: " + e.message); }
  await browser.close();
  if (errors.length) { console.log("FALLITO\n" + errors.join("\n")); process.exit(1); }
  console.log("OK storia-menu");
})();
