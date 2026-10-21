// js/cavaliere-tiles.js - tessere e pavimenti di «Il Cavaliere del Fischio»: facciata gotica, vuoto tra i tetti, cornicione di salto, ancora del rampino, gargolla, lampione,
// casse, comignolo, abbaino (ombra), console, teca, sbarre, poltrona, tendaggio, statua, tomba, cassaforte, container.
// Pavimenti: r tegole · p asfalto bagnato · d banchina · y piastrelle del manicomio · o parquet del teatro · c marmo della banca · n terra del cimitero · k pietra del rifugio
(function () {
  "use strict";
  const TS = 16;
  const rn = (a, b, k) => { const s = Math.sin(a * 127.1 + b * 311.7 + (k || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const same = (K, tx, ty, c) => { const m = K.ZX.map; return !!(m[ty] && m[ty][tx] === c); };
  const paint = {
    // facciata gotica: pietra scura, finestre a sesto acuto, cornicione
    P(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g, top = !same(K, tx, ty - 1, "P"), bot = !same(K, tx, ty + 1, "P");
      g.fillStyle = (tx + ty) % 2 ? "#3a3447" : "#352f42"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(sx, sy, 1, 16); g.fillRect(sx, sy + 7, 16, 1);
      if (tx % 3 === 1 && !top) { g.fillStyle = "#16121f"; g.fillRect(sx + 4, sy + 4, 8, 12); g.beginPath(); g.arc(sx + 8, sy + 4, 4, Math.PI, 0); g.fill(); const on = rn(tx, ty, 4) < 0.5; g.fillStyle = on ? "rgba(253,224,140,.9)" : "#1f2937"; g.fillRect(sx + 5, sy + 5, 6, 10); g.beginPath(); g.arc(sx + 8, sy + 5, 3, Math.PI, 0); g.fill(); if (on) K.glow(g, sx + 8, sy + 10, 14, "255,200,110", 0.18); g.fillStyle = "#16121f"; g.fillRect(sx + 7.5, sy + 3, 1, 12); }
      if (top) { g.fillStyle = "#231d30"; g.fillRect(sx, sy, 16, 5); g.fillStyle = "#4a4260"; g.fillRect(sx, sy + 4, 16, 1.5); if (tx % 2 === 0) { g.fillStyle = "#231d30"; g.fillRect(sx + 2, sy - 3, 3, 3); } }
      if (bot) { g.fillStyle = "#1b1626"; g.fillRect(sx, sy + 13, 16, 3); }
    },
    // il vuoto tra i tetti: buio, luci lontane, pioggia
    Z(K, sx, sy, tx, ty, fr) {
      const g = K.g; g.fillStyle = "#06070d"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#0b0d18"; g.fillRect(sx, sy + 8 + (tx % 2) * 2, 16, 8);
      if (rn(tx, ty, 2) < 0.18) { g.fillStyle = `rgba(250,204,21,${0.5 + 0.3 * Math.sin(fr / 20 + tx)})`; g.fillRect(sx + 3 + Math.floor(rn(tx, ty, 6) * 9), sy + 6 + Math.floor(rn(tx, ty, 8) * 7), 1.5, 1.5); }
      g.strokeStyle = "rgba(150,170,220,.22)"; g.lineWidth = 1; const o = (fr * 2 + tx * 5 + ty * 3) % 16; g.beginPath(); g.moveTo(sx + 4, sy + o); g.lineTo(sx + 2, sy + o + 5); g.stroke();
    },
    // cornicione da cui si salta: parapetto con freccia
    J(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2c2638"; g.fillRect(sx, sy + 5, 16, 11); g.fillStyle = "#4a4260"; g.fillRect(sx, sy + 5, 16, 3); g.fillStyle = "#1b1626"; g.fillRect(sx, sy + 13, 16, 3);
      const a = 0.5 + 0.4 * Math.sin(fr / 10); g.fillStyle = `rgba(250,204,21,${a})`; g.beginPath(); g.moveTo(sx + 4, sy + 11); g.lineTo(sx + 12, sy + 11); g.lineTo(sx + 8, sy + 4); g.closePath(); g.fill();
    },
    // ancora del rampino: trave di ferro con anello
    H(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 2, sy + 14, 12, 2); g.fillStyle = "#4b5563"; g.fillRect(sx + 6, sy + 3, 4, 12); g.fillStyle = "#9ca3af"; g.fillRect(sx + 6, sy + 3, 1.5, 12);
      g.strokeStyle = "#d1d5db"; g.lineWidth = 1.5; g.beginPath(); g.arc(sx + 8, sy + 4, 4, 0, 7); g.stroke(); K.glow(g, sx + 8, sy + 4, 10, "250,204,21", 0.18 + 0.08 * Math.sin(fr / 9));
    },
    // gargolla: sagoma alata su un piedistallo, occhi che brillano
    G(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2c2638"; g.fillRect(sx + 3, sy + 11, 10, 5); g.fillStyle = "#4a4260"; g.fillRect(sx + 5, sy + 4, 6, 8); g.beginPath(); g.moveTo(sx + 5, sy + 6); g.lineTo(sx + 0, sy + 2); g.lineTo(sx + 4, sy + 10); g.fill(); g.beginPath(); g.moveTo(sx + 11, sy + 6); g.lineTo(sx + 16, sy + 2); g.lineTo(sx + 12, sy + 10); g.fill();
      g.fillStyle = `rgba(250,204,21,${0.6 + 0.4 * Math.sin(fr / 14 + tx)})`; g.fillRect(sx + 6, sy + 6, 1.5, 1.5); g.fillRect(sx + 9, sy + 6, 1.5, 1.5);
    },
    // lampione a gas: la luce si può spegnere (flag rf_lamp_<x>_<y>)
    L(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g, off = K.F.is("rf_lamp_" + tx + "_" + ty); g.fillStyle = "#1f2937"; g.fillRect(sx + 7, sy + 5, 2, 11); g.fillRect(sx + 4, sy + 14, 8, 2); g.fillStyle = "#374151"; g.fillRect(sx + 4, sy + 1, 8, 5);
      if (!off) { g.fillStyle = "#fde68a"; g.fillRect(sx + 5, sy + 2, 6, 3); K.glow(g, sx + 8, sy + 4, 34, "255,210,120", 0.35 + 0.05 * Math.sin(fr / 5 + tx)); K.light(sx + 8, sy + 4, 56, "255,210,120", 0.4); } else { g.fillStyle = "#4b5563"; g.fillRect(sx + 5, sy + 2, 6, 3); }
    },
    // cassa / bidone
    B(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 14, 2); g.fillStyle = "#5a3a20"; g.fillRect(sx + 1, sy + 4, 14, 11); g.fillStyle = "#7a5230"; g.fillRect(sx + 1, sy + 4, 14, 2); g.fillStyle = "#3b2514"; g.fillRect(sx + 1, sy + 9, 14, 1); g.fillRect(sx + 7, sy + 4, 2, 11); },
    // comignolo di mattoni con fumo
    C(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#6b3a2a"; g.fillRect(sx + 3, sy + 3, 10, 13); g.fillStyle = "#8c4a36"; g.fillRect(sx + 3, sy + 3, 10, 2); g.fillStyle = "#1a1018"; g.fillRect(sx + 5, sy + 3, 6, 2); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(sx + 3, sy + 8, 10, 1);
      for (let i = 0; i < 3; i++) { const t = ((fr * 0.3 + i * 11) % 33) / 33; g.fillStyle = `rgba(210,210,220,${0.3 * (1 - t)})`; g.beginPath(); g.arc(sx + 8 + Math.sin(t * 5 + i) * 2, sy + 2 - t * 14, 2 + t * 3, 0, 7); g.fill(); }
    },
    // abbaino / serbatoio: ombra in cui nascondersi (non solido)
    h(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,10,.55)"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(60,70,100,.35)"; g.fillRect(sx + 2, sy + 2, 12, 2); g.fillStyle = "rgba(100,116,150,.5)"; g.fillRect(sx + 1, sy + 1, 14, 1);
    },
    // console del rifugio: schermi e luci
    D(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#0f172a"; g.fillRect(sx, sy + 3, 16, 13); g.fillStyle = "#1e293b"; g.fillRect(sx + 1, sy + 4, 14, 6);
      g.fillStyle = `rgba(56,189,248,${0.65 + 0.2 * Math.sin(fr / 12 + tx)})`; g.fillRect(sx + 2, sy + 5, 12, 4); g.fillStyle = "#22c55e"; g.fillRect(sx + 3 + (fr >> 4) % 8, sy + 6, 2, 1); g.fillStyle = "#f59e0b"; g.fillRect(sx + 3, sy + 12, 2, 2); g.fillStyle = "#ef4444"; g.fillRect(sx + 7, sy + 12, 2, 2);
      K.glow(g, sx + 8, sy + 7, 18, "56,189,248", 0.2);
    },
    // teca con il mantello / trofei
    Q(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#111827"; g.fillRect(sx, sy + 1, 16, 15); g.fillStyle = "rgba(147,197,253,.25)"; g.fillRect(sx + 1, sy + 2, 14, 13); g.fillStyle = "#0b0b12"; g.fillRect(sx + 5, sy + 4, 6, 10); g.fillStyle = "#facc15"; g.fillRect(sx + 7, sy + 7, 2, 2); g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(sx + 2, sy + 2, 3, 12);
    },
    // sbarre di cella
    V(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#0b0b10"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#6b7280"; for (let i = 0; i < 4; i++) g.fillRect(sx + 1 + i * 4, sy, 1.5, 16); g.fillStyle = "#9ca3af"; g.fillRect(sx, sy + 3, 16, 1.5); g.fillRect(sx, sy + 12, 16, 1.5);
      if (rn(tx, ty, 9) < 0.35) { g.fillStyle = "rgba(250,204,21,.8)"; g.fillRect(sx + 6 + (tx % 2) * 3, sy + 7, 1.5, 1.5); }
    },
    // poltrona / sedile di velluto
    S(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5b1220"; g.fillRect(sx + 1, sy + 4, 14, 11); g.fillStyle = "#7f1d2d"; g.fillRect(sx + 2, sy + 8, 12, 6); g.fillStyle = "#3a0a14"; g.fillRect(sx + 1, sy + 4, 14, 2); g.fillStyle = "#d4a73a"; g.fillRect(sx + 1, sy + 4, 14, 1); },
    // tendaggio di velluto del palcoscenico
    N(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#6b1020"; g.fillRect(sx, sy - 2, 16, 18); for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#8a1a2e" : "#560c18"; g.fillRect(sx + i * 4, sy - 2, 3, 18); } g.fillStyle = "#d4a73a"; g.fillRect(sx, sy - 2, 16, 2); },
    // statua di pietra con mantello
    U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 2, sy + 14, 12, 2); g.fillStyle = "#6b7280"; g.fillRect(sx + 3, sy + 11, 10, 5); g.fillStyle = "#9ca3af"; g.fillRect(sx + 5, sy + 3, 6, 9); g.beginPath(); g.arc(sx + 8, sy + 3, 3, 0, 7); g.fill(); g.fillStyle = "#d1d5db"; g.fillRect(sx + 5, sy + 3, 1.5, 9); g.fillStyle = "rgba(255,255,255,.1)"; g.fillRect(sx + 10, sy + 4, 1, 8); },
    // lapide
    X(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 2, sy + 14, 12, 2); g.fillStyle = "#7c8190"; g.fillRect(sx + 4, sy + 4, 8, 11); g.beginPath(); g.arc(sx + 8, sy + 4, 4, Math.PI, 0); g.fill(); g.fillStyle = "#4b5563"; g.fillRect(sx + 7.5, sy + 6, 1, 6); g.fillRect(sx + 5.5, sy + 8, 5, 1); if (rn(tx, ty, 4) < 0.4) { g.fillStyle = "#2f5a3a"; g.fillRect(sx + 4, sy + 13, 8, 2); } },
    // cassaforte della banca
    K(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#374151"; g.fillRect(sx, sy + 1, 16, 15); g.fillStyle = "#6b7280"; g.fillRect(sx + 1, sy + 2, 14, 13); g.fillStyle = "#9ca3af"; g.beginPath(); g.arc(sx + 8, sy + 9, 4.5, 0, 7); g.fill(); g.fillStyle = "#374151"; g.beginPath(); g.arc(sx + 8, sy + 9, 2.2, 0, 7); g.fill(); g.fillStyle = "#facc15"; g.fillRect(sx + 7.5, sy + 4, 1, 10); g.fillRect(sx + 3, sy + 8.5, 10, 1); },
    // container del porto
    M(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, col = ["#9a3412", "#1d4ed8", "#15803d", "#a16207"][(tx >> 1) % 4]; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 14, 16, 2); g.fillStyle = col; g.fillRect(sx, sy + 1, 16, 14); g.fillStyle = "rgba(0,0,0,.25)"; for (let i = 0; i < 4; i++) g.fillRect(sx + 2 + i * 4, sy + 2, 1.5, 12); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(sx, sy + 1, 16, 2); }
  };
  function floorPaint(K, f, sx, sy, tx, ty) {
    const P = K.P, g = K.g, fr = Math.floor(performance.now() / 16);
    if (f === "r") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#44526c" : "#3d4a63"); const o = (ty % 2) * 4; for (let i = 0; i < 3; i++) P(sx + ((o + i * 6) % 16), sy, 1, 5, "rgba(0,0,0,.3)"); P(sx, sy + 5, 16, 1, "rgba(0,0,0,.35)"); P(sx, sy + 10, 16, 1, "rgba(0,0,0,.3)"); if (rn(tx, ty, 3) < 0.25) P(sx + 3 + Math.floor(rn(tx, ty, 5) * 8), sy + 2 + Math.floor(rn(tx, ty, 7) * 10), 3, 1, "rgba(150,180,255,.18)"); return true; }
    if (f === "p") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#1d2230" : "#1a1e2b"); for (let i = 0; i < 5; i++) P(sx + Math.floor(rn(tx, ty, i) * 14), sy + Math.floor(rn(tx, ty, i + 9) * 14), 2, 1, "rgba(120,150,230,.2)"); P(sx, sy, 16, 1, "rgba(0,0,0,.3)"); return true; }
    if (f === "d") { P(sx, sy, 16, 16, (ty % 2) ? "#4a3a28" : "#43342a"); P(sx, sy + 7, 16, 1, "rgba(0,0,0,.4)"); P(sx + ((tx * 5) % 16), sy, 1, 16, "rgba(0,0,0,.25)"); return true; }
    if (f === "y") { const d = (tx + ty) % 2; P(sx, sy, 16, 16, d ? "#c9d1c8" : "#b9c4bd"); P(sx, sy, 16, 1, "rgba(0,0,0,.15)"); P(sx, sy, 1, 16, "rgba(0,0,0,.15)"); if (rn(tx, ty, 2) < 0.07) P(sx + 4, sy + 6, 7, 3, "rgba(120,0,0,.22)"); return true; }
    if (f === "o") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#6b1d2a" : "#601824"); P(sx, sy, 16, 2, "#d4a73a"); P(sx + 2, sy + 4, 12, 8, "rgba(0,0,0,.12)"); return true; }
    if (f === "c") { const d = (tx + ty) % 2; P(sx, sy, 16, 16, d ? "#d8d4c8" : "#c8c4b6"); P(sx, sy, 16, 1, "rgba(0,0,0,.2)"); P(sx, sy, 1, 16, "rgba(0,0,0,.2)"); if (rn(tx, ty, 1) < 0.2) P(sx + 5, sy + 7, 6, 1, "rgba(60,60,60,.25)"); return true; }
    if (f === "n") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#1c2a22" : "#18251d"); for (let i = 0; i < 4; i++) P(sx + Math.floor(rn(tx, ty, i) * 14), sy + Math.floor(rn(tx, ty, i + 5) * 12), 1, 3, "#2f4a37"); if (rn(tx, ty, 6) < 0.1) P(sx + 4, sy + 6, 8, 3, "rgba(190,200,215,.15)"); return true; }
    if (f === "k") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#252a36" : "#20242f"); P(sx, sy, 16, 1, "rgba(255,255,255,.05)"); P(sx, sy + 8, 16, 1, "rgba(0,0,0,.3)"); if (rn(tx, ty, 2) < 0.15) P(sx + 6, sy + 4, 4, 1, "rgba(56,189,248,.25)"); return true; }
    return false;
  }
  window.__cavTiles = { paint, floorPaint };
})();
