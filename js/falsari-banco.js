// js/falsari-banco.js — IL BANCO DEL FALSARIO & LA FORGIA ARTIGIANALE
// Modulo interattivo per la saga «I Falsari della Coppa».
// Permette di:
// 1. Rilevare calchi in cera d'api di stemmi e incisioni storiche.
// 2. Dosare la lega metallica (Rame, Ottone, Stagno) per centrare la tonalità dorata.
// 3. Regolare la patina del tempo e bilanciare il peso con zavorra in piombo (tolleranza grammi).
// Espone: window.__falsariBanco = { start(opts), state, finishTest(win) }
(function () {
  "use strict";
  if (window.__falsariBanco) return;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let activeOv = null;
  const STATE = {
    open: false,
    opts: null,
    step: "calco", // calco | lega | bilancia
    targetPurezza: 85,
    targetPeso: 1840,
    rame: 70,
    ottone: 20,
    stagno: 10,
    patina: 40,
    piombo: 1800,
    stampX: 50,
    stampY: 50,
    calcoDone: false,
    win: false,
    finish(win) {
      this.win = !!win;
      if (this.opts && this.opts.onDone) {
        const cb = this.opts.onDone;
        this.opts.onDone = null;
        closeOv();
        cb({ win: this.win, purezza: this.rame, peso: this.piombo, patina: this.patina });
      } else {
        closeOv();
      }
    }
  };

  function closeOv() {
    STATE.open = false;
    if (activeOv && activeOv.parentNode) {
      activeOv.parentNode.removeChild(activeOv);
    }
    activeOv = null;
  }

  function start(opts) {
    STATE.opts = opts || {};
    STATE.open = true;
    STATE.win = false;
    STATE.step = opts.mode || "calco";
    STATE.targetPurezza = opts.targetPurezza || 85;
    STATE.targetPeso = opts.targetPeso || 1840;
    STATE.piombo = opts.initialPeso || 1750;
    STATE.rame = 70;
    STATE.ottone = 20;
    STATE.stagno = 10;
    STATE.patina = 30;
    STATE.stampX = 50;
    STATE.stampY = 50;
    STATE.calcoDone = false;

    renderOv();
  }

  function renderOv() {
    if (activeOv && activeOv.parentNode) activeOv.parentNode.removeChild(activeOv);

    const ov = document.createElement("div");
    ov.id = "falsariBancoOv";
    ov.className = "salOv";
    ov.style.cssText = `
      position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(15,10,6,0.95); z-index:9999;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      color:#fef3c7; font-family:'Trebuchet MS', system-ui, sans-serif;
      padding:16px; box-sizing:border-box; user-select:none;
    `;

    const title = STATE.opts.title || (STATE.step === "calco" ? "🔍 Banco d'Orefice · Calco in Cera d'Api" : "⚖️ Banco del Falsario · Taratura della Replica");
    const sub = STATE.step === "calco"
      ? "Posiziona il tampone di cera vergine esattamente sopra lo stemma della Rondine inciso sulla coppa e premi «Prendi Calco»."
      : "Regola la composizione della lega e il peso per non far scattare i sensori della bacheca allarmata.";

    let innerHtml = `
      <div style="background:#26180b; border:2px solid #d97706; border-radius:12px; padding:20px; width:min(100%, 460px); box-shadow:0 12px 36px rgba(0,0,0,0.8); text-align:center;">
        <div style="font-size:18px; font-weight:bold; color:#fbbf24; margin-bottom:6px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>${title}</span>
        </div>
        <div style="font-size:13px; color:#fde68a; opacity:0.85; margin-bottom:16px; line-height:1.4;">${sub}</div>
    `;

    if (STATE.step === "calco") {
      innerHtml += `
        <div style="position:relative; width:100%; height:180px; background:#120c06; border:1px solid #78350f; border-radius:8px; margin-bottom:16px; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          <!-- Disegno coppa stilizzata -->
          <svg width="220" height="150" viewBox="0 0 220 150">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fbbf24"/>
                <stop offset="50%" stop-color="#b45309"/>
                <stop offset="100%" stop-color="#78350f"/>
              </linearGradient>
            </defs>
            <!-- Calice -->
            <path d="M60 20 Q110 50 160 20 L150 75 Q110 110 70 75 Z" fill="url(#goldGrad)" stroke="#fef3c7" stroke-width="1.5"/>
            <!-- Anse a collo di cigno -->
            <path d="M60 25 C30 30 30 70 68 70" fill="none" stroke="#f59e0b" stroke-width="4"/>
            <path d="M160 25 C190 30 190 70 152 70" fill="none" stroke="#f59e0b" stroke-width="4"/>
            <!-- Stelo e base -->
            <rect x="103" y="100" width="14" height="25" fill="#92400e" stroke="#f59e0b" stroke-width="1"/>
            <path d="M85 125 L135 125 L145 140 L75 140 Z" fill="#78350f" stroke="#fbbf24" stroke-width="1.5"/>
            <!-- Incisione stemma Rondine centrale (bersaglio) -->
            <circle cx="110" cy="55" r="18" fill="#451a03" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,3"/>
            <text x="110" y="58" font-size="12" fill="#fde68a" text-anchor="middle" font-weight="bold">1934</text>
            <!-- Tampone di cera mobile -->
            <circle id="waxStamp" cx="${STATE.stampX * 2.2}" cy="${STATE.stampY * 1.5}" r="16" fill="rgba(245,158,11,0.6)" stroke="#fef3c7" stroke-width="2"/>
          </svg>
          <div style="position:absolute; bottom:6px; font-size:11px; color:#f59e0b;">Usa i pulsanti o tocca per centrare la cera sullo stemma</div>
        </div>

        <div style="display:flex; justify-content:center; gap:8px; margin-bottom:14px;">
          <button type="button" id="btnStampLeft" style="background:#78350f; color:#fef3c7; border:1px solid #d97706; border-radius:6px; padding:6px 14px; font-weight:bold; cursor:pointer;">◀ Sinistra</button>
          <button type="button" id="btnStampCenter" style="background:#b45309; color:#fef3c7; border:1px solid #fbbf24; border-radius:6px; padding:6px 14px; font-weight:bold; cursor:pointer;">🎯 Centra</button>
          <button type="button" id="btnStampRight" style="background:#78350f; color:#fef3c7; border:1px solid #d97706; border-radius:6px; padding:6px 14px; font-weight:bold; cursor:pointer;">Destra ▶</button>
        </div>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button type="button" id="btnApplyWax" style="background:#d97706; color:#0f0a06; font-size:14px; font-weight:bold; padding:10px 20px; border:none; border-radius:8px; cursor:pointer; flex:1;">🕯️ Prendi Calco in Cera</button>
          <button type="button" id="btnCancelBanco" style="background:#451a03; color:#fef3c7; font-size:13px; padding:10px 14px; border:1px solid #78350f; border-radius:8px; cursor:pointer;">Annulla</button>
        </div>
      `;
    } else {
      // Modalità forgiatura/bilancia
      innerHtml += `
        <div style="background:#120c06; border:1px solid #78350f; border-radius:8px; padding:12px; margin-bottom:14px; text-align:left;">
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
            <span>Purezza Lega Dorata:</span>
            <b id="lblPurezza" style="color:#fbbf24;">${STATE.rame}% (Target: ${STATE.targetPurezza}%)</b>
          </div>
          <input type="range" id="rngRame" min="50" max="95" value="${STATE.rame}" style="width:100%; accent-color:#f59e0b; margin-bottom:10px;">

          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
            <span>Peso con Zavorra:</span>
            <b id="lblPeso" style="color:#fbbf24;">${STATE.piombo}g (Target: ${STATE.targetPeso}g ±20g)</b>
          </div>
          <input type="range" id="rngPeso" min="1600" max="2100" value="${STATE.piombo}" style="width:100%; accent-color:#f59e0b; margin-bottom:10px;">

          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
            <span>Patina d'Ossidazione:</span>
            <b id="lblPatina" style="color:#fbbf24;">${STATE.patina}%</b>
          </div>
          <input type="range" id="rngPatina" min="10" max="90" value="${STATE.patina}" style="width:100%; accent-color:#f59e0b;">
        </div>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button type="button" id="btnValidateForge" style="background:#d97706; color:#0f0a06; font-size:14px; font-weight:bold; padding:10px 20px; border:none; border-radius:8px; cursor:pointer; flex:1;">⚖️ Convalida Replica</button>
          <button type="button" id="btnCancelBanco" style="background:#451a03; color:#fef3c7; font-size:13px; padding:10px 14px; border:1px solid #78350f; border-radius:8px; cursor:pointer;">Annulla</button>
        </div>
      `;
    }

    innerHtml += `</div>`;
    ov.innerHTML = innerHtml;
    document.body.appendChild(ov);
    activeOv = ov;

    bindEvents(ov);
  }

  function bindEvents(ov) {
    const btnCancel = ov.querySelector("#btnCancelBanco");
    if (btnCancel) {
      btnCancel.onclick = () => STATE.finish(false);
    }

    if (STATE.step === "calco") {
      const stamp = ov.querySelector("#waxStamp");
      const updateStamp = () => {
        if (stamp) {
          stamp.setAttribute("cx", String(STATE.stampX * 2.2));
          stamp.setAttribute("cy", String(STATE.stampY * 1.5));
        }
      };

      const btnLeft = ov.querySelector("#btnStampLeft");
      if (btnLeft) {
        btnLeft.onclick = () => { STATE.stampX = Math.max(25, STATE.stampX - 8); updateStamp(); };
      }
      const btnRight = ov.querySelector("#btnStampRight");
      if (btnRight) {
        btnRight.onclick = () => { STATE.stampX = Math.min(75, STATE.stampX + 8); updateStamp(); };
      }
      const btnCenter = ov.querySelector("#btnStampCenter");
      if (btnCenter) {
        btnCenter.onclick = () => { STATE.stampX = 50; STATE.stampY = 37; updateStamp(); };
      }

      const btnApply = ov.querySelector("#btnApplyWax");
      if (btnApply) {
        btnApply.onclick = () => {
          // Successo se vicino al centro (stemma a x=50, y=37)
          const dist = Math.hypot(STATE.stampX - 50, STATE.stampY - 37);
          const ok = dist <= 20;
          if (ok) {
            STATE.calcoDone = true;
            btnApply.style.background = "#22c55e";
            btnApply.innerHTML = "✓ Calco Preso con Successo!";
            setTimeout(() => STATE.finish(true), 600);
          } else {
            btnApply.style.background = "#ef4444";
            btnApply.innerHTML = "✗ Tampone disallineato, riprova!";
            setTimeout(() => {
              btnApply.style.background = "#d97706";
              btnApply.innerHTML = "🕯️ Prendi Calco in Cera";
            }, 800);
          }
        };
      }
    } else {
      const rngRame = ov.querySelector("#rngRame");
      const rngPeso = ov.querySelector("#rngPeso");
      const rngPatina = ov.querySelector("#rngPatina");
      const lblPurezza = ov.querySelector("#lblPurezza");
      const lblPeso = ov.querySelector("#lblPeso");
      const lblPatina = ov.querySelector("#lblPatina");

      if (rngRame) {
        rngRame.oninput = (e) => {
          STATE.rame = parseInt(e.target.value, 10);
          if (lblPurezza) lblPurezza.textContent = `${STATE.rame}% (Target: ${STATE.targetPurezza}%)`;
        };
      }
      if (rngPeso) {
        rngPeso.oninput = (e) => {
          STATE.piombo = parseInt(e.target.value, 10);
          if (lblPeso) lblPeso.textContent = `${STATE.piombo}g (Target: ${STATE.targetPeso}g ±20g)`;
        };
      }
      if (rngPatina) {
        rngPatina.oninput = (e) => {
          STATE.patina = parseInt(e.target.value, 10);
          if (lblPatina) lblPatina.textContent = `${STATE.patina}%`;
        };
      }

      const btnValidate = ov.querySelector("#btnValidateForge");
      if (btnValidate) {
        btnValidate.onclick = () => {
          let ok = false;
          let errMsg = "";
          if (STATE.opts && STATE.opts.mode === "patina") {
            const targetPat = STATE.opts.targetPatina || 65;
            const diffPat = Math.abs(STATE.patina - targetPat);
            ok = diffPat <= 12;
            errMsg = "Patina d'ossidazione non uniforme!";
          } else {
            const diffP = Math.abs(STATE.rame - STATE.targetPurezza);
            const diffW = Math.abs(STATE.piombo - STATE.targetPeso);
            ok = diffP <= 8 && diffW <= 25;
            errMsg = diffW > 25 ? "Peso errato!" : "Lega imprecisa!";
          }
          if (ok) {
            btnValidate.style.background = "#22c55e";
            btnValidate.innerHTML = "✓ Replica Convalidata!";
            setTimeout(() => STATE.finish(true), 600);
          } else {
            btnValidate.style.background = "#ef4444";
            btnValidate.innerHTML = `✗ ${errMsg}`;
            setTimeout(() => {
              btnValidate.style.background = "#d97706";
              btnValidate.innerHTML = "⚖️ Convalida Replica";
            }, 900);
          }
        };
      }
    }
  }

  window.__falsariBanco = {
    start,
    state: STATE,
    finishTest(win) {
      STATE.finish(win);
    }
  };
})();
