// js/director-trattativa.js - Minigioco di negoziazione contrattuale "Braccio di Ferro al Barcone"
// Giocabile sia nel mercato di "Director · Carriera" sia come cabinato in Sala Giochi (MACHINES)
(function () {
  "use strict";

  const STYLE_ID = "trattativa-style";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = Math.random;

  const CSS = `
  .tratt-overlay{position:fixed;inset:0;background:rgba(5,12,24,.88);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:12px;font-family:system-ui,-apple-system,sans-serif}
  .tratt-card{background:#0e1726;border:2px solid #253349;border-radius:14px;width:100%;max-width:380px;box-shadow:0 10px 30px rgba(0,0,0,.6);color:#e2e8f0;display:flex;flex-direction:column;overflow:hidden;max-height:92vh}
  .tratt-header{background:linear-gradient(135deg,#1e293b,#0f172a);padding:10px 14px;border-bottom:1px solid #334155;display:flex;align-items:center;justify-content:space-between}
  .tratt-header h2{font-size:15px;margin:0;font-weight:800;color:#facc15;display:flex;align-items:center;gap:6px}
  .tratt-body{padding:12px;display:flex;flex-direction:column;gap:10px;overflow-y:auto}
  .tratt-faces{display:flex;align-items:center;justify-content:space-between;background:#162032;padding:8px 12px;border-radius:10px;border:1px solid #223049}
  .tratt-face{display:flex;flex-direction:column;align-items:center;font-size:11px;font-weight:700;color:#94a3b8}
  .tratt-face .ico{font-size:32px;line-height:1}
  .tratt-vs{font-weight:900;font-size:16px;color:#f59e0b}
  .tratt-bubble{background:#1e293b;border-left:3px solid #facc15;padding:8px 10px;border-radius:6px;font-size:12.5px;color:#f1f5f9;line-height:1.4;min-height:44px}
  .tratt-bars{display:flex;flex-direction:column;gap:6px}
  .tratt-bar-row{display:flex;flex-direction:column;gap:2px}
  .tratt-bar-lbl{display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:#cbd5e1}
  .tratt-bar-track{height:10px;background:#1e293b;border-radius:5px;overflow:hidden;border:1px solid #334155}
  .tratt-bar-fill{height:100%;transition:width .3s ease;border-radius:5px}
  .tratt-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px}
  .tratt-btn{background:#1e293b;border:1px solid #3b82f6;color:#f8fafc;padding:9px 6px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;text-align:center}
  .tratt-btn:active{transform:scale(.97)}
  .tratt-btn small{font-size:9.5px;color:#94a3b8;font-weight:500}
  .tratt-btn.gold{background:#ca8a04;border-color:#eab308;color:#0f172a;grid-column:span 2}
  .tratt-btn[disabled]{opacity:.4;cursor:not-allowed}
  `;

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function start(opts) {
    opts = opts || {};
    injectCSS();

    const playerName = opts.playerName || "Gigi Nasello";
    const agentName = opts.agentName || "Oreste 'Baffo d'Oro' Puleo";
    const initialPrice = opts.initialPrice || 45;
    const targetPrice = opts.targetPrice || Math.round(initialPrice * 0.7);
    const maxTurns = 5;

    let currentPrice = initialPrice;
    let patience = 85;
    let turn = 1;
    let logMsg = `«Mister, per ${playerName} la mia richiesta di partenza è ${initialPrice} scudi. Meno di così è un'offesa al talento.»`;
    let ended = false;
    let won = false;

    const overlay = document.createElement("div");
    overlay.className = "tratt-overlay";
    document.body.appendChild(overlay);

    function render() {
      const pricePct = clamp(Math.round(((currentPrice - targetPrice) / (initialPrice - targetPrice || 1)) * 100), 0, 100);
      const isTargetReached = currentPrice <= targetPrice;

      overlay.innerHTML = `
        <div class="tratt-card">
          <div class="tratt-header">
            <h2>🤝 Trattativa al Barcone</h2>
            <span style="font-size:11.5px;color:#cbd5e1">Turno ${Math.min(turn, maxTurns)}/${maxTurns}</span>
          </div>
          <div class="tratt-body">
            <div class="tratt-faces">
              <div class="tratt-face">
                <span class="ico">🧢</span>
                <span>Tu (Mister)</span>
              </div>
              <div class="tratt-vs">VS</div>
              <div class="tratt-face">
                <span class="ico">💼</span>
                <span>${esc(agentName.split(" ")[0])}</span>
              </div>
            </div>

            <div class="tratt-bubble">${esc(logMsg)}</div>

            <div class="tratt-bars">
              <div class="tratt-bar-row">
                <div class="tratt-bar-lbl">
                  <span>Prezzo richiesto: <b>${currentPrice} 🐟</b></span>
                  <span>Obiettivo: &le;${targetPrice} 🐟</span>
                </div>
                <div class="tratt-bar-track">
                  <div class="tratt-bar-fill" style="width:${100 - pricePct}%;background:${isTargetReached ? "#22c55e" : "#f59e0b"}"></div>
                </div>
              </div>

              <div class="tratt-bar-row">
                <div class="tratt-bar-lbl">
                  <span>Pazienza del procuratore: <b>${patience}%</b></span>
                  <span>${patience < 30 ? "⚠️ Irritato!" : patience < 60 ? "Attento" : "Calmo"}</span>
                </div>
                <div class="tratt-bar-track">
                  <div class="tratt-bar-fill" style="width:${patience}%;background:${patience > 50 ? "#3b82f6" : patience > 25 ? "#f59e0b" : "#ef4444"}"></div>
                </div>
              </div>
            </div>

            ${!ended ? `
              <div class="tratt-actions">
                <button class="tratt-btn" id="actRagione">
                  <span>💬 Ragionamento</span>
                  <small>-2/4 scudi · -8% pazienza</small>
                </button>
                <button class="tratt-btn" id="actBianco">
                  <span>🍷 Calice di Bianco</span>
                  <small>50% distende, 50% insospettisce</small>
                </button>
                <button class="tratt-btn" id="actBluff">
                  <span>🃏 Bluff di mercato</span>
                  <small>-5/9 scudi · -20% pazienza</small>
                </button>
                <button class="tratt-btn" id="actSpigola">
                  <span>📞 Urlo di Spigola</span>
                  <small>Imprevedibile</small>
                </button>
                ${isTargetReached ? `<button class="tratt-btn gold" id="actChiudi">✍️ Firma l'Accordo (${currentPrice} 🐟)!</button>` : ""}
              </div>
            ` : `
              <div style="margin-top:10px;text-align:center">
                <div style="font-size:16px;font-weight:800;color:${won ? "#4ade80" : "#f87171"};margin-bottom:8px">
                  ${won ? "🎉 ACCORDO RAGGIUNTO!" : "❌ TRATTATIVA SALTATA"}
                </div>
                <button class="tratt-btn gold" id="actDone">Continua</button>
              </div>
            `}
          </div>
        </div>
      `;

      if (!ended) {
        overlay.querySelector("#actRagione").onclick = () => doAction("ragione");
        overlay.querySelector("#actBianco").onclick = () => doAction("bianco");
        overlay.querySelector("#actBluff").onclick = () => doAction("bluff");
        overlay.querySelector("#actSpigola").onclick = () => doAction("spigola");
        const chiudi = overlay.querySelector("#actChiudi");
        if (chiudi) chiudi.onclick = () => closeDeal(true);
      } else {
        overlay.querySelector("#actDone").onclick = () => finish();
      }
    }

    function doAction(type) {
      if (ended) return;

      if (type === "ragione") {
        const drop = Math.floor(2 + rnd() * 3);
        currentPrice = Math.max(targetPrice, currentPrice - drop);
        patience = Math.max(0, patience - 8);
        logMsg = `«Ha ragione, Mister. I ragazzi del Borgo hanno prospettiva. Scendo a ${currentPrice} scudi.»`;
      } else if (type === "bianco") {
        if (rnd() < 0.6) {
          const drop = Math.floor(3 + rnd() * 4);
          currentPrice = Math.max(targetPrice, currentPrice - drop);
          patience = Math.min(100, patience + 15);
          logMsg = `«Ottimo questo bianco di Baciccia! Sa cosa le dico? Chiudiamo a ${currentPrice} e non se ne parla più!»`;
        } else {
          patience = Math.max(0, patience - 15);
          logMsg = `«Non bevo durante il lavoro, Mister. Vuole per caso prendermi per la gola?»`;
        }
      } else if (type === "bluff") {
        if (rnd() < 0.75) {
          const drop = Math.floor(5 + rnd() * 5);
          currentPrice = Math.max(targetPrice, currentPrice - drop);
          patience = Math.max(0, patience - 22);
          logMsg = `«Anche il Real Mareggiata su di lui?! Accidenti... va bene, ${currentPrice} scudi, ma chiudiamo subito!»`;
        } else {
          patience = Math.max(0, patience - 35);
          logMsg = `«Non mi prenda in giro. Il Mareggiata non sa nemmeno chi sia! Mi sta facendo perdere la pazienza.»`;
        }
      } else if (type === "spigola") {
        if (rnd() < 0.5) {
          currentPrice = targetPrice;
          patience = Math.max(10, patience - 10);
          logMsg = `Il Presidente Spigola urla nel ricevitore del telefono: «O FIRMI O TI COMPRO IL BARCONE!» Il procuratore impallidisce: «Va bene ${targetPrice}!»`;
        } else {
          patience = Math.max(0, patience - 40);
          logMsg = `Spigola al telefono confonde il giocatore con un carico di alici. Il procuratore si alza offeso.`;
        }
      }

      turn++;
      if (patience <= 0) {
        closeDeal(false, "Pazienza esaurita! Il procuratore ha sbattuto la porta del barcone.");
      } else if (turn > maxTurns) {
        if (currentPrice <= targetPrice) {
          closeDeal(true, "Tempo scaduto, ma la cifra finale rientra nel budget pattuito!");
        } else {
          closeDeal(false, "Tempo scaduto! Non siete riusciti a trovare un accordo economico prima della chiusura del mercato.");
        }
      } else {
        render();
      }
    }

    function closeDeal(isWin, customMsg) {
      ended = true;
      won = isWin;
      if (customMsg) logMsg = customMsg;
      else if (isWin) logMsg = `«Affare fatto, Mister! ${playerName} firma con la Rondine per ${currentPrice} scudi. Dina può preparare i contratti.»`;
      render();
    }

    function finish() {
      overlay.remove();
      if (typeof opts.onDone === "function") {
        opts.onDone({
          win: won,
          finalPrice: currentPrice,
          discount: initialPrice - currentPrice
        });
      }
    }

    render();
  }

  window.__directorTrattativa = { start };
})();
