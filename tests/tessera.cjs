// tests/tessera.cjs - Tessera del Borgo, Modalità foto, Home che cambia (blocco 1, 4 nov 2026)
const L = require("./lib.cjs");
(async () => {
  const { browser, page: p, errors } = await L.setup({ w: 390, h: 800, key: "ali-di-rondine.tessera", save: { cut: true } });
  const B = () => p.evaluate(() => window.T_.btns().map((o) => o.t));
  try {
    await p.evaluate(() => window.__ali.title && window.__ali.title()); await p.waitForTimeout(800);
    if (!(await B()).some((t) => /Tessera del Borgo/.test(t))) errors.push("home senza Tessera");
    if (!(await p.$("#tesCam"))) errors.push("linguetta foto assente");
    // home che cambia: saga più recente → copertina + ospite
    await p.evaluate(() => window.__tessera.mark("saga", "tifosi")); await p.waitForTimeout(1500);
    const hv = await p.evaluate(() => { const h = window.__tessera.home(); return h && { kind: h.kind, t: h.t, img: !!h.img, guest: h.guest }; });
    if (!hv || hv.kind !== "saga" || !hv.img) errors.push("home saga: " + JSON.stringify(hv));
    console.log("home saga", JSON.stringify(hv));
    await L.shot(p, "tessera_home_saga");
    await p.evaluate(() => window.__tessera.mark("storia", { chap: "Prologo · Borgo Marino", scene: "beach" })); await p.waitForTimeout(600);
    const hs = await p.evaluate(() => window.__tessera.home().kind); if (hs !== "storia") errors.push("home storia: " + hs);
    await L.shot(p, "tessera_home_storia");
    // tessera
    await p.evaluate(() => window.T_.click("Tessera del Borgo")); await p.waitForTimeout(1500);
    const src = await p.evaluate(() => { const i = document.querySelector("#tesOv .pv"); return i ? i.src.length : 0; });
    if (src < 5000) errors.push("tessera immagine vuota " + src);
    if ((await p.$$("#tesOv [data-t]")).length < 5) errors.push("titoli mancanti");
    if ((await p.$$("#tesOv [data-f]")).length < 2) errors.push("preferiti mancanti");
    await L.shot(p, "tessera_card");
    await p.click("#tesOv .x"); await p.waitForTimeout(400);
    // foto
    await p.click("#tesCam"); await p.waitForTimeout(800);
    if (!(await p.$("#tesOv .pv"))) errors.push("foto non aperta");
    for (const fr of ["figurina", "giornale", "cinema", "cartolina", "polaroid"]) { await p.click(`#tesOv [data-g=fr] [data-v=${fr}]`); await p.waitForTimeout(150); }
    await p.click("#tesOv [data-g=fi] [data-v=seppia]"); await p.fill("#tesOv input", "Gol all'ultimo"); await p.waitForTimeout(600);
    await L.shot(p, "tessera_foto");
    await p.click("#tesOv [data-k=again]"); await p.waitForTimeout(300);
    // impostazioni: spegnere tutto
    await p.evaluate(() => { ["tessera", "foto", "home"].forEach((k) => window.__tessera.setOn(k, false)); });
    await p.evaluate(() => window.__ali.title()); await p.waitForTimeout(400);
    if ((await B()).some((t) => /Tessera del Borgo/.test(t))) errors.push("Tessera spenta ma visibile");
    if (await p.$("#tesCam")) errors.push("linguetta spenta ma visibile");
    if (await p.evaluate(() => window.__tessera.home())) errors.push("home spenta ma attiva");
  } catch (e) { errors.push("eccezione: " + e.message); }
  await browser.close();
  if (errors.length) { console.log("FALLITO\n" + errors.join("\n")); process.exit(1); }
  console.log("OK tessera");
})();
