// js/pedinamento.js - «PEDINAMENTO TATTICO» · la partita originale di «Operazione Fuorigioco Noir · Milano 1954» (sul kit di partita di js/saga-core.js)
// Si gioca di notte, nella nebbia, sotto i riflettori che spazzano il campo:
//  - il campo è BUIO: vedi bene solo intorno a te e dentro i coni dei RIFLETTORI che girano;
//  - l'ARBITRO È COMPRATO (o.clean = false): un contrasto fatto SOTTO IL RIFLETTORE è fischiato, punizione per loro;
//    un contrasto fatto NELL'OMBRA lui non lo vede;
//  - PEDINARE: resta nell'ombra vicino a chi ha la palla e si carica il FIUTO; a fiuto pieno il prossimo contrasto
//    nell'ombra è un ANTICIPO sicuro (e dopo un anticipo il tiro parte più forte);
//  - fango (o.mud) che frena il pallone, neve (o.snow) che lo frena di più e copre il campo, pioggia (o.rain).
// Opzioni: o.clean (arbitro onesto: niente fischi a comando) · o.fog 0..1 (nebbia) · o.lights 1..3 · o.mud · o.snow · o.rain · o.hard
// Uso: window.__pedinamento.start({ opp: "Nome" | { name, kit, names }, heroLook, onDone({ a, b, win, data }) })
(function () {
  "use strict";
  if (window.__pedinamento && window.__pedinamento.v2) return;
  function start(o) {
    o = o || {};
    const C = window.__sagaCore; if (!C || !C.pitch) return false;
    const opp = typeof o.opp === "string" ? { name: o.opp, kit: o.kit || "#3a3a44", names: o.oppNames || ["Il Ciccio", "Lo Sfregiato"] } : Object.assign({ kit: (o.opp && o.opp.color) || "#3a3a44", names: ["Il Ciccio", "Lo Sfregiato"] }, o.opp || { name: "Banda dei Bastioni '54" });
    const FOG = o.fog == null ? 0.55 : Math.max(0, Math.min(1, o.fog)), NL = Math.max(1, Math.min(3, o.lights || 2)), BENT = !o.clean;
    let off = null;
    const lit = (S, p) => S.data.L.some((l) => Math.hypot(p.x - l.x, p.y - l.y) < l.r);
    const hooks = {
      setup(S) {
        S.data.L = Array.from({ length: NL }, (_, i) => ({ x: S.CX, y: S.WH * (i + 1) / (NL + 1), r: 46, ph: i * 2.1, sp: 0.011 + i * 0.004 }));
        S.data.fiuto = 0; S.data.fouls = 0; S.data.ant = 0; S.data.prevSlide = 0; S.data.lit = false; S.data.whistle = 0;
        S.data.drops = Array.from({ length: 60 }, () => ({ x: Math.random() * 240, y: Math.random() * 360, s: Math.random() }));
      },
      tick(S) {
        const d = S.data, h = S.hero, b = S.ball;
        d.L.forEach((l, i) => { l.x = S.CX + Math.sin(S.t * l.sp + l.ph) * 82; l.y = S.WH * (i + 1) / (NL + 1) + Math.cos(S.t * l.sp * 0.7 + l.ph) * 90; });
        d.lit = lit(S, h);
        // PEDINARE: nell'ombra, vicino a chi porta palla per loro → il fiuto sale
        const carrier = b.own && b.own.team === 1 && !b.own.gk ? b.own : null;
        if (carrier && !d.lit && Math.hypot(carrier.x - h.x, carrier.y - h.y) < 54) { d.fiuto = Math.min(100, d.fiuto + 0.9); if (d.fiuto === 100 && !d.ready) { d.ready = true; S.pop("FIUTO PIENO!", h.x, h.y - 20, "#fde68a"); S.tone(880, 0.12, "triangle", 0.05); } }
        else if (!carrier && d.fiuto > 0 && !d.ready) d.fiuto = Math.max(0, d.fiuto - 0.12);
        // il contrasto appena partito: sotto il riflettore, con l'arbitro comprato, è fischio
        const sl = h.slide | 0;
        if (sl > 0 && d.prevSlide <= 0) {
          if (BENT && d.lit && b.own && b.own.team === 1) {
            h.slide = 0; h.stun = 28; d.fouls++; d.whistle = 50; S.snd.whistle();
            S.flash = { txt: "FISCHIO!", sub: "sotto il riflettore l'arbitro vede tutto. Quello che vuole vedere.", t: 70 };
            const q = S.opp[0]; b.own = q; b.cd = 20; b.x = q.x; b.y = q.y; q.boost = 40;
          }
        }
        if (sl > 0 && !d.lit && d.ready && b.own && b.own.team === 1 && !b.own.gk && Math.hypot(b.x - h.x, b.y - h.y) < 16) {
          const was = b.own; was.stun = 34; b.own = h; b.cd = 14; b.passTo = null; h.slide = 0; d.ready = false; d.fiuto = 0; d.ant++; d.boost = 140;
          S.pop("ANTICIPO NELL'OMBRA!", h.x, h.y - 18, "#fde68a"); S.tone(523, 0.1, "square", 0.05); S.tone(784, 0.18, "triangle", 0.05, 0.08);
        }
        d.prevSlide = h.slide | 0;
        if (d.boost > 0) d.boost--; if (d.whistle > 0) d.whistle--;
      },
      ballForce(S, b) { if (b.own) return; const k = o.snow ? 0.975 : o.mud ? 0.984 : 1; if (b.z < 0.5) { b.vx *= k; b.vy *= k; } },
      speed(S, p, v) { let k = 1; if (o.snow) k *= 0.9; if (p === S.hero && S.data.boost > 0) k *= 1.15; return v * k; },
      keeper(S, gk, b) { return gk.team === 1 && S.data.boost > 0 && b.last === S.hero ? 0.3 : null; },
      bg(g, S, cy) {
        g.fillStyle = o.snow ? "#1a2030" : "#06080e"; g.fillRect(0, 0, 240, 360);
        for (let i = 0; i < 40; i++) { const x = (i * 29) % 240, y = ((i * 47) % 360) - cy * 0.15; g.fillStyle = i % 3 ? "#141a26" : "#1e2636"; g.beginPath(); g.arc(x, ((y % 360) + 360) % 360, 4, Math.PI, 0); g.fill(); }
      },
      field(g, S) {
        for (let y = 0; y < S.WH; y += 30) { g.fillStyle = o.snow ? ((y / 30) % 2 ? "#cfd8e4" : "#d8e0ea") : ((y / 30) % 2 ? "#2c3a24" : "#334229"); g.fillRect(S.XL, y, S.XR - S.XL, 30); }
        g.fillStyle = o.snow ? "#9aa6b8" : "#1a1f18"; g.fillRect(0, 0, S.XL, S.WH); g.fillRect(S.XR, 0, 240 - S.XR, S.WH);
        if (!o.snow) for (let i = 0; i < 26; i++) { const x = S.XL + ((i * 67) % (S.XR - S.XL - 20)), y = (i * 113) % S.WH; g.fillStyle = "rgba(40,30,20,.55)"; g.beginPath(); g.ellipse(x + 10, y, 9 + (i % 3) * 4, 4, 0, 0, 7); g.fill(); g.fillStyle = "rgba(200,210,230,.08)"; g.fillRect(x + 6, y - 1, 6, 1); }
        else for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(150,165,190,.35)"; g.fillRect(S.XL + ((i * 53) % (S.XR - S.XL)), (i * 89) % S.WH, 3, 2); }
        // i piloni dei riflettori ai lati
        S.data.L.forEach((l, i) => { const px = i % 2 ? S.XR + 10 : S.XL - 12; g.fillStyle = "#3a3f4a"; g.fillRect(px, l.y - 30, 3, 34); g.fillStyle = "#fef3c7"; g.fillRect(px - 3, l.y - 34, 9, 5); });
      },
      under(g, S) { S.data.L.forEach((l) => { const gr = g.createRadialGradient(l.x, l.y, 4, l.x, l.y, l.r); gr.addColorStop(0, "rgba(255,240,180,.32)"); gr.addColorStop(1, "rgba(255,240,180,0)"); g.fillStyle = gr; g.beginPath(); g.arc(l.x, l.y, l.r, 0, 7); g.fill(); }); },
      over(g, S) {
        // la notte e la nebbia: buio dappertutto tranne intorno al Campione, al pallone e dentro i coni di luce
        if (!off) { off = document.createElement("canvas"); off.width = 240; off.height = 360; }
        const c = off.getContext("2d"), cam = S.cam; c.globalCompositeOperation = "source-over"; c.clearRect(0, 0, 240, 360);
        c.fillStyle = `rgba(4,6,12,${0.5 + FOG * 0.32})`; c.fillRect(0, 0, 240, 360);
        c.globalCompositeOperation = "destination-out";
        const hole = (x, y, r) => { const gr = c.createRadialGradient(x, y - cam, r * 0.3, x, y - cam, r); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = gr; c.beginPath(); c.arc(x, y - cam, r, 0, 7); c.fill(); };
        hole(S.hero.x, S.hero.y, 62 - FOG * 14); hole(S.ball.x, S.ball.y, 26); S.data.L.forEach((l) => hole(l.x, l.y, l.r + 8));
        g.drawImage(off, 0, cam);
        // banchi di nebbia che scorrono
        for (let i = 0; i < 6; i++) { const x = ((i * 70 + S.t * 0.25) % 330) - 45, y = cam + 40 + i * 55; g.fillStyle = `rgba(200,210,225,${0.04 + FOG * 0.05})`; g.beginPath(); g.ellipse(x, y, 60, 14, 0, 0, 7); g.fill(); }
        if (o.rain || o.snow) S.data.drops.forEach((q) => { q.y += o.snow ? 0.6 + q.s : 4 + q.s * 3; q.x += o.snow ? Math.sin(S.t / 30 + q.s * 6) * 0.4 : -0.6; if (q.y > 360) { q.y = 0; q.x = Math.random() * 240; } g.fillStyle = o.snow ? "rgba(255,255,255,.8)" : "rgba(170,190,220,.45)"; g.fillRect(q.x, cam + q.y, 1, o.snow ? 1 + (q.s > 0.6) : 4); });
        if (S.data.whistle > 0) { g.fillStyle = "#fef3c7"; g.font = "bold 9px monospace"; g.textAlign = "center"; g.fillText("🟨 PUNIZIONE PER LORO", S.hero.x, S.hero.y - 26); g.textAlign = "left"; }
      },
      hud(g, S) {
        const d = S.data;
        g.fillStyle = "rgba(10,14,22,.82)"; g.fillRect(4, 30, 92, 22); g.strokeStyle = d.ready ? "#fde68a" : "#64748b"; g.strokeRect(4.5, 30.5, 91, 21);
        g.fillStyle = "#94a3b8"; g.font = "bold 7px monospace"; g.fillText("FIUTO", 8, 39); g.fillStyle = "#1e293b"; g.fillRect(36, 34, 56, 6); g.fillStyle = d.ready ? "#fde68a" : "#38bdf8"; g.fillRect(36, 34, 56 * d.fiuto / 100, 6);
        g.fillStyle = d.lit ? "#fca5a5" : "#93c5fd"; g.fillText(d.lit ? "💡 SOTTO IL RIFLETTORE" : "🕶 NELL'OMBRA", 8, 48);
        if (BENT) { g.fillStyle = "rgba(10,14,22,.82)"; g.fillRect(170, 30, 66, 12); g.fillStyle = "#fef3c7"; g.fillText(`FISCHI ${d.fouls}`, 176, 39); }
      },
      result(S) { const d = S.data; return `Anticipi nell'ombra ${d.ant}` + (BENT ? ` · Fischi contro ${d.fouls}` : " · Arbitro onesto"); },
    };
    const look = o.heroLook || {};
    return C.pitch({
      title: o.title || "Pedinamento Tattico '54", us: o.us || "Ferrovieri di Porta Ticinese", opp,
      hero: look, mate: o.mate || { name: "Nando", skin: "#f1d5b5", hair: "#2a1d14", shirt: "#7f1d1d" },
      half: o.half || 40, hard: o.hard, extra: o.extra, halftime: o.halftime || "Intervallo. Qualcuno, in tribuna, conta banconote al buio. Sul campo, la nebbia si è fatta più fitta.",
      gk0: "#e2e8f0", gk1: "#111827", winTitle: o.winTitle || "VITTORIA NELLA NEBBIA!",
      theme: { accent: "#fde68a", bg: "#090d16", panel: "#1e293b", border: "#94a3b8", ink: "#f1f5f9", font: "'Courier New', monospace", tira: "#b91c1c", passa: "#334155" },
      intro: `<p>Si gioca di notte, nella <b>nebbia</b>: vedi bene solo intorno a te e nei <b>coni dei riflettori</b> che girano.</p>` +
        (BENT ? `<p>L'<b>arbitro è comprato</b>: un contrasto (TIRA senza palla) <b>sotto il riflettore</b> è fischiato. Nell'<b>ombra</b> non vede.</p>` : `<p>Stavolta l'<b>arbitro è onesto</b>: nessun fischio a comando.</p>`) +
        `<p><b>Pedina</b>: resta nell'ombra vicino a chi ha la palla. A <b>FIUTO pieno</b> il contrasto nell'ombra è un <b>ANTICIPO</b> sicuro, e il tiro dopo vola.</p>`,
      hooks, onDone: (r) => { if (o.onDone) o.onDone(r); else if (o.done) o.done(r); },
    });
  }
  window.__pedinamento = { start, v2: true };
})();
