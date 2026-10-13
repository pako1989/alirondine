// tests/volti.cjs - gli stili nuovi dei volti: Flat, 2D HD (disegnati) e Toon Head (DiceBear)
// Ogni personaggio del gioco, con ogni espressione, deve disegnarsi senza errori; gli stili DiceBear caricano la libreria solo quando servono.
const L = require("./lib.cjs");
async function run(w) {
  const { browser, page, errors } = await L.setup({ w });
  if (await page.evaluate(() => !!window.__dicebear)) errors.push("la libreria DiceBear si carica anche se nessuno la usa");
  await page.evaluate(() => window.__faceStyles.preload()); await page.waitForFunction(() => !!window.__dicebear, null, { timeout: 15000 });
  const bad = await page.evaluate(() => {
    const C = window.__borgoApi.CAST, g = document.createElement("canvas").getContext("2d"), out = [], ids = Object.keys(C).filter((id) => C[id] && C[id].skin).slice(0, 70);
    ["flat", "hd", "db_toonhead"].forEach((st) => ids.forEach((id) => [null, "smile", "grin", "sad", "angry", "wow", "sly", "think", "blink"].forEach((e) => { try { if (!window.__faceStyles.draw(st, g, id, C[id], e)) out.push(st + ":" + id + ":" + e); } catch (er) { out.push(st + ":" + id + " " + er.message); } })));
    return [ids.length, out.slice(0, 8)];
  });
  if (bad[0] < 50) errors.push("pochi personaggi: " + bad[0]); if (bad[1].length) errors.push("volti non disegnati: " + bad[1].join(", "));
  // il ciclo delle Impostazioni passa per tutti gli stili nuovi
  const seen = await page.evaluate(() => { const s = []; for (let i = 0; i < 15 && window.cycleFaces; i++) { window.cycleFaces(); s.push(JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni") || "{}").faces); } return s.join(); });
  ["flat", "hd", "db_toonhead"].forEach((k) => { if (seen && !seen.includes(k)) errors.push("lo stile " + k + " manca nel ciclo: " + seen); });
  L.check(`Stili dei volti nuovi (${w} px)`, errors); await browser.close();
}
// le acconciature: 18 nel gioco (8 libere in più, 10 delle saghe) disegnate in tutti gli stili; finire una saga sblocca la sua
async function capelli(w) {
  const fin = { v: 1, ch: 3, step: {}, done: { 1: "a", 2: "b", 3: "c" }, ends: ["trono"], diffSet: true, flags: {} };
  const { browser, page, errors } = await L.setup({ w, extra: { "ali-di-rondine.trono": fin, "ali-di-rondine.lampioni": fin } });
  const own = await page.evaluate(() => window.__borgoApi.cosOwned()); ["hs_sidebraid", "hs_spacebuns"].forEach((k) => { if (!own.includes(k)) errors.push("acconciatura non sbloccata: " + k); }); if (own.includes("hs_afro")) errors.push("afro sbloccato senza aver finito la saga");
  await page.evaluate(() => window.__faceStyles.preload()); await page.waitForFunction(() => !!window.__dicebear, null, { timeout: 15000 });
  const bad = await page.evaluate(() => {
    const API = window.__borgoApi, out = [], g = document.createElement("canvas").getContext("2d");
    ["bob", "ponytail", "twintails", "braids", "curly", "side", "ordinato", "bandana", "afro", "dread", "undercut", "pompadour", "mullet", "wavy", "messybun", "topknot", "sidebraid", "spacebuns", "corona", "ciuffo", "cometa", "scodella", "antenne", "criniera"].forEach((st) => {
      const id = "t_" + st, c = { name: "x", tag: "", skin: "#e0ac7e", hair: "#2b1d14", eye: "#222", style: st, shirt: "#3f5fbf", bg: ["#123", "#fff"] }; API.CAST[id] = c;
      try { API.portraitTo(g, id, 50, 50, 1); } catch (e) { out.push("classico:" + st); }
      ["anime", "manga", "acquerello", "pixel", "flat", "hd", "db_toonhead"].forEach((sy) => { try { if (!window.__faceStyles.draw(sy, g, id, c, "smile")) out.push(sy + ":" + st); } catch (e) { out.push(sy + ":" + st + " " + e.message); } });
    });
    return out.slice(0, 8);
  });
  if (bad.length) errors.push("acconciature non disegnate: " + bad.join(", "));
  L.check(`Acconciature nuove e sblocchi dalle saghe (${w} px)`, errors); await browser.close();
}
(async () => { await run(390); await run(320); await capelli(390); })().catch((e) => { console.error("✗ volti:", e.message); process.exit(1); });
