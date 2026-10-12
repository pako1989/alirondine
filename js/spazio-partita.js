// js/spazio-partita.js - «GRAVITÀ ZERO» · la partita originale di «Calcio Spaziale: Stazione Orbitale 7» (sul kit di js/saga-core.js)
// Si gioca in una palestra senza peso:
//  - il pallone NON CADE MAI e quasi non rallenta: rimbalza sulle pareti come in un flipper;
//  - i giocatori FLUTTUANO: i comandi spingono, e quando li lasci continui a scivolare;
//  - toccando una parete laterale ci si DÀ LA SPINTA (scatto gratis, «SPINTA!»);
//  - ogni tanto la GRAVITÀ SI GIRA: la visuale ruota di 180° per qualche secondo, il campo diventa il soffitto
//    (i comandi restano quelli dello schermo, ma si attacca verso il basso);
//  - ARBI-9, il robot arbitro, fischia fuorigioco a cose a caso. Non conta niente. Lo fa per affetto.
// Uso: window.__gravita.start({ title, us, opp, heroLook, mate, flips, flipEvery, nonna, onDone })
(function () {
  "use strict";
  if (window.__gravita) return;
  const THEME = { accent: "#7af0c8", bg: "#05060c", panel: "#101a30", border: "#4a8ab8", ink: "#e8f4ff", font: "'Trebuchet MS', sans-serif", tira: "#c83a6a", passa: "#2a6ac8" };
  const FUORI = ["FUORIGIOCO! (la porta)", "FUORIGIOCO! (il pallone)", "FUORIGIOCO! (la Terra)", "FUORIGIOCO! (io stesso)", "FUORIGIOCO! (scusate)", "FUORIGIOCO! (il cuoco)"];
  function start(o) {
    const C = window.__sagaCore; if (!C || !C.pitch) return false;
    const every = (o.flipEvery || 24) * 60;
    const hooks = {
      setup(S) { S.data.flip = 0; S.data.ang = 0; S.data.flips = 0; S.data.push = 0; S.data.arbi = 0; S.all().forEach((p) => { p.vx = 0; p.vy = 0; p.lx = p.x; p.ly = p.y; p.pcd = 0; }); },
      kickoff(S) { S.all().forEach((p) => { p.vx = 0; p.vy = 0; p.lx = p.x; p.ly = p.y; }); },
      tick(S) {
        const D = S.data;
        // inerzia: ogni giocatore tiene la velocità del fotogramma prima e scivola
        S.all().forEach((p) => {
          if (p.gk) { p.lx = p.x; p.ly = p.y; return; }
          let dx = p.x - p.lx, dy = p.y - p.ly; const k = p === S.hero ? 0.06 : 0.09;
          if (p === S.hero && D.ang > Math.PI / 2 && (dx || dy)) { dx = -dx; dy = -dy; p.x = p.lx + dx; p.y = p.ly + dy; if (p.dir != null) p.dir += Math.PI; } // comandi dello schermo, anche a testa in giù
          p.vx = p.vx * (1 - k) + dx * k * 1.15; p.vy = p.vy * (1 - k) + dy * k * 1.15;
          p.x = p.lx + p.vx; p.y = p.ly + p.vy;
          // la spinta dalla parete
          if (p.pcd > 0) p.pcd--;
          if (p.pcd <= 0 && (p.x < S.XL + 7 || p.x > S.XR - 7) && Math.abs(p.vx) > 0.4) { p.vx = -p.vx * 1.9; p.vy *= 1.6; p.pcd = 40; if (p === S.hero) { D.push++; S.pop("SPINTA!", p.x, p.y - 14, "#7af0c8"); S.tone(660, 0.08, "triangle", 0.05); } }
          p.lx = p.x; p.ly = p.y;
        });
        // la gravità si gira
        if (o.flips !== false) {
          const at = S.t % every;
          if (at === every - 150) S.flash = { txt: "ATTENZIONE", sub: "inversione di gravità tra 2 secondi", t: 100 };
          if (at === 0 && S.t > 0) { D.flip = 1; D.flips++; D.until = S.t + (o.nonna ? 540 : 420); S.tone(220, 0.5, "sawtooth", 0.04, 0, 660); S.shake = 14; }
          if (D.flip && S.t >= D.until) { D.flip = 0; S.flash = { txt: "GRAVITÀ OK", sub: "il pavimento è di nuovo sotto", t: 60 }; }
        }
        D.ang += ((D.flip ? Math.PI : 0) - D.ang) * 0.07;
        // ARBI-9
        if (S.t % 1100 === 700) { D.arbi++; S.snd.whistle(); S.pop(FUORI[D.arbi % FUORI.length], S.CX, S.ball.y - 30, "#ffe84a"); }
      },
      // il pallone non cade e quasi non rallenta
      ballForce(S, b) { b.z = 0; b.vz = 0; b.vx /= 0.979; b.vy /= 0.979; b.vx *= 0.996; b.vy *= 0.996; const v = Math.hypot(b.vx, b.vy); if (v > 7.5) { b.vx *= 7.5 / v; b.vy *= 7.5 / v; } },
      speed(S, p, v) { return v * (p === S.hero ? 1.05 : 0.95); },
      bg(g, S, cy) { // stelle in parallasse dietro le vetrate della palestra
        for (let i = 0; i < 90; i++) { const d = 0.15 + (i % 3) * 0.2, x = (i * 53) % 240, y = ((i * 97) - cy * d) % 380; g.fillStyle = i % 7 ? "rgba(220,235,255,.7)" : "#ffe8a0"; g.fillRect(x, y < 0 ? y + 380 : y, i % 5 ? 1 : 2, i % 5 ? 1 : 2); }
        g.fillStyle = "rgba(90,120,200,.12)"; g.beginPath(); g.arc(200, 300 - cy * 0.05, 60, 0, 7); g.fill();
      },
      field(g, S) {
        for (let y = 0; y < S.WH; y += 24) { g.fillStyle = (y / 24) % 2 ? "rgba(30,50,90,.88)" : "rgba(36,58,100,.88)"; g.fillRect(S.XL, y, S.XR - S.XL, 24); }
        g.strokeStyle = "rgba(122,240,200,.12)"; g.lineWidth = 1; for (let x = S.XL; x <= S.XR; x += 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, S.WH); g.stroke(); }
        // le pareti con le maniglie per la spinta
        for (let y = 20; y < S.WH; y += 40) { g.fillStyle = "#7af0c8"; g.fillRect(S.XL - 3, y, 3, 10); g.fillRect(S.XR, y, 3, 10); }
      },
      over(g, S) { // caschi di vetro su tutti, e la scia del pallone
        S.all().forEach((p) => { g.strokeStyle = "rgba(200,240,255,.55)"; g.lineWidth = 1; g.beginPath(); g.arc(p.x, p.y - 6, 6.5, 0, 7); g.stroke(); g.fillStyle = "rgba(200,240,255,.12)"; g.fill(); g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect(p.x - 3, p.y - 10, 2, 1.5); });
        const b = S.ball; g.strokeStyle = "rgba(122,240,200,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x - b.vx * 4, b.y - b.vy * 4); g.stroke();
      },
      post(g, S, W, VH) { // la visuale ruota quando la gravità si gira
        const a = S.data.ang; if (a < 0.02) return;
        const cv = g.canvas; if (!S.data.cv) { S.data.cv = document.createElement("canvas"); S.data.cv.width = cv.width; S.data.cv.height = cv.height; }
        const t = S.data.cv.getContext("2d"); t.clearRect(0, 0, cv.width, cv.height); t.drawImage(cv, 0, 0);
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#05060c"; g.fillRect(0, 0, cv.width, cv.height); g.translate(cv.width / 2, cv.height / 2); g.rotate(a); g.drawImage(S.data.cv, -cv.width / 2, -cv.height / 2); g.restore();
        if (S.data.flip) { g.fillStyle = "rgba(200,58,106,.85)"; g.font = "bold 8px sans-serif"; g.textAlign = "center"; g.fillText("GRAVITÀ INVERTITA · si attacca verso il basso", W / 2, VH - 6); g.textAlign = "left"; }
      },
      hud(g, S) { g.font = "bold 8px sans-serif"; g.fillStyle = "#7af0c8"; g.textAlign = "right"; g.fillText(`0 g · spinte ${S.data.push}`, 236, 11); g.textAlign = "left"; },
      result(S) { return `Inversioni ${S.data.flips} · Spinte ${S.data.push} · Fuorigioco inventati ${S.data.arbi}`; },
    };
    return C.pitch({
      title: o.title || "Gravità zero", us: o.us || "Stazione 7", opp: o.opp || { name: "I Bulloni", kit: "#8a94a8", names: ["BU-1", "BU-2"], skins: ["#a8b0b8", "#a8b0b8"], hairs: ["#5a6478", "#5a6478"] },
      hero: o.heroLook || {}, mate: o.mate, half: o.half || 30, extra: o.extra, hard: o.hard, halftime: o.halftime, gk0: o.gk0 || "#e8a83a", gk1: o.gk1,
      winTitle: o.winTitle || "VITTORIA A GRAVITÀ ZERO!", theme: THEME, tiraLabel: "TIRA", passaLabel: "PASSA",
      intro: "<p><b>Gravità zero.</b> Il pallone non cade mai e rimbalza sulle pareti. Tu fluttui: i comandi spingono, e quando li lasci continui a scivolare. Tocca una parete laterale per darti la <b>SPINTA</b>. Ogni tanto la <b>gravità si gira</b>: per qualche secondo il campo diventa il soffitto.</p>" + (o.introExtra || ""),
      hooks, onDone: o.onDone,
    });
  }
  window.__gravita = { start };
})();
