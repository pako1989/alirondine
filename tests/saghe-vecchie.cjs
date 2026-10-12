// tests/saghe-vecchie.cjs - le saghe più vecchie (quelle senza un test proprio): ognuna si apre, il capitolo 1 parte,
// l'introduzione scorre fino a quando si cammina, e l'elenco dei finali è completo (titolo e descrizione). Nessun errore in console.
const L = require("./lib.cjs");
const SAGHE = [["__abissoStory", "ali-di-rondine.abisso"], ["__alchimiaStory", "ali-di-rondine.alchimia"], ["__belovodiaStory", "ali-di-rondine.belovodia"], ["__bilanciaFeudi", "ali-di-rondine.bilancia"],
  ["__campioneOmbre", "ali-di-rondine.ombre"], ["__chronoStory", "ali-di-rondine.chrono"], ["__cristalli", "ali-di-rondine.cristalli"], ["__doppioTurno", "ali-di-rondine.doppio-turno"],
  ["__kronenburgStory", "ali-di-rondine.kronenburg"], ["__libroFinali", "ali-di-rondine.libro-finali"], ["__muro", "ali-di-rondine.muro"], ["__phantomGenesis", "ali-di-rondine.phantom"],
  ["__piratiStory", "ali-di-rondine.pirati"], ["__ragnarokStory", "ali-di-rondine.ragnarok"], ["__shogunStory", "ali-di-rondine.shogun"], ["__storiaCampione", "ali-di-rondine.storia-campione"]];
async function saga(mod, w) {
  const { browser, page, errors } = await L.setup({ w });
  const ok = await page.evaluate((m) => !!(window[m] && window[m].open), mod); if (!ok) { errors.push("saga non caricata"); L.check(`${mod} (${w} px)`, errors); return browser.close(); }
  await page.evaluate((m) => window[m].open(() => {}), mod); await page.waitForTimeout(500);
  const started = await page.evaluate(() => window.T_.click("Inizia la storia|^Inizia|Capitolo 1|^Continua|Nuova partita|^Gioca|Entra nel|Attiva la|^Comincia|^Avvia"));
  if (!started) errors.push("nessun pulsante per cominciare: " + (await page.evaluate(() => window.T_.btns().map((b) => b.t).join(" | "))));
  else { try { await L.advance(page, ["^Normale", "^Storia", "Entra nel", "^Avanti", "^Prosegui"], 400); } catch (e) { errors.push("l'introduzione si blocca: " + e.message.slice(0, 160)); } }
  const ends = await page.evaluate((m) => { try { return (window[m].endings ? window[m].endings() : null); } catch (e) { return "ERR " + e.message; } }, mod);
  if (typeof ends === "string") errors.push("elenco dei finali: " + ends);
  else if (Array.isArray(ends)) { if (ends.length < 2) errors.push("finali: " + ends.length); const bad = ends.filter((e) => !e.title || !(e.desc || e.d)); if (bad.length) errors.push("finali senza titolo o descrizione: " + bad.map((e) => e.id).join(",")); }
  L.check(`${mod}: si apre, il capitolo 1 parte, ${Array.isArray(ends) ? ends.length + " finali" : "finali"} (${w} px)`, errors); await browser.close();
}
(async () => { for (const [m] of SAGHE) await saga(m, 390); })().catch((e) => { console.error("✗ saghe-vecchie:", e.message); process.exit(1); });
