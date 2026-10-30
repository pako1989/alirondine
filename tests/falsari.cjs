// tests/falsari.cjs — «I Falsari della Coppa» · Test di Capitolo 1
// Verifica: zone 2D raggiungibili (reachAll), sfondi fa_* con 3 hotspot,
// Banco del Falsario (calco in cera), dialoghi con Valerio, Arturo, Gina e De Santis,
// e avanzamento fluido fino a fine capitolo a 390 e 320 px senza errori in console.
const L = require("./lib.cjs");
const MOD = { mod: "__falsari", key: "ali-di-rondine.falsari" };

(async () => {
  for (const w of [390, 320]) {
    const { browser, page, errors } = await L.setup({ w, ...MOD });

    try {
      // 1. Verifica caricamento del modulo saga
      const hasSaga = await page.evaluate(() => !!(window.__falsari && window.__falsariCore && window.__falsariBanco));
      if (!hasSaga) errors.push("Moduli __falsari o __falsariBanco non caricati correttamente");

      // 2. Verifica sfondi e hotspot
      const bgs = await page.evaluate(() => {
        const B = window.__lbBg && window.__lbBg.LB;
        if (!B) return [];
        return ["fa_titolo", "fa_bottega_bg", "fa_trofei_bg"].filter((k) => !B[k] || !B[k].hot || B[k].hot.length < 3);
      });
      if (bgs.length) errors.push("Sfondi o hotspot mancanti: " + bgs.join(", "));

      // 3. Avvio nuova partita: apri capitolo 1
      await page.evaluate(() => window.__falsari.open());
      await page.waitForTimeout(400);

      // Premi Inizia / Difficoltà / Continua
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(350);
        const onMap = await page.evaluate(() => document.body.classList.contains("borgo") && !!(window.__ali && window.__ali.view && window.__ali.view.kind === "trasf"));
        if (onMap) break;
        const b = await page.evaluate(() => {
          const btns = [...document.querySelectorAll("#choices button")].filter((x) => x.offsetParent);
          const p = btns.find((x) => /Continua ▸|^Inizia|^Normale|^Storia/.test(x.innerText));
          if (p) { p.click(); return true; }
          return false;
        });
        if (!b) await page.waitForTimeout(200);
      }

      // Verifica che siamo sulla mappa fa_piazza
      const curZone = await page.evaluate(() => window.__falsariCore.K.api.trZone());
      if (curZone !== "fa_piazza") errors.push("Zona iniziale errata: attesa fa_piazza, trovata " + curZone);

      // 4. ReachAll su fa_piazza
      const unreachPiazza = await L.reachAll(page, "fa_piazza");
      if (unreachPiazza && unreachPiazza.length) errors.push("Tile non raggiungibili in fa_piazza: " + unreachPiazza.join(", "));

      // 5. Parla con Valerio allo step 0
      await L.talk(page, "fc_valerio");
      await L.advance(page, ["Cosa possiamo fare", "difendiamo"]);
      await page.waitForTimeout(300);

      // Step dovrebbe essere 1
      const s1 = await page.evaluate(() => window.__falsariCore.K.stepOf(1));
      if (s1 !== 1) errors.push("Step dopo Valerio atteso 1, trovato " + s1);

      // 6. Entra nella Bottega Silvestri
      await page.evaluate(() => window.__falsariCore.K.go("fa_bottega", 8, 11));
      await page.waitForTimeout(400);

      // ReachAll su fa_bottega
      const unreachBottega = await L.reachAll(page, "fa_bottega");
      if (unreachBottega && unreachBottega.length) errors.push("Tile non raggiungibili in fa_bottega: " + unreachBottega.join(", "));

      // Parla con Arturo Silvestri
      await L.talk(page, "fc_arturo");
      await L.advance(page);
      await page.waitForTimeout(300);

      // Raccogli l'oggetto sotto l'asse (fa_lente)
      await page.evaluate(() => {
        window.__falsariCore.K.inv.give("fa_lente", 1);
        window.__falsariCore.K.inv.give("fa_calibro", 1);
      });
      await page.waitForTimeout(200);

      // 7. Torna in piazza e parla con Gina al Bar Centrale
      await page.evaluate(() => window.__falsariCore.K.go("fa_piazza", 8, 9));
      await page.waitForTimeout(400);

      await L.talk(page, "fc_gina");
      await L.advance(page, ["prometto", "lezione"]);
      await page.waitForTimeout(300);

      // 8. Entra nella Sala dei Trofei del Palazzo Municipale
      await page.evaluate(() => window.__falsariCore.K.go("fa_sala_trofei", 7, 11));
      await page.waitForTimeout(400);

      // ReachAll su fa_sala_trofei
      const unreachTrofei = await L.reachAll(page, "fa_sala_trofei");
      if (unreachTrofei && unreachTrofei.length) errors.push("Tile non raggiungibili in fa_sala_trofei: " + unreachTrofei.join(", "));

      // Ispeziona la teca (azione T)
      await page.evaluate(() => {
        const dbg = window.__falsari._dbg;
        const ch = dbg && dbg.CHAPTERS && dbg.CHAPTERS[1];
        if (ch && ch.obj && ch.obj["fa_sala_trofei:T"]) {
          ch.obj["fa_sala_trofei:T"]();
        }
      });
      await page.waitForTimeout(400);

      // Il minigioco Banco del Falsario è aperto: convalida il calco
      const isBancoOpen = await page.evaluate(() => window.__falsariBanco.state.open);
      if (!isBancoOpen) errors.push("Il minigioco Banco del Falsario non si è aperto");

      await page.evaluate(() => window.__falsariBanco.finishTest(true));
      await page.waitForTimeout(300);
      await L.advance(page);
      await page.waitForTimeout(300);

      // Step dovrebbe essere 4 (De Santis è entrato)
      const s4 = await page.evaluate(() => window.__falsariCore.K.stepOf(1));
      if (s4 !== 4) errors.push("Step dopo il calco atteso 4, trovato " + s4);

      // Confronto con De Santis
      await L.talk(page, "fc_desantis");
      await L.advance(page, ["Integrità", "Furbizia", "perito", "verità"]);
      await page.waitForTimeout(300);

      // Step 5: Torna alla Bottega da Arturo per concludere il capitolo
      await page.evaluate(() => window.__falsariCore.K.go("fa_bottega", 8, 11));
      await page.waitForTimeout(400);

      await L.talk(page, "fc_arturo");
      await L.advance(page, ["Mostra il calco", "Mostra", "Ecco l'impronta"]);
      await page.waitForTimeout(400);

      // Avanza lungo le scene finali
      await L.advance(page);
      await page.waitForTimeout(400);

      // Verifica completamento capitolo 1
      const isDone = await page.evaluate(() => window.__falsariCore.K.F.get("fa_c1_done"));
      if (!isDone) errors.push("Capitolo 1 non risulta concluso (fa_c1_done false)");

    } catch (e) {
      errors.push("Errore esecuzione test: " + e.message);
    }

    L.check(`I Falsari della Coppa · Capitolo 1 a ${w} px`, errors);
    await browser.close();
  }
})().catch((e) => {
  console.error("✗ falsari:", e.message);
  process.exit(1);
});
