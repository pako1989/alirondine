// js/sigilli-partita.js - «TRACCIA-RUNA · RUNE & VOLLEY»
// Motore di partita originale per «L'Accademia dei Sigilli · Esami di Magia del Pallone».
// Duello magico tra cerchi runici ed energie arcane:
//  - 4 SIGILLI BALISTICI: Runa del Vento (curva), del Tuono (saetta), dello Scudo (parata), dell'Illusione (finta).
//  - GESTO RUNICO: traccia col dito/mouse il simbolo sullo schermo o usa i tasti rapidi (1-4 / tocco).
//  - TEMPO LIMITE DI LANCIO: 5 turni di sfida (6 contro il Boss).
//  - CHIUSURA PROGRAMMATICA: espone window.__runaMatch.state con finish() per i test.
(function () {
  "use strict";
  if (window.__runaMatch) return;

  const W = 360, H = 210;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function snd(type) {
    const ctx = getAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    try {
      if (type === "spell") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.15);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      } else if (type === "thunder") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(110, t + 0.2);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.24);
      } else if (type === "shield") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.setValueAtTime(660, t + 0.08);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      } else if (type === "goal") {
        [440, 554, 659, 880].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, t + i * 0.08);
          gain.gain.setValueAtTime(0.2, t + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.005, t + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.38);
        });
      }
    } catch (_) {}
  }

  const SPELLS = [
    { id: "vento", shape: "◯ CERCHIO: gira in tondo", name: "Runa del Vento", icon: "🌀", desc: "Tiro a spirale che aggira la barriera", sym: "O" },
    { id: "tuono", shape: "⚡ ZIG-ZAG: destra, diagonale, destra", name: "Runa del Tuono", icon: "⚡", desc: "Saetta folgorante a massima velocità", sym: "Z" },
    { id: "scudo", shape: "^ FRECCIA IN SU: sali e scendi", name: "Sigillo di Protezione", icon: "🛡️", desc: "Barriera esagonale respingi-tiri", sym: "^" },
    { id: "illusione", shape: "〰 ONDA: su e giù mentre avanzi", name: "Runa del Doppio", icon: "✨", desc: "Finta speculare che sdoppia il pallone", sym: "~" }
  ];

  // riconoscimento del gesto: cerchio (Vento), zig-zag (Tuono), freccia in su (Scudo), onda (Doppio)
  function reversals(a, th) {
    let n = 0, dir = 0, hi = a[0], lo = a[0];
    for (let i = 1; i < a.length; i++) {
      const v = a[i];
      if (v > hi) hi = v; if (v < lo) lo = v;
      if (dir <= 0 && v - lo > th) { if (dir === -1) n++; dir = 1; hi = v; }
      else if (dir >= 0 && hi - v > th) { if (dir === 1) n++; dir = -1; lo = v; }
    }
    return n;
  }
  function classify(p) {
    if (!p || p.length < 8) return null;
    const xs = p.map((q) => q.x), ys = p.map((q) => q.y);
    const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), w = x1 - x0, h = y1 - y0;
    if (Math.max(w, h) < 26) return null;
    let len = 0; for (let i = 1; i < p.length; i++) len += Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]);
    const gap = Math.hypot(xs[0] - xs[xs.length - 1], ys[0] - ys[ys.length - 1]);
    if (gap < 0.5 * Math.max(w, h) && w > 0.45 * h && h > 0.45 * w && len > 2.0 * Math.max(w, h)) return "vento";
    const rx = reversals(xs, w * 0.22), ry = reversals(ys, h * 0.22);
    if (ry >= 2 && w >= h * 0.9) return "illusione";
    if (rx >= 2) return "tuono";
    if (ry >= 1 && rx <= 1) return "scudo";
    return null;
  }

  let G_STATE = null;

  function start(opts) {
    opts = opts || {};
    const wrap = document.createElement("div");
    wrap.className = "sigilli-match-ovl";
    wrap.style.cssText = "position:fixed;inset:0;z-index:9999;background:#030712;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;user-select:none;touch-action:none;";

    const cur = (window.__sagaCore && window.__sagaCore.cur) || {};
    const diff = cur.diff || opts.diff || "normale";
    const oppName = (typeof opts.opp === "string" && opts.opp) || (opts.opp && opts.opp.name) || (opts.oppNames && opts.oppNames[0]) || "Custodi dell'Accademia";
    const heroName = (opts.hero && opts.hero.name) || opts.us || "Il Campione";
    const totalRounds = opts.turns || 5;

    let scoreA = 0, scoreB = 0;
    let round = 1;
    let phase = "draw"; // "draw", "anim", "result"
    let targetSpell = SPELLS[0];
    let strokePoints = [];
    let isDrawing = false;
    let roundTimer = 5.0;
    let animTimer = 0;
    let animText = "";
    let ballPos = { x: 180, y: 150 };
    let ballTarget = { x: 180, y: 50 };
    let auraSparkles = [];

    wrap.innerHTML = `
      <div style="width:100%;max-width:440px;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:8px 12px;box-sizing:border-box;">
        <!-- Top bar HUD -->
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(30,27,75,.85);border:1px solid #6366f1;border-radius:10px;padding:6px 12px;font-size:13px;">
          <div style="font-weight:700;color:#a5b4fc;"><span style="color:#fbbf24;">✨</span> ${esc(heroName)}: <b style="color:#fff;font-size:16px;" id="sg-score-a">0</b></div>
          <div style="font-weight:800;color:#c7d2fe;background:#4338ca;padding:2px 8px;border-radius:12px;font-size:11px;" id="sg-round-lbl">TURNO 1/${totalRounds}</div>
          <div style="font-weight:700;color:#fca5a5;"><b style="color:#fff;font-size:16px;" id="sg-score-b">0</b> :${esc(oppName)}</div>
        </div>

        <!-- Canvas area -->
        <div style="position:relative;width:100%;flex:1;display:flex;align-items:center;justify-content:center;margin:6px 0;">
          <canvas id="sg-canvas" width="${W}" height="${H}" style="width:100%;max-width:${W}px;height:auto;flex:none;aspect-ratio:360/210;background:#090d16;border:2px solid #4f46e5;border-radius:12px;box-shadow:0 0 20px rgba(99,102,241,.3);touch-action:none;"></canvas>
          <div id="sg-prompt" style="position:absolute;top:10px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,.9);border:1px solid #818cf8;border-radius:16px;padding:3px 12px;font-size:11px;font-weight:600;color:#e0e7ff;pointer-events:none;white-space:nowrap;">
            Traccia: <span id="sg-spell-target" style="color:#fbbf24;font-weight:800;">Runa del Vento (Cerchio)</span>
          </div>
        </div>

        <!-- Rune buttons shortcuts & timer -->
        <div style="display:flex;flex-direction:column;gap:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#94a3b8;padding:0 4px;">
            <span>Tempo lancio: <b id="sg-timer-lbl" style="color:#facc15;">5.0s</b></span>
            <span>Usa il tocco o i pulsanti rapidi sotto:</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
            ${SPELLS.map((sp, idx) => `
              <button type="button" class="sg-spell-btn" data-id="${sp.id}" style="background:#1e1b4b;border:1px solid #6366f1;border-radius:8px;padding:6px 2px;color:#f8fafc;font-size:11px;font-weight:700;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;">
                <span style="font-size:16px;">${sp.icon}</span>
                <span>${sp.name.split(" ")[2] || sp.name}</span>
                <span style="font-size:9px;color:#a5b4fc;opacity:.8;">[${idx + 1}]</span>
              </button>
            `).join("")}
          </div>
          <button type="button" id="sg-quit-btn" style="background:transparent;border:none;color:#64748b;font-size:11px;padding:2px;cursor:pointer;text-align:center;">Abbandona la sfida</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const canvas = wrap.querySelector("#sg-canvas");
    const ctx = canvas.getContext("2d");
    const scoreAEl = wrap.querySelector("#sg-score-a");
    const scoreBEl = wrap.querySelector("#sg-score-b");
    const roundLbl = wrap.querySelector("#sg-round-lbl");
    const timerLbl = wrap.querySelector("#sg-timer-lbl");
    const spellTargetEl = wrap.querySelector("#sg-spell-target");

    function pickTargetLabel() { if (spellTargetEl) spellTargetEl.textContent = `${targetSpell.shape}`; }
    function pickTargetSpell() {
      targetSpell = SPELLS[(round - 1) % SPELLS.length];
      pickTargetLabel();
      roundTimer = diff === "sfida" ? 3.8 : diff === "storia" ? 6.5 : 5.0;
    }
    pickTargetSpell();

    const pHit = diff === "sfida" ? 0.7 : diff === "storia" ? 0.95 : 0.82;
    const oppPower = diff === "sfida" ? 0.62 : diff === "storia" ? 0.22 : 0.45;
    function castSpell(spellId, timeout) {
      if (phase !== "draw") return;
      phase = "anim";
      animTimer = 0;
      const sp = SPELLS.find((x) => x.id === spellId) || targetSpell;
      const isCorrect = !timeout && sp.id === targetSpell.id;

      let playerScores = false, oppScores = false;
      if (timeout) animText = "⏳ Tempo scaduto! Il sigillo si dissolve.";
      else if (!isCorrect) animText = `🌫️ Il sigillo sbagliato svanisce nel nulla.`;
      else if (Math.random() < pHit) { playerScores = true; animText = `✨ ${sp.name}! GOL ARCANO!`; snd("goal"); }
      else animText = `🛡️ Parata dell'avversario! Il tiro è respinto.`;

      // l'avversario attacca sempre; lo Scudo ben tracciato dimezza il pericolo
      const pr = oppPower * (isCorrect && sp.id === "scudo" ? 0.5 : 1);
      if (Math.random() < pr) { oppScores = true; animText += " Ma l'avversario segna!"; }

      snd(sp.id === "tuono" ? "thunder" : sp.id === "scudo" ? "shield" : "spell");
      if (playerScores) scoreA++;
      if (oppScores) scoreB++;
      scoreAEl.textContent = scoreA;
      scoreBEl.textContent = scoreB;
      for (let i = 0; i < 24; i++) {
        const ang = Math.random() * Math.PI * 2, spd = 2 + Math.random() * 4;
        auraSparkles.push({ x: 180, y: 70, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, color: playerScores ? "#fbbf24" : "#a855f7", life: 30 });
      }
    }

    // Touch / pointer drawing on canvas
    function getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    }

    canvas.addEventListener("pointerdown", (e) => {
      if (phase !== "draw") return;
      isDrawing = true;
      strokePoints = [getCanvasCoords(e)];
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!isDrawing || phase !== "draw") return;
      if (strokePoints.length < 300) strokePoints.push(getCanvasCoords(e));
    });

    window.addEventListener("pointerup", () => {
      if (!isDrawing) return;
      isDrawing = false;
      if (phase === "draw" && strokePoints.length > 5) {
        const got = classify(strokePoints);
        if (got) castSpell(got);
        else if (spellTargetEl) { spellTargetEl.textContent = "Gesto non riconosciuto: riprova!"; setTimeout(() => { if (phase === "draw") pickTargetLabel(); }, 900); }
      }
      strokePoints = [];
    });

    // Spell buttons click
    wrap.querySelectorAll(".sg-spell-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        castSpell(btn.dataset.id);
      });
    });

    // Keyboard shortcuts
    function onKeyDown(e) {
      if (e.key === "1") castSpell(SPELLS[0].id);
      else if (e.key === "2") castSpell(SPELLS[1].id);
      else if (e.key === "3") castSpell(SPELLS[2].id);
      else if (e.key === "4") castSpell(SPELLS[3].id);
      
    }
    window.addEventListener("keydown", onKeyDown);

    // End match cleanup
    function finishMatch(forceWin) {
      if (wrap._done) return;
      wrap._done = true;
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(animId);

      const win = forceWin !== undefined ? forceWin : (scoreA > scoreB);
      const res = {
        a: scoreA,
        b: scoreB,
        win: win,
        quit: false,
        data: { rounds: round, spell: targetSpell.id }
      };

      if (window.__sagaCore && window.__sagaCore.endMatch) {
        window.__sagaCore.endMatch();
      }

      wrap.innerHTML = `
        <div style="background:#0f172a;border:2px solid ${win ? "#fbbf24" : "#ef4444"};border-radius:16px;padding:24px 28px;text-align:center;max-width:320px;box-shadow:0 0 30px rgba(0,0,0,.8);">
          <div style="font-size:38px;margin-bottom:8px;">${win ? "🏆" : "📜"}</div>
          <h2 style="margin:0 0 8px;font-size:20px;color:${win ? "#fbbf24" : "#f87171"};">${win ? (opts.winTitle || "ESAME SUPERATO!") : "PROVA NON SUPERATA"}</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#cbd5e1;">Risultato finale: <b>${scoreA} - ${scoreB}</b></p>
          <button type="button" id="sg-cont-btn" style="background:#4338ca;border:none;border-radius:10px;padding:10px 24px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(67,56,202,.5);">Continua ▸</button>
        </div>
      `;
      wrap.querySelector("#sg-cont-btn").onclick = () => {
        wrap.remove();
        if (opts.onDone) opts.onDone(res);
        else if (opts.done) opts.done(res);
      };
    }

    wrap.querySelector("#sg-quit-btn").onclick = () => {
      finishMatch(false);
    };

    // Render loop
    let lastTime = performance.now();
    let animId = null;

    function loop(now) {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      // Update timer & round state
      if (phase === "draw") {
        roundTimer -= dt;
        if (timerLbl) timerLbl.textContent = Math.max(0, roundTimer).toFixed(1) + "s";
        if (roundTimer <= 0) castSpell(targetSpell.id, true);
      } else if (phase === "anim") {
        animTimer += dt;
        if (animTimer > 1.8) {
          if (round >= totalRounds && (scoreA !== scoreB || round >= totalRounds + 3)) {
            phase = "result";
            finishMatch(scoreA > scoreB);
            return;
          } else {
            round++;
            roundLbl.textContent = round > totalRounds ? `SPAREGGIO ${round - totalRounds}` : `TURNO ${round}/${totalRounds}`;
            phase = "draw";
            pickTargetSpell();
          }
        }
      }

      // Draw Court Canvas
      ctx.fillStyle = "#050814";
      ctx.fillRect(0, 0, W, H);

      // Arcane pitch perspective
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#1e1b4b");
      grad.addColorStop(0.5, "#0f172a");
      grad.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = grad;
      ctx.fillRect(10, 10, W - 20, H - 20);

      // Runic lines on court
      ctx.strokeStyle = "rgba(99,102,241,.35)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 20, W - 40, H - 40);

      // Center magical circle
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 35, 0, Math.PI * 2);
      ctx.stroke();

      // Pulsing magic goal in top court
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(130, 15, 100, 25);
      ctx.fillStyle = "rgba(251,191,36,.12)";
      ctx.fillRect(130, 15, 100, 25);
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 9px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("PORTA ARCANA", 180, 31);

      // Target rune hint in center
      if (phase === "draw") {
        ctx.save();
        ctx.strokeStyle = "rgba(251,191,36,.25)";
        ctx.lineWidth = 4;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        if (targetSpell.id === "vento") {
          ctx.arc(180, 110, 24, 0, Math.PI * 2);
        } else if (targetSpell.id === "tuono") {
          ctx.moveTo(165, 95); ctx.lineTo(195, 95); ctx.lineTo(165, 125); ctx.lineTo(195, 125);
        } else if (targetSpell.id === "scudo") {
          ctx.moveTo(180, 90); ctx.lineTo(198, 125); ctx.lineTo(162, 125); ctx.closePath();
        } else {
          ctx.moveTo(160, 110); ctx.bezierCurveTo(170, 90, 175, 130, 180, 110); ctx.bezierCurveTo(185, 90, 190, 130, 200, 110);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Draw user stroke trail
      if (strokePoints.length > 1) {
        ctx.save();
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "#c084fc";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(strokePoints[0].x, strokePoints[0].y);
        for (let i = 1; i < strokePoints.length; i++) {
          ctx.lineTo(strokePoints[i].x, strokePoints[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Ball / Spell orb
      const bProgress = phase === "anim" ? Math.min(1, animTimer * 1.5) : 0;
      const curBallX = ballPos.x + (ballTarget.x - ballPos.x) * bProgress + Math.sin(now / 150) * 4;
      const curBallY = ballPos.y + (ballTarget.y - ballPos.y) * bProgress;

      ctx.save();
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(curBallX, curBallY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Sparkles
      for (let i = auraSparkles.length - 1; i >= 0; i--) {
        const p = auraSparkles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
        if (p.life <= 0) auraSparkles.splice(i, 1);
      }

      // Animation banner
      if (phase === "anim" && animText) {
        ctx.save();
        ctx.fillStyle = "rgba(15,23,42,.88)";
        ctx.fillRect(40, 85, W - 80, 36);
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(40, 85, W - 80, 36);
        ctx.fillStyle = "#fef08a";
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(animText, W / 2, 107);
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    const state = {
      opts,
      round: () => round,
      score: () => ({ a: scoreA, b: scoreB }),
      finish: (forceWin) => finishMatch(forceWin)
    };
    G_STATE = state;
    return state;
  }

  window.__runaMatch = {
    start, classify,
    state: () => G_STATE
  };
  window.__runa = window.__runaMatch;
})();
