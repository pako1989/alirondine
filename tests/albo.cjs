// tests/albo.cjs - L'Albo dei Sogni (js/sogni-albo.js): opzione, viste, percentuali, sagome senza nome, premi estetici
const L = require("./lib.cjs");
(async () => {
  const { browser, page, errors } = await L.setup({ w: 390 });
  const ev = (f, a) => page.evaluate(f, a);
  const off = await ev(() => window.__albo.on()); if (off) errors.push("l'Albo deve essere spento di base");
  await ev(() => window.__sogni.open(() => {})); await page.waitForTimeout(200);
  if (await ev(() => !!document.querySelector('[data-go="albo"]'))) errors.push("pulsante Albo visibile con opzione spenta");
  const first = await ev(() => window.__albo.setOn(true)); if (!first) errors.push("prima accensione: atteso cut-in");
  if (await ev(() => window.__albo.setOn(true))) errors.push("cut-in ripetuto");
  // 30% delle carte possedute
  const n = await ev(() => { const S = window.__sogni, r = S._load(), ids = S.CARDS.map((c) => c.id); r.own = ids.slice(0, Math.ceil(ids.length * 0.3)); S._save(r); return ids.length; });
  await ev(() => window.__sogni.open(() => {})); await page.waitForTimeout(200);
  if (!(await ev(() => !!document.querySelector('[data-go="albo"]')))) errors.push("manca il pulsante Albo");
  await ev(() => document.querySelector('[data-go="albo"]').click()); await page.waitForTimeout(300);
  const t = await ev(() => document.querySelector(".alboTot").innerText);
  if (!/Albo completato: 30%/.test(t)) errors.push("percentuale totale: " + t);
  for (const v of ["saga", "tema", "rar"]) {
    await ev((v) => document.querySelector(`.alboTabs [data-v="${v}"]`).click(), v);
    const g = await ev(() => document.querySelectorAll(".alboGrp").length); if (!g) errors.push("vista " + v + " vuota");
    await ev(() => document.querySelectorAll(".alboGrp>button").forEach((b, i) => i < 8 && b.click()));
  }
  await ev(() => document.querySelector('.alboTabs [data-v="saga"]').click());
  await ev(() => { let b; while ((b = document.querySelector('.alboGrp>button[aria-expanded="false"]'))) b.click(); });
  const lk = await ev(() => { const L = [...document.querySelectorAll(".alboC.lock")]; return { n: L.length, named: L.filter((x) => !/\? \? \?/.test(x.querySelector(".n").innerText)).length, hint: L.filter((x) => !x.querySelector(".h") || !x.querySelector(".h").innerText.trim()).length }; });
  if (!lk.n || lk.named || lk.hint) errors.push("sagome: " + JSON.stringify(lk));
  const tot = await ev(() => document.querySelectorAll(".alboC").length); if (tot !== n) errors.push(`carte nell'Albo ${tot} != ${n}`);
  // premi: al 30% bronzo, piazza, zucchero
  const u = await ev(() => window.__albo.unlocked()); ["frame:bronzo", "title:piazza", "bg:zucchero"].forEach((k) => { if (!u.includes(k)) errors.push("premio mancante " + k); });
  if (u.includes("frame:argento")) errors.push("argento troppo presto");
  await ev(() => document.querySelector('.alboTabs [data-v="prem"]').click());
  await ev(() => document.querySelector('[data-eq="frame:bronzo"]').click());
  await ev(() => document.querySelector('[data-eq="title:piazza"]').click());
  await ev(() => { document.querySelector(".alboOv .x").click(); }); await page.waitForTimeout(300);
  const sk = await ev(() => ({ f: !!document.querySelector(".sgOv.alboF-bronzo"), t: !!document.querySelector(".sgOv .alboTitle") }));
  if (!sk.f || !sk.t) errors.push("estetica non applicata " + JSON.stringify(sk));
  // la forza non cambia con i premi
  const f1 = await ev(() => window.__sogni.forza(window.__sogni._load().team)); await ev(() => window.__albo.setOn(false)); const f2 = await ev(() => window.__sogni.forza(window.__sogni._load().team));
  if (f1 !== f2) errors.push("i premi cambiano la forza");
  await page.screenshot({ path: L.OUT ? L.OUT + "/albo.png" : "tests/shots/albo.png" }).catch(() => {});
  L.check("albo dei sogni", errors); await browser.close();
})().catch((e) => { console.error("✗ albo:", e.message); process.exit(1); });
