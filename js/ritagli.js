// js/ritagli.js - «RITAGLI» · la partita originale di «Piccolo Borgo di Montagna»
// Calcio a marionette di carta ritagliata (animazione a 12 fps stop-motion, sagome piatte con bordi tagliati a forbice).
// Gameplay a "Molla di Cartone": tocchi e trascini all'indietro un giocatore per caricare la molla (potenza e mira ad arco);
// rilasciando, la sagoma scatta in avanti con un "TAC!" cartaceo e calcia la palla piatta esagonale con traiettorie e rimbalzi secchi.
// Tre azioni speciali: Taglio a Forbice (contrasto netto), Lancio a Fisarmonica (pallonetto a zig-zag), Tiro a Molla Tripla.
(function () {
  "use strict";
  if (window.__ritagli) return;
  const W = 320, H = 175;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random;

  let STATE = null;

  function css() {
    if (document.getElementById("rtCss")) return;
    const st = document.createElement("style");
    st.id = "rtCss";
    st.textContent = `
.rtOv{position:fixed;inset:0;z-index:99999;background:#1e293b;color:#f8fafc;font-family:'Trebuchet MS',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:8px 8px 12px;user-select:none;-webkit-user-select:none;box-sizing:border-box}
.rtOv .hud{width:100%;max-width:360px;display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:13px;background:rgba(15,23,42,.85);padding:6px 10px;border-radius:8px;border:2px dashed #94a3b8;box-sizing:border-box}
.rtOv .hud .sc{font-size:17px;color:#fef08a;letter-spacing:1px}
.rtOv .hud .team{display:inline-flex;align-items:center;gap:6px}
.rtOv .hud .dot{width:10px;height:10px;border-radius:2px;display:inline-block;border:1px solid #000}
.rtOv .bar{width:100%;max-width:360px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#cbd5e1;padding:2px 6px}
.rtOv canvas{width:100%;max-width:360px;height:auto;flex:none;background:#f1f5f9;border:3px solid #334155;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,.45);image-rendering:pixelated}
.rtOv .scr{width:100%;max-width:360px;min-height:36px;background:rgba(15,23,42,.8);border-radius:6px;padding:6px 10px;font-size:12px;line-height:1.3;box-sizing:border-box;border-left:4px solid #38bdf8}
.rtOv .scr b{color:#fef08a}
.rtOv .scr small{display:block;color:#94a3b8;font-size:10px;margin-top:2px}
.rtOv .pad{width:100%;max-width:360px;display:flex;gap:6px;justify-content:center}
.rtOv .pad button{flex:1;min-height:42px;padding:4px 8px;font-weight:900;font-size:13px;border-radius:6px;border:2px solid #0f172a;background:#f8fafc;color:#0f172a;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 3px 0 #0f172a}
.rtOv .pad button small{font-size:9px;font-weight:700;color:#64748b;margin-top:1px}
.rtOv .pad button:active{transform:translateY(2px);box-shadow:none}
.rtOv .pad button.hot{background:#ef4444;color:#fff;border-color:#7f1d1d;box-shadow:0 3px 0 #7f1d1d}
.rtOv .pad button.hot small{color:#fecaca}
.rtOv .pad button.go{background:#22c55e;color:#fff;border-color:#14532d;box-shadow:0 3px 0 #14532d}
.rtOv .pad button.go small{color:#bbf7d0}
.rtOv .ov{position:absolute;inset:0;background:rgba(15,23,42,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;gap:12px;z-index:2}
.rtOv .ov h2{margin:0;font-size:20px;color:#fef08a}
.rtOv .ov p{margin:0;font-size:13px;line-height:1.4;color:#e2e8f0;max-width:300px}
.rtOv .ov .goB{padding:8px 24px;font-size:15px;font-weight:900;border-radius:8px;border:2px solid #000;background:#38bdf8;color:#0f172a;cursor:pointer;box-shadow:0 4px 0 #0284c7}
.rtOv .ov .goB:active{transform:translateY(2px);box-shadow:none}
`;
    document.head.appendChild(st);
  }

  function start(o) {
    if (document.querySelector(".rtOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 };
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.85 : 1;
    const usCol = o.usColor || "#0284c7", opp = Object.assign({ name: "Boscaioli", color: "#b45309", players: [] }, o.opp || {});
    const hero = Object.assign({ name: "Campione" }, o.hero || o.heroLook || {});
    const mate = (o.mates && o.mates[0]) || { name: "Boris" };

    const turnsTotal = o.turns || 6;
    const S = {
      o, a: 0, b: 0, turn: 1, turnsTotal, phase: "intro", over: false,
      ball: { x: W / 2, y: H / 2, vx: 0, vy: 0 },
      drag: null,
      spring: 0,
      springAngle: 0,
      us: [
        { id: "hero", name: hero.name, x: W * 0.35, y: H * 0.48, vx: 0, vy: 0, role: "A" },
        { id: "mate", name: mate.name, x: W * 0.22, y: H * 0.72, vx: 0, vy: 0, role: "C" },
        { id: "gk", name: "Boris GK", x: W * 0.08, y: H * 0.5, vx: 0, vy: 0, role: "P" }
      ],
      oppTeam: [
        { id: "e1", name: opp.players[0] ? opp.players[0].name : "Tronco", x: W * 0.65, y: H * 0.45, vx: 0, vy: 0, role: "A" },
        { id: "e2", name: opp.players[1] ? opp.players[1].name : "Accetta", x: W * 0.78, y: H * 0.68, vx: 0, vy: 0, role: "C" },
        { id: "egk", name: "Abete GK", x: W * 0.92, y: H * 0.5, vx: 0, vy: 0, role: "P" }
      ],
      data: { tiri: 0, gol: 0, contrasti: 0, molle: 0 }
    };
    STATE = S;
    css();

    const el = document.createElement("div");
    el.className = "rtOv";
    el.innerHTML = `
      <div class="hud">
        <span class="team"><i class="dot" style="background:${usCol}"></i> ${esc(o.us || "Noi")}</span>
        <span class="sc">0 – 0</span>
        <span class="team">${esc(opp.name)} <i class="dot" style="background:${opp.color}"></i></span>
      </div>
      <div class="bar">
        <span>✂️ RITAGLI · Turno <b class="trn">1</b>/${turnsTotal}</span>
        <span class="msg">Carica la molla di cartone</span>
      </div>
      <canvas width="${W * 2}" height="${H * 2}"></canvas>
      <div class="scr"><b>CALCIO DI CARTONE</b><small>Tocca un tuo giocatore e tira indietro per caricare la molla. Rilascia per tirare!</small></div>
      <div class="pad"></div>
    `;
    document.body.appendChild(el);
    S.el = el;
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");

    function tone(f, d, type, v, slide) {
      try {
        const A = (window.__rtAC = window.__rtAC || new (window.AudioContext || window.webkitAudioContext)());
        const os = A.createOscillator(), gn = A.createGain();
        os.type = type || "triangle";
        os.frequency.value = f;
        if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d);
        gn.gain.value = v || 0.05;
        gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d);
        os.connect(gn); gn.connect(A.destination);
        os.start(); os.stop(A.currentTime + d);
      } catch (e) {}
    }

    const hud = () => {
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`;
      el.querySelector(".trn").textContent = Math.min(S.turn, S.turnsTotal);
    };

    const scr = (h) => { el.querySelector(".scr").innerHTML = h; };

    function shoot(p, pwr, ang, isHero) {
      const spd = Math.min(18, pwr * 0.45);
      S.ball.vx = Math.cos(ang) * spd;
      S.ball.vy = Math.sin(ang) * spd;
      p.vx = Math.cos(ang) * (spd * 0.4);
      p.vy = Math.sin(ang) * (spd * 0.4);
      tone(440, 0.08, "square", 0.06, 220);
      S.data.tiri++;
      S.data.molle++;
      resolveTurn(isHero);
    }

    function resolveTurn(playerTurn) {
      S.phase = "moving";
      let frames = 0;
      const stepSim = () => {
        frames++;
        // Fisica a scatti (stop motion ~12-15 fps visual)
        S.ball.x += S.ball.vx;
        S.ball.y += S.ball.vy;
        S.ball.vx *= 0.92;
        S.ball.vy *= 0.92;

        // Rimbalzo sponde di cartone
        if (S.ball.y < 20) { S.ball.y = 20; S.ball.vy = -S.ball.vy * 0.8; tone(300, 0.04, "sine", 0.03); }
        if (S.ball.y > H - 20) { S.ball.y = H - 20; S.ball.vy = -S.ball.vy * 0.8; tone(300, 0.04, "sine", 0.03); }

        // Gol a sinistra (loro) o a destra (nostro)
        if (S.ball.x > W - 16 && S.ball.y > H * 0.35 && S.ball.y < H * 0.65) {
          S.a++;
          S.data.gol++;
          tone(587, 0.12, "triangle", 0.08, 880);
          scr(`<b>RETEEEE! GOL DI CARTONE!</b><small>Tiro spettacolare a molla tesa: il pallone piega i pali di legno!</small>`);
          hud();
          resetPositions();
          checkNext();
          return;
        }
        if (S.ball.x < 16 && S.ball.y > H * 0.35 && S.ball.y < H * 0.65) {
          S.b++;
          tone(220, 0.15, "sawtooth", 0.08, 110);
          scr(`<b>GOL DEGLI AVVERSARI!</b><small>La palla scivola sul cartoncino ed entra nell'angolo basso.</small>`);
          hud();
          resetPositions();
          checkNext();
          return;
        }

        // Rimbalzo fondo campo
        if (S.ball.x < 16) { S.ball.x = 16; S.ball.vx = -S.ball.vx * 0.7; }
        if (S.ball.x > W - 16) { S.ball.x = W - 16; S.ball.vx = -S.ball.vx * 0.7; }

        // Attrito giocatori
        [...S.us, ...S.oppTeam].forEach((pl) => {
          pl.x += pl.vx; pl.y += pl.vy;
          pl.vx *= 0.88; pl.vy *= 0.88;
          pl.x = Math.max(18, Math.min(W - 18, pl.x));
          pl.y = Math.max(22, Math.min(H - 22, pl.y));
        });

        draw();

        if (frames < 36 && (Math.abs(S.ball.vx) > 0.4 || Math.abs(S.ball.vy) > 0.4)) {
          requestAnimationFrame(stepSim);
        } else {
          S.ball.vx = 0; S.ball.vy = 0;
          if (playerTurn) {
            // Risposta avversaria
            setTimeout(oppMove, 300);
          } else {
            checkNext();
          }
        }
      };
      stepSim();
    }

    function oppMove() {
      if (S.over) return;
      scr(`<b>TURNO AVVERSARIO: ${esc(opp.name)}</b><small>I rivali caricano la molla di cartone...</small>`);
      const shooter = S.oppTeam[0].x < S.oppTeam[1].x ? S.oppTeam[0] : S.oppTeam[1];
      const targetAngle = Math.atan2((H * 0.5) - S.ball.y, 16 - S.ball.x);
      shooter.x = S.ball.x + 12;
      shooter.y = S.ball.y + (R() - 0.5) * 8;
      setTimeout(() => {
        shoot(shooter, (14 + R() * 8) * oppK, targetAngle + (R() - 0.5) * 0.4, false);
      }, 400);
    }

    function resetPositions() {
      S.ball.x = W / 2; S.ball.y = H / 2; S.ball.vx = 0; S.ball.vy = 0;
      S.us[0].x = W * 0.35; S.us[0].y = H * 0.48;
      S.us[1].x = W * 0.22; S.us[1].y = H * 0.72;
      S.oppTeam[0].x = W * 0.65; S.oppTeam[0].y = H * 0.45;
      S.oppTeam[1].x = W * 0.78; S.oppTeam[1].y = H * 0.68;
    }

    function checkNext() {
      S.turn++;
      hud();
      if (S.turn > S.turnsTotal) {
        finish();
      } else {
        S.phase = "aim";
        scr(`<b>TURNO ${S.turn}: TOCCA A TE!</b><small>Trascina il giocatore per mirare e rilascia, oppure usa i pulsanti d'azione.</small>`);
        draw();
      }
    }

    // Comandi touch / drag su canvas
    let startX = 0, startY = 0, draggingPl = null;
    cv.addEventListener("pointerdown", (e) => {
      if (S.phase !== "aim") return;
      const rect = cv.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * W;
      const cy = ((e.clientY - rect.top) / rect.height) * H;
      // Trova giocatore nostro vicino
      const pl = S.us.find((p) => Math.hypot(p.x - cx, p.y - cy) < 22);
      if (pl) {
        draggingPl = pl;
        startX = cx; startY = cy;
        S.drag = { px: pl.x, py: pl.y, curX: cx, curY: cy };
        try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });

    cv.addEventListener("pointermove", (e) => {
      if (!draggingPl || !S.drag) return;
      const rect = cv.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * W;
      const cy = ((e.clientY - rect.top) / rect.height) * H;
      S.drag.curX = cx; S.drag.curY = cy;
      const dx = startX - cx, dy = startY - cy;
      S.spring = Math.min(36, Math.hypot(dx, dy));
      S.springAngle = Math.atan2(dy, dx);
      draw();
    });

    const releaseDrag = () => {
      if (!draggingPl || !S.drag) return;
      const pl = draggingPl;
      const pwr = S.spring;
      const ang = S.springAngle;
      draggingPl = null; S.drag = null; S.spring = 0;
      if (pwr > 5) {
        shoot(pl, pwr, ang, true);
      } else {
        draw();
      }
    };

    cv.addEventListener("pointerup", releaseDrag);
    cv.addEventListener("pointercancel", releaseDrag);

    // Pulsanti rapidi inferiori per accessibilità / tastiera
    const pad = el.querySelector(".pad");
    pad.innerHTML = `
      <button type="button" class="go" id="rtShoot">🎯 Tiro a Molla<small>Scatto dritto in porta</small></button>
      <button type="button" class="hot" id="rtScissors">✂️ Forbice<small>Contrasto netto</small></button>
      <button type="button" id="rtPass">📐 Fisarmonica<small>Pallonetto filtrante</small></button>
    `;

    pad.querySelector("#rtShoot").onclick = () => {
      if (S.phase !== "aim") return;
      const pl = S.us[0];
      const ang = Math.atan2(H * 0.5 - pl.y, W - 16 - pl.x);
      shoot(pl, 28, ang, true);
    };

    pad.querySelector("#rtScissors").onclick = () => {
      if (S.phase !== "aim") return;
      S.data.contrasti++;
      tone(600, 0.05, "sawtooth", 0.05);
      const pl = S.us[1];
      pl.x = S.ball.x - 8; pl.y = S.ball.y;
      shoot(pl, 20, 0, true);
    };

    pad.querySelector("#rtPass").onclick = () => {
      if (S.phase !== "aim") return;
      const pl = S.us[0];
      const ang = Math.atan2(S.us[1].y - pl.y, S.us[1].x - pl.x);
      shoot(pl, 22, ang, true);
    };

    // Disegno carta e sagome
    function draw() {
      g.save();
      g.scale(2, 2);
      g.clearRect(0, 0, W, H);

      // Texture campo di cartone poroso
      g.fillStyle = "#e2e8f0";
      g.fillRect(0, 0, W, H);

      // Linee di campo tratteggiate a forbice
      g.strokeStyle = "#94a3b8";
      g.lineWidth = 1.5;
      g.setLineDash([4, 4]);
      g.strokeRect(16, 16, W - 32, H - 32);
      // Centrocampo
      g.beginPath();
      g.moveTo(W / 2, 16); g.lineTo(W / 2, H - 16);
      g.stroke();
      g.beginPath();
      g.arc(W / 2, H / 2, 24, 0, Math.PI * 2);
      g.stroke();
      g.setLineDash([]);

      // Porte di compensato
      g.fillStyle = "#64748b";
      g.fillRect(10, H * 0.35, 6, H * 0.3);
      g.fillRect(W - 16, H * 0.35, 6, H * 0.3);

      // Molla tesa durante il puntamento
      if (S.drag && S.spring > 2) {
        g.strokeStyle = "#ef4444";
        g.lineWidth = 2.5;
        g.beginPath();
        g.moveTo(S.drag.px, S.drag.py);
        g.lineTo(S.drag.px + Math.cos(S.springAngle) * (S.spring * 1.5), S.drag.py + Math.sin(S.springAngle) * (S.spring * 1.5));
        g.stroke();
      }

      // Disegno giocatori (sagome di carta 2D a compasso)
      const drawPaperGuy = (p, color, isUs) => {
        g.save();
        g.translate(p.x, p.y);
        // Ombra di carta portata
        g.fillStyle = "rgba(15,23,42,0.18)";
        g.beginPath();
        g.ellipse(2, 8, 8, 4, 0, 0, Math.PI * 2);
        g.fill();

        // Corpo di cartoncino rettangolare/sagomato
        g.fillStyle = color;
        g.strokeStyle = "#0f172a";
        g.lineWidth = 1.2;
        g.fillRect(-6, -10, 12, 14);
        g.strokeRect(-6, -10, 12, 14);

        // Testa tonda di carta
        g.fillStyle = isUs ? "#fde047" : "#fdba74";
        g.beginPath();
        g.arc(0, -14, 5, 0, Math.PI * 2);
        g.fill();
        g.stroke();

        // Nome
        g.fillStyle = "#0f172a";
        g.font = "bold 7px sans-serif";
        g.textAlign = "center";
        g.fillText(p.name.slice(0, 7), 0, 12);
        g.restore();
      };

      S.us.forEach((p) => drawPaperGuy(p, usCol, true));
      S.oppTeam.forEach((p) => drawPaperGuy(p, opp.color, false));

      // Pallone piatto esagonale di cartone
      g.save();
      g.translate(S.ball.x, S.ball.y);
      g.fillStyle = "#fff";
      g.strokeStyle = "#0f172a";
      g.lineWidth = 1.2;
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const bx = Math.cos(a) * 5, by = Math.sin(a) * 5;
        if (i === 0) g.moveTo(bx, by); else g.lineTo(bx, by);
      }
      g.closePath();
      g.fill();
      g.stroke();
      g.fillStyle = "#0f172a";
      g.beginPath();
      g.arc(0, 0, 2, 0, Math.PI * 2);
      g.fill();
      g.restore();

      g.restore();
    }

    function finish() {
      if (S.over) return;
      S.over = true;
      const win = S.a > S.b;
      const ov = document.createElement("div");
      ov.className = "ov";
      ov.innerHTML = `
        <h2>${win ? "🏆 VITTORIA DI CARTA!" : S.a === S.b ? "⚖️ PAREGGIO INNEVATO" : "❄️ SCONFITTA SUL GHIACCIO"}</h2>
        <p><b>Risultato Finale:</b> ${S.a} – ${S.b}<br><span style="color:#94a3b8">Tiri scattati: ${S.data.tiri} · Contrasti: ${S.data.contrasti}</span></p>
        <button type="button" class="goB">Continua ▸</button>
      `;
      el.appendChild(ov);
      ov.querySelector(".goB").onclick = () => {
        el.remove();
        if (window.__sagaCore && window.__sagaCore.endMatch) window.__sagaCore.endMatch();
        const cb = o.done || o.onDone;
        if (typeof cb === "function") {
          cb({ a: S.a, b: S.b, win, data: S.data });
        }
      };
    }

    // Schermata di presentazione
    const introOv = document.createElement("div");
    introOv.className = "ov";
    introOv.innerHTML = `
      <h2>✂️ RITAGLI</h2>
      <p><b>${esc(o.title || "Partita del Piccolo Borgo")}</b><br>${esc(o.intro || "Sfida sul campo di compensato! Carica le marionette di cartone e scatta verso la porta avversaria!")}</p>
      <button type="button" class="goB">Fischio d'Inizio ▸</button>
    `;
    el.appendChild(introOv);
    introOv.querySelector(".goB").onclick = () => {
      introOv.remove();
      S.phase = "aim";
      draw();
    };

    draw();
    return S;
  }

  window.__ritagli = {
    start,
    get state() { return STATE; }
  };
})();
