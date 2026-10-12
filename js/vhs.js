// js/vhs.js - RIAVVOLGIMENTO VHS (strumento comune, per qualsiasi saga)
// window.__vhs.rewind({ from: "19:00", to: "08:00", label: "DOMENICA", sub: "GIRO 3" }, fatto)
// Copre lo schermo con una videocassetta che si riavvolge: righe di scansione, strappi del nastro, colori che sbavano,
// l'orologio che corre all'indietro e poi «▶ PLAY». Dura circa due secondi e mezzo; un tocco lo accelera.
(function () {
  "use strict";
  if (window.__vhs) return;
  function rewind(o, done) {
    o = o || {}; done = typeof done === "function" ? done : () => {};
    const W = 320, H = 200, cv = document.createElement("canvas"); cv.width = W * 2; cv.height = H * 2;
    cv.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:400;background:#000;image-rendering:pixelated;touch-action:none";
    document.body.appendChild(cv); const g = cv.getContext("2d"); g.scale(2, 2);
    const toMin = (s) => { const m = String(s || "00:00").match(/(\d+):(\d+)/); return m ? +m[1] * 60 + +m[2] : 0; }, from = toMin(o.from || "19:00"), to = toMin(o.to || "08:00");
    const N = o.frames || 150; let t = 0, fast = false, raf = 0;
    try { const A = (window.__vhsAC = window.__vhsAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = "sawtooth"; os.frequency.value = 1200; os.frequency.exponentialRampToValueAtTime(180, A.currentTime + 2.2); gn.gain.value = 0.025; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + 2.4); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + 2.4); } catch (e) {}
    cv.addEventListener("pointerdown", () => (fast = true));
    function frame() {
      t += fast ? 4 : 1; const k = Math.min(1, t / N), play = k > 0.82;
      g.fillStyle = play ? "#0a1a3a" : "#06060a"; g.fillRect(0, 0, W, H);
      // rumore e strappi del nastro
      for (let i = 0; i < (play ? 30 : 160); i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.25})`; g.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 3, 1); }
      if (!play) for (let i = 0; i < 5; i++) { const y = (t * 7 + i * 47) % H; g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(0, y, W, 2 + (i % 3)); g.fillStyle = "rgba(255,0,90,.08)"; g.fillRect(4, y + 3, W, 1); }
      // l'orologio che corre all'indietro
      const m = Math.round(from + (to - from) * Math.min(1, k / 0.8)), hh = String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, "0"), mm = String(((m % 60) + 60) % 60).padStart(2, "0");
      g.font = "bold 14px 'Courier New', monospace"; g.textAlign = "left";
      const lbl = play ? "▶ PLAY" : "◀◀ REW"; [["#ff2a6a", -1.5], ["#2ad8ff", 1.5], ["#fff", 0]].forEach(([c, dx]) => { g.fillStyle = c; g.fillText(lbl, 16 + dx, 26); });
      g.textAlign = "right"; [["#ff2a6a", -1.5], ["#2ad8ff", 1.5], ["#fff", 0]].forEach(([c, dx]) => { g.fillStyle = c; g.fillText(`${o.label || ""} ${hh}:${mm}`.trim(), W - 16 + dx, 26); });
      g.textAlign = "center"; g.font = "900 34px 'Courier New', monospace";
      if (!play) { const j = (Math.random() - 0.5) * 4; [["#ff2a6a", -2], ["#2ad8ff", 2], ["#fff", 0]].forEach(([c, dx]) => { g.fillStyle = c; g.fillText("◀◀", W / 2 + dx + j, H / 2 + 10); }); }
      else { g.font = "bold 13px 'Courier New', monospace"; g.fillStyle = "#fff"; g.fillText(o.sub || "", W / 2, H / 2 + 4); if (o.line) { g.font = "11px 'Courier New', monospace"; g.fillStyle = "#c8c8d8"; g.fillText(o.line, W / 2, H / 2 + 22); } }
      g.textAlign = "left";
      // righe di scansione
      g.fillStyle = "rgba(0,0,0,.25)"; for (let y = 0; y < H; y += 2) g.fillRect(0, y, W, 1);
      if (t >= N + (fast ? 10 : 40)) { cancelAnimationFrame(raf); cv.remove(); try { done(); } catch (e) { console.error(e); } return; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return true;
  }
  window.__vhs = { rewind };
})();
