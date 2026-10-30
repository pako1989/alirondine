// js/moviola-bg.js - Sfondi in pixel art (320x200) per «L'Ombra della Moviola · Tele-Rondine '84»
// Estetica anni '80: monitor a fosfori, scansione raster CRT, banchi U-matic, pioggia su asfalto, valvole termoioniche e velluto teatrale.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };

  // Disegna barre colore SMPTE su un monitor
  const smpte = (g, x, y, w, h) => {
    const cols = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];
    const bw = w / cols.length;
    for (let i = 0; i < cols.length; i++) R(g, x + i * bw, y, bw + 1, h * 0.75, cols[i]);
    R(g, x, y + h * 0.75, w * 0.25, h * 0.25, "#0000c0");
    R(g, x + w * 0.25, y + h * 0.75, w * 0.5, h * 0.25, "#ffffff");
    R(g, x + w * 0.75, y + h * 0.75, w * 0.25, h * 0.25, "#111111");
  };

  // Linee di scansione CRT
  const crt = (g, x, y, w, h, a) => {
    g.fillStyle = `rgba(0,0,0,${a || 0.22})`;
    for (let py = y; py < y + h; py += 2) g.fillRect(x, py, w, 1);
  };

  const SC = {
    // 0. Titolo della Saga: Studio Tele-Rondine con banco U-matic e spia IN ONDA
    mov_titolo(g, W, H, f) {
      VG(g, 0, H, "#0d1424", "#1a2236"); g.fillRect(0, 0, W, H);
      // Parete acustica con pannelli forati
      for (let y = 10; y < 110; y += 12) {
        for (let x = 10; x < W; x += 12) R(g, x, y, 2, 2, "#131a2b");
      }
      // Cartello IN ONDA (lampeggia)
      const onAir = (f % 60) < 40;
      R(g, 110, 14, 100, 26, onAir ? "#7f1d1d" : "#3b0d0d");
      R(g, 112, 16, 96, 22, onAir ? "#dc2626" : "#450a0a");
      if (onAir) GL(g, 160, 27, 45, "239,68,68", 0.5);
      g.fillStyle = onAir ? "#ffffff" : "#7f1d1d";
      g.font = "900 13px 'Courier New', monospace";
      g.textAlign = "center";
      g.fillText("● IN ONDA ●", 160, 32);

      // Scaffali rack U-matic a sinistra
      R(g, 12, 45, 60, 110, "#1f293d");
      for (let i = 0; i < 4; i++) {
        R(g, 14, 48 + i * 26, 56, 22, "#111827");
        R(g, 18, 52 + i * 26, 30, 8, "#374151"); // fessura cassetta
        C(g, 56, 56 + i * 26, 3, i === 1 ? "#22c55e" : "#ef4444"); // led
      }

      // Monitor centrale a tubo catodico
      R(g, 100, 52, 120, 82, "#2b3447");
      R(g, 106, 58, 108, 70, "#080c14");
      smpte(g, 108, 60, 104, 66);
      crt(g, 108, 60, 104, 66, 0.28);
      // Luce riflessa del monitor
      GL(g, 160, 93, 70, "100,180,255", 0.18 + 0.05 * Math.sin(f / 15));

      // Banco Moviola inferiore con jog shuttle e levette
      VG(g, 134, H, "#334155", "#1e293b"); g.fillRect(0, 134, W, H - 134);
      R(g, 0, 134, W, 3, "#475569");
      // Bobine U-matic sul banco
      C(g, 60, 168, 20, "#0f172a"); C(g, 60, 168, 6, "#64748b");
      C(g, 260, 168, 20, "#0f172a"); C(g, 260, 168, 6, "#64748b");
      // Manopola Jog/Shuttle al centro
      C(g, 160, 170, 22, "#0f172a"); C(g, 160, 170, 18, "#475569");
      const ja = (f / 40);
      C(g, 160 + Math.cos(ja) * 11, 170 + Math.sin(ja) * 11, 3, "#facc15");

      // Scritte titolo
      g.textAlign = "center";
      g.font = "900 18px 'Courier New', monospace"; g.fillStyle = "#facc15";
      g.fillText("L'OMBRA DELLA MOVIOLA", 160, 150);
      g.font = "700 10px 'Courier New', monospace"; g.fillStyle = "#38bdf8";
      g.fillText("TELE-RONDINE 1984 · INCHIESTA MASTER", 160, 194);
      VIG(g, W, H, 0.35);
    },

    // 1. Piazzale Studi Tele-Rondine (Cap. 1 Esterno)
    mov_piazzale(g, W, H, f) {
      VG(g, 0, 110, "#1e2430", "#334155"); g.fillRect(0, 0, W, 110);
      // Colline lontane con ripetitore che lampeggia
      T(g, [0, 110, 80, 75, 180, 110], "#17202e");
      T(g, [120, 110, 220, 65, 320, 110], "#131b27");
      // Antenna / traliccio sulla collina
      R(g, 220, 40, 2, 25, "#64748b");
      if (f % 40 < 20) { C(g, 221, 40, 2.5, "#ef4444"); GL(g, 221, 40, 12, "239,68,68", 0.4); }

      // Capannone industriale di Tele-Rondine a sinistra
      R(g, 0, 48, 140, 70, "#1f2937");
      R(g, 10, 62, 50, 40, "#374151"); // portone
      R(g, 70, 60, 60, 14, "#0f172a"); // insegna
      g.fillStyle = "#facc15"; g.font = "900 9px sans-serif"; g.textAlign = "center";
      g.fillText("TELE-RONDINE", 100, 71);

      // Piazzale bagnato d'asfalto
      VG(g, 110, H, "#18202c", "#0f141d"); g.fillRect(0, 110, W, H - 110);
      R(g, 0, 110, W, 2, "#334155");
      // Pozzanghere riflettenti
      for (let i = 0; i < 4; i++) {
        const px = 40 + i * 70, py = 135 + (i % 2) * 28;
        g.fillStyle = "rgba(56,189,248,.18)";
        g.beginPath(); g.ellipse(px, py, 26, 5, 0, 0, 7); g.fill();
      }

      // Furgone regia mobile bianco con parabola sul tetto (punto chiave!)
      const vx = 175, vy = 92;
      R(g, vx, vy + 20, 92, 42, "#e2e8f0"); // corpo furgone
      R(g, vx + 70, vy + 26, 20, 24, "#cbd5e1"); // muso
      R(g, vx + 74, vy + 28, 14, 12, "#1e293b"); // finestrino
      R(g, vx + 16, vy + 28, 48, 8, "#0284c7"); // fascia blu Tele-Rondine
      R(g, vx + 8, vy + 30, 2, 28, "#475569"); // serratura forzata
      C(g, vx + 22, vy + 62, 9, "#0f172a"); C(g, vx + 22, vy + 62, 4, "#64748b"); // ruote
      C(g, vx + 76, vy + 62, 9, "#0f172a"); C(g, vx + 76, vy + 62, 4, "#64748b");
      // Parabola sul tetto con cavo tranciato
      C(g, vx + 35, vy + 10, 14, "#94a3b8");
      R(g, vx + 34, vy + 10, 2, 10, "#475569");
      g.strokeStyle = "#ef4444"; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(vx + 34, vy + 18); g.lineTo(vx + 28, vy + 24); g.stroke();

      // Pioggia sottile
      g.strokeStyle = "rgba(148,163,184,.35)"; g.lineWidth = 0.8;
      for (let i = 0; i < 45; i++) {
        const rx = (rnd(i) * W + f * 1.5) % (W + 20) - 10;
        const ry = (rnd(i + 30) * H + f * 5) % H;
        g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 2, ry + 6); g.stroke();
      }
      VIG(g, W, H, 0.35);
    },

    // 2. Sala Regia e Montaggio (Cap. 1 Interno 1)
    mov_regia(g, W, H, f) {
      VG(g, 0, 130, "#2d1f18", "#422e23"); g.fillRect(0, 0, W, 130);
      // Pannelli fonoassorbenti marroni
      for (let y = 8; y < 110; y += 18) {
        for (let x = 12; x < W - 12; x += 22) {
          R(g, x, y, 18, 14, "#38271e");
          R(g, x + 2, y + 2, 14, 10, "#4a3529");
        }
      }
      // Rack monitor CRT sospesi in alto (3 monitor)
      for (let m = 0; m < 3; m++) {
        const mx = 40 + m * 85, my = 22;
        R(g, mx, my, 70, 52, "#1e293b");
        R(g, mx + 4, my + 4, 62, 44, "#0a0f1d");
        if (m === 1) {
          // Monitor master con neve elettrostatica
          for (let sy = 0; sy < 44; sy += 3) {
            for (let sx = 0; sx < 62; sx += 4) {
              if (rnd(sx + sy * 10 + f) > 0.45) R(g, mx + 4 + sx, my + 4 + sy, 3, 2, "#94a3b8");
            }
          }
        } else if (m === 0) {
          smpte(g, mx + 4, my + 4, 62, 44);
        } else {
          VG(g, my + 4, my + 48, "#047857", "#064e3b"); g.fillRect(mx + 4, my + 4, 62, 44);
          g.fillStyle = "#a7f3d0"; g.font = "800 8px monospace"; g.textAlign = "center";
          g.fillText("CAM 2 (OFF)", mx + 35, my + 28);
        }
        crt(g, mx + 4, my + 4, 62, 44, 0.25);
      }

      // Banco mixer e postazione di montaggio
      VG(g, 110, H, "#334155", "#0f172a"); g.fillRect(0, 110, W, H - 110);
      R(g, 0, 110, W, 4, "#64748b");
      // Levette fader colorate del mixer video
      for (let i = 0; i < 8; i++) {
        const fx = 35 + i * 16;
        R(g, fx, 122, 2, 34, "#0f172a");
        const fv = 126 + (Math.sin(i * 1.7) * 12 + 12);
        R(g, fx - 3, fv, 8, 5, ["#ef4444", "#3b82f6", "#eab308", "#10b981"][i % 4]);
      }
      // Smagnetizzatore da tavolo caldo
      R(g, 180, 126, 36, 26, "#1e293b");
      R(g, 184, 130, 28, 18, "#7f1d1d");
      GL(g, 198, 139, 15, "239,68,68", 0.35 + 0.1 * Math.sin(f / 10));

      // Cestino con ritagli di nastro tagliati a terra
      R(g, 260, 148, 28, 38, "#475569");
      for (let i = 0; i < 5; i++) {
        g.strokeStyle = "#111827"; g.lineWidth = 1.5;
        g.beginPath(); g.arc(274 + Math.sin(i) * 6, 146 - i * 3, 7, 0, 3.14); g.stroke();
      }
      VIG(g, W, H, 0.3);
    },

    // 3. Magazzino Televendite e Costumi (Cap. 1 Interno 2)
    mov_magazzino(g, W, H, f) {
      VG(g, 0, 120, "#1f2937", "#111827"); g.fillRect(0, 0, W, 120);
      // Scaffali industriali metallici arancioni e grigi
      for (let s = 0; s < 3; s++) {
        const sx = 20 + s * 95;
        R(g, sx, 15, 80, 105, "#374151");
        R(g, sx, 15, 3, 105, "#f97316"); R(g, sx + 77, 15, 3, 105, "#f97316");
        for (let l = 0; l < 4; l++) R(g, sx, 35 + l * 24, 80, 3, "#f97316");
      }
      // Scatole e pentole d'acciaio inox impilate
      for (let p = 0; p < 3; p++) {
        C(g, 40 + p * 18, 52, 8, "#cbd5e1"); C(g, 40 + p * 18, 52, 6, "#e2e8f0");
        R(g, 38 + p * 18, 50, 14, 2, "#94a3b8"); // manici
      }
      // Manichino da arbitro con giacca nera e busta
      const ax = 150, ay = 58;
      R(g, ax - 8, ay, 16, 32, "#0f172a"); // giacca nera
      R(g, ax - 4, ay + 6, 8, 14, "#ffffff"); // colletto bianco
      R(g, ax + 2, ay + 10, 4, 6, "#fef08a"); // busta assegno che spunta
      C(g, ax, ay - 6, 6, "#e2e8f0"); // testa manichino
      R(g, ax - 1, ay + 32, 2, 20, "#64748b"); // piantana

      // Vecchio televisore Phonola sventrato (punto 1)
      const tx = 225, ty = 60;
      R(g, tx, ty, 50, 36, "#78350f"); // mobile in radica
      R(g, tx + 4, ty + 4, 34, 28, "#0f172a"); // tubo svuotato buio
      R(g, tx + 12, ty + 12, 18, 12, "#1e293b"); // cassetta Betamax nascosta dentro
      R(g, tx + 14, ty + 14, 14, 4, "#ef4444"); // etichetta rossa

      // Pavimento polveroso con scatoloni
      VG(g, 120, H, "#262e3d", "#151b26"); g.fillRect(0, 120, W, H - 120);
      for (let i = 0; i < 4; i++) {
        R(g, 30 + i * 65, 142 + (i % 2) * 12, 34, 28, "#b45309");
        R(g, 30 + i * 65, 142 + (i % 2) * 12, 34, 4, "#d97706");
      }
      VIG(g, W, H, 0.32);
    },

    // 4. Greto del Torrente Rondinella (Cap. 2 Esterno)
    mov_torrente(g, W, H, f) {
      VG(g, 0, 90, "#1f2937", "#374151"); g.fillRect(0, 0, W, 90);
      // Piloni massicci in cemento armato del viadotto autostradale
      for (let p = 0; p < 2; p++) {
        const px = 60 + p * 150;
        VG(g, 0, 130, "#475569", "#1e293b"); g.fillRect(px, 0, 36, 130);
        R(g, px - 6, 0, 48, 16, "#334155"); // travata superiore
        R(g, px, 80, 36, 2, "#0f172a");
        // Cassetta stagna abusiva con fili sul pilone 2
        if (p === 1) {
          R(g, px + 8, 92, 10, 14, "#0284c7");
          g.strokeStyle = "#0f172a"; g.lineWidth = 1;
          g.beginPath(); g.moveTo(px + 13, 106); g.lineTo(px + 24, 130); g.stroke();
        }
      }

      // Greto ghiaioso e canneti
      VG(g, 90, 140, "#334155", "#475569"); g.fillRect(0, 90, W, 50);
      for (let i = 0; i < 30; i++) C(g, rnd(i) * W, 95 + rnd(i + 10) * 40, rnd(i + 20) * 3 + 1, "#64748b");

      // Acqua del torrente che scorre
      VG(g, 135, H, "#0f2338", "#081524"); g.fillRect(0, 135, W, H - 135);
      for (let i = 0; i < 15; i++) {
        const wx = (i * 35 + f * 0.8) % (W + 40) - 20, wy = 142 + (i * 11) % (H - 146);
        R(g, wx, wy, 24, 1.5, "rgba(125,211,252,.3)");
      }

      // Furgone mimetizzato coperto da teli cerati tra i canneti
      const fx = 180, fy = 100;
      R(g, fx, fy, 75, 36, "#1f2937"); // sagoma scura
      T(g, [fx - 5, fy + 36, fx + 30, fy - 6, fx + 85, fy + 36], "#14532d"); // telo mimetico
      // Antenna Yagi telescopica puntata verso lo stadio
      R(g, fx + 45, fy - 22, 2, 22, "#94a3b8");
      for (let b = 0; b < 4; b++) R(g, fx + 40 + b * 2, fy - 20 + b * 4, 12 - b * 2, 1.5, "#cbd5e1");

      // Canneti verticali in primo piano
      for (let c = 0; c < 22; c++) {
        const cx = (c * 15 + rnd(c) * 8) % W;
        g.strokeStyle = "#3f6212"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(cx, H); g.quadraticCurveTo(cx + Math.sin(f / 25 + c) * 4, H - 25, cx, H - 45); g.stroke();
      }
      VIG(g, W, H, 0.4);
    },

    // 5. Abitacolo Furgone Intercettazioni (Cap. 2 Interno 1)
    mov_abitacolo(g, W, H, f) {
      VG(g, 0, H, "#060a0f", "#0f172a"); g.fillRect(0, 0, W, H);
      // Profilo sagomato dell'interno del van con vetri oscurati
      R(g, 30, 20, 260, 48, "#020617");
      R(g, 30, 20, 260, 2, "#1e293b");

      // Banco centrale con registratore Nagra a bobine aperte
      VG(g, 78, H, "#1e293b", "#0f172a"); g.fillRect(20, 78, 280, H - 78);
      R(g, 20, 78, 280, 3, "#334155");

      // Nagra 1/4" portatile in metallo spazzolato
      const nx = 70, ny = 90;
      R(g, nx, ny, 110, 70, "#475569");
      R(g, nx + 4, ny + 4, 102, 62, "#334155");
      // Due bobine metalliche che girano piano
      const rot = (f / 15);
      C(g, nx + 30, ny + 32, 18, "#94a3b8"); C(g, nx + 30, ny + 32, 5, "#0f172a");
      C(g, nx + 78, ny + 32, 18, "#94a3b8"); C(g, nx + 78, ny + 32, 5, "#0f172a");
      // Tratto di nastro magnetico tra le bobine
      R(g, nx + 30, ny + 46, 48, 2, "#451a03");
      // Spie a led e vu-meter analogico
      R(g, nx + 42, ny + 8, 24, 10, "#0f172a");
      const vup = Math.sin(f / 8) * 8;
      R(g, nx + 44, ny + 12, 10 + vup, 3, "#22c55e");
      C(g, nx + 96, ny + 12, 2.5, "#22c55e");

      // Cuffie professionali appese al cruscotto
      const hx = 210, hy = 86;
      g.strokeStyle = "#94a3b8"; g.lineWidth = 2.5;
      g.beginPath(); g.arc(hx, hy + 10, 16, 3.14, 0); g.stroke();
      C(g, hx - 16, hy + 22, 9, "#1e293b"); C(g, hx + 16, hy + 22, 9, "#1e293b");
      // Lucina di spia verde diffusa
      GL(g, nx + 54, ny + 14, 25, "34,197,94", 0.35);

      // Posacenere con cenere di sigaro cubano
      R(g, 245, 126, 26, 16, "#64748b");
      C(g, 258, 134, 6, "#334155");
      R(g, 254, 130, 8, 3, "#78350f"); // mozzicone
      VIG(g, W, H, 0.45);
    },

    // 6. Osteria «Il Traliccio» (Cap. 2 Interno 2)
    mov_osteria(g, W, H, f) {
      VG(g, 0, 110, "#451a03", "#78350f"); g.fillRect(0, 0, W, 110);
      // Perline in legno sulle pareti
      for (let x = 0; x < W; x += 14) R(g, x, 0, 1, 110, "#291003");

      // Televisore Mivar sospeso a mensola in alto a destra
      R(g, 220, 15, 65, 48, "#1c1917");
      R(g, 224, 19, 54, 38, "#022c22");
      // Telecronaca sfocata verde/bianco sul tubo
      for (let l = 0; l < 4; l++) R(g, 228, 25 + l * 7, 30 + (l % 2) * 12, 3, "#86efac");
      crt(g, 224, 19, 54, 38, 0.3);
      GL(g, 250, 36, 40, "134,239,172", 0.22);

      // Flipper 'Super Goal' a sinistra con luci lampeggianti
      const fx = 25, fy = 45;
      VG(g, fy, fy + 70, "#1d4ed8", "#1e3a8a"); g.fillRect(fx, fy, 46, 68);
      R(g, fx + 4, fy + 4, 38, 34, "#0f172a"); // testata segnapunti
      g.fillStyle = (f % 30 < 15) ? "#facc15" : "#ef4444";
      g.font = "900 8px monospace"; g.textAlign = "center";
      g.fillText("148.45", fx + 23, fy + 22);
      // Frecce e luci del cassone
      C(g, fx + 12, fy + 52, 3, "#f43f5e"); C(g, fx + 34, fy + 52, 3, "#38bdf8");

      // Bancone in formica verde dell'osteria
      VG(g, 110, H, "#15803d", "#14532d"); g.fillRect(0, 110, W, H - 110);
      R(g, 0, 110, W, 4, "#cbd5e1"); // bordo in alluminio cromato
      // Boccale di vino rosso e telefono a gettoni sul bancone
      R(g, 120, 94, 18, 20, "#e2e8f0"); // bicchiere
      R(g, 122, 102, 14, 10, "#991b1b"); // vino rosso
      // Telefono a gettoni arancione SIP
      R(g, 160, 80, 24, 34, "#ea580c");
      C(g, 172, 94, 6, "#ffffff"); C(g, 172, 94, 2, "#0f172a"); // disco combinatore
      R(g, 156, 76, 32, 6, "#0f172a"); // cornetta
      VIG(g, W, H, 0.28);
    },

    // 7. Campanile dei Corvi (Cap. 3 Esterno)
    mov_campanile(g, W, H, f) {
      // Cielo temporalesco violaceo con nuvole scure
      VG(g, 0, 120, "#1e1b4b", "#4338ca"); g.fillRect(0, 0, W, 120);
      for (let i = 0; i < 4; i++) {
        g.fillStyle = "rgba(15,23,42,.65)";
        g.beginPath(); g.arc(60 + i * 80, 45 + (i % 2) * 16, 42, 0, 7); g.fill();
      }

      // Vetta del Campanile romanico in pietra
      const bx = 110;
      VG(g, 40, H, "#57534e", "#292524"); g.fillRect(bx, 40, 100, H - 40);
      // Pietre a vista
      for (let y = 45; y < H; y += 12) {
        for (let x = bx + 4; x < bx + 96; x += 18) {
          R(g, x + ((y % 24) ? 0 : 8), y, 14, 8, "#44403c");
        }
      }
      // Bifora campanaria gotica al centro
      T(g, [bx + 25, 110, bx + 50, 75, bx + 75, 110], "#0c0a09");
      R(g, bx + 25, 108, 50, 40, "#0c0a09");
      // Campana di bronzo scuro all'interno
      C(g, bx + 50, 116, 16, "#14532d");

      // Struttura in traliccio d'antenna montata abusivamente in cima
      R(g, bx + 48, 0, 4, 42, "#94a3b8");
      R(g, bx + 36, 14, 28, 2, "#94a3b8");
      R(g, bx + 40, 24, 20, 2, "#94a3b8");
      // Cavo tranciato che penzola nel vento (punto chiave 1)
      const ca = Math.sin(f / 12) * 8;
      g.strokeStyle = "#ef4444"; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(bx + 48, 30); g.lineTo(bx + 30 + ca, 60); g.stroke();

      // Corvi neri posati sulle cornici
      C(g, bx + 16, 38, 4, "#0f172a"); R(g, bx + 14, 38, 6, 8, "#0f172a");
      C(g, bx + 84, 38, 4, "#0f172a"); R(g, bx + 82, 38, 6, 8, "#0f172a");
      VIG(g, W, H, 0.4);
    },

    // 8. Cella Campanaria e Ponte Radio (Cap. 3 Interno 1)
    mov_cella(g, W, H, f) {
      VG(g, 0, H, "#0c0a09", "#1c1917"); g.fillRect(0, 0, W, H);
      // Muri di pietra con finestre ad arco bifore che mostrano la notte
      T(g, [30, 80, 75, 20, 120, 80], "#172554");
      R(g, 30, 80, 90, 60, "#172554");
      // Antenna rivale di TVA visibile nella notte (luce rossa intermittente)
      R(g, 75, 45, 2, 30, "#64748b");
      if (f % 50 < 25) { C(g, 76, 45, 3, "#ef4444"); GL(g, 76, 45, 14, "239,68,68", 0.5); }

      // Campana maggiore di bronzo verde sulla destra
      const cx = 230, cy = 90;
      C(g, cx, cy, 38, "#065f46");
      R(g, cx - 38, cy, 76, 24, "#065f46");
      C(g, cx, cy + 24, 38, "#047857");
      // Microfono spia incollato col mastice sul bordo della campana
      R(g, cx - 28, cy + 20, 6, 6, "#0f172a");

      // Rack trasmettitore industriale con valvole termoioniche incandescenti
      const rx = 120, ry = 85;
      R(g, rx, ry, 64, 85, "#292524");
      R(g, rx + 4, ry + 4, 56, 77, "#1c1917");
      // 3 valvole termoioniche a bulbo (calore arancione intenso!)
      for (let v = 0; v < 3; v++) {
        const vx = rx + 14 + v * 18, vy = ry + 28;
        R(g, vx - 4, vy - 10, 8, 20, "rgba(255,255,255,.2)");
        C(g, vx, vy - 10, 4, "rgba(255,255,255,.3)");
        R(g, vx - 1, vy - 6, 2, 12, "#fb923c"); // filamento
        GL(g, vx, vy, 16, "249,115,22", 0.5 + 0.15 * Math.sin(f / 8 + v));
      }
      VIG(g, W, H, 0.42);
    },

    // 9. Salotto TV di «Polenta e Rigori» (Cap. 3 Interno 2)
    mov_studio_tv(g, W, H, f) {
      // Sfondo studio con pannelli luminosi e logo Tele-Rondine
      VG(g, 0, 110, "#075985", "#0284c7"); g.fillRect(0, 0, W, 110);
      // Linee grafiche retro anni '80
      g.strokeStyle = "rgba(254,240,138,.35)"; g.lineWidth = 2;
      for (let y = 20; y < 90; y += 14) {
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
      }

      // Moquette blu elettrico dello studio
      VG(g, 110, H, "#1d4ed8", "#1e3a8a"); g.fillRect(0, 110, W, H - 110);
      // Divanetti in similpelle lucida
      const dx = 120, dy = 120;
      R(g, dx, dy, 80, 28, "#7f1d1d");
      R(g, dx, dy - 14, 80, 16, "#991b1b"); // schienale
      // Agenda in pelle di coccodrillo lasciata sul divano dal Commendatore
      R(g, dx + 45, dy + 6, 12, 16, "#14532d");
      R(g, dx + 47, dy + 8, 8, 2, "#facc15"); // fermaglio oro

      // Telecamera da studio professionale pesante su ruote a sinistra
      const kx = 45, ky = 115;
      R(g, kx, ky, 34, 22, "#334155");
      C(g, kx + 34, ky + 11, 8, "#0f172a"); // ottica Zeiss gigante
      C(g, kx + 34, ky + 11, 4, "#38bdf8");
      R(g, kx - 4, ky - 8, 12, 8, "#1e293b"); // mirino
      R(g, kx + 14, ky + 22, 6, 26, "#1e293b"); // piedistallo
      // Cavi a serpente neri che corrono sul pavimento
      g.strokeStyle = "#0f172a"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(kx + 16, ky + 45); g.bezierCurveTo(kx + 30, ky + 55, kx + 60, ky + 40, kx + 90, ky + 58); g.stroke();

      // Riflettori fresnel a soffitto con fasci di luce concentrati
      for (const lx of [80, 240]) {
        R(g, lx - 8, 0, 16, 12, "#1e293b");
        T(g, [lx - 8, 12, lx - 45, 140, lx + 45, 140], "rgba(254,240,138,.12)");
        GL(g, lx, 14, 25, "254,240,138", 0.4);
      }
      VIG(g, W, H, 0.28);
    },

    // 10. Foyer del Teatro Comunale (Cap. 4 Esterno)
    mov_foyer(g, W, H, f) {
      // Cielo notturno con facciata monumentale neoclassica
      VG(g, 0, 110, "#0b0f19", "#1e1b4b"); g.fillRect(0, 0, W, 110);
      // Colonne monumentali corinzie in marmo chiaro
      for (let c = 0; c < 4; c++) {
        const cx = 35 + c * 75;
        VG(g, 20, 130, "#e2e8f0", "#94a3b8"); g.fillRect(cx, 20, 22, 110);
        R(g, cx - 4, 18, 30, 6, "#cbd5e1"); // capitello
        R(g, cx - 4, 126, 30, 6, "#cbd5e1"); // base
      }
      // Portone dorato monumentale con manifesto coperto da adesivo
      R(g, 120, 48, 80, 80, "#451a03");
      R(g, 130, 60, 28, 36, "#ffffff"); // manifesto
      R(g, 132, 70, 24, 12, "#ef4444"); // adesivo clandestino sul 94° min

      // Tappeto rosso bagnato dalla pioggia sui gradini
      VG(g, 126, H, "#991b1b", "#450a0a"); g.fillRect(90, 126, 140, H - 126);
      R(g, 0, 130, W, H - 130, "#334155"); // asfalto bagnato circostante
      R(g, 90, 126, 140, H - 126, "#991b1b");

      // Auto blu ministeriale parcheggiata con baule socchiuso (punto 2)
      const ax = 210, ay = 135;
      R(g, ax, ay + 10, 85, 30, "#090d16"); // berlina blu scuro
      R(g, ax + 10, ay, 35, 14, "#0f172a"); // tetto
      C(g, ax + 22, ay + 40, 8, "#020617"); C(g, ax + 72, ay + 40, 8, "#020617");
      // Baule semiaperto con mazzette da centomila lire che brillano
      R(g, ax + 58, ay + 6, 22, 8, "#475569");
      R(g, ax + 64, ay + 8, 12, 5, "#86efac"); // fascette banconote

      // Lampadari a gocce di cristallo interni che filtrano luce calda
      GL(g, 160, 50, 60, "254,240,160", 0.4);
      VIG(g, W, H, 0.35);
    },

    // 11. Cabina di Proiezione 35mm (Cap. 4 Interno 1)
    mov_proiezione(g, W, H, f) {
      VG(g, 0, H, "#0f141c", "#1a2230"); g.fillRect(0, 0, W, H);
      // Parete tecnica con portarotoli e bobine metalliche
      for (let i = 0; i < 4; i++) {
        C(g, 35 + i * 26, 30, 12, "#475569"); C(g, 35 + i * 26, 30, 4, "#0f172a");
      }

      // Proiettore monumentale Victoria 5 in ghisa
      const px = 130, py = 50;
      R(g, px, py + 20, 55, 75, "#1f2937"); // corpo lampada
      // Bobina superiore gigante 35mm
      C(g, px + 26, py - 4, 24, "#94a3b8"); C(g, px + 26, py - 4, 6, "#0f172a");
      // Bobina inferiore
      C(g, px + 26, py + 115, 24, "#94a3b8"); C(g, px + 26, py + 115, 6, "#0f172a");
      // Lampada a carboni accesa e feritoia verso la platea (punto 1)
      R(g, px + 55, py + 35, 14, 12, "#334155");
      // Fascio di luce proiettato verso la feritoia destra
      T(g, [px + 69, py + 41, W, py - 10, W, py + 95], "rgba(254,240,160,.28)");
      GL(g, px + 69, py + 41, 20, "254,240,160", 0.6);
      // Particelle di polvere che danzano nel fascio
      for (let p = 0; p < 18; p++) {
        const pox = px + 80 + (p * 11 + f * 0.4) % (W - px - 90);
        const poy = py + 10 + (p * 17 + f * 0.2) % 65;
        R(g, pox, poy, 1.5, 1.5, "rgba(255,255,255,.7)");
      }

      // Banco giunzione a nastro con colla
      R(g, 30, 130, 60, 36, "#334155");
      R(g, 42, 136, 36, 12, "#0f172a"); // giuntatrice
      R(g, 46, 140, 28, 2, "#facc15"); // pellicola tesa
      VIG(g, W, H, 0.38);
    },

    // 12. Camerino VIP nel Sottopalco (Cap. 4 Interno 2)
    mov_camerino(g, W, H, f) {
      VG(g, 0, H, "#2a0808", "#450a0a"); g.fillRect(0, 0, W, H);
      // Tappezzeria damascata bordeaux
      for (let y = 10; y < 110; y += 16) {
        for (let x = 12; x < W; x += 20) {
          R(g, x + ((y % 32) ? 0 : 10), y, 3, 3, "#5f0f0f");
        }
      }

      // Specchio grande con cornice in mogano e lampadine a bulbo
      const sx = 90, sy = 25, sw = 140, sh = 95;
      R(g, sx - 6, sy - 6, sw + 12, sh + 12, "#451a03"); // cornice
      VG(g, sy, sy + sh, "#cbd5e1", "#64748b"); g.fillRect(sx, sy, sw, sh); // specchio
      // Lampadine tonde accese lungo la cornice
      for (let i = 0; i <= 6; i++) {
        C(g, sx + (i * sw) / 6, sy - 6, 3.5, "#fef08a"); // sopra
        C(g, sx + (i * sw) / 6, sy + sh + 6, 3.5, "#fef08a"); // sotto
        if (i < 4) {
          C(g, sx - 6, sy + 15 + i * 22, 3.5, "#fef08a"); // sinistra
          C(g, sx + sw + 6, sy + 15 + i * 22, 3.5, "#fef08a"); // destra
        }
      }
      GL(g, sx + sw / 2, sy + sh / 2, 80, "254,240,160", 0.35);

      // Lettera di minacce infilata nella cornice in alto a destra
      R(g, sx + sw - 12, sy - 4, 14, 18, "#ffffff");
      R(g, sx + sw - 10, sy, 10, 2, "#991b1b"); // timbro ceralacca

      // Tavolo da trucco con custodia del fischietto d'oro
      VG(g, 120, H, "#78350f", "#451a03"); g.fillRect(40, 120, 240, H - 120);
      R(g, 40, 120, 240, 4, "#9a3412");
      // Custodia in velluto verde aperta
      R(g, 140, 134, 40, 26, "#064e3b");
      C(g, 160, 147, 7, "#facc15"); // fischietto d'oro massiccio lucente!
      GL(g, 160, 147, 18, "250,204,21", 0.45 + 0.1 * Math.sin(f / 12));

      // Griglia del condotto di aerazione da cui arrivano i suoni del palco
      R(g, 260, 20, 36, 26, "#334155");
      for (let l = 0; l < 4; l++) R(g, 264, 24 + l * 5, 28, 2, "#0f172a");
      VIG(g, W, H, 0.3);
    }
  };

  // Punti interattivi per ogni scena (3 punti per scena con testo descrittivo)
  const HOT = {
    mov_titolo: [
      [110, 14, 100, 26, "🔴 Segnale IN ONDA: quando quella spia è accesa, cento città guardano quello che decidi di mostrare."],
      [100, 52, 120, 82, "📺 Monitor Master: il monoscopio a barre colorate SMPTE nasconde l'istante esatto del 94° minuto."],
      [135, 148, 50, 44, "🎛️ Banco Jog/Shuttle: la manopola per avanzare fotogramma per fotogramma verso la verità."]
    ],
    mov_piazzale: [
      [200, 100, 35, 25, "📡 Parabola sul tetto: «I cavi penzolano staccati: qualcuno ha tagliato il segnale di trasmissione durante la notte.»"],
      [175, 110, 40, 30, "🚐 Portellone del furgone: «La serratura è forzata con una punta di cacciavite: il nastro della partita era qui dentro.»"],
      [10, 145, 60, 30, "🚬 Grata di scolo: «Un mozzicone di sigaro cubano ancora asciutto galleggia sulla fogna: chi ha rubato la bobina fuma roba costosa.»"]
    ],
    mov_regia: [
      [180, 126, 36, 26, "⚡ Smagnetizzatore da tavolo: «È ancora tiepido al tatto: hanno provato a bruciare le tracce magnetiche prima di fuggire.»"],
      [125, 26, 62, 44, "📺 Monitor Master U-matic: «Mostra solo neve elettrostatica e un fischio sordo a 50 Hertz.»"],
      [260, 145, 30, 40, "✂️ Cestino della carta: «Ritagli di nastro tagliati con le forbici: mancano esattamente due minuti di registrazione del secondo tempo.»"]
    ],
    mov_magazzino: [
      [225, 60, 50, 36, "📼 Televisore Phonola rotto: «All'interno del tubo svuotato è stata infilata una cassetta Betamax non etichettata!»"],
      [140, 50, 30, 50, "🕴️ Manichino da arbitro: «Indossa una giacca nera con una busta nella tasca interna: contabile di un assegno circolare.»"],
      [280, 20, 30, 40, "⚡ Quadro elettrico centrale: «La leva generale è stata abbassata con violenza scheggiando la bachelite rossa.»"]
    ],
    mov_torrente: [
      [20, 120, 60, 30, "🥾 Tracce di fango: «Impronte di stivali da cantiere numero 44 che portano verso la baracca dei pescatori.»"],
      [220, 80, 20, 30, "📡 Antenna Yagi telescopica: «Spunta da un cespuglio di rovi, perfettamente puntata verso la tribuna stampa dello stadio.»"],
      [210, 30, 36, 90, "🌉 Pilone 4 del viadotto: «Una cassetta stagna con cavi coassiali abusivi collegati alla linea telefonica pubblica.»"]
    ],
    mov_abitacolo: [
      [70, 90, 110, 70, "🎙️ Bobina Nagra 1/4\": «Il nastro è bloccato all'inizio del minuto 93: si sente un fruscio di fondo e un bisbiglio inequivocabile.»"],
      [195, 85, 30, 40, "🎧 Cuffie professionali: «Dall'auricolare sinistro trapela la frequenza dei radiomicrofoni usati dalla terna arbitrale.»"],
      [245, 126, 26, 16, "🚬 Posacenere del cruscotto: «Cenere di sigaro identica a quella trovata nel cortile degli studi di Tele-Rondine.»"]
    ],
    mov_osteria: [
      [25, 45, 46, 68, "🎰 Flipper 'Super Goal': «Sul vetro segnapunti c'è incisa una frequenza in megahertz: 148.450 MHz.»"],
      [160, 80, 24, 34, "☎️ Telefono a gettoni: «L'ultimo numero composto corrisponde alla segreteria dello sponsor Splendor.»"],
      [75, 20, 40, 30, "🏆 Bacheca dei trofei da bar: «Una foto sgualcita ritrae il patron Valeri a braccetto con il designatore arbitrale del 1980.»"]
    ],
    mov_campanile: [
      [135, 20, 30, 40, "✂️ Cavo d'antenna principale: «Tranciato di netto con una cesoia a leva: qualcuno non vuole che la trasmissione delle 20:30 parta.»"],
      [230, 130, 40, 30, "🪦 Lapide in pietra del 1920: «Alla base c'è nascosto un connettore BNC dorato ad alta potenza.»"],
      [150, 0, 20, 25, "🧭 Banderuola segnavento: «Il vento gira forte da nord: se non fissiamo i tiranti della parabola il ponte radio salterà a metà puntata.»"]
    ],
    mov_cella: [
      [120, 85, 64, 85, "🔥 Amplificatore valvolare 500W: «Le valvole sono incandescenti: serve un fusibile al silicio per non mandare a fuoco la cella.»"],
      [210, 80, 60, 50, "🔔 Campana maggiore: «Una scalfittura sul bordo rivela un microfono spia a cristallo incollato con mastice.»"],
      [40, 30, 70, 70, "🪟 Finestra bifora sulla vallata: «Da quassù si vede l'antenna rivale della potente TVA che brilla con luce rossa intermittente.»"]
    ],
    mov_studio_tv: [
      [220, 80, 30, 30, "📜 Gobbo elettronico: «Il testo delle domande concordate con lo sponsor è stato modificato a penna con insulti anonimi.»"],
      [10, 50, 35, 30, "📊 Monitor di trasmissione diretta: «Le linee del segnale mostrano una valanga di telefonate in arrivo al centralino.»"],
      [155, 120, 30, 20, "🐊 Poltrona dell'ospite d'onore: «Il patron Valeri ha dimenticato la sua agenda in pelle di coccodrillo tra i cuscini.»"]
    ],
    mov_foyer: [
      [125, 60, 35, 40, "📰 Vetrina del manifesto ufficiale: «La locandina del galà è coperta da un adesivo clandestino: 'Vogliamo la verità sul 94° minuto'.»"],
      [260, 135, 35, 25, "💼 Baule dell'auto blu del Commendatore: «Una valigetta diplomatica semichiusa lascia intravedere mazzette di banconote da centomila lire.»"],
      [10, 150, 40, 25, "🕳️ Botola di scarico carbone: «Un varco non sorvegliato che conduce direttamente ai cunicoli della cabina di proiezione.»"]
    ],
    mov_proiezione: [
      [130, 50, 70, 80, "📽️ Proiettore Victoria 5: «La lampada a carboni è accesa: basta sostituire la bobina dei saluti istituzionali con il nostro master!»"],
      [30, 130, 60, 36, "🎞️ Banco di giunzione a nastro: «Una giuntatrice manuale per pellicola con colla speciale ancora umida.»"],
      [240, 30, 70, 70, "👀 Feritoia di vetro sulla sala: «La platea è stracolma: ministri, presidenti di club, arbitri e il sindaco nei palchetti centrali.»"]
    ],
    mov_camerino: [
      [90, 25, 140, 95, "✉️ Specchio illuminato: «Sulla cornice in mogano è infilata la lettera di minacce recapitata alla famiglia di Fosco Banti.»"],
      [140, 130, 40, 30, "🪙 Custodia in velluto verde: «Il fischietto d'oro massiccio destinato alla premiazione del miglior arbitro dell'anno.»"],
      [260, 20, 36, 26, "💨 Condotto di areazione: «I suoni del palco arrivano limpidi: il Commendatore sta per prendere la parola al microfono.»"]
    ]
  };

  window.__moviolaBg = SC;
  window.__moviolaHot = HOT;

  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) {
      Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    } else if (n < 80) {
      setTimeout(() => reg(n + 1), 150);
    }
  }
  reg(0);
})();
