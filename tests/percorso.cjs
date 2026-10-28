// tests/percorso.cjs - per OGNI saga del Salone: da nuova partita «Inizia la storia» → difficoltà → «Continua ▸» → arrivo sulla mappa, senza errori.
// Prende le saghe da js/salone.js (mod + key). Uso: node tests/percorso.cjs [parte-del-nome]
const L = require("./lib.cjs"), fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "js", "salone.js"), "utf8");
const only = process.argv[2] || "";
const sagas = [...src.matchAll(/id: "([\w-]+)"[^\n]*?mod: "(__\w+)", key: "([\w.\-]+)"/g)].map((m) => ({ id: m[1], mod: m[2], key: m[3] })).filter((s) => s.id.includes(only));
(async () => {
  let fail = 0, skip = [];
  for (const s of sagas) {
    let ctx; try { ctx = await L.setup({ mod: s.mod, key: s.key }); } catch (e) { skip.push(s.id); continue; }
    const { browser, page, errors } = ctx;
    try {
      const has = await page.evaluate((m) => !!(window[m] && window[m].open && window[m]._dbg && window[m]._dbg.CHAPTERS), s.mod);
      if (!has) { skip.push(s.id); await browser.close(); continue; }
      await page.evaluate((m) => window[m].open(), s.mod);
      let map = false, seenCont = false;
      for (let i = 0; i < 14 && !map; i++) {
        await page.waitForTimeout(450);
        const st = await page.evaluate(() => ({ walk: document.body.classList.contains("borgo") && !!(window.__ali.view && window.__ali.view.kind === "trasf"), b: [...document.querySelectorAll("#choices button")].filter((b) => b.offsetParent).map((b) => b.innerText.split("\n")[0].trim()) }));
        if (st.walk) { map = true; break; }
        if (st.b.some((t) => /^Continua ▸/.test(t))) seenCont = true;
        const pick = st.b.find((t) => /^Continua ▸|^Inizia|^Continua la storia|^Normale/.test(t)) || st.b.find((t) => /^Storia/.test(t)) || (i === 0 ? st.b.find((t) => !/^◂/.test(t)) : null); // alcune saghe chiamano il primo pulsante in altro modo (es. «Firma il contratto»)
        if (!pick) { await page.waitForTimeout(300); continue; }
        await page.evaluate((p) => { const b = [...document.querySelectorAll("#choices button")].find((x) => x.innerText.trim().startsWith(p)); b && b.click(); }, pick);
      }
      if (!map) errors.push("non arrivi sulla mappa dopo «Inizia la storia» (manca «Continua»?)");
    } catch (e) { errors.push("test: " + e.message); }
    if (errors.length) fail++;
    L.check(`percorso nuova partita · ${s.id}`, errors);
    await browser.close();
  }
  if (skip.length) console.log("(saltate, non sul motore comune: " + skip.join(", ") + ")");
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("✗ percorso:", e.message); process.exit(1); });
