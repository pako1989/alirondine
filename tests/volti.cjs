// tests/volti.cjs - gli stili nuovi dei volti: Flat, 2D HD, Visual novel (disegnati) e Avatar, Lorelei, Avventuriero (DiceBear)
// Ogni personaggio del gioco, con ogni espressione, deve disegnarsi senza errori; gli stili DiceBear caricano la libreria solo quando servono.
const L = require("./lib.cjs");
async function run(w) {
  const { browser, page, errors } = await L.setup({ w });
  if (await page.evaluate(() => !!window.__dicebear)) errors.push("la libreria DiceBear si carica anche se nessuno la usa");
  await page.evaluate(() => window.__faceStyles.preload()); await page.waitForFunction(() => !!window.__dicebear, null, { timeout: 15000 });
  const bad = await page.evaluate(() => {
    const C = window.__borgoApi.CAST, g = document.createElement("canvas").getContext("2d"), out = [], ids = Object.keys(C).filter((id) => C[id] && C[id].skin).slice(0, 70);
    ["flat", "hd", "vn", "db_avataaars", "db_lorelei", "db_adventurer"].forEach((st) => ids.forEach((id) => [null, "smile", "grin", "sad", "angry", "wow", "sly", "think", "blink"].forEach((e) => { try { if (!window.__faceStyles.draw(st, g, id, C[id], e)) out.push(st + ":" + id + ":" + e); } catch (er) { out.push(st + ":" + id + " " + er.message); } })));
    return [ids.length, out.slice(0, 8)];
  });
  if (bad[0] < 50) errors.push("pochi personaggi: " + bad[0]); if (bad[1].length) errors.push("volti non disegnati: " + bad[1].join(", "));
  // il ciclo delle Impostazioni passa per tutti gli stili nuovi
  const seen = await page.evaluate(() => { const s = []; for (let i = 0; i < 15 && window.cycleFaces; i++) { window.cycleFaces(); s.push(JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni") || "{}").faces); } return s.join(); });
  ["flat", "hd", "vn", "db_avataaars", "db_lorelei", "db_adventurer"].forEach((k) => { if (seen && !seen.includes(k)) errors.push("lo stile " + k + " manca nel ciclo: " + seen); });
  L.check(`Stili dei volti nuovi (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); })().catch((e) => { console.error("✗ volti:", e.message); process.exit(1); });
