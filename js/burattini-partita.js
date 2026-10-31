// js/burattini-partita.js - «PUPPET STRIKER» · Calcio a Fili '74
// La partita originale di «La Giostra dei Burattini»:
// Sul proscenio ligneo di un teatrino d'epoca, due coppie di marionette di legno sospese a un bilancino (crociera)
// si affrontano per calciare il pallone di cuoio nella porticina con campanella in ottone.
// Comandi:
//  - Levetta analogica o frecce: inclinano il bilancino e muovono il baricentro oscillante delle marionette (fisica pendolare).
//  - Tasto A: tira il filo della gamba destra per scoccare un tiro radente o una volée al volo.
//  - Tasto B: tira il filo del busto/testa per stacco aereo, incornata o respinta difensiva.
//  - Evita che i fili si incrocino: se le marionette si sovrappongono troppo a lungo, i fili si aggrovigliano!
// Uso: window.__burattiniPartita.start({ title, opp, half, onDone({ win, a, b, quit }) })
(function () {
  "use strict";
  if (window.__burattiniPartita) return;

  const W = 380, H = 220;
  let M = null;

  function css() {
    if (document.getElementById("burPartitaCss")) return;
    const st = document.createElement("style");
    st.id = "burPartitaCss";
    st.textContent = `#burOv{position:fixed;inset:0;z-index:300;background:#0d0806;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px;color:#fef08a;font-family:system-ui,Georgia,serif;touch-action:none;user-select:none;-webkit-user-select:none}
#burOv .top{width:min(100%,520px);display:flex;justify-content:space-between;align-items:center;background:#2b1810;border:2px solid #b45309;border-radius:6px;padding:4px 10px;font:700 13px Georgia,serif;color:#fef08a}
#burOv canvas{width:min(100%,520px);aspect-ratio:19/11;border:3px solid #78350f;border-radius:6px;background:#1a0f0a;touch-action:none;display:block}
#burOv .bar{width:min(100%,520px);display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:4px}
#burOv .act{display:flex;gap:8px}
#burOv .act button{font:800 14px system-ui;border:2px solid #b45309;border-radius:8px;padding:8px 14px;background:#451a03;color:#fef08a;cursor:pointer;touch-action:none}
#burOv .act button:active,#burOv .act button.on{background:#b45309;color:#fff}
#burOv .esci{background:#2b1810;border:1px solid #78350f;color:#e5e7eb;border-radius:6px;padding:6px 10px;font-size:12px;cursor:pointer}
#burOv .card{background:#2b1810;border:2px solid #b45309;border-radius:8px;padding:14px;max-width:420px;text-align:center;color:#fef08a}
#burOv .card h3{margin:0 0 6px;font:900 20px Georgia,serif;color:#fbbf24}
#burOv .card p{margin:6px 0;font-size:13px;line-height:1.4;color:#fde68a}
#burOv .card button{margin-top:10px;font:800 15px system-ui;border:2px solid #b45309;border-radius:8px;padding:10px 16px;background:#b45309;color:#fff;width:100%;cursor:pointer}
#burOv .ov{position:absolute;inset:0;background:rgba(13,8,6,.92);display:flex;align-items:center;justify-content:center;padding:16px;z-index:10}`;
    document.head.appendChild(st);
  }

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function tone(f, d, type, v) {
    try {
      const AC = window.__bpAC = window.__bpAC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
      o.type = type || "triangle";
      o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(v || 0.05, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(AC.destination);
      o.start(t); o.stop(t + d + 0.02);
    } catch (e) {}
  }

  function start(o) {
    if (M) return false;
    css();
    o = o || {};
    const dur = (o.half || 45) * 60;
    M = {
      o, t: 0, dur, score: [0, 0],
      over: false, pause: false, raf: 0,
      inp: { l: 0, r: 0, u: 0, d: 0, a: 0, b: 0 },
      shake: 0, goalFlash: 0, bellAnim: 0, tangle: 0,
      ball: { x: W / 2, y: 160, vx: 0, vy: 0, r: 4.5, rot: 0 },
      // Squadra Giocatore: Due marionette sospese (Capitan Furia p0, Fra' Bastone p1)
      p: [
        { id: "furia", x: 120, y: 150, cx: 120, vx: 0, legAng: 0, headAng: 0, col: "#dc2626", col2: "#fbbf24", role: "att" },
        { id: "bastone", x: 60, y: 155, cx: 60, vx: 0, legAng: 0, headAng: 0, col: "#78350f", col2: "#fef08a", role: "dif" }
      ],
      // Squadra Avversaria: Due marionette rivali (Compagnia Nera)
      q: [
        { id: "spadino", x: 260, y: 150, cx: 260, vx: 0, legAng: 0, headAng: 0, col: o.oppCol || "#1e293b", col2: "#94a3b8", role: "att" },
        { id: "golia", x: 320, y: 155, cx: 320, vx: 0, legAng: 0, headAng: 0, col: o.oppCol2 || "#0f172a", col2: "#dc2626", role: "dif" }
      ],
      parts: [],
      msg: o.intro || "In bilico sui fili: calibra il bilancino, calcia con A, svetta di testa con B!"
    };

    const el = document.createElement("div");
    el.id = "burOv";
    el.innerHTML = `<div class="top">
      <span>🎭 ${esc(o.title || "Calcio a Fili '74")}</span>
      <span class="sc">TU 0 - 0 ${esc(o.oppName || "RIVALI")}</span>
      <span class="tm">45s</span>
    </div>
    <canvas width="${W * 2}" height="${H * 2}"></canvas>
    <div class="bar">
      <div class="act">
        <button type="button" data-k="a">🦵 Calcio (A)</button>
        <button type="button" data-k="b">🎭 Incornata (B)</button>
      </div>
      <button type="button" class="esci">Esci</button>
    </div>`;
    document.body.appendChild(el);
    M.el = el;

    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    g.scale(2, 2);
    M.g = g; M.cv = cv;

    const scEl = el.querySelector(".sc"), tmEl = el.querySelector(".tm");

    // Controlli da tastiera
    const onKey = (e, down) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") M.inp.l = down ? 1 : 0;
      if (k === "arrowright" || k === "d") M.inp.r = down ? 1 : 0;
      if (k === "arrowup" || k === "w") M.inp.u = down ? 1 : 0;
      if (k === "arrowdown" || k === "s") M.inp.d = down ? 1 : 0;
      if (k === "j" || k === "z") M.inp.a = down ? 1 : 0;
      if (k === "k" || k === "x") M.inp.b = down ? 1 : 0;
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    // Pulsanti touch
    el.querySelectorAll(".act button").forEach((b) => {
      const k = b.dataset.k;
      const setK = (on) => { M.inp[k] = on ? 1 : 0; b.classList.toggle("on", !!on); };
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); setK(true); });
      b.addEventListener("pointerup", () => setK(false));
      b.addEventListener("pointercancel", () => setK(false));
      b.addEventListener("pointerleave", () => setK(false));
    });

    el.querySelector(".esci").onclick = () => finish(true);

    // Controlli touch direzionali sul canvas (trascinamento crociera)
    let pointerX = null;
    cv.addEventListener("pointerdown", (e) => {
      const r = cv.getBoundingClientRect();
      pointerX = ((e.clientX - r.left) / r.width) * W;
    });
    cv.addEventListener("pointermove", (e) => {
      if (pointerX == null) return;
      const r = cv.getBoundingClientRect(), nx = ((e.clientX - r.left) / r.width) * W;
      const dx = nx - pointerX;
      if (dx < -4) { M.inp.l = 1; M.inp.r = 0; }
      else if (dx > 4) { M.inp.r = 1; M.inp.l = 0; }
      else { M.inp.l = 0; M.inp.r = 0; }
    });
    const releasePointer = () => { pointerX = null; M.inp.l = 0; M.inp.r = 0; };
    cv.addEventListener("pointerup", releasePointer);
    cv.addEventListener("pointercancel", releasePointer);

    function burst(x, y, n, col) {
      for (let i = 0; i < n; i++) {
        M.parts.push({
          x, y, vx: (Math.random() - 0.5) * 3.5,
          vy: -Math.random() * 3.2 - 0.5,
          l: 25 + Math.random() * 20, col: col || "#fbbf24"
        });
      }
    }

    function tick() {
      if (M.over) return;
      M.t++;
      if (M.shake > 0) M.shake--;
      if (M.goalFlash > 0) M.goalFlash--;
      if (M.bellAnim > 0) M.bellAnim--;

      // Aggiornamento tempo
      const rem = Math.max(0, Math.ceil((M.dur - M.t) / 60));
      tmEl.textContent = rem + "s";
      scEl.textContent = `TU ${M.score[0]} - ${M.score[1]} ${esc(o.oppName || "RIVALI")}`;

      // Fisica marionette Giocatore (p0 attaccante, p1 difensore)
      const moveSpd = 2.4;
      if (M.inp.l) { M.p[0].cx -= moveSpd; M.p[1].cx -= moveSpd * 0.9; }
      if (M.inp.r) { M.p[0].cx += moveSpd; M.p[1].cx += moveSpd * 0.9; }

      // Limiti crociera sul palcoscenico
      M.p[0].cx = Math.max(70, Math.min(230, M.p[0].cx));
      M.p[1].cx = Math.max(30, Math.min(150, M.p[1].cx));

      // Fisica pendolare elastica per ogni burattino
      [M.p, M.q].forEach((team, isOpp) => {
        team.forEach((m) => {
          const dx = m.cx - m.x;
          m.vx = (m.vx + dx * 0.12) * 0.88;
          m.x += m.vx;
          // Inclinazione gambe al tiro o corsa
          if (!isOpp && M.inp.a) {
            m.legAng = Math.min(1.2, m.legAng + 0.25);
          } else {
            m.legAng = m.legAng * 0.82;
          }
          // Inclinazione testa per incornata
          if (!isOpp && M.inp.b) {
            m.headAng = Math.min(0.8, m.headAng + 0.2);
          } else {
            m.headAng = m.headAng * 0.85;
          }
        });
      });

      // AI avversaria semplice ma reattiva
      const b = M.ball;
      const qAtt = M.q[0], qDif = M.q[1];
      // Attaccante rivale insegue la palla per calciare
      if (b.x > 180) {
        qAtt.cx += (b.x - qAtt.cx) * 0.08;
        if (Math.abs(b.x - qAtt.x) < 22 && b.y > 140) {
          qAtt.legAng = 1.1; // calcia
        } else {
          qAtt.legAng *= 0.8;
        }
      } else {
        qAtt.cx += (260 - qAtt.cx) * 0.04;
      }
      // Portiere/difensore rivale copre la linea di porta
      const targetGkY = Math.max(290, Math.min(350, b.x + (b.vx * 12)));
      qDif.cx += (targetGkY - qDif.cx) * 0.06;
      qAtt.cx = Math.max(160, Math.min(320, qAtt.cx));
      qDif.cx = Math.max(280, Math.min(355, qDif.cx));

      // Controllo aggrovigliamento fili tra p0 e p1
      if (Math.abs(M.p[0].x - M.p[1].x) < 14) {
        M.tangle = Math.min(100, M.tangle + 1.2);
      } else {
        M.tangle = Math.max(0, M.tangle - 0.8);
      }

      // Fisica del pallone di cuoio
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.22; // gravità
      b.rot += b.vx * 0.12;

      // Rimbalzo pavimento palco
      if (b.y > 178) {
        b.y = 178;
        b.vy = -b.vy * 0.65;
        b.vx *= 0.92;
        if (Math.abs(b.vy) < 0.4) b.vy = 0;
      }

      // Rimbalzo pareti laterali (escluse le bocche di porta tra y 135 e 180)
      const inGoalHeight = b.y >= 135 && b.y <= 180;
      if (b.x < 18 && !inGoalHeight) {
        b.x = 18; b.vx = Math.abs(b.vx) * 0.75;
        tone(220, 0.06, "square", 0.03);
      }
      if (b.x > W - 18 && !inGoalHeight) {
        b.x = W - 18; b.vx = -Math.abs(b.vx) * 0.75;
        tone(220, 0.06, "square", 0.03);
      }

      // Collisione pallone con le marionette
      const checkHit = (m, isOpp) => {
        const dx = b.x - m.x, dy = b.y - (m.y - 10);
        const dist = Math.hypot(dx, dy);
        if (dist < 18) {
          // Calcio o colpo di testa
          const fwd = isOpp ? -1 : 1;
          const kickPow = m.legAng > 0.4 ? 4.8 : m.headAng > 0.3 ? 3.8 : 2.2;
          b.vx = fwd * (kickPow + Math.abs(m.vx) * 0.6);
          b.vy = m.headAng > 0.3 ? -3.4 : (m.legAng > 0.4 ? -2.2 : -1.4);
          m.legAng = 0;
          tone(m.headAng > 0.3 ? 380 : 180, 0.08, "triangle", 0.08);
          burst(b.x, b.y, 6, isOpp ? m.col : "#fbbf24");
          M.shake = 4;
        }
      };
      M.p.forEach((m) => checkHit(m, false));
      M.q.forEach((m) => checkHit(m, true));

      // Gol a sinistra (porta TU, rete di RIVALI)
      if (b.x < 6 && inGoalHeight) {
        M.score[1]++;
        onGoal(1);
      }
      // Gol a destra (porta RIVALI, rete di TU)
      else if (b.x > W - 6 && inGoalHeight) {
        M.score[0]++;
        onGoal(0);
      }

      // Particelle
      M.parts = M.parts.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.1;
        return --p.l > 0;
      });

      // Fine tempo
      if (M.t >= M.dur) {
        finish(false);
      }
    }

    function onGoal(team) {
      M.shake = 12;
      M.goalFlash = 24;
      M.bellAnim = 40;
      tone(1200, 0.4, "sine", 0.15); // suono campanella di porta
      burst(team === 0 ? W - 14 : 14, 155, 26, team === 0 ? "#fbbf24" : "#ef4444");
      // Reset palla al centro
      M.ball.x = W / 2;
      M.ball.y = 130;
      M.ball.vx = (team === 0 ? -1 : 1) * 1.5;
      M.ball.vy = -2.5;
    }

    function finish(quit) {
      if (M.over) return;
      M.over = true;
      cancelAnimationFrame(M.raf);
      const win = M.score[0] > M.score[1];
      const ov = document.createElement("div");
      ov.className = "ov";
      ov.innerHTML = `<div class="card">
        <h3>${quit ? "Spettacolo Interrotto" : win ? "🏆 Vittoria alla Giostra!" : M.score[0] === M.score[1] ? "🤝 Pareggio sul Palco" : "Sconfitta tra i Trucioli"}</h3>
        <p style="font-size:18px;font-weight:900;color:#fbbf24">TU ${M.score[0]} - ${M.score[1]} ${esc(o.oppName || "RIVALI")}</p>
        <p>${win ? "I fili hanno retto con maestria! Il pubblico lancia monete ed esulta tra i banchi del rione." : "I tiranti hanno ceduto all'avversario. Mastro Taddeo ti porge una lima per ricalibrare i legni."}</p>
        <button type="button" class="chiudi">Continua ▸</button>
      </div>`;
      ov.querySelector(".chiudi").onclick = () => {
        el.remove();
        const res = { win, a: M.score[0], b: M.score[1], quit: !!quit };
        M = null;
        try { if (o.onDone) o.onDone(res); } catch (e) { console.error(e); }
      };
      el.appendChild(ov);
    }

    // Loop grafico
    function draw() {
      if (!M) return;
      tick();
      const g = M.g;
      const sh = M.shake > 0 ? (Math.random() - 0.5) * M.shake * 0.6 : 0;
      g.save();
      g.translate(sh, sh * 0.5);

      // Sfondo: Teatrino antico e drappeggi in velluto cremisi
      g.fillStyle = "#1c0d06";
      g.fillRect(0, 0, W, H);

      // Grana tavole lignee del fondo
      for (let bx = 0; bx < W; bx += 24) {
        g.fillStyle = (bx / 24) % 2 === 0 ? "#2b140b" : "#221008";
        g.fillRect(bx, 20, 24, 160);
        g.strokeStyle = "rgba(0,0,0,0.35)";
        g.strokeRect(bx, 20, 24, 160);
      }

      // Travature superiori e carrucole del soffitto
      g.fillStyle = "#451a03";
      g.fillRect(0, 0, W, 22);
      g.fillStyle = "#78350f";
      g.fillRect(0, 18, W, 4);

      // Drappeggi laterali del sipario rosso
      g.fillStyle = "#991b1b";
      g.beginPath();
      g.moveTo(0, 0); g.lineTo(24, 0); g.lineTo(16, 180); g.lineTo(0, 180); g.fill();
      g.moveTo(W, 0); g.lineTo(W - 24, 0); g.lineTo(W - 16, 180); g.lineTo(W, 180); g.fill();
      // Festone superiore
      g.fillStyle = "#b91c1c";
      for (let fx = 20; fx < W - 20; fx += 34) {
        g.beginPath();
        g.arc(fx + 17, 18, 17, Math.PI, 0);
        g.fill();
        g.strokeStyle = "#fbbf24";
        g.lineWidth = 1;
        g.stroke();
      }

      // Palcoscenico (pavimento di travi dorate)
      g.fillStyle = "#78350f";
      g.fillRect(0, 180, W, 40);
      g.fillStyle = "#92400e";
      g.fillRect(0, 180, W, 3);
      g.fillStyle = "#451a03";
      for (let px = 0; px < W; px += 38) {
        g.fillRect(px, 183, 1.5, 37);
      }

      // Porticine di legno con rete in refe e campanella in ottone
      // Porta Sinistra (TU)
      g.strokeStyle = "#fbbf24"; g.lineWidth = 2.5;
      g.strokeRect(4, 135, 14, 45);
      g.fillStyle = "rgba(251,191,36,0.15)";
      g.fillRect(4, 135, 14, 45);
      // Campanella sinistra
      g.fillStyle = "#fef08a";
      g.beginPath(); g.arc(11, 132, 3.5, 0, 7); g.fill();

      // Porta Destra (RIVALI)
      g.strokeStyle = "#f59e0b"; g.lineWidth = 2.5;
      g.strokeRect(W - 18, 135, 14, 45);
      g.fillStyle = "rgba(245,158,11,0.15)";
      g.fillRect(W - 18, 135, 14, 45);
      // Campanella destra
      g.fillStyle = "#fef08a";
      const bellY = M.bellAnim > 0 ? 132 + Math.sin(M.t * 0.8) * 2.5 : 132;
      g.beginPath(); g.arc(W - 11, bellY, 3.5, 0, 7); g.fill();

      // Disegno fili sospesi e bilancini superiori
      const drawMarionette = (m, isOpp) => {
        // Crociera di legno in alto
        g.fillStyle = "#d97706";
        g.fillRect(m.cx - 10, 12, 20, 3);
        g.fillRect(m.cx - 2, 8, 4, 10);

        // Fili di refe (testa, braccia, gambe)
        g.strokeStyle = "rgba(254,240,138,0.45)";
        g.lineWidth = 0.65;
        g.beginPath();
        g.moveTo(m.cx - 7, 14); g.lineTo(m.x - 4, m.y - 18);
        g.moveTo(m.cx + 7, 14); g.lineTo(m.x + 4, m.y - 18);
        g.moveTo(m.cx, 14); g.lineTo(m.x, m.y - 26);
        g.stroke();

        // Ombra sul palco
        g.fillStyle = "rgba(0,0,0,0.38)";
        g.beginPath();
        g.ellipse(m.x, 181, 8, 2.5, 0, 0, 7);
        g.fill();

        // Busto di legno
        g.save();
        g.translate(m.x, m.y - 12);
        // Testa intagliata
        g.save();
        g.rotate(isOpp ? -m.headAng : m.headAng);
        g.fillStyle = "#d4b996";
        g.beginPath(); g.arc(0, -12, 5.5, 0, 7); g.fill();
        g.fillStyle = m.col2; // Cappello o maschera
        g.fillRect(-5, -18, 10, 4);
        g.restore();

        // Torso sagomato
        g.fillStyle = m.col;
        g.fillRect(-5, -7, 10, 11);
        g.strokeStyle = "#451a03"; g.lineWidth = 1;
        g.strokeRect(-5, -7, 10, 11);

        // Gambe articolate
        const sgn = isOpp ? -1 : 1;
        g.strokeStyle = "#d4b996"; g.lineWidth = 2.4;
        g.beginPath();
        g.moveTo(-3, 4); g.lineTo(-4 + Math.sin(m.legAng) * 6 * sgn, 12);
        g.moveTo(3, 4); g.lineTo(3 - Math.sin(m.legAng) * 4 * sgn, 12);
        g.stroke();

        // Scarpette di cuoio
        g.fillStyle = "#451a03";
        g.fillRect(-5 + Math.sin(m.legAng) * 6 * sgn, 11, 4, 2.5);
        g.fillRect(2 - Math.sin(m.legAng) * 4 * sgn, 11, 4, 2.5);
        g.restore();
      };

      // Disegno tutte le marionette
      M.p.forEach((m) => drawMarionette(m, false));
      M.q.forEach((m) => drawMarionette(m, true));

      // Disegno pallone di cuoio
      const b0 = M.ball;
      // Ombra pallone
      g.fillStyle = "rgba(0,0,0,0.4)";
      g.beginPath();
      g.ellipse(b0.x, 181, b0.r * 0.9, 2, 0, 0, 7);
      g.fill();
      // Pallone
      g.save();
      g.translate(b0.x, b0.y);
      g.rotate(b0.rot);
      g.fillStyle = "#fef08a";
      g.beginPath(); g.arc(0, 0, b0.r, 0, 7); g.fill();
      g.strokeStyle = "#78350f"; g.lineWidth = 1; g.stroke();
      // Cuciture a pentagono di cuoio
      g.fillStyle = "#78350f";
      for (let a = 0; a < 3; a++) {
        const ang = a * 2.1;
        g.beginPath(); g.arc(Math.cos(ang) * 2, Math.sin(ang) * 2, 1, 0, 7); g.fill();
      }
      g.restore();

      // Particelle trucioli e scintille
      M.parts.forEach((p) => {
        g.fillStyle = p.col;
        g.fillRect(p.x, p.y, 2, 2);
      });

      // Indicatore Aggrovigliamento Fili (se critico)
      if (M.tangle > 20) {
        g.fillStyle = "rgba(13,8,6,0.8)";
        g.fillRect(W / 2 - 40, 26, 80, 12);
        g.fillStyle = M.tangle > 70 ? "#ef4444" : "#f59e0b";
        g.fillRect(W / 2 - 38, 28, 76 * (M.tangle / 100), 8);
        g.fillStyle = "#fff";
        g.font = "bold 8px system-ui";
        g.textAlign = "center";
        g.fillText("FILI INTRECCIATI!", W / 2, 35);
      }

      // Flash del gol
      if (M.goalFlash > 0) {
        g.fillStyle = `rgba(254,240,138,${M.goalFlash / 40})`;
        g.fillRect(0, 0, W, H);
      }

      g.restore();
      if (!M.over) M.raf = requestAnimationFrame(draw);
    }

    M.raf = requestAnimationFrame(draw);
    M.finish = () => finish(false);
    return true;
  }

  window.__burattiniPartita = {
    start,
    state: () => M,
    finish: () => {
      if (M) {
        M.finish();
        const b = document.querySelector("#burOv .chiudi");
        if (b) b.click();
      }
    }
  };
})();
