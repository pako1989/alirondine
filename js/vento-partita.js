// js/vento-partita.js - «COL VENTO» · la partita originale de «La Valle del Vento Gentile» (sul kit di partita di js/saga-core.js)
// Si gioca sul Prato dei Soffi, con il vento come dodicesimo giocatore:
//  - il vento CAMBIA DIREZIONE ogni 15 secondi: lo vedi sulle bandierine agli angoli, sull'erba e sulla rosa dei venti in alto;
//  - i palloni ALTI (tiri da lontano e passaggi lunghi) si piegano col vento; quelli rasoterra quasi niente;
//  - ogni tanto arriva una FOLATA (avviso due secondi prima): un tiro da lontanissimo, nel momento giusto, diventa un gol;
//  - chi corre col vento va più veloce, chi corre contro fatica; gli SPIRITI (i Soffi) in campo planano e il vento li porta.
// Opzioni: o.calm (vento leggero, primo incontro) · o.fading (il vento muore piano piano durante la partita)
//          o.spiritsMate (il compagno è un Soffio) · o.spiritsOpp (gli avversari sono Soffi) · o.great (Mormorio tra i pali, il vento è con te)
// Uso: window.__ventoPartita.start({ title, us, opp:{ name, kit, names }, heroLook, onDone({ a, b, win, data }) , ... })
(function () {
  "use strict";
  if (window.__ventoPartita) return;
  const SPIRIT = { skin: "#f6f6fa", hair: null, shirt: "#e8eef4" };
  function start(o) {
    const C = window.__sagaCore; if (!C || !C.pitch) return false;
    const DIRN = ["da ovest", "da nord-ovest", "da nord", "da nord-est", "da est", "da sud-est", "da sud", "da sud-ovest"];
    const from = (a) => DIRN[Math.round((((a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4)) % 8];
    const W0 = { ang: Math.random() * Math.PI * 2, str: o.calm ? 0.35 : 0.7, target: 0, change: 900, gust: 0, warn: 0, gustNext: 500, gustGoals: 0, lobs: 0 };
    W0.target = W0.ang;
    const hooks = {
      setup(S) { S.data.wind = W0; S.data.seeds = Array.from({ length: 30 }, () => ({ x: Math.random() * 240, y: Math.random() * S.WH, p: Math.random() * 6 })); },
      tick(S) {
        const w = S.data.wind;
        if (--w.change <= 0) { w.change = 900; w.target = w.ang + (Math.random() < 0.5 ? 1 : -1) * (0.8 + Math.random() * 1.6); S.pop("IL VENTO GIRA!", S.hero.x, S.hero.y - 26, "#cfe6b0"); S.tone(660, 0.3, "sine", 0.04, 0, 990); }
        let d = w.target - w.ang; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; w.ang += d * 0.02;
        const fade = o.fading ? Math.max(0.05, 1 - (S.half * S.dur + S.t) / (S.dur * 2) * 1.1) : 1, base = (o.calm ? 0.35 : 0.7) * fade;
        if (w.gust <= 0 && w.warn <= 0 && --w.gustNext <= 0 && fade > 0.2) { w.warn = 120; S.tone(330, 0.2, "triangle", 0.04); }
        if (w.warn > 0 && --w.warn <= 0) { w.gust = 180; S.noise(1.2, 0.04, 500); }
        if (w.gust > 0 && --w.gust <= 0) w.gustNext = 480 + Math.random() * 300;
        w.str += (base * (w.gust > 0 ? 2.4 : 1) - w.str) * 0.05;
        S.data.fade = fade;
        // gli spiriti planano: il vento li sposta un poco anche da fermi
        const glide = (p) => { p.x += Math.cos(w.ang) * w.str * 0.35; p.y += Math.sin(w.ang) * w.str * 0.35; };
        if (o.spiritsMate) glide(S.mate); if (o.spiritsOpp) S.opp.forEach(glide);
      },
      ballForce(S, b) { const w = S.data.wind, k = b.z > 0.5 ? 0.075 : 0.01; b.vx += Math.cos(w.ang) * w.str * k; b.vy += Math.sin(w.ang) * w.str * k; },
      speed(S, p, v) { const w = S.data.wind; if (p.dir == null || p.gk) return v; const spirit = (o.spiritsMate && p === S.mate) || (o.spiritsOpp && p.team === 1 && !p.gk); return v * (1 + Math.cos(p.dir - w.ang) * w.str * (spirit ? 0.45 : 0.22)); },
      act(S, kind) { // da lontano, TIRA diventa un tiro alto che il vento porta (un «pallonetto col vento»)
        const b = S.ball, h = S.hero; if (kind !== "tira" || b.own !== h) return false;
        const dist = h.y - S.GY0; if (dist < 170) return false;
        const aim = S.CX + (S.ptr ? (S.ptr.x - S.ptr.ax) * 0.8 : 0), ang = Math.atan2(S.GY0 - h.y, aim - h.x), pw = 5.2 + Math.min(1.6, dist / 300);
        b.own = null; b.vx = Math.cos(ang) * pw; b.vy = Math.sin(ang) * pw; b.vz = 4.6; b.z = 0.2; b.cd = 14; b.last = h; b.shot = 0; b.lob = true; S.shots++; S.data.wind.lobs++;
        S.snd.kick(); S.pop(S.data.wind.gust > 0 ? "COL VENTO!" : "TIRO ALTO!", h.x, h.y - 14, S.data.wind.gust > 0 ? "#cfe6b0" : "#ffb347"); return true;
      },
      keeper(S, gk, b) { if (o.great && gk.team === 0) return 0.9; return b.lob && b.z > 4 ? 0.3 : null; }, // i palloni alti col vento ingannano i portieri
      onGoal(S, team) { if (team === 0 && S.data.wind.gust > 0) { S.data.wind.gustGoals++; S.flash = { txt: "GOL COL VENTO!", sub: "hai aspettato la folata giusta", t: 80 }; } S.ball.lob = false; },
      bg(g, S, cy) { // cielo, colline e mulini che girano con il vento
        const w = S.data.wind, gr = g.createLinearGradient(0, 0, 0, 360); gr.addColorStop(0, o.dusk ? "#f0a070" : "#9cd4f0"); gr.addColorStop(1, o.dusk ? "#ffd8a0" : "#e8f4ff"); g.fillStyle = gr; g.fillRect(0, 0, 240, 360);
        for (let i = 0; i < 5; i++) { const x = ((i * 70 + S.t * w.str * 0.3 * Math.cos(w.ang)) % 300 + 300) % 300 - 30, y = 30 + i * 60 - cy * 0.1; g.fillStyle = "rgba(255,255,255,.75)"; g.beginPath(); g.ellipse(x, y, 22, 7, 0, 0, 7); g.ellipse(x + 12, y - 4, 14, 7, 0, 0, 7); g.fill(); }
        [8, 222].forEach((mx, i) => { const my = 140 + i * 90 - cy * 0.25; g.fillStyle = "#e8dcc0"; g.fillRect(mx - 4, my, 8, 30); g.fillStyle = "#a04a32"; g.beginPath(); g.moveTo(mx - 5, my); g.lineTo(mx, my - 6); g.lineTo(mx + 5, my); g.fill(); g.save(); g.translate(mx, my + 2); g.rotate(S.t * w.str * 0.04 + i); g.fillStyle = "rgba(244,236,214,.9)"; for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.fillRect(0, -1, 14, 3); } g.restore(); });
      },
      field(g, S) { // il prato con l'erba lunga che si piega dove soffia il vento
        const w = S.data.wind, k = Math.cos(w.ang) * w.str * 4, ky = Math.sin(w.ang) * w.str * 2;
        for (let y = 0; y < S.WH; y += 30) { g.fillStyle = (y / 30) % 2 ? "#78b452" : "#82bd5a"; g.fillRect(S.XL, y, S.XR - S.XL, 30); }
        g.fillStyle = "#6aa04a"; g.fillRect(0, 0, S.XL, S.WH); g.fillRect(S.XR, 0, 240 - S.XR, S.WH);
        g.strokeStyle = "rgba(60,110,40,.55)"; g.lineWidth = 1;
        for (let i = 0; i < 160; i++) { const x = (i * 37) % 240, y = (i * 53) % S.WH, sw = Math.sin(S.t / 20 + i) * 0.8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + k + sw, y - 5 + ky); g.stroke(); }
        for (let i = 0; i < 18; i++) { const x = (i * 71) % 240, y = (i * 97) % S.WH; g.fillStyle = ["#fff6f0", "#ffd23f", "#f29ab0"][i % 3]; g.fillRect(x + k * 0.5, y - 4, 2, 2); }
        // bandierine agli angoli: mostrano da dove soffia
        [[S.XL, S.GY0], [S.XR, S.GY0], [S.XL, S.GY1], [S.XR, S.GY1]].forEach(([x, y]) => { g.fillStyle = "#6a4a2a"; g.fillRect(x - 1, y - 14, 2, 14); g.save(); g.translate(x, y - 13); g.rotate(w.ang); g.fillStyle = "#e85a4a"; g.beginPath(); g.moveTo(0, 0); g.lineTo(8 + w.str * 6, 2 + Math.sin(S.t / 4) * 1.5); g.lineTo(0, 5); g.closePath(); g.fill(); g.restore(); });
      },
      over(g, S) { // semi di tarassaco e, nelle folate, scie di vento
        const w = S.data.wind;
        S.data.seeds.forEach((q) => { q.x += Math.cos(w.ang) * w.str * 1.4 + Math.sin(S.t / 30 + q.p) * 0.2; q.y += Math.sin(w.ang) * w.str * 1.4 + 0.1; if (q.x > 245) q.x = -5; if (q.x < -6) q.x = 244; if (q.y > S.WH) q.y = 0; if (q.y < 0) q.y = S.WH; g.fillStyle = "rgba(255,255,255,.9)"; g.fillRect(q.x, q.y, 1.4, 1.4); });
        if (w.gust > 0) { g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.2; for (let i = 0; i < 14; i++) { const x = ((i * 53 + S.t * 3 * Math.cos(w.ang)) % 260 + 260) % 260 - 10, y = S.cam + ((i * 41 + S.t * 3 * Math.sin(w.ang)) % 360 + 360) % 360; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(w.ang) * 10, y + Math.sin(w.ang) * 10 - 3, x + Math.cos(w.ang) * 22, y + Math.sin(w.ang) * 22); g.stroke(); } }
        if (o.great) { const gx = S.CX, gy = S.GY1 + 4; g.fillStyle = "rgba(240,240,248,.85)"; g.beginPath(); g.ellipse(gx, gy - 4, 30, 14, 0, Math.PI, 0); g.fill(); g.fillStyle = "#2a2a30"; g.fillRect(gx - 9, gy - 12, 3, 4); g.fillRect(gx + 6, gy - 12, 3, 4); }
      },
      person(g, S, p, look, own) { // i Soffi: palline di nebbia che planano, con due occhi
        const spirit = (o.spiritsMate && p === S.mate) || (o.spiritsOpp && p.team === 1 && !p.gk); if (!spirit) return false;
        const b = Math.sin(S.t / 8 + p.x) * 2;
        g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(p.x, p.y + 8, 6, 2.4, 0, 0, 7); g.fill();
        g.fillStyle = p.team === 1 ? "#f0e6ff" : "#f6f6fa"; g.beginPath(); g.arc(p.x, p.y - 2 + b, 7, 0, 7); g.fill(); for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(p.x + Math.cos(k + S.t / 20) * 6, p.y - 2 + b + Math.sin(k + S.t / 20) * 6, 2.6, 0, 7); g.fill(); }
        g.fillStyle = "#2a2a30"; g.fillRect(p.x - 3, p.y - 4 + b, 1.6, 2.4); g.fillRect(p.x + 1.5, p.y - 4 + b, 1.6, 2.4);
        if (own) { g.strokeStyle = "#cfe6b0"; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y - 2 + b, 11, 0, 7); g.stroke(); }
        if (look.label) { g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillStyle = "#fbf6e6"; g.fillText(look.label, p.x, p.y + 16); g.textAlign = "left"; }
        return true;
      },
      hud(g, S) { // rosa dei venti e countdown del cambio
        const w = S.data.wind, x = 222, y = 34;
        g.fillStyle = "rgba(28,44,38,.8)"; g.beginPath(); g.arc(x, y, 14, 0, 7); g.fill(); g.strokeStyle = "#cfe6b0"; g.lineWidth = 1; g.stroke();
        g.save(); g.translate(x, y); g.rotate(w.ang); g.strokeStyle = "#fbf6e6"; g.lineWidth = 1.5 + Math.min(2.5, w.str * 1.6); g.beginPath(); g.moveTo(-8, 0); g.lineTo(8, 0); g.lineTo(4, -3.5); g.moveTo(8, 0); g.lineTo(4, 3.5); g.stroke(); g.restore();
        g.font = "bold 8px sans-serif"; g.textAlign = "right"; g.fillStyle = "#e8e2d4"; g.fillText(`gira tra ${Math.ceil(w.change / 60)}s`, 236, 11);
        if (w.warn > 0 || w.gust > 0) { g.fillStyle = w.warn > 0 ? "rgba(120,60,20,.9)" : "rgba(40,90,60,.9)"; g.fillRect(70, 18, 100, 14); g.fillStyle = "#fbf6e6"; g.textAlign = "center"; g.fillText(w.warn > 0 ? "⚠ ARRIVA UNA FOLATA" : "🍃 FOLATA: TIRA DA LONTANO!", 120, 28); }
        else if (o.fading && S.data.fade < 0.35) { g.fillStyle = "rgba(60,60,70,.85)"; g.fillRect(70, 18, 100, 14); g.fillStyle = "#e8e2d4"; g.textAlign = "center"; g.fillText("il vento si sta spegnendo…", 120, 28); }
        g.textAlign = "left";
      },
      result(S) { const w = S.data.wind; return `Tiri alti col vento ${w.lobs} · Gol in folata ${w.gustGoals}`; },
    };
    const look = o.heroLook || {};
    return C.pitch({
      title: o.title || "Col Vento", us: o.us || "Mulinella", opp: o.opp || { name: "I Soffi", kit: "#c8b8f0", names: ["Soffio", "Sbuffo"] },
      hero: look, mate: o.spiritsMate ? Object.assign({ name: "Soffio" }, SPIRIT) : o.mate || { name: "Selva", skin: "#f0c8a0", hair: "#b0502a", shirt: "#3a8a7a" },
      half: o.half || 40, hard: o.hard, extra: o.extra, halftime: o.halftime || "Il vento si riposa un attimo, poi ricomincia a soffiare. Da dove, non lo sa nessuno.",
      gk0: o.great ? "#f6f6fa" : "#e8c46a", gk1: o.spiritsOpp ? "#f0e6ff" : "#5a5a62", winTitle: o.winTitle || "VITTORIA COL VENTO!",
      theme: { accent: "#cfe6b0", bg: "#1c2c26", panel: "#2c4a3c", border: "#cfe6b0", ink: "#fbf6e6", font: "Georgia, serif", tira: "#c86a3a", passa: "#3a7a9a" },
      intro: `<p>Si gioca <b>col vento</b>. Guarda la <b>rosa dei venti</b> in alto a destra, le <b>bandierine</b> e l'erba: ti dicono dove soffia. Il vento <b>gira ogni 15 secondi</b>.</p><p>Da lontano, <b>TIRA</b> fa un <b>tiro alto</b> che il vento porta con sé. Quando arriva una <b>FOLATA</b>, un tiro da lontanissimo può diventare un gol.</p>${o.introExtra || ""}`,
      hooks, onDone: o.onDone,
    });
  }
  window.__ventoPartita = { start };
})();
