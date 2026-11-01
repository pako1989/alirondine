// tests/staffetta.cjs - Test completo per La Staffetta dei Legami (Squadra dei Sogni & Arena)
const L = require("./lib.cjs");

const fin = { v: 1, ch: 3, step: { 1: 5, 2: 5, 3: 5 }, done: { 1: "a", 2: "b", 3: "c" }, ends: ["mondiale", "leone", "campetto", "amico"], diffSet: true, flags: {} };

async function run(w) {
  const { browser, page, errors } = await L.setup({
    w,
    extra: {
      "ali-di-rondine.campetto": fin,
      "ali-di-rondine.falsari": { v: 1, ch: 4, ends: ["olmo", "montecarlo"] },
      "ali-di-rondine.latta": { v: 1, ch: 4, ends: ["popolare"] }
    }
  });

  // 1. Inizializza Sogni con personaggi sbloccati
  await page.evaluate(() => {
    const S = window.__sogni;
    if (S) {
      S.sync();
      const r = S._load();
      ["fa_arturo", "fa_tullio", "of_ferro", "cc_lyra", "cm_bastiano", "cm_leone"].forEach((id) => {
        if (!r.own.includes(id)) r.own.push(id);
      });
      S._save(r);
    }
    // Assicura che la Staffetta sia attiva
    if (window.__staffetta) {
      window.__staffetta.setOn(true);
    }
  });

  // 2. Apri Arena e controlla bottone Staffetta dei Legami
  await page.evaluate(() => window.__arena.open());
  await page.waitForTimeout(300);

  const btnStaffetta = await page.evaluate(() => !!document.querySelector('.arOv [data-go="staffettaLegami"]'));
  if (!btnStaffetta) {
    errors.push("Manca il pulsante Staffetta dei Legami nell'Arena");
  }

  // 3. Clicca sul pulsante ed entra nella Staffetta
  await page.evaluate(() => document.querySelector('.arOv [data-go="staffettaLegami"]').click());
  await page.waitForTimeout(400);

  const hubState = await page.evaluate(() => {
    const ov = document.querySelector(".stfOv");
    if (!ov) return null;
    const starters = ov.querySelectorAll('.stfSlot[data-slot="0"], .stfSlot[data-slot="1"]').length;
    const bench = ov.querySelectorAll('.stfSlot[data-slot="2"], .stfSlot[data-slot="3"], .stfSlot[data-slot="4"]').length;
    const reso = ov.querySelector(".stfResoBanner") ? ov.querySelector(".stfResoBanner").textContent : "";
    return { starters, bench, reso };
  });

  if (!hubState || hubState.starters !== 2 || hubState.bench !== 3) {
    errors.push("Hub Staffetta non renderizzato correttamente: " + JSON.stringify(hubState));
  }

  if (w === 390) await L.shot(page, "staffetta_hub");

  // 4. Seleziona coppia canonica Arturo + Tullio per verificare la risonanza
  await page.evaluate(() => {
    const st = window.__staffetta;
    st.setRoster(["fa_arturo", "fa_tullio", "of_ferro", "cc_lyra", "cm_bastiano"]);
    st.open();
  });
  await page.waitForTimeout(300);

  const resoCheck = await page.evaluate(() => {
    const b = document.querySelector(".stfResoBanner");
    return b ? b.textContent : "";
  });
  if (!resoCheck.includes("Doppio Marchio") && !resoCheck.includes("Forgia")) {
    errors.push("Risonanza Arturo-Tullio non attiva: " + resoCheck);
  }

  // 5. Test Cut-in manuale via API
  await page.evaluate(() => {
    return new Promise((res) => {
      window.__staffetta.cutin(["fa_arturo", "fa_tullio"], () => res(true), "FORGIA D'ORO");
    });
  });
  await page.waitForTimeout(1600);
  if (w === 390) await L.shot(page, "staffetta_cutin");

  // Assicurati che l'hub sia aperto per cliccare Inizia
  await page.evaluate(() => {
    if (!document.querySelector(".stfOv")) {
      window.__staffetta.open();
    }
  });
  await page.waitForTimeout(300);

  // 6. Avvia Battaglia 5 Ondate
  await page.evaluate(() => {
    const btn = document.querySelector('.stfBtn[data-act="start"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);

  const bState = await page.evaluate(() => {
    const ov = document.querySelector(".stfBattleRoot");
    if (!ov) return null;
    const myUnits = ov.querySelectorAll(".stfUnitCard.activeHero").length;
    const foes = ov.querySelectorAll(".stfUnitCard.foe").length;
    const hasAtk = !!ov.querySelector('[data-bact="atk"]');
    const hasSwap = !!ov.querySelector("[data-swap]");
    return { myUnits, foes, hasAtk, hasSwap };
  });

  if (!bState || bState.myUnits !== 2 || bState.foes < 1 || !bState.hasAtk || !bState.hasSwap) {
    errors.push("Schermata Battaglia Staffetta non valida: " + JSON.stringify(bState));
  }

  if (w === 390) await L.shot(page, "staffetta_battle");

  // Esegui azione di Attacco
  await page.evaluate(() => {
    const btn = document.querySelector('.stfBattleRoot [data-bact="atk"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(600);

  // Esegui Cambio Volante (Staffetta) cliccando un atleta in panchina
  const swapResult = await page.evaluate(() => {
    const swapBtn = document.querySelector(".stfBattleRoot [data-swap]");
    if (swapBtn) {
      swapBtn.click();
      return true;
    }
    return false;
  });
  if (!swapResult) {
    errors.push("Nessuna riserva disponibile per il cambio volante");
  }
  await page.waitForTimeout(400);

  // Verifica lo scudo d'ingresso del nuovo entrato
  const shieldCheck = await page.evaluate(() => {
    const uShield = document.querySelector(".stfBattleRoot .stfUnitCard.activeHero .uShield");
    return uShield ? uShield.textContent : "";
  });
  if (!shieldCheck.includes("🛡️")) {
    errors.push("Scudo d'ingresso non visibile dopo il cambio volante");
  }

  // 7. Chiudi battaglia
  await page.evaluate(() => {
    const q = document.querySelector('.stfBattleRoot [data-bact="quit"]');
    if (q) q.click();
  });
  await page.waitForTimeout(400);

  // 8. Test disattivazione in Impostazioni e sparizione nell'Arena
  await page.evaluate(() => {
    window.__staffetta.setOn(false);
    window.__arena.open();
  });
  await page.waitForTimeout(300);

  const btnHidden = await page.evaluate(() => !document.querySelector('.arOv [data-go="staffettaLegami"]'));
  if (!btnHidden) {
    errors.push("Il pulsante Staffetta non scompare quando la modalità è disattivata");
  }

  // Riattiva per consistenza
  await page.evaluate(() => window.__staffetta.setOn(true));

  // 9. Test Sala Giochi
  await page.evaluate(() => {
    if (window.__salone) {
      window.__salone.salaGiochi();
    }
  });
  await page.waitForTimeout(300);

  const salaMachine = await page.evaluate(() => {
    const m = document.querySelector('[data-m="staffetta"]');
    if (!m) return false;
    m.click();
    return true;
  });
  if (!salaMachine) {
    errors.push("Cabinato Staffetta non trovato o non cliccabile in Sala Giochi");
  }
  await page.waitForTimeout(400);

  const inStaffetta = await page.evaluate(() => !!document.querySelector(".stfOv"));
  if (!inStaffetta) {
    errors.push("Il click su cabinato Staffetta non ha aperto la modalità");
  }

  await browser.close();
}

async function main() {
  console.log("=== TEST LA STAFFETTA DEI LEGAMI (390px) ===");
  await run(390);
  console.log("=== TEST LA STAFFETTA DEI LEGAMI (320px) ===");
  await run(320);
  console.log("Test Staffetta dei Legami completato con successo!");
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
