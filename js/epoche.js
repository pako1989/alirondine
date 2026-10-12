// js/epoche.js - «EPOCHE» · la partita originale di «Dopo il Campione» (sul kit di partita di js/saga-core.js)
// Ogni partita leggendaria si rigioca CON LA GRAFICA E LE REGOLE DELLA SUA EPOCA:
//  - 1928: film muto in bianco e nero, didascalie al posto della telecronaca, pallone di cuoio pesante, campo di terra.
//  - 1974: colori caldi da pellicola anni '70, l'AFA: nel secondo tempo tutti rallentano (chi tiene palla di meno).
//  - 1989: sala giochi a 8 bit, pixel grossi; compaiono STELLE sul campo: chi le prende ha il SUPER TIRO.
//  - oggi:  tutto a colori, e Ada in porta (para quasi tutto, ma non sempre).
// Uso: window.__epoche.start({ era, title, us, opp, heroLook, mate, onDone })
(function () {
  "use strict";
  if (window.__epoche) return;
  const ERAS = {
    1928: { name: "1928", filter: "bn", grass: ["#7a6a4a", "#84744e"], line: "rgba(240,235,220,.5)", theme: { accent: "#e8e2d4", bg: "#141210", panel: "#2a2622", border: "#c8c0a8", ink: "#e8e2d4", font: "Georgia, serif", tira: "#4a4440", passa: "#5a5450" },
      intro: "<p><b>1928 · film muto.</b> Pallone di cuoio pesante: rotola poco, si alza poco. Niente telecronaca: solo didascalie. Si gioca in maniche lunghe e col cappello in tribuna.</p>" },
    1974: { name: "1974", filter: "anni70", grass: ["#4fa04a", "#5aad52"], line: "rgba(255,255,240,.75)", theme: { accent: "#ffb347", bg: "#1e140c", panel: "#3a2a1a", border: "#e8a050", ink: "#fff0d8", font: "Georgia, serif", tira: "#c8501a", passa: "#2a7a8a" },
      intro: "<p><b>1974 · pellicola a colori.</b> Fa un caldo da cicale: nel <b>secondo tempo arriva l'afa</b> e tutti rallentano, ma chi tiene palla fatica di più. Passala!</p>" },
    1989: { name: "1989", filter: "pixel", grass: ["#2a9a3a", "#36aa44"], line: "rgba(255,255,255,.9)", theme: { accent: "#7af0ff", bg: "#0a0a1a", panel: "#1a1a3a", border: "#7af0ff", ink: "#ffffff", font: "monospace", tira: "#e83a8a", passa: "#3a6ae8" },
      intro: "<p><b>1989 · sala giochi.</b> Tutto più veloce, pixel grossi come pugni. Sul campo compaiono <b>stelle</b>: prendine una e il prossimo tiro è un <b>SUPER TIRO</b>.</p>" },
    oggi: { name: "oggi", filter: null, grass: ["#4f8a3e", "#57943f"], line: "rgba(255,255,255,.6)", theme: { accent: "#e8c46a", bg: "#14161c", panel: "#2a2c34", border: "#8a8070", ink: "#e8e2d4", font: "Georgia, serif", tira: "#a8322a", passa: "#2c5f8a" },
      intro: "<p><b>Oggi.</b> Tutto a colori. In porta, con voi, c'è Ada: para quasi tutto. Quasi.</p>" },
  };
  function start(o) {
    const C = window.__sagaCore; if (!C || !C.pitch) return false;
    const E = ERAS[o.era] || ERAS.oggi, era = o.era || "oggi";
    const card = (S, txt, sub) => { S.data.card = { txt, sub, t: 120 }; S.flash = null; };
    const hooks = {
      setup(S) { S.data.stars = []; S.data.super = false; S.data.supers = 0; if (era === "1928") card(S, "VALDORSA – FORNACI", "Primo incontro ufficiale · domenica 14 ottobre 1928"); },
      tick(S) {
        if (S.data.card && S.data.card.t > 0) S.data.card.t--;
        if (era === "1989") { // le stelle della sala giochi
          if (S.t % 360 === 120 && S.data.stars.length < 2) S.data.stars.push({ x: S.XL + 20 + Math.random() * (S.XR - S.XL - 40), y: S.GY0 + 80 + Math.random() * (S.GY1 - S.GY0 - 160), t: 600 });
          S.data.stars = S.data.stars.filter((st) => { st.t--; if (Math.hypot(st.x - S.hero.x, st.y - S.hero.y) < 10) { S.data.super = true; S.pop("SUPER TIRO PRONTO!", S.hero.x, S.hero.y - 16, "#7af0ff"); S.tone(1320, 0.15, "square", 0.05); return false; } return st.t > 0; });
        }
      },
      speed(S, p, v) {
        if (era === "1928") return v * 0.9;
        if (era === "1989") return v * 1.15;
        if (era === "1974" && S.half === 1) { const k = 1 - Math.min(0.3, S.t / S.dur * 0.35); return v * k * (S.ball.own === p ? 0.85 : 1); }
        return v;
      },
      ballForce(S, b) { if (era === "1928") { b.vx *= 0.985; b.vy *= 0.985; b.vz *= 0.9; } if (era === "1989") { b.vx *= 1.004; b.vy *= 1.004; } },
      act(S, kind) {
        if (era === "1989" && kind === "tira" && S.ball.own === S.hero && S.data.super) {
          S.data.super = false; S.data.supers++; const h = S.hero, ang = Math.atan2(S.GY0 - h.y, S.CX - h.x);
          const b = S.ball; b.own = null; b.vx = Math.cos(ang) * 10; b.vy = Math.sin(ang) * 10; b.vz = 1; b.z = 0.1; b.cd = 14; b.last = h; b.shot = 0; S.shots++; S.snd.kick(); S.pop("★ SUPER TIRO ★", h.x, h.y - 16, "#7af0ff"); return true;
        }
        return false;
      },
      keeper(S, gk, b) { if (era === "oggi" && gk.team === 0 && o.ada) return 0.8; if (era === "1989" && b.vy && Math.hypot(b.vx, b.vy) > 9) return 0.15; return null; },
      onGoal(S, team) {
        if (era === "1928") card(S, team === 0 ? "RETE!" : "RETE DEGLI AVVERSARI", team === 0 ? "Il pubblico lancia i cappelli in aria" : "Silenzio sugli spalti. Un cane abbaia.");
        else if (era === "1974") S.flash = { txt: team === 0 ? "GOOOL!" : "GOL LORO", sub: team === 0 ? "e il sole picchia" : "", t: 70 };
        else if (era === "1989") S.flash = { txt: team === 0 ? "GOAL!!" : "GAME OVER?", sub: team === 0 ? "+1000 PUNTI" : "INSERT COIN", t: 70 };
      },
      second(S) { if (era === "1928") card(S, "SECONDO TEMPO", "Le ombre si allungano sul campo di terra"); if (era === "1974") S.flash = { txt: "ARRIVA L'AFA", sub: "chi tiene palla fatica di più", t: 90 }; },
      bg(g, S, cy) { // tribune d'epoca
        if (era === "1928") { g.fillStyle = "#2a2622"; g.fillRect(0, 0, 240, 360); for (let i = 0; i < 60; i++) { const y = (i * 23 - cy * 0.3) % 380; g.fillStyle = "#4a4440"; g.fillRect(4 + (i % 3) * 7, y, 6, 8); g.fillStyle = "#1a1816"; g.fillRect(3 + (i % 3) * 7, y - 2, 8, 2); g.fillRect(215 + (i % 3) * 7, y + 40, 8, 2); g.fillStyle = "#4a4440"; g.fillRect(216 + (i % 3) * 7, y + 42, 6, 8); } }
        else if (era === "1974") { g.fillStyle = "#e8c070"; g.fillRect(0, 0, 240, 360); for (let i = 0; i < 80; i++) { const y = (i * 17 - cy * 0.3) % 380; g.fillStyle = ["#e85a3a", "#ffd23f", "#3a8ac8", "#ffffff"][i % 4]; g.fillRect(3 + (i % 4) * 6, y, 5, 6); g.fillRect(214 + (i % 4) * 6, y + 20, 5, 6); } }
        else if (era === "1989") { g.fillStyle = "#0a0a1a"; g.fillRect(0, 0, 240, 360); for (let i = 0; i < 40; i++) { g.fillStyle = (i + Math.floor(S.t / 15)) % 3 ? "#3a3a7a" : "#e83a8a"; g.fillRect(4 + (i % 3) * 8, (i * 31 - cy * 0.3) % 380, 6, 6); g.fillRect(214 + (i % 3) * 8, (i * 37 - cy * 0.3) % 380, 6, 6); } }
      },
      field(g, S) {
        for (let y = 0; y < S.WH; y += 30) { g.fillStyle = E.grass[(y / 30) % 2]; g.fillRect(S.XL, y, S.XR - S.XL, 30); }
        if (era === "1928") for (let i = 0; i < 60; i++) { g.fillStyle = i % 3 ? "rgba(90,70,40,.5)" : "rgba(80,110,50,.5)"; g.beginPath(); g.ellipse(S.XL + (i * 37) % (S.XR - S.XL), (i * 53) % S.WH, 6 + (i % 4) * 2, 3, 0, 0, 7); g.fill(); }
        if (era === "1989") { g.fillStyle = "rgba(255,255,255,.06)"; for (let x = S.XL; x < S.XR; x += 12) g.fillRect(x, 0, 1, S.WH); }
      },
      over(g, S) { if (era === "1989") S.data.stars.forEach((st) => { const a = S.t / 8; g.fillStyle = "#ffe84a"; g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 3 : 7, t = a + i * Math.PI / 5; g.lineTo(st.x + Math.cos(t) * r, st.y + Math.sin(t) * r); } g.closePath(); g.fill(); }); },
      post(g, S, W, VH) {
        if (E.filter) C.filter(g, E.filter, W, VH);
        const c = S.data.card; if (c && c.t > 0) { // didascalia del film muto
          g.fillStyle = "rgba(10,8,6,.92)"; g.fillRect(14, VH / 2 - 44, W - 28, 88); g.strokeStyle = "#c8c0a8"; g.lineWidth = 1.5; g.strokeRect(20, VH / 2 - 38, W - 40, 76); g.strokeRect(24, VH / 2 - 34, W - 48, 68);
          g.fillStyle = "#e8e2d4"; g.textAlign = "center"; g.font = "bold 16px Georgia, serif"; g.fillText(c.txt, W / 2, VH / 2 - 4); g.font = "italic 9px Georgia, serif"; g.fillText(c.sub || "", W / 2, VH / 2 + 16); g.textAlign = "left";
        }
      },
      hud(g, S) { g.font = era === "1989" ? "bold 8px monospace" : "bold 8px Georgia, serif"; g.fillStyle = E.theme.accent; g.textAlign = "right"; g.fillText(era === "1989" ? `1UP ${String(S.a * 1000).padStart(6, "0")}${S.data.super ? " ★" : ""}` : `EPOCA ${E.name}`, 236, 11); g.textAlign = "left"; },
      result(S) { return era === "1989" ? `Super tiri ${S.data.supers}` : `Epoca: ${E.name}`; },
    };
    return C.pitch({
      title: o.title || "Epoche", us: o.us || "Valdorsa", opp: o.opp || { name: "Avversari", kit: "#4a4a5a", names: ["", ""] }, hero: o.heroLook || {}, mate: o.mate,
      half: o.half || 35, extra: false, hard: o.hard, halftime: o.halftime, gk0: o.ada ? "#d8d0e8" : undefined, winTitle: o.winTitle || (era === "1928" ? "VITTORIA (con cappello)" : era === "1989" ? "YOU WIN!" : "VITTORIA!"),
      theme: E.theme, intro: E.intro + (o.introExtra || ""), hooks, onDone: o.onDone,
    });
  }
  window.__epoche = { start, ERAS };
})();
