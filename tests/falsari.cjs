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
        return ["fa_titolo", "fa_bottega_bg", "fa_trofei_bg", "fa_molo_bg", "fa_fonderia_bg"].filter((k) => !B[k] || !B[k].hot || B[k].hot.length < 3);
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

      // 9. Avvio Capitolo 2
      await page.evaluate(() => window.__falsari.open());
      await page.waitForTimeout(400);

      for (let i = 0; i < 8; i++) {
        await page.waitForTimeout(300);
        const onMap = await page.evaluate(() => document.body.classList.contains("borgo") && window.__falsariCore.K.api.trZone() === "fa_molo");
        if (onMap) break;
        await page.evaluate(() => {
          const btns = [...document.querySelectorAll("#choices button")].filter((x) => x.offsetParent);
          const p = btns.find((x) => /Continua ▸|^Inizia il Capitolo 2|^Inizia|^Continua/.test(x.innerText));
          if (p) p.click();
        });
      }
      await page.waitForTimeout(300);

      // ReachAll su fa_molo
      const unreachMolo = await L.reachAll(page, "fa_molo");
      if (unreachMolo && unreachMolo.length) errors.push("Tile non raggiungibili in fa_molo: " + unreachMolo.join(", "));

      // Parla con Valerio al molo (step 0 -> 1)
      await L.talk(page, "fc_valerio");
      await L.advance(page, ["fiducia", "onore", "compravendita"]);
      await page.waitForTimeout(300);

      // Entra nell'Osteria «La Prua d'Oro»
      await page.evaluate(() => window.__falsariCore.K.go("fa_osteria", 7, 11));
      await page.waitForTimeout(300);
      const unreachOsteria = await L.reachAll(page, "fa_osteria");
      if (unreachOsteria && unreachOsteria.length) errors.push("Tile non raggiungibili in fa_osteria: " + unreachOsteria.join(", "));

      // Parla con Oste Nino (step 1 -> 2)
      await L.talk(page, "fc_nino");
      await L.advance(page, ["salvezza", "metallo"]);
      await page.waitForTimeout(300);

      // Entra nella Fonderia Clandestina
      await page.evaluate(() => window.__falsariCore.K.go("fa_fonderia", 8, 12));
      await page.waitForTimeout(300);
      const unreachFonderia = await L.reachAll(page, "fa_fonderia");
      if (unreachFonderia && unreachFonderia.length) errors.push("Tile non raggiungibili in fa_fonderia: " + unreachFonderia.join(", "));

      // Parla con Mastro Tullio (step 2 -> 3)
      await L.talk(page, "fc_tullio");
      await L.advance(page);
      await page.waitForTimeout(300);

      // Fruga nella cassa dei rottami (C) per prendere il lingotto
      await page.evaluate(() => {
        const dbg = window.__falsari._dbg;
        const ch = dbg && dbg.CHAPTERS && dbg.CHAPTERS[2];
        if (ch && ch.obj && ch.obj["fa_fonderia:C"]) ch.obj["fa_fonderia:C"]();
      });
      await page.waitForTimeout(300);
      await L.advance(page);

      // Attiva il forno a riverbero (F)
      await page.evaluate(() => {
        const dbg = window.__falsari._dbg;
        const ch = dbg && dbg.CHAPTERS && dbg.CHAPTERS[2];
        if (ch && ch.obj && ch.obj["fa_fonderia:F"]) ch.obj["fa_fonderia:F"]();
      });
      await page.waitForTimeout(300);

      // Banco Falsario è aperto in modalità lega: finisci con successo
      await page.evaluate(() => window.__falsariBanco.finishTest(true));
      await page.waitForTimeout(300);
      await L.advance(page);
      await page.waitForTimeout(300);

      // Step 4: sfida calcistica sul molo
      await page.evaluate(() => window.__falsariCore.K.go("fa_molo", 16, 12));
      await page.waitForTimeout(300);

      // Parla con Mastro Tullio per la sfida (step 4 -> 5)
      await L.talk(page, "fc_tullio");
      await L.advance(page, ["Simula", "maestria", "convincere", "Banchina"]);
      await page.waitForTimeout(300);

      // Parla di nuovo con Tullio per chiudere capitolo 2
      await L.talk(page, "fc_tullio");
      await L.advance(page);
      await page.waitForTimeout(400);

      // Avanza scene finali capitolo 2
      await L.advance(page);
      await page.waitForTimeout(400);

      const isC2Done = await page.evaluate(() => window.__falsariCore.K.F.get("fa_c2_done"));
      if (!isC2Done) errors.push("Capitolo 2 non risulta concluso (fa_c2_done false)");

    } catch (e) {
      errors.push("Errore esecuzione test: " + e.message);
    }

    L.check(`I Falsari della Coppa · Capitoli 1-2 a ${w} px`, errors);
    await browser.close();
  }
})().catch((e) => {
  console.error("✗ falsari:", e.message);
  process.exit(1);
});
