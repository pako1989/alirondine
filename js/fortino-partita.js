// js/fortino-partita.js - «LASER & RIMBALZO · CAVEAU TACTICS»
// Motore di partita originale per «Colpo al Fortino · La Notte del Trofeo Scomparso».
// Infiltrazione nei caveau di massima sicurezza:
//  - GRIGLIA BLINDATA & PRISMI RIFLETTENTI: la palla rimbalza su pareti d'acciaio e specchi orientabili.
//  - BARRIERE LASER MOBILI: sensori ottici a scansione; colpirli alza l'allarme e smorza la traiettoria.
//  - DISATTIVAZIONE TERMINALI: colpisci i 3 nodi di sicurezza per disattivare le chiusure stagne e fare gol nel Caveau Centrale!
//  - COMANDI: tocco/trascinamento della traiettoria di tiro, tocco sui prismi per ruotarli, supporto tastiera (frecce + Spazio).
(function () {
  "use strict";
  if (window.__fortinoMatch) return;

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
      if (type === "laser") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.linearRampToValueAtTime(300, t + 0.12);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.13);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.14);
      } else if (type === "prism") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(2400, t + 0.08);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (type === "kick") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(170, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.11);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.13);
      } else if (type === "alarm") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(880, t + 0.08);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.24);
      } else if (type === "goal") {
        [523, 659, 784, 1046].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, t + i * 0.08);
          gain.gain.setValueAtTime(0.22, t + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.005, t + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.42);
        });
      }
    } catch (_) {}
  }

  function start(opts) {
    opts = opts || {};
    const wrap = document.createElement("div");
    wrap.className = "fortino-match-ovl";
    wrap.style.cssText = "position:fixed;inset:0;z-index:9999;background:#050814;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;color:#f8fafc;user-select:none;touch-action:none;";

    wrap.innerHTML = `
      <div style="width:100%;max-width:440px;display:flex;justify-content:space-between;align-items:center;padding:6px 12px;background:#0f172a;border-bottom:2px solid #38bdf8;font-size:13px;box-sizing:border-box;">
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:16px;">🚨</span>
          <b style="color:#38bdf8;">CAVEAU TACTICS</b>
        </div>
        <div id="foHudScore" style="font-size:15px;font-weight:900;color:#facc15;">NODI: <span id="foNodes">0/3</span> · TENTATIVI: <span id="foShots">5</span></div>
        <button type="button" id="foQuitBtn" style="background:#ef4444;border:none;color:#fff;border-radius:4px;padding:3px 8px;font-size:11px;font-weight:bold;cursor:pointer;">ABBANDONA</button>
      </div>
      <div style="position:relative;width:100%;max-width:440px;background:#020617;display:flex;justify-content:center;align-items:center;">
        <canvas id="foCanvas" width="${W}" height="${H}" style="width:100%;height:auto;flex:none;display:block;background:#030712;"></canvas>
      </div>
      <div id="foControls" style="width:100%;max-width:440px;padding:8px 12px;background:#0f172a;display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center;box-sizing:border-box;font-size:12px;">
        <div style="display:flex;gap:6px;align-items:center;">
          <button type="button" id="foPrismBtn" style="background:#1e293b;border:1px solid #38bdf8;color:#38bdf8;border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer;">💎 RUOTA PRISMA</button>
          <span id="foMsg" style="color:#94a3b8;font-size:11px;">Trascina o usa MIRA/TIRA</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button type="button" id="foAimLeft" style="background:#334155;border:none;color:#fff;border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer;">◀</button>
          <button type="button" id="foAimRight" style="background:#334155;border:none;color:#fff;border-radius:6px;padding:6px 10px;font-weight:bold;cursor:pointer;">▶</button>
          <button type="button" id="foShootBtn" style="background:linear-gradient(180deg,#38bdf8,#0284c7);border:none;color:#0f172a;border-radius:6px;padding:6px 14px;font-weight:900;cursor:pointer;">⚡ TIRA!</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const cv = wrap.querySelector("#foCanvas");
    const ctx = cv.getContext("2d");
    const nodesEl = wrap.querySelector("#foNodes");
    const shotsEl = wrap.querySelector("#foShots");
    const msgEl = wrap.querySelector("#foMsg");

    const st = {
      wrap,
      opts,
      running: true,
      a: 0,
      b: 0,
      targetGoals: opts.targetGoals || 3,
      shotsLeft: opts.turns || 6,
      frame: 0,
      aimAngle: -Math.PI / 4,
      aimPower: 5.5,
      ball: { x: 50, y: 155, vx: 0, vy: 0, moving: false, r: 5 },
      startPos: { x: 50, y: 155 },
      // Prismi riflettenti orientabili (angolo di rotazione: 0, 45, 90, 135 deg)
      prisms: [
        { x: 130, y: 90, angle: 45, size: 24 },
        { x: 230, y: 140, angle: 135, size: 24 }
      ],
      selectedPrism: 0,
      // Nodi da colpire per disattivare il caveau
      nodes: [
        { x: 310, y: 50, hit: false, color: "#facc15", r: 14, name: "ALPHA" },
        { x: 310, y: 110, hit: false, color: "#38bdf8", r: 14, name: "BETA" },
        { x: 310, y: 170, hit: false, color: "#4ade80", r: 14, name: "GAMMA" }
      ],
      // Barriere laser verticali mobili
      lasers: [
        { x: 180, y1: 20, y2: 120, vy: 0.8, color: "rgba(239,68,68,0.85)" },
        { x: 270, y1: 80, y2: 190, vy: -0.7, color: "rgba(239,68,68,0.85)" }
      ],
      particles: [],
      finish: (win) => {
        st.running = false;
        st.a = win ? st.targetGoals : 0;
        st.b = win ? 0 : 2;
        endGame(st);
      }
    };

    window.__fortinoMatch.state = st;

    // Gestione mira touch / mouse
    let dragging = false;
    function setAim(clientX, clientY) {
      const rect = cv.getBoundingClientRect();
      const x = (clientX - rect.left) * (W / rect.width);
      const y = (clientY - rect.top) * (H / rect.height);
      const dx = x - st.ball.x;
      const dy = y - st.ball.y;
      st.aimAngle = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);
      st.aimPower = Math.min(8, Math.max(3.5, dist / 14));
    }

    cv.addEventListener("pointerdown", (e) => {
      if (st.ball.moving) return;
      // Controlla se ha cliccato su un prisma
      const rect = cv.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (W / rect.width);
      const py = (e.clientY - rect.top) * (H / rect.height);
      for (let i = 0; i < st.prisms.length; i++) {
        const p = st.prisms[i];
        if (Math.hypot(px - p.x, py - p.y) < p.size) {
          p.angle = (p.angle + 45) % 180;
          st.selectedPrism = i;
          snd("prism");
          if (msgEl) msgEl.textContent = `Prisma ${i + 1} ruotato a ${p.angle}°`;
          return;
        }
      }
      dragging = true;
      setAim(e.clientX, e.clientY);
    });

    window.addEventListener("pointermove", (e) => {
      if (!dragging || st.ball.moving) return;
      setAim(e.clientX, e.clientY);
    });

    window.addEventListener("pointerup", () => {
      dragging = false;
    });

    // Pulsanti
    const prismBtn = wrap.querySelector("#foPrismBtn");
    prismBtn.onclick = () => {
      const p = st.prisms[st.selectedPrism];
      p.angle = (p.angle + 45) % 180;
      st.selectedPrism = (st.selectedPrism + 1) % st.prisms.length;
      snd("prism");
      if (msgEl) msgEl.textContent = `Prisma ruotato a ${p.angle}°`;
    };

    wrap.querySelector("#foAimLeft").onclick = () => {
      st.aimAngle -= 0.12;
    };
    wrap.querySelector("#foAimRight").onclick = () => {
      st.aimAngle += 0.12;
    };

    function shoot() {
      if (st.ball.moving || st.shotsLeft <= 0) return;
      st.ball.vx = Math.cos(st.aimAngle) * st.aimPower;
      st.ball.vy = Math.sin(st.aimAngle) * st.aimPower;
      st.ball.moving = true;
      st.shotsLeft--;
      if (shotsEl) shotsEl.textContent = String(st.shotsLeft);
      snd("kick");
      if (msgEl) msgEl.textContent = "Sfera-sonda lanciata!";
    }

    wrap.querySelector("#foShootBtn").onclick = shoot;

    wrap.querySelector("#foQuitBtn").onclick = () => {
      st.finish(false);
    };

    // Pilota automatico per i test
    if (opts.auto) {
      setTimeout(() => {
        st.running = false;
        const win = Math.random() > 0.15;
        st.a = win ? (opts.targetGoals || 2) : 1;
        st.b = win ? 0 : 2;
        if (st.wrap && st.wrap.parentNode) st.wrap.parentNode.removeChild(st.wrap);
        const res = { a: st.a, b: st.b, win, quit: false };
        if (opts.onDone) opts.onDone(res);
        else if (opts.done) opts.done(res);
      }, 25);
      return;
    }

    // Loop grafico e fisico
    function loop() {
      if (!st.running) return;
      st.frame++;
      updatePhysics(st);
      render(ctx, st);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function updatePhysics(st) {
    // Aggiorna laser oscillanti
    for (const l of st.lasers) {
      l.y1 += l.vy;
      l.y2 += l.vy;
      if (l.y1 <= 15 || l.y2 >= H - 15) l.vy *= -1;
    }

    if (!st.ball.moving) return;

    const b = st.ball;
    b.x += b.vx;
    b.y += b.vy;

    // Attrito leggero
    b.vx *= 0.992;
    b.vy *= 0.992;

    // Rimbalzo bordi
    if (b.x - b.r <= 12) {
      b.x = 12 + b.r;
      b.vx *= -0.92;
      snd("kick");
    }
    if (b.x + b.r >= W - 12) {
      b.x = W - 12 - b.r;
      b.vx *= -0.92;
      snd("kick");
    }
    if (b.y - b.r <= 14) {
      b.y = 14 + b.r;
      b.vy *= -0.92;
      snd("kick");
    }
    if (b.y + b.r >= H - 14) {
      b.y = H - 14 - b.r;
      b.vy *= -0.92;
      snd("kick");
    }

    // Collisione con prismi riflettenti
    for (const p of st.prisms) {
      if (Math.hypot(b.x - p.x, b.y - p.y) < p.size / 2 + b.r) {
        const rad = (p.angle * Math.PI) / 180;
        const nx = Math.cos(rad);
        const ny = Math.sin(rad);
        const dot = b.vx * nx + b.vy * ny;
        b.vx = b.vx - 2 * dot * nx;
        b.vy = b.vy - 2 * dot * ny;
        b.x += b.vx * 1.5;
        b.y += b.vy * 1.5;
        snd("prism");
        for (let i = 0; i < 6; i++) {
          st.particles.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 15,
            color: "#38bdf8"
          });
        }
      }
    }

    // Collisione con raggi laser
    for (const l of st.lasers) {
      if (Math.abs(b.x - l.x) < b.r + 4 && b.y >= Math.min(l.y1, l.y2) && b.y <= Math.max(l.y1, l.y2)) {
        b.vx *= -0.7;
        b.vy *= 0.7;
        snd("laser");
        snd("alarm");
        for (let i = 0; i < 8; i++) {
          st.particles.push({
            x: b.x,
            y: b.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 20,
            color: "#ef4444"
          });
        }
      }
    }

    // Collisione con nodi terminali
    for (const n of st.nodes) {
      if (!n.hit && Math.hypot(b.x - n.x, b.y - n.y) < n.r + b.r) {
        n.hit = true;
        st.a++;
        snd("goal");
        const nodesEl = st.wrap.querySelector("#foNodes");
        if (nodesEl) nodesEl.textContent = `${st.a}/${st.targetGoals}`;
        for (let i = 0; i < 15; i++) {
          st.particles.push({
            x: n.x,
            y: n.y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 25,
            color: n.color
          });
        }
      }
    }

    // Ferma la sfera se è troppo lenta
    if (Math.hypot(b.vx, b.vy) < 0.2) {
      b.moving = false;
      b.x = st.startPos.x;
      b.y = st.startPos.y;
      b.vx = 0;
      b.vy = 0;

      // Controllo vittoria o esaurimento tentativi
      if (st.a >= st.targetGoals) {
        st.finish(true);
      } else if (st.shotsLeft <= 0) {
        st.finish(false);
      }
    }

    // Aggiorna particelle
    for (let i = st.particles.length - 1; i >= 0; i--) {
      const pt = st.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life--;
      if (pt.life <= 0) st.particles.splice(i, 1);
    }
  }

  function render(ctx, st) {
    ctx.clearRect(0, 0, W, H);

    // Sfondo pavimento blindato a griglia
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1;
    for (let x = 12; x <= W - 12; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 14);
      ctx.lineTo(x, H - 14);
      ctx.stroke();
    }
    for (let y = 14; y <= H - 14; y += 20) {
      ctx.beginPath();
      ctx.moveTo(12, y);
      ctx.lineTo(W - 12, y);
      ctx.stroke();
    }

    // Cornice corazzata perimetrale
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(12, 14, W - 24, H - 28);

    // Laser verticali
    for (const l of st.lasers) {
      ctx.save();
      ctx.strokeStyle = l.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(l.x, l.y1);
      ctx.lineTo(l.x, l.y2);
      ctx.stroke();

      // Testine emettitori
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(l.x - 3, l.y1 - 3, 6, 6);
      ctx.fillRect(l.x - 3, l.y2 - 3, 6, 6);
      ctx.restore();
    }

    // Prismi riflettenti
    for (let i = 0; i < st.prisms.length; i++) {
      const p = st.prisms[i];
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);

      // Supporto
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-p.size / 2, -4, p.size, 8);

      // Superficie a specchio riflettente in ottone/prisma
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-p.size / 2, -2, p.size, 4);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-p.size / 2, -4, p.size, 8);

      // Indicatore di rotazione
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Nodi di sicurezza caveau
    for (const n of st.nodes) {
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.fillStyle = n.hit ? "#1e293b" : n.color;
      ctx.beginPath();
      ctx.arc(0, 0, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = n.hit ? "#475569" : "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = n.hit ? "#64748b" : "#0f172a";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.hit ? "OK" : n.name, 0, 0);
      ctx.restore();
    }

    // Guida di mira se la sfera è ferma
    if (!st.ball.moving) {
      ctx.save();
      ctx.strokeStyle = "rgba(56,189,248,0.7)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(st.ball.x, st.ball.y);
      ctx.lineTo(
        st.ball.x + Math.cos(st.aimAngle) * (st.aimPower * 14),
        st.ball.y + Math.sin(st.aimAngle) * (st.aimPower * 14)
      );
      ctx.stroke();
      ctx.restore();
    }

    // Pallone-sonda
    const b = st.ball;
    ctx.save();
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = b.moving ? 10 : 4;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // Particelle
    for (const pt of st.particles) {
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function endGame(st) {
    if (!st.running) return;
    st.running = false;
    snd(st.a >= st.targetGoals ? "goal" : "alarm");

    const win = st.a >= st.targetGoals;
    const ov = document.createElement("div");
    ov.style.cssText = "position:absolute;inset:0;background:rgba(2,6,23,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f8fafc;text-align:center;padding:20px;z-index:1000;";
    ov.innerHTML = `
      <div style="font-size:24px;font-weight:900;margin-bottom:8px;color:${win ? "#38bdf8" : "#f87171"}">
        ${win ? "🏆 CAVEAU FORZATO CON SUCCESSO! 🏆" : "🚨 ALLARME GENERALE DEL FORTINO!"}
      </div>
      <div style="font-size:32px;font-weight:900;margin-bottom:12px;color:#ffffff;">
        NODI DISATTIVATI: ${st.a} / ${st.targetGoals}
      </div>
      <div style="font-size:13px;color:#94a3b8;max-width:320px;margin-bottom:18px;line-height:1.5;">
        ${win ? "I rimbalzi sui prismi hanno aggirato i laser e disattivato i circuiti blindati! Il varco è aperto." : "I sensori hanno rilevato l'intrusione. Bisogna riorganizzare la traiettoria di tiro."}
      </div>
      <button type="button" id="foDoneBtn" style="padding:12px 26px;font-size:15px;font-weight:900;background:linear-gradient(180deg,#38bdf8,#0284c7);color:#0f172a;border:none;border-radius:8px;cursor:pointer;box-shadow:0 4px 14px rgba(56,189,248,0.45);">
        CONTINUA ▸
      </button>
    `;
    st.wrap.appendChild(ov);

    const btn = ov.querySelector("#foDoneBtn");
    if (st.opts.auto) setTimeout(() => btn.click(), 20);
    btn.onclick = () => {
      if (st.wrap && st.wrap.parentNode) st.wrap.parentNode.removeChild(st.wrap);
      if (window.__sagaCore && window.__sagaCore.endMatch) window.__sagaCore.endMatch();
      if (st.opts) {
        if (st.opts.onDone) st.opts.onDone({ a: st.a, b: st.b, win, quit: false });
        else if (st.opts.done) st.opts.done({ a: st.a, b: st.b, win, quit: false });
      }
    };
  }

  window.__fortinoMatch = {
    start,
    state: null
  };
})();
