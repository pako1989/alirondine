// js/corriere-bg.js - sfondo di «IL CORRIERE DEL PALLONE» (320x200): la città al tramonto, un corriere in bici, finestre che si accendono.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const SC = {
    cr_titolo(g, W, H, f) {
      const gr = g.createLinearGradient(0, 0, 0, 140); gr.addColorStop(0, "#2a1f5a"); gr.addColorStop(0.7, "#f97316"); gr.addColorStop(1, "#fde68a"); g.fillStyle = gr; g.fillRect(0, 0, W, 140);
      C(g, 230, 96, 20, "#fff1c4");
      for (let i = 0; i < 18; i++) { const w = 14 + rnd(i) * 22, h = 30 + rnd(i + 9) * 70, x = i * 19 - 6; R(g, x, 150 - h, w, h, i % 2 ? "#2a2347" : "#1d1838"); for (let k = 0; k < 14; k++) { if (rnd(i * 31 + k) > 0.55) R(g, x + 3 + (k % 3) * 6, 154 - h + Math.floor(k / 3) * 11, 3, 4, (f + i * 7 + k * 13) % 200 > 6 ? "#fde68a" : "#8a7a4a"); } }
      R(g, 0, 150, W, 50, "#1a1428"); R(g, 0, 166, W, 2, "rgba(255,255,255,.2)");
      const x = (f * 0.9) % 380 - 30; g.strokeStyle = "#fbbf24"; g.lineWidth = 2; C(g, x, 178, 9, "rgba(0,0,0,0)"); g.beginPath(); g.arc(x, 178, 9, 0, 7); g.arc(x + 26, 178, 9, 0, 7); g.moveTo(x, 178); g.lineTo(x + 12, 164); g.lineTo(x + 26, 178); g.moveTo(x + 12, 164); g.lineTo(x + 18, 164); g.stroke();
      R(g, x + 8, 150, 8, 14, "#f59e0b"); C(g, x + 12, 146, 5, "#e0b890"); R(g, x + 17, 158, 12, 10, "#7c2d12");
      g.textAlign = "center"; g.font = "900 22px Georgia, serif"; g.fillStyle = "#fde68a"; g.fillText("IL CORRIERE", 160, 34); g.font = "900 20px Georgia, serif"; g.fillStyle = "#f1f5f9"; g.fillText("DEL PALLONE", 160, 56);
    }
  };
  const HOT = { cr_titolo: [[0, 60, 320, 90, "🏙️ La città: sei quartieri, un orologio che non aspetta nessuno."], [0, 160, 320, 30, "🚲 La bici: una ruota più seria dell'altra."]] };
  function reg(n) { const B = window.__lbBg; if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] })); else if (n < 80) setTimeout(() => reg(n + 1), 150); }
  reg(0);
})();
