// tests/album.cjs - l'Album dei personaggi (Salone delle Saghe): sezioni, carte incontrate e sagome, carte d'oro, scheda
const L = require("./lib.cjs");
async function album(w) {
  const { browser, page, errors } = await L.setup({ w, key: "ali-di-rondine.album", save: ["nico", "sara", "tommy", "so_gru", "so_blop", "so_arbi", "ep_ada"],
    extra: { "ali-di-rondine.spazio": { v: 1, ch: 3, step: { 1: 5, 2: 7, 3: 5 }, done: { 1: "festa", 2: "segreto", 3: "casa" }, ends: ["casa"] } } });
  const st = await page.evaluate(() => window.__salone.personaggiStato()); if (!st || st.tot < 300 || st.seen !== 7) errors.push("conteggio sbagliato: " + JSON.stringify(st));
  if (!st || st.gold < 1) errors.push("la saga conclusa non ha le carte d'oro");
  await page.evaluate(() => window.__salone.personaggi(() => {})); await page.waitForTimeout(300);
  if (w === 390) await L.shot(page, "album_indice");
  await page.evaluate(() => document.querySelector('[data-sec="spazio"]').click()); await page.waitForTimeout(900);
  const n = await page.evaluate(() => [document.querySelectorAll(".pc").length, document.querySelectorAll(".pc.gold").length, document.querySelectorAll(".pc.miss").length, [...document.querySelectorAll(".pc img")].filter((i) => i.src.startsWith("data:")).length]);
  if (n[0] < 10 || n[1] !== 3 || n[3] < n[0]) errors.push("griglia di Calcio Spaziale sbagliata: " + JSON.stringify(n));
  if (w === 390) await L.shot(page, "album_spazio");
  await page.evaluate(() => document.querySelector('[data-pid="so_gru"]').click()); await page.waitForTimeout(400);
  const t = await page.evaluate(() => document.querySelector(".sheet h3").textContent); if (!/Gru/.test(t)) errors.push("scheda sbagliata: " + t);
  if (w === 390) await L.shot(page, "album_carta");
  await page.evaluate(() => document.querySelector(".sheet [data-x]").click()); await page.evaluate(() => document.querySelector(".pc.miss").click()); await page.waitForTimeout(300);
  const t2 = await page.evaluate(() => document.querySelector(".sheet h3").textContent); if (t2 !== "???") errors.push("una carta non incontrata mostra il nome: " + t2);
  if (w === 390) await L.shot(page, "album_sagoma");
  // da Altro → Collezioni → Carte dei personaggi si arriva al nuovo album
  await page.evaluate(() => window.__salone.close()); await page.evaluate(() => window.T_.click("^Altro")); await page.waitForTimeout(300); await page.evaluate(() => window.T_.click("^Collezioni")); await page.waitForTimeout(300);
  await page.evaluate(() => window.T_.click("^Carte dei personaggi")); await page.waitForTimeout(300);
  if (!(await page.evaluate(() => !!document.querySelector(".salOv h2") && /personaggi/.test(document.querySelector(".salOv h2").textContent)))) errors.push("da Collezioni non si apre il nuovo album");
  L.check(`Album dei personaggi (${w} px)`, errors); await browser.close();
}
(async () => { await album(390); await album(320); })().catch((e) => { console.error("✗ album:", e.message); process.exit(1); });
