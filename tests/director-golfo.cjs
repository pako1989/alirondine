// tests/director-golfo.cjs - Carriera del Golfo, blocco «Società e storia»: obiettivi, eventi, Coppa, infortuni, rivale,
// epilogo con albo d'oro, rosa che invecchia, episodio Ruspa, esonero, integrazione (Sogni, mazzo, ospite, Salone, opzione).
// Uso: python3 -m http.server 8765 &  node tests/director-golfo.cjs [shots]
const L = require("./lib.cjs");
const KEY = "ali-di-rondine.director-carriera";
const SHOTS = process.argv.includes("shots");
const S = (p) => p.evaluate(() => JSON.parse(JSON.stringify(window.__directorCarriera.state())));
// un passo: dialogo (prima scelta), evento, coppa, partita simulata o fine stagione
async function step(p) {
  return p.evaluate(() => {
    const r = document.querySelector(".car-root"); if (!r) return "chiuso";
    const d = r.querySelector(".car-dlg [data-dlg]"); if (d) { const t = d.textContent; d.click(); return "dlg:" + t.slice(0, 30); }
    for (const id of ["#carGoal", "#carEvent", "#carCupSim", "#carSimMatch", "#carNewSeasonBtn"]) { const b = r.querySelector(id); if (b) { b.click(); return id; } }
    const tab = r.querySelector('[data-tab="ufficio"]'); if (tab) { tab.click(); return "tab"; }
    return "niente";
  });
}
(async () => {
  const { browser, page, errors } = await L.setup({ w: 390, key: KEY, extra: { [KEY + ".opt"]: { on: true, cut: true } } });
  try {
    await page.evaluate(() => window.__directorCarriera.open()); await page.waitForTimeout(300);
    const intro = await page.evaluate(() => !!document.querySelector(".car-dlg .car-dlg-who img"));
    if (!intro) errors.push("intro senza ritratto");
    if (SHOTS) await L.shot(page, "golfo_intro");
    const seen = { cup: 0, ev: 0, dlg: 0, ruspa: 0 }; let seasons = 0, guard = 0;
    while (seasons < 3 && guard++ < 900) {
      const s0 = await S(page);
      if (s0.round === 7 && !s0.flags["t" + s0.season]) await page.evaluate(() => { const S = window.__directorCarriera.state(); S.table.rondine.pts += 50; S.flags["t" + S.season] = 1; }); // promozione sicura
      const a = await step(page); await page.waitForTimeout(25);
      if (a === "#carCupSim") seen.cup++; if (a === "#carEvent") seen.ev++; if (a.startsWith("dlg")) seen.dlg++;
      if (a === "#carNewSeasonBtn") { seasons++; console.log("  fine stagione " + s0.season + " round " + s0.round + " epi " + s0.epi); }
      if (a === "chiuso" || a === "niente") { errors.push("bloccato: " + a); break; }
      if (SHOTS && a === "#carCupSim" && seen.cup === 1) await L.shot(page, "golfo_coppa");
    }
    for (let i = 0; i < 60; i++) { await page.waitForTimeout(120); const st = await S(page), dl = await page.evaluate(() => !!document.querySelector(".car-dlg")); if (st.goal && !dl) break; if (dl || !st.goal) await step(page); }
    const s = await S(page);
    if (s.season !== 4) errors.push("stagione " + s.season + " epi " + s.epi + " round " + s.round + " goal " + !!s.goal + " dlg " + (await page.evaluate(() => (document.querySelector(".car-dlg") || {}).textContent || "-")).slice(0, 200));
    if (s.albo.length !== 3) errors.push("albo " + s.albo.length);
    if (!(s.ends.includes("promoB") && s.ends.includes("promoA") && s.ends.includes("scudetto"))) errors.push("traguardi " + JSON.stringify(s.ends));
    if (!s.squad.some((x) => x.name === "Tito Pulcino")) errors.push("niente Tito Pulcino");
    if (!s.flags.ruspa || !s.flags.ruspaGone) errors.push("episodio Ruspa: " + JSON.stringify(s.flags));
    if (!seen.cup || !seen.ev) errors.push("coppa/eventi mai visti " + JSON.stringify(seen));
    if (!s.goal) errors.push("obiettivo nuova stagione non scelto");
    console.log("  visti: " + JSON.stringify(seen) + " · albo " + JSON.stringify(s.albo));
    if (SHOTS) { await L.shot(page, "golfo_ufficio"); await page.evaluate(() => document.querySelector(".car-content").scrollTo(0, 9999)); await L.shot(page, "golfo_albo"); }
    // esonero: fiducia a zero dopo una sconfitta
    await page.evaluate(() => { const S = window.__directorCarriera.state(); S.presTrust = 0; });
    let eso = false; for (let i = 0; i < 30; i++) { await page.waitForTimeout(60); const t = await page.evaluate(() => (document.querySelector(".car-dlg") || {}).textContent || ""); if (/esonerato/.test(t)) eso = true; const a = await step(page); if (eso && !a.startsWith("dlg")) break; if (eso && a.startsWith("dlg:Aspetti")) { await page.waitForTimeout(60); await step(page); break; } }
    const s2 = await S(page);
    if (!eso || s2.esoneri !== 1 || s2.presTrust !== 45) errors.push("esonero: " + eso + " " + s2.esoneri + " " + s2.presTrust);
    // integrazione
    const integ = await page.evaluate(() => {
      const so = window.__sogni, cards = so.CARDS.filter((c) => c.saga === "golfo").map((c) => c.id);
      const g = window.__borgoGuests.list().find((x) => x.id === "gf_livore"), deck = window.__carteDecks && window.__carteDecks.list ? window.__carteDecks.list().map((d) => d.id) : null;
      return { cards, sal: window.__salone.concluded("ali-di-rondine.director-carriera"), guest: g && g.on, deck: deck ? deck.includes("gdc") : "?", cast: ["gf_livore", "gf_mina", "gf_ruspa", "gf_pulcino", "gf_mister"].every((k) => !!window.__borgoApi.CAST[k]) };
    });
    if (integ.cards.length !== 8) errors.push("carte Sogni " + integ.cards.length);
    if (!integ.sal) errors.push("Salone non conclusa");
    if (!integ.guest) errors.push("ospite Livore spento");
    if (integ.deck === false) errors.push("mazzo mancante");
    if (!integ.cast) errors.push("cast mancante");
    await page.evaluate(() => window.__directorCarriera.close());
    // opzione: menu Partite e modalità
    await page.evaluate(() => window.title()); await page.waitForTimeout(150);
    await page.evaluate(() => window.T_.click("^Partite e modalità")); await page.waitForTimeout(150);
    const has = await page.evaluate(() => window.T_.btns().some((o) => /Carriera del Golfo/.test(o.t)));
    if (!has) errors.push("manca in Partite e modalità");
    await page.evaluate(() => { window.__directorCarriera.setOn(false); window.title(); window.T_.click("^Partite e modalità"); }); await page.waitForTimeout(150);
    if (await page.evaluate(() => window.T_.btns().some((o) => /Carriera del Golfo/.test(o.t)))) errors.push("spenta ma nel menu");
    await page.evaluate(() => window.__directorCarriera.setOn(true));
  } catch (e) { errors.push(e.message.slice(0, 500)); if (SHOTS) await L.shot(page, "golfo_errore"); }
  L.check("Carriera del Golfo · società e storia (390 px)", errors); await browser.close();
})();
