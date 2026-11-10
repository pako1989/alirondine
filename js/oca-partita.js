// js/oca-partita.js - «PARTITA SUL PRATO DEL CONTE» · la partita de «Il Gioco dell'Oca del Conte» (sul kit di partita di js/saga-core.js)
// Si gioca sul prato davanti alla villa, con le oche del parco in campo: camminano dove vogliono, e se il pallone le prende rimbalza via (e loro protestano: «QUA!»).
// Ogni tanto Teresa, la capa delle oche, insegue chi ha la palla: chi viene beccato la perde. Un gol «di sponda» su un'oca vale doppio negli applausi (non nel punteggio).
// Opzioni: o.geese (quante, 3 di base) · o.teresa (la capa che insegue, di base sì). Uso: window.__ocaPartita.start({ title, us, opp, mate, onDone({ a, b, win, data }) })
(function () {
  "use strict";
  if (window.__ocaPartita) return;
  function start(o) {
    const C = window.__sagaCore; if (!C || !C.pitch) return false;
    const n = o.geese == null ? 3 : o.geese;
    const goose = (g, x, y, t, k, boss) => { g.save(); g.translate(x, y); const s = boss ? 1.25 : 1, b = Math.sin(t / 6 + k); g.scale(s, s);
      g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(0, 6, 6, 2, 0, 0, 7); g.fill(); g.fillStyle = "#f8fafc"; g.beginPath(); g.ellipse(0, 1, 6, 4.4, 0, 0, 7); g.fill();
      g.strokeStyle = "#f8fafc"; g.lineWidth = 2.2; g.beginPath(); g.moveTo(3, 0); g.quadraticCurveTo(6, -3, 5, -7 + b); g.stroke(); g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(5.5, -7 + b, 2, 0, 7); g.fill();
      g.fillStyle = "#f59e0b"; g.fillRect(7, -7.5 + b, 2.6, 1.4); g.fillStyle = "#111"; g.fillRect(5.6, -8.4 + b, 1, 1); if (boss) { g.fillStyle = "#dc2626"; g.fillRect(-2, -1, 5, 1.5); } g.restore(); };
    const hooks = {
      setup(S) { S.data.geese = Array.from({ length: n }, (_, i) => ({ x: 50 + i * 60, y: 160 + i * 110, a: Math.random() * 6, t: 0 })); S.data.teresa = o.teresa === false ? null : { x: 120, y: S.WH / 2, cd: 300 }; S.data.bounce = 0; S.data.pecks = 0; S.data.spondaGoals = 0; },
      tick(S) {
        const b = S.ball;
        S.data.geese.forEach((q) => { q.t++; if (q.t % 120 === 0) q.a += (Math.random() - 0.5) * 2; q.x += Math.cos(q.a) * 0.35; q.y += Math.sin(q.a) * 0.35; if (q.x < S.XL + 8 || q.x > S.XR - 8) q.a = Math.PI - q.a; if (q.y < S.GY0 + 30 || q.y > S.GY1 - 30) q.a = -q.a; q.x = Math.max(S.XL + 8, Math.min(S.XR - 8, q.x)); q.y = Math.max(S.GY0 + 30, Math.min(S.GY1 - 30, q.y));
          if (!b.own && b.z < 2 && Math.hypot(b.x - q.x, b.y - q.y) < 9 && (b.vx || b.vy)) { const nx = (b.x - q.x) || 0.1, ny = (b.y - q.y) || 0.1, l = Math.hypot(nx, ny); const dot = b.vx * nx / l + b.vy * ny / l; b.vx -= 2 * dot * nx / l; b.vy -= 2 * dot * ny / l; b.vx *= 0.8; b.vy *= 0.8; b.x = q.x + nx / l * 10; b.y = q.y + ny / l * 10; S.data.bounce++; S.data.lastBounce = S.t; S.pop("QUA!", q.x, q.y - 12, "#fde68a"); S.tone(880, 0.08, "square", 0.04); q.a += Math.PI; } });
        const T = S.data.teresa; if (T) { const own = b.own; if (--T.cd <= 0 && own) { const dx = own.x - T.x, dy = own.y - T.y, d = Math.hypot(dx, dy) || 1; T.x += dx / d * 0.9; T.y += dy / d * 0.9; if (d < 8) { b.own = null; b.vx = (Math.random() - 0.5) * 3; b.vy = (Math.random() - 0.5) * 3; b.cd = 20; T.cd = 360; S.data.pecks++; S.pop("BECCATO!", own.x, own.y - 16, "#f87171"); S.tone(660, 0.1, "sawtooth", 0.05); } } }
      },
      onGoal(S, team) { if (team === 0 && S.data.lastBounce && S.t - S.data.lastBounce < 90) { S.data.spondaGoals++; S.flash = { txt: "GOL DI SPONDA SULL'OCA!", sub: "Teo applaude, l'oca no", t: 80 }; } },
      bg(g, S, cy) { const gr = g.createLinearGradient(0, 0, 0, 360); gr.addColorStop(0, o.dusk ? "#f59e0b" : "#93c5fd"); gr.addColorStop(1, o.dusk ? "#fde68a" : "#e0f2fe"); g.fillStyle = gr; g.fillRect(0, 0, 240, 360); },
      field(g, S) {
        for (let y = 0; y < S.WH; y += 30) { g.fillStyle = (y / 30) % 2 ? "#4d8a3c" : "#559442"; g.fillRect(S.XL, y, S.XR - S.XL, 30); }
        g.fillStyle = "#d6c7a1"; g.fillRect(0, 0, S.XL, S.WH); g.fillRect(S.XR, 0, 240 - S.XR, S.WH);
        for (let y = 10; y < S.WH; y += 70) { [6, 226].forEach((x) => { g.fillStyle = "#14401c"; g.beginPath(); g.moveTo(x + 4, y - 22); g.quadraticCurveTo(x + 11, y - 4, x + 4, y + 6); g.quadraticCurveTo(x - 3, y - 4, x + 4, y - 22); g.fill(); }); }
        g.fillStyle = "rgba(255,255,255,.12)"; for (let i = 0; i < 40; i++) g.fillRect(S.XL + (i * 37) % (S.XR - S.XL), (i * 89) % S.WH, 2, 2);
      },
      over(g, S) { S.data.geese.forEach((q, k) => goose(g, q.x, q.y, S.t, k, false)); const T = S.data.teresa; if (T) goose(g, T.x, T.y, S.t, 9, true); },
      hud(g, S) { g.font = "bold 8px sans-serif"; g.textAlign = "right"; g.fillStyle = "#fef3c7"; g.fillText(`🪿 sponde ${S.data.bounce}`, 236, 11); g.textAlign = "left"; },
      result(S) { return `Sponde sulle oche ${S.data.bounce} · Gol di sponda ${S.data.spondaGoals} · Beccate di Teresa ${S.data.pecks}`; }
    };
    return C.pitch({
      title: o.title || "Partita sul prato del Conte", us: o.us || "Il Neutrale", opp: o.opp || { name: "Gli Eredi", kit: "#7c2d12", names: ["Tonio", "Arrigo"] },
      hero: o.heroLook || {}, mate: o.mate || { name: "Damiano", skin: "#f1c9a5", hair: "#57534e", shirt: "#15803d" },
      half: o.half || 35, hard: o.hard, extra: o.extra, halftime: o.halftime || "Intervallo. Ernestina porta la limonata. Teresa, la capa delle oche, si beve quella di Arrigo.",
      gk0: "#0369a1", gk1: "#4d7c0f", winTitle: o.winTitle || "VITTORIA SUL PRATO!",
      theme: { accent: "#fbbf24", bg: "#1c2a14", panel: "#2f4a24", border: "#fbbf24", ink: "#fef3c7", font: "Georgia, serif", tira: "#b45309", passa: "#0369a1" },
      intro: `<p>Si gioca sul <b>prato della villa</b>, con le <b>oche</b> in campo. Se il pallone le prende, <b>rimbalza</b>: usale come sponda!</p><p>Attento a <b>Teresa</b> (l'oca col nastro rosso): insegue chi ha la palla e, se ti becca, la perdi.</p>${o.introExtra || ""}`,
      hooks, onDone: o.onDone
    });
  }
  window.__ocaPartita = { start };
})();
