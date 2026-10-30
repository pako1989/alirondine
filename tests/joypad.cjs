// tests/joypad.cjs - joystick virtuale (js/joypad.js) al posto delle quattro frecce, scelta Joystick / Quattro frecce, «✕ Esci» in alto in orizzontale
const L = require("./lib.cjs");
const MOD = { mod: "__neve", key: "ali-di-rondine.neve", save: { v: 1, diffSet: true, intro: { ch1: 1 } } };
async function open(w, h) {
  const r = await L.setup({ w, h, ...MOD }), p = r.page;
  await p.evaluate(() => { window.__noSfx = 1; window.__neve.open(); }); await p.waitForTimeout(500); await L.advance(p).catch(() => {});
  await p.evaluate(() => window.__neve._dbg.K.go("gn_paese", 15, 12)); await p.waitForTimeout(600); await L.advance(p).catch(() => {});
  return r;
}
const pos = (p) => p.evaluate(() => ({ x: window.__tr.TW.x, y: window.__tr.TW.y }));
async function drag(p, dx, dy, ms = 500) {
  const r = await p.evaluate(() => { const e = document.querySelector(".jp"); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width }; });
  if (!r) throw new Error("joystick assente");
  await p.mouse.move(r.x, r.y); await p.mouse.down(); await p.mouse.move(r.x + dx * r.w * 0.4, r.y + dy * r.w * 0.4, { steps: 3 }); await p.waitForTimeout(ms); await p.mouse.up(); await p.waitForTimeout(120);
}
async function test(w, h, name) {
  const { browser, page: p, errors } = await open(w, h);
  try {
    const st = await p.evaluate(() => ({ mode: window.__joypad.mode(), jp: !!document.querySelector(".dpad .jp"), hid: getComputedStyle(document.querySelector('.dpad [data-d="up"]')).visibility }));
    if (st.mode !== "joy" || !st.jp || st.hid !== "hidden") errors.push("predefinito non joystick: " + JSON.stringify(st));
    await L.shot(p, "joypad_" + name);
    let a = await pos(p); await drag(p, 1, 0); let b = await pos(p); if (!(b.x > a.x)) errors.push("joystick a destra non muove: " + JSON.stringify([a, b]));
    a = b; await drag(p, -1, 0); b = await pos(p); if (!(b.x < a.x)) errors.push("joystick a sinistra non muove: " + JSON.stringify([a, b]));
    a = b; await drag(p, 0, 1); b = await pos(p); if (!(b.y > a.y)) errors.push("joystick giù non muove: " + JSON.stringify([a, b]));
    a = b; await drag(p, 0, -1); b = await pos(p); if (!(b.y < a.y)) errors.push("joystick su non muove: " + JSON.stringify([a, b]));
    const held = await p.evaluate(() => Object.keys(window.__borgoApi && window.__tr.BW ? window.__tr.BW.keys : {}).filter((k) => window.__tr.BW.keys[k]));
    if (held && held.length) errors.push("frecce rimaste premute: " + held);
    // scelta salvata: quattro frecce
    await p.evaluate(() => window.__joypad.set("frecce")); await p.waitForTimeout(150);
    const fr = await p.evaluate(() => ({ jp: !!document.querySelector(".jp"), k: localStorage.getItem("ali-di-rondine.comandi"), vis: getComputedStyle(document.querySelector('.dpad [data-d="up"]')).visibility }));
    if (fr.jp || fr.k !== "frecce" || fr.vis !== "visible") errors.push("quattro frecce non attive: " + JSON.stringify(fr));
    await p.evaluate(() => window.__joypad.set("joy")); await p.waitForTimeout(150);
    if (!(await p.evaluate(() => !!document.querySelector(".dpad .jp")))) errors.push("joystick non torna");
    if (h < w) { // orizzontale: Esci in alto, sopra la scena
      const e = await p.evaluate(() => { const b = [...document.querySelectorAll(".scExit.on")][0], c = document.getElementById("cv").getBoundingClientRect(); if (!b) return null; const r = b.getBoundingClientRect(); return { top: r.top, cvTop: c.top, cvH: c.height }; });
      if (!e || e.top > e.cvTop + e.cvH / 3) errors.push("Esci non in alto: " + JSON.stringify(e));
    }
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check(`Joystick · ${name}`, errors); await browser.close();
}
(async () => {
  await test(900, 405, "orizzontale");
  await test(390, 800, "verticale");
  // ruotando il telefono il joystick segue il direzionale: in orizzontale sta fisso in basso a sinistra sopra la scena, tutto visibile
  {
    const { browser, page: p, errors } = await open(390, 800);
    try {
      await p.setViewportSize({ width: 900, height: 405 }); await p.waitForTimeout(400);
      const r = await p.evaluate(() => { const d = document.querySelector(".dpad"), j = d.querySelector(".jp").getBoundingClientRect(), c = document.getElementById("cv").getBoundingClientRect(); return { pos: getComputedStyle(d).position, j: [j.left, j.top, j.right, j.bottom], c: [c.left, c.right], h: innerHeight }; });
      if (r.pos !== "fixed" || r.j[3] > r.h || r.j[1] < 0 || r.j[2] > r.c[1]) errors.push("joystick fuori posto dopo la rotazione: " + JSON.stringify(r));
      await L.shot(p, "joypad_ruotato");
    } catch (e) { errors.push(e.message.slice(0, 300)); }
    L.check("Joystick · rotazione", errors); await browser.close();
  }
  // orizzontale: toccando un punto della scena la didascalia in alto non resta coperta dal «✕ Esci»
  {
    const { browser, page: p, errors } = await open(900, 405);
    try {
      await p.evaluate(() => window.__borgoApi.scene("gn_bar", "voce", "Prova didascalia", [{ label: "Continua ▸", fn: () => {} }])); await p.waitForTimeout(500);
      const c = await p.evaluate(() => { const r = document.getElementById("cv").getBoundingClientRect(); return { x: r.left + (160 / 320) * r.width, y: r.top + (74 / 200) * r.height }; });
      await p.mouse.click(c.x, c.y); await p.waitForTimeout(400);
      const r = await p.evaluate(() => { const b = document.querySelector(".scExit.on"); return { cap: document.body.classList.contains("bgCapOn"), op: b ? getComputedStyle(b).opacity : "nessuno" }; });
      if (!r.cap || (r.op !== "nessuno" && r.op !== "0")) errors.push("Esci copre la didascalia: " + JSON.stringify(r));
      await L.shot(p, "joypad_didascalia");
    } catch (e) { errors.push(e.message.slice(0, 300)); }
    L.check("Esci · didascalia scena", errors); await browser.close();
  }
  // avviso «Zaino: …» solo alla battuta che nomina l'oggetto, non a inizio dialogo
  {
    const { browser, page: p, errors } = await open(390, 800);
    try {
      await p.evaluate(() => { window.__toasts = []; const t0 = window.toast; window.toast = function (m) { window.__toasts.push(m); return t0 && t0.apply(this, arguments); }; const K = window.__neve._dbg.K; K.inv.give("gn_brule"); K.say([["voce", "Prima battuta, senza nulla."], ["voce", "Tecla ti dà una borraccia di vin brulè (🎒 Zaino)."]]); });
      await p.waitForTimeout(600); let n = await p.evaluate(() => window.__toasts.filter((m) => /Zaino/.test(m)).length);
      if (n) errors.push("avviso Zaino già alla prima battuta");
      await p.evaluate(() => window.T_.click("^Continua|^Avanti")); await p.waitForTimeout(600);
      n = await p.evaluate(() => window.__toasts.filter((m) => /Zaino/.test(m)).length); if (n !== 1) errors.push("avviso Zaino non uscito alla battuta giusta: " + n);
    } catch (e) { errors.push(e.message.slice(0, 300)); }
    L.check("Zaino · avviso al momento giusto", errors); await browser.close();
  }
  // Capitoli: il capitolo in corso si può ricominciare, e si rivedono le scene d'apertura
  {
    const { browser, page: p, errors } = await open(390, 800);
    try {
      await p.evaluate(() => window.__neve._dbg.K.setStep(1, 2)); await p.waitForTimeout(200);
      await p.evaluate(() => { window.__borgoApi.trExitTo ? window.__borgoApi.trExitTo(() => window.__neve.open()) : window.__neve.open(); }); await p.waitForTimeout(800);
      for (const re of ["^Capitoli", "Capitolo 1", "Ricomincia il capitolo"]) { const ok = await p.evaluate((re) => window.T_.click(re), re); if (!ok) { errors.push("manca «" + re + "»: " + (await p.evaluate(() => window.T_.btns().map((o) => o.t).join(" | ")))); break; } await p.waitForTimeout(500); }
      const r = await p.evaluate(() => ({ walk: window.T_.walk(), step: window.__neve._dbg.K.stepOf(1), intro: !!(JSON.parse(localStorage.getItem("ali-di-rondine.neve")).intro || {}).gn_paese }));
      if (r.walk || r.step !== 0) errors.push("capitolo non ricominciato con le scene d'apertura: " + JSON.stringify(r));
    } catch (e) { errors.push(e.message.slice(0, 300)); }
    L.check("Saga · ricomincia il capitolo in corso", errors); await browser.close();
  }
  // obiettivi vaghi (predefiniti): niente strada nel riquadro; «🧭 Dove vado?» nel Menu costa 10 monete e svela l'obiettivo esatto
  {
    const { browser, page: p, errors } = await open(390, 800);
    try {
      const txt = () => p.evaluate(() => document.getElementById("text").innerText);
      let t = await txt();
      if (/a ovest|Tecla/.test(t) || !/Dove vado/.test(t)) errors.push("obiettivo non vago: " + t.slice(0, 200));
      await p.evaluate(() => window.addCoins(25)); const c0 = await p.evaluate(() => window.bCoins());
      await p.evaluate(() => document.getElementById("bMenu").click()); await p.waitForTimeout(300);
      if (!(await p.evaluate(() => window.T_.click("Dove vado")))) errors.push("manca «Dove vado?» nel Menu");
      await p.waitForTimeout(300); const said = await txt(); if (!/a ovest/.test(said)) errors.push("indizio non esatto: " + said.slice(0, 200));
      await L.advance(p).catch(() => {}); const c1 = await p.evaluate(() => window.bCoins()); if (c0 - c1 !== 10) errors.push("costo sbagliato: " + c0 + " → " + c1);
      t = await txt(); if (!/a ovest/.test(t) || /Dove vado/.test(t)) errors.push("dopo l'acquisto l'obiettivo resta vago: " + t.slice(0, 200));
      await p.evaluate(() => localStorage.setItem("ali-di-rondine.obiettivi", "chiari"));
    } catch (e) { errors.push(e.message.slice(0, 300)); }
    L.check("Obiettivi vaghi · Dove vado?", errors); await browser.close();
  }
  // impostazioni: voce «Comandi per camminare» e scelta che resta dopo il riavvio
  const { browser, page: p, errors } = await L.setup({ w: 390, h: 800, extra: {} });
  try {
    await p.evaluate(() => window.__ali && window.__ali.settings ? window.__ali.settings() : null);
    const got = await p.evaluate(() => { localStorage.setItem("ali-di-rondine.comandi", "frecce"); return window.__joypad.mode(); });
    if (got !== "frecce") errors.push("scelta non letta: " + got);
  } catch (e) { errors.push(e.message.slice(0, 300)); }
  L.check("Joystick · scelta salvata", errors); await browser.close();
})();
