// ================= SCENARI E SFONDI 2D DETTAGLIATI & ANIMATI =================
// Motore di scenografie 2D pittoriche per Ali di Rondine:
// - Trattoria Moretti (tavoli a quadri, bottiglie, quadri d'epoca, lavagna del giorno, fumo caldo)
// - Spiaggia & Porto del Borgo (case liguri pastello, gozzo in legno, onde animate, faro)
// - Spogliatoio Storico (piastrelle anni '80, panche, lavagna schemi, maglia #10)
// - Notte sul Molo (luna con riflesso sull'acqua, lampare, lanterna a gas, faro rotante)
// - Stadio della Finale (fasci di luce volumetrici, spalti con bandiere, prato a strisce)
// - Villa dei Presidenti (parquet in noce, camino con braci, trofei dorati, vetrate sul golfo)
// - Piazza del Borgo (campanile, acciottolato, archi in pietra, festoni colorati)
(function () {
  "use strict";

  // Controllo attivazione da Impostazioni
  window.isBgArtDetailed = function () {
    try {
      if (window.SET && window.SET.bgArt === "retro") return false;
      return true;
    } catch (e) {
      return true;
    }
  };

  // Helper pixel e forme
  function px(g, x, y, w, h, col) {
    g.fillStyle = col;
    g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // --- 1. TRATTORIA MORETTI ---
  function drawDetailedTrattoria(g, W, H, f) {
    // Parete: parte alta stucco crema caldo, parte bassa perlinato in legno noce
    const wallGrad = g.createLinearGradient(0, 0, 0, 110);
    wallGrad.addColorStop(0, "#8a4e2a");
    wallGrad.addColorStop(1, "#c98246");
    g.fillStyle = wallGrad;
    g.fillRect(0, 0, W, 110);

    // Boiserie in legno (zoccolo)
    g.fillStyle = "#4a2412";
    g.fillRect(0, 110, W, 40);
    g.fillStyle = "#33160a";
    g.fillRect(0, 108, W, 3);
    for (let x = 12; x < W; x += 22) {
      px(g, x, 111, 2, 39, "#381708");
    }

    // Pavimento in cotto antico ligure
    const floorGrad = g.createLinearGradient(0, 148, 0, H);
    floorGrad.addColorStop(0, "#732c1c");
    floorGrad.addColorStop(1, "#40130a");
    g.fillStyle = floorGrad;
    g.fillRect(0, 148, W, H - 148);
    g.strokeStyle = "rgba(0,0,0,0.25)";
    g.lineWidth = 1;
    for (let y = 148; y < H; y += 14) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
    }
    for (let x = 0; x < W; x += 32) {
      g.beginPath(); g.moveTo(x + (Math.floor(x / 32) % 2 * 16), 148); g.lineTo(x + (Math.floor(x / 32) % 2 * 16), H); g.stroke();
    }

    // Finestra ad arco a sinistra con vista sul mare
    px(g, 16, 20, 52, 70, "#33160a");
    px(g, 19, 23, 46, 64, "#245080");
    // Vista mare e cielo dalla finestra
    const winGrad = g.createLinearGradient(19, 23, 19, 87);
    winGrad.addColorStop(0, "#ffb370");
    winGrad.addColorStop(0.5, "#ffd59e");
    winGrad.addColorStop(0.52, "#1d5885");
    winGrad.addColorStop(1, "#0d3150");
    g.fillStyle = winGrad;
    g.fillRect(19, 23, 46, 64);
    // Vele e sole al tramonto nella finestra
    g.fillStyle = "#fff4d4";
    g.beginPath(); g.arc(52, 48, 7, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#ffffffcc";
    g.beginPath(); g.moveTo(32, 54); g.lineTo(36, 44); g.lineTo(39, 54); g.fill();
    // Infisso a croce
    px(g, 41, 23, 2, 64, "#33160a");
    px(g, 19, 52, 46, 2, "#33160a");

    // Quadro storico della Rondine FC (centro-sinistra)
    px(g, 84, 22, 42, 34, "#ffd23f");
    px(g, 86, 24, 38, 30, "#2c2a26");
    // Foto d'epoca virata seppia
    const seppiaGrad = g.createLinearGradient(86, 24, 86, 54);
    seppiaGrad.addColorStop(0, "#c4a37a");
    seppiaGrad.addColorStop(1, "#7d6244");
    g.fillStyle = seppiaGrad;
    g.fillRect(86, 24, 38, 30);
    // Silhouette dei calciatori del 1982
    g.fillStyle = "#3d2a1b";
    for (let i = 0; i < 5; i++) {
      g.fillRect(90 + i * 6, 36, 4, 14);
      g.beginPath(); g.arc(92 + i * 6, 33, 2, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = "#ffd23f";
    g.font = "bold 5px sans-serif";
    g.fillText("RONDINE '82", 88, 52);

    // Mensola con bottiglie di vino e barattoli (centro)
    px(g, 140, 48, 72, 4, "#33160a");
    // Bottiglie (Vermentino verde, Rossese rosso scuro, olio d'oliva dorato)
    const bottles = ["#234a2e", "#234a2e", "#5a1420", "#5a1420", "#b8860b", "#234a2e"];
    bottles.forEach((c, idx) => {
      const bx = 146 + idx * 10;
      px(g, bx, 34, 6, 14, c);
      px(g, bx + 2, 28, 2, 6, c);
      px(g, bx + 1, 38, 4, 6, "#f5ecd8"); // Etichetta
    });

    // Lavagna del Menu del Giorno (destra)
    px(g, 226, 20, 76, 56, "#4a2412"); // Cornice
    px(g, 229, 23, 70, 50, "#1a241e"); // Lavagna ardesia
    g.fillStyle = "#e8f0e8";
    g.font = "bold 6px sans-serif";
    g.fillText("~ OSTERIA MORETTI ~", 233, 32);
    g.font = "5px sans-serif";
    g.fillStyle = "#ffd23f";
    g.fillText("• Trofie al Pesto", 233, 42);
    g.fillText("• Acciughe Fritte", 233, 50);
    g.fillText("• Focaccia Calda", 233, 58);
    g.fillStyle = "#a8d5a8";
    g.fillText("Vino della Casa 1L", 233, 67);

    // Lanterna a sospensione in ottone con alone caldo pulsante
    const lampX = 176, lampY = 12;
    px(g, lampX, 0, 1, lampY, "#222");
    g.fillStyle = "#c99738";
    g.beginPath(); g.moveTo(lampX - 8, lampY + 10); g.lineTo(lampX + 8, lampY + 10); g.lineTo(lampX + 5, lampY); g.lineTo(lampX - 5, lampY); g.fill();
    // Alone di luce calda
    const glowRad = 36 + Math.sin(f / 16) * 3;
    const glowGrad = g.createRadialGradient(lampX, lampY + 12, 2, lampX, lampY + 12, glowRad);
    glowGrad.addColorStop(0, "rgba(255,225,140,0.65)");
    glowGrad.addColorStop(0.4, "rgba(255,190,80,0.22)");
    glowGrad.addColorStop(1, "rgba(255,190,80,0)");
    g.fillStyle = glowGrad;
    g.fillRect(lampX - glowRad, lampY + 12 - glowRad, glowRad * 2, glowRad * 2);

    // Tavolo in primo piano con tovaglia a quadri bianchi e rossi
    px(g, 0, 162, W, 38, "#b3202c");
    // Quadri bianchi
    for (let tx = 0; tx < W; tx += 16) {
      for (let ty = 162; ty < H; ty += 12) {
        if (((tx / 16 + ty / 12) | 0) % 2 === 0) {
          px(g, tx, ty, 16, 12, "#f4eae0");
        }
      }
    }
    // Cestino di focaccia sul tavolo (sinistra)
    px(g, 28, 154, 34, 12, "#7a481e");
    px(g, 30, 150, 30, 8, "#d99b4a"); // Focaccia dorata
    for (let d = 0; d < 5; d++) {
      px(g, 34 + d * 5, 152 + (d % 2) * 2, 2, 2, "#fff"); // Granelli di sale grosso
    }

    // Caraffa di vino e bicchiere (destra)
    px(g, 250, 142, 14, 22, "rgba(180,30,45,0.85)");
    px(g, 252, 138, 10, 4, "rgba(255,255,255,0.7)");
    px(g, 268, 148, 8, 14, "rgba(180,30,45,0.75)");
    px(g, 270, 160, 4, 3, "rgba(255,255,255,0.8)");

    // Vapore delicato che sale dalla focaccia
    g.fillStyle = "rgba(255,255,255,0.18)";
    for (let s = 0; s < 3; s++) {
      const sy = 145 - ((f * 0.4 + s * 14) % 35);
      const sx = 40 + s * 6 + Math.sin(f / 12 + s) * 4;
      g.beginPath(); g.arc(sx, sy, 3 + (145 - sy) * 0.08, 0, Math.PI * 2); g.fill();
    }
  }

  // --- 2. SPIAGGIA & PORTO DEL BORGO ---
  function drawDetailedBeach(g, W, H, f, isPorto) {
    // Cielo ligure al crepuscolo / mezzogiorno dorato
    const skyGrad = g.createLinearGradient(0, 0, 0, 110);
    skyGrad.addColorStop(0, "#3a76b8");
    skyGrad.addColorStop(0.5, "#7eb1e0");
    skyGrad.addColorStop(0.85, "#ffd59b");
    skyGrad.addColorStop(1, "#ff9e5e");
    g.fillStyle = skyGrad;
    g.fillRect(0, 0, W, 110);

    // Sole caldo e riflesso
    const sunX = 246, sunY = 52;
    const sunGlow = g.createRadialGradient(sunX, sunY, 6, sunX, sunY, 48);
    sunGlow.addColorStop(0, "rgba(255,250,220,0.95)");
    sunGlow.addColorStop(0.3, "rgba(255,220,130,0.5)");
    sunGlow.addColorStop(1, "rgba(255,180,90,0)");
    g.fillStyle = sunGlow;
    g.fillRect(sunX - 48, sunY - 48, 96, 96);
    g.fillStyle = "#fffdf0";
    g.beginPath(); g.arc(sunX, sunY, 13, 0, Math.PI * 2); g.fill();

    // Nuvole soffuse
    for (let c = 0; c < 3; c++) {
      const cx = ((c * 130 + f * 0.15) % (W + 80)) - 40;
      const cy = 20 + c * 14;
      g.fillStyle = "rgba(255,245,235,0.45)";
      g.beginPath();
      g.arc(cx, cy, 14, 0, Math.PI * 2);
      g.arc(cx + 12, cy - 3, 11, 0, Math.PI * 2);
      g.arc(cx + 22, cy + 2, 13, 0, Math.PI * 2);
      g.fill();
    }

    // Scogliera e casette liguri arroccate sullo sfondo (sinistra e centro)
    // Roccia a strapiombo
    g.fillStyle = "#5c504a";
    g.beginPath();
    g.moveTo(0, 115);
    g.lineTo(0, 55);
    g.lineTo(34, 52);
    g.lineTo(76, 68);
    g.lineTo(118, 80);
    g.lineTo(150, 115);
    g.fill();

    // Macchia mediterranea (pini e ulivi sulla scogliera)
    g.fillStyle = "#2d5a34";
    for (let p = 0; p < 7; p++) {
      g.beginPath();
      g.arc(10 + p * 16, 54 + (p % 2) * 5, 8 + (p % 3) * 2, 0, Math.PI * 2);
      g.fill();
    }

    // Casette color pastello ligure (giallo ocra, rosa antico, arancio)
    const houses = [
      { x: 14, y: 38, w: 14, h: 22, c: "#e8a855", r: "#b84232" },
      { x: 30, y: 34, w: 16, h: 26, c: "#df7456", r: "#8f3226" },
      { x: 48, y: 44, w: 15, h: 20, c: "#f0cf65", r: "#a8382b" },
      { x: 65, y: 52, w: 18, h: 22, c: "#e5856b", r: "#983626" },
      { x: 85, y: 62, w: 14, h: 18, c: "#dfc072", r: "#8b2e22" },
    ];
    houses.forEach((h) => {
      // Parete
      px(g, h.x, h.y, h.w, h.h, h.c);
      // Tetto in tegole
      g.fillStyle = h.r;
      g.beginPath(); g.moveTo(h.x - 2, h.y); g.lineTo(h.x + h.w / 2, h.y - 6); g.lineTo(h.x + h.w + 2, h.y); g.fill();
      // Finestre con persiane verdi liguri
      px(g, h.x + 3, h.y + 4, 3, 5, "#1e4d2b");
      px(g, h.x + h.w - 6, h.y + 4, 3, 5, "#1e4d2b");
      px(g, h.x + 3, h.y + 12, 3, 5, "#1e4d2b");
      px(g, h.x + h.w - 6, h.y + 12, 3, 5, "#1e4d2b");
    });

    // Promontorio del Faro di Punta Rondine in lontananza (destra)
    g.fillStyle = "#3e4854";
    g.beginPath();
    g.moveTo(270, 115);
    g.lineTo(290, 84);
    g.lineTo(320, 80);
    g.lineTo(320, 115);
    g.fill();
    // Faro bianco e amaranto
    px(g, 300, 56, 7, 28, "#f2f2f2");
    px(g, 300, 64, 7, 5, "#b3202c");
    px(g, 300, 74, 7, 5, "#b3202c");
    px(g, 298, 52, 11, 4, "#222"); // Cupola
    px(g, 301, 48, 5, 4, "#ffd23f"); // Luce

    // Il Mare Ligure: blu cobalto e smeraldo con riflessi
    const seaTop = 112;
    const seaGrad = g.createLinearGradient(0, seaTop, 0, 155);
    seaGrad.addColorStop(0, "#195085");
    seaGrad.addColorStop(0.4, "#1d6ea8");
    seaGrad.addColorStop(0.85, "#2589b8");
    seaGrad.addColorStop(1, "#36a3ba");
    g.fillStyle = seaGrad;
    g.fillRect(0, seaTop, W, 48);

    // Riflesso dorato del sole sulle onde
    g.fillStyle = "rgba(255,225,120,0.22)";
    for (let r = 0; r < 7; r++) {
      const ry = seaTop + 4 + r * 6;
      const rw = 24 + r * 10;
      px(g, sunX - rw / 2 + Math.sin(f / 15 + r) * 4, ry, rw, 2, "rgba(255,235,140,0.35)");
    }

    // Onde con schiuma procedurale animata
    g.strokeStyle = "rgba(255,255,255,0.65)";
    g.lineWidth = 1.5;
    for (let w = 0; w < 4; w++) {
      const wy = seaTop + 10 + w * 10 + Math.sin(f / 20 + w) * 2;
      g.beginPath();
      for (let x = 0; x < W; x += 16) {
        const yOffset = Math.sin((x + f * 1.4 + w * 40) / 14) * 2;
        if (x === 0) g.moveTo(x, wy + yOffset);
        else g.lineTo(x, wy + yOffset);
      }
      g.stroke();
    }

    // Se è la spiaggia: sabbia dorata con ciottoli e gozzo in secca
    if (!isPorto) {
      const sandGrad = g.createLinearGradient(0, 152, 0, H);
      sandGrad.addColorStop(0, "#f0cb82");
      sandGrad.addColorStop(0.5, "#d9aa5f");
      sandGrad.addColorStop(1, "#b38342");
      g.fillStyle = sandGrad;
      g.fillRect(0, 152, W, H - 152);

      // Bagnasciuga (schiuma che si ritira)
      const foamOffset = Math.sin(f / 25) * 4;
      g.fillStyle = "rgba(255,255,255,0.7)";
      g.beginPath();
      g.ellipse(160, 154 + foamOffset, 160, 4, 0, 0, Math.PI * 2);
      g.fill();

      // Ciottoli di mare
      for (let p = 0; p < 12; p++) {
        const pxPos = (p * 29 + 15) % W;
        const pyPos = 160 + (p * 11) % 32;
        px(g, pxPos, pyPos, 3, 2, "#8a7560");
      }

      // Gozzo in legno arenato sulla sabbia (destra)
      const bx = 224, by = 162;
      // Ombra
      g.fillStyle = "rgba(0,0,0,0.2)";
      g.beginPath(); g.ellipse(bx + 26, by + 16, 32, 6, 0, 0, Math.PI * 2); g.fill();
      // Scafo bianco e blu
      g.fillStyle = "#1e4b85"; // Fondo carena
      g.beginPath();
      g.moveTo(bx, by + 8);
      g.quadraticCurveTo(bx + 26, by + 20, bx + 56, by + 8);
      g.lineTo(bx + 54, by + 12);
      g.quadraticCurveTo(bx + 26, by + 22, bx + 2, by + 12);
      g.fill();
      g.fillStyle = "#f5f5f5"; // Fiancata bianca
      g.beginPath();
      g.moveTo(bx, by + 6);
      g.quadraticCurveTo(bx + 26, by + 18, bx + 56, by + 6);
      g.lineTo(bx + 56, by + 9);
      g.quadraticCurveTo(bx + 26, by + 21, bx, by + 9);
      g.fill();
      // Bordo in mogano
      px(g, bx + 4, by + 5, 48, 2, "#6e3314");
      // Remi incrociati
      g.strokeStyle = "#8b4f24";
      g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(bx + 12, by + 2); g.lineTo(bx + 44, by + 16); g.stroke();
    } else {
      // Molo in pietra con bitte di ferro (Porto)
      const pierGrad = g.createLinearGradient(0, 146, 0, H);
      pierGrad.addColorStop(0, "#737a85");
      pierGrad.addColorStop(0.5, "#5a616c");
      pierGrad.addColorStop(1, "#3e444d");
      g.fillStyle = pierGrad;
      g.fillRect(0, 146, W, H - 146);

      // Lastroni di granito e fughe
      g.strokeStyle = "rgba(0,0,0,0.3)";
      g.lineWidth = 1;
      for (let x = 0; x < W; x += 36) {
        g.beginPath(); g.moveTo(x, 146); g.lineTo(x, H); g.stroke();
      }
      for (let y = 146; y < H; y += 16) {
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
      }

      // Bitte d'ormeggio in ghisa
      for (let b = 28; b < W; b += 78) {
        px(g, b - 4, 150, 8, 8, "#1f2228");
        g.fillStyle = "#111418";
        g.beginPath(); g.arc(b, 150, 5, 0, Math.PI * 2); g.fill();
        // Cima di canapa legata
        g.strokeStyle = "#b8905a";
        g.lineWidth = 2;
        g.beginPath(); g.arc(b, 152, 6, 0, Math.PI); g.stroke();
      }

      // Rete da pesca arrotolata ad asciugare (sinistra)
      px(g, 10, 164, 40, 18, "#2d4a3e");
      for (let n = 0; n < 6; n++) {
        px(g, 14 + n * 6, 166 + (n % 2) * 3, 3, 3, "#b88a42"); // Sugheri galleggianti
      }
    }

    // Gabbiani in volo (disegnati a V)
    g.strokeStyle = "#223";
    g.lineWidth = 1.2;
    const gulls = [
      { x: 120, y: 35 },
      { x: 134, y: 30 },
      { x: 185, y: 44 }
    ];
    gulls.forEach((gl, i) => {
      const flap = Math.sin(f / 8 + i * 2) * 2;
      const gx = (gl.x + f * 0.4) % (W + 30) - 15;
      g.beginPath();
      g.moveTo(gx - 5, gl.y + flap);
      g.quadraticCurveTo(gx - 2, gl.y - 3, gx, gl.y);
      g.quadraticCurveTo(gx + 2, gl.y - 3, gx + 5, gl.y + flap);
      g.stroke();
    });
  }

  // --- 3. SPOGLIATOIO STORICO ---
  function drawDetailedLocker(g, W, H, f) {
    // Piastrelle vintage bianche e azzurro chiaro tipiche anni '80
    g.fillStyle = "#edf4fa";
    g.fillRect(0, 0, W, 100);
    g.strokeStyle = "#c2d4e3";
    g.lineWidth = 1;
    for (let x = 0; x < W; x += 16) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 100); g.stroke();
    }
    for (let y = 0; y < 100; y += 16) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
    }
    // Fascia decorativa centrale piastrelle blu scuro
    px(g, 0, 96, W, 8, "#1a3b5c");
    px(g, 0, 104, W, 4, "#ffd23f"); // Filetto dorato

    // Pavimento in linoleum verde bottiglia antiscivolo
    const floorGrad = g.createLinearGradient(0, 108, 0, H);
    floorGrad.addColorStop(0, "#19422b");
    floorGrad.addColorStop(1, "#0d2417");
    g.fillStyle = floorGrad;
    g.fillRect(0, 108, W, H - 108);

    // Lampada industriale al neon a soffitto con fascio conico di luce
    px(g, 130, 0, 60, 5, "#a0aab5");
    px(g, 134, 5, 52, 3, "#ffffff");
    // Fascio di luce
    const coneGrad = g.createLinearGradient(160, 8, 160, 160);
    coneGrad.addColorStop(0, "rgba(255,255,255,0.18)");
    coneGrad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = coneGrad;
    g.beginPath();
    g.moveTo(134, 8);
    g.lineTo(186, 8);
    g.lineTo(240, 170);
    g.lineTo(80, 170);
    g.fill();

    // Lavagna tattica con schemi al centro della stanza
    px(g, 106, 22, 108, 64, "#5c3418"); // Cornice in legno
    px(g, 110, 26, 100, 56, "#1d382b"); // Lavagna verde scuro
    // Campo tracciato con gesso bianco
    g.strokeStyle = "rgba(255,255,255,0.45)";
    g.lineWidth = 1;
    g.strokeRect(114, 30, 92, 48);
    g.beginPath(); g.moveTo(160, 30); g.lineTo(160, 78); g.stroke();
    g.beginPath(); g.arc(160, 54, 10, 0, Math.PI * 2); g.stroke();
    // Cerchietti schemi e freccia dell'attacco della Rondine
    g.fillStyle = "#ff4d5a"; // Noi
    [[130, 44], [130, 64], [146, 54], [176, 42], [188, 54]].forEach(([cx, cy]) => {
      g.beginPath(); g.arc(cx, cy, 3, 0, Math.PI * 2); g.fill();
    });
    g.fillStyle = "#3fa7ff"; // Avversari
    [[142, 44], [154, 64], [174, 54], [194, 46]].forEach(([cx, cy]) => {
      g.beginPath(); g.arc(cx, cy, 3, 0, Math.PI * 2); g.fill();
    });
    // Freccia schema a triangolo
    g.strokeStyle = "#ffd23f";
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(146, 54);
    g.lineTo(176, 42);
    g.lineTo(188, 54);
    g.stroke();

    // Armadietti a sinistra e destra con pioli
    // Panca in legno di pino
    px(g, 0, 126, W, 14, "#8f572c");
    px(g, 0, 140, W, 4, "#5c3314");
    // Gambe della panca
    for (let leg = 30; leg < W; leg += 64) {
      px(g, leg, 144, 8, 38, "#2e333d");
    }

    // Maglie appese ai ganci
    // Maglia #10 di Leo (Amaranto)
    const jx1 = 34;
    g.fillStyle = "#b3202c";
    g.beginPath();
    g.moveTo(jx1 - 10, 52);
    g.lineTo(jx1 + 10, 52);
    g.lineTo(jx1 + 14, 62);
    g.lineTo(jx1 + 9, 64);
    g.lineTo(jx1 + 8, 86);
    g.lineTo(jx1 - 8, 86);
    g.lineTo(jx1 - 9, 64);
    g.lineTo(jx1 - 14, 62);
    g.fill();
    g.fillStyle = "#fff";
    g.font = "bold 9px sans-serif";
    g.textAlign = "center";
    g.fillText("10", jx1, 74);
    g.textAlign = "left";

    // Maglia #1 di Nico (Turchese portiere)
    const jx2 = 68;
    g.fillStyle = "#19a0b8";
    g.beginPath();
    g.moveTo(jx2 - 10, 52);
    g.lineTo(jx2 + 10, 52);
    g.lineTo(jx2 + 14, 62);
    g.lineTo(jx2 + 9, 64);
    g.lineTo(jx2 + 8, 86);
    g.lineTo(jx2 - 8, 86);
    g.lineTo(jx2 - 9, 64);
    g.lineTo(jx2 - 14, 62);
    g.fill();
    g.fillStyle = "#fff";
    g.font = "bold 9px sans-serif";
    g.textAlign = "center";
    g.fillText("1", jx2, 74);
    g.textAlign = "left";

    // Maglia #8 di Tommy (destra)
    const jx3 = 246;
    g.fillStyle = "#b3202c";
    g.beginPath();
    g.moveTo(jx3 - 10, 52);
    g.lineTo(jx3 + 10, 52);
    g.lineTo(jx3 + 14, 62);
    g.lineTo(jx3 + 9, 64);
    g.lineTo(jx3 + 8, 86);
    g.lineTo(jx3 - 8, 86);
    g.lineTo(jx3 - 9, 64);
    g.lineTo(jx3 - 14, 62);
    g.fill();
    g.fillStyle = "#fff";
    g.font = "bold 9px sans-serif";
    g.textAlign = "center";
    g.fillText("8", jx3, 74);
    g.textAlign = "left";

    // Borsone in cuoio vintage sulla panca
    px(g, 268, 114, 36, 16, "#5a2e16");
    px(g, 272, 110, 28, 4, "#3d1e0d"); // Manico
    px(g, 276, 118, 20, 2, "#d9a84e"); // Zip dorata

    // Pallone di cuoio classico poggiato a terra sotto la panca
    const ballX = 64, ballY = 168;
    g.fillStyle = "rgba(0,0,0,0.3)";
    g.beginPath(); g.ellipse(ballX, ballY + 7, 8, 3, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f5f5f5";
    g.beginPath(); g.arc(ballX, ballY, 8, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#222";
    g.beginPath(); g.arc(ballX, ballY, 3, 0, Math.PI * 2); g.fill();
  }

  // --- 4. NOTTE SUL MOLO ---
  function drawDetailedNight(g, W, H, f) {
    // Cielo notturno blu oltremare profondo
    const skyGrad = g.createLinearGradient(0, 0, 0, 120);
    skyGrad.addColorStop(0, "#050814");
    skyGrad.addColorStop(0.6, "#0d1630");
    skyGrad.addColorStop(1, "#18284d");
    g.fillStyle = skyGrad;
    g.fillRect(0, 0, W, 120);

    // Stelle scintillanti con ampiezze sfalsate
    for (let s = 0; s < 45; s++) {
      const sx = (s * 47 + 13) % W;
      const sy = (s * 31 + 7) % 95;
      const starAlpha = 0.35 + Math.sin(f / 10 + s) * 0.3;
      px(g, sx, sy, (s % 7 === 0) ? 2 : 1, (s % 7 === 0) ? 2 : 1, `rgba(255,255,255,${starAlpha})`);
    }

    // Luna crescente dorata con alone
    const moonX = 252, moonY = 32;
    const moonGlow = g.createRadialGradient(moonX, moonY, 6, moonX, moonY, 40);
    moonGlow.addColorStop(0, "rgba(255,245,200,0.5)");
    moonGlow.addColorStop(0.5, "rgba(200,225,255,0.15)");
    moonGlow.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = moonGlow;
    g.fillRect(moonX - 40, moonY - 40, 80, 80);
    // Luna
    g.fillStyle = "#fff7d6";
    g.beginPath(); g.arc(moonX, moonY, 12, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#0d1630"; // Ombra per mezzaluna
    g.beginPath(); g.arc(moonX + 5, moonY - 2, 11, 0, Math.PI * 2); g.fill();

    // Sagoma del paese e faro all'orizzonte
    g.fillStyle = "#090d1a";
    g.beginPath();
    g.moveTo(0, 118);
    for (let h = 0; h < 9; h++) {
      const hx = h * 38;
      const hh = 26 + (h * 17) % 24;
      g.lineTo(hx, 118 - hh);
      g.lineTo(hx + 30, 118 - hh);
    }
    g.lineTo(W, 118);
    g.fill();
    // Finestrelle illuminate calde nel borgo notturno
    for (let w = 0; w < 14; w++) {
      const wx = 12 + w * 21;
      const wy = 100 + (w % 3) * 5;
      px(g, wx, wy, 3, 4, ((w + (f >> 5)) % 4 !== 0) ? "#ffd97a" : "#4a3b22");
    }

    // Faro di Punta Rondine con fascio luminoso rotante
    const lx = 296, ly = 66;
    px(g, lx, ly, 6, 26, "#151c2e");
    // Fascio di luce volumetrico che ruota
    const beamAngle = Math.PI / 2 + Math.sin(f / 75) * 0.95;
    g.save();
    g.translate(lx + 3, ly + 2);
    g.rotate(beamAngle);
    const beamGrad = g.createLinearGradient(0, 0, 240, 0);
    beamGrad.addColorStop(0, "rgba(255,245,180,0.65)");
    beamGrad.addColorStop(0.3, "rgba(255,240,160,0.2)");
    beamGrad.addColorStop(1, "rgba(255,240,160,0)");
    g.fillStyle = beamGrad;
    g.beginPath();
    g.moveTo(0, -2);
    g.lineTo(240, -32);
    g.lineTo(240, 32);
    g.lineTo(0, 2);
    g.fill();
    g.restore();

    // Mare notturno scuro con nastro argentato di riflesso lunare
    const seaTop = 114;
    const seaGrad = g.createLinearGradient(0, seaTop, 0, 154);
    seaGrad.addColorStop(0, "#081124");
    seaGrad.addColorStop(1, "#0f1f3d");
    g.fillStyle = seaGrad;
    g.fillRect(0, seaTop, W, 40);

    // Riflesso argentato della luna
    for (let r = 0; r < 6; r++) {
      const ry = seaTop + 3 + r * 6;
      const rw = 20 + r * 14;
      const rx = moonX - rw / 2 + Math.sin(f / 12 + r) * 5;
      px(g, rx, ry, rw, 2, "rgba(255,245,210,0.35)");
    }

    // Lucine delle lampare dei pescatori al largo
    for (let lp = 0; lp < 4; lp++) {
      const lpx = 40 + lp * 65 + Math.sin(f / 20 + lp) * 3;
      const lpy = 122 + (lp % 2) * 6;
      px(g, lpx - 4, lpy + 1, 8, 2, "#050a14"); // Sagoma barca
      px(g, lpx, lpy - 2, 2, 2, "#ffe082"); // Lucina
    }

    // Banchina in pietra bagnata della notte in primo piano
    px(g, 0, 150, W, H - 150, "#0b1022");
    // Pozzanghere con riflesso
    for (let pz = 0; pz < 4; pz++) {
      g.fillStyle = "rgba(40,65,115,0.45)";
      g.beginPath();
      g.ellipse(60 + pz * 70, 168 + (pz % 2) * 8, 22, 5, 0, 0, Math.PI * 2);
      g.fill();
    }

    // Lampione a gas in ferro battuto con luce ambrata viva
    const lampX = 46, lampY = 104;
    px(g, lampX, lampY, 3, 50, "#1a1f2e"); // Palo
    px(g, lampX - 6, lampY - 8, 15, 9, "#1a1f2e"); // Lanterna
    // Fiamma e bagliore
    const fireFlicker = Math.sin(f / 6) * 2;
    px(g, lampX - 2, lampY - 6, 7, 5, "#ffd97a");
    const lampGlow = g.createRadialGradient(lampX + 1, lampY - 4, 3, lampX + 1, lampY - 4, 38 + fireFlicker);
    lampGlow.addColorStop(0, "rgba(255,215,110,0.65)");
    lampGlow.addColorStop(0.4, "rgba(255,180,70,0.22)");
    lampGlow.addColorStop(1, "rgba(255,180,70,0)");
    g.fillStyle = lampGlow;
    g.fillRect(lampX - 40, lampY - 44, 80, 80);
  }

  // --- 5. STADIO DELLA FINALE ---
  function drawDetailedStadium(g, W, H, f) {
    // Cielo serale dell'arena calcistica
    const skyGrad = g.createLinearGradient(0, 0, 0, 95);
    skyGrad.addColorStop(0, "#09122b");
    skyGrad.addColorStop(0.6, "#142552");
    skyGrad.addColorStop(1, "#264882");
    g.fillStyle = skyGrad;
    g.fillRect(0, 0, W, 95);

    // Spalti gremiti su più anelli con tifosi animati
    const crowdGrad = g.createLinearGradient(0, 50, 0, 110);
    crowdGrad.addColorStop(0, "#1c2a4a");
    crowdGrad.addColorStop(1, "#121b30");
    g.fillStyle = crowdGrad;
    g.fillRect(0, 50, W, 60);

    // Silhouette e coriandoli di tifosi
    const fanColors = ["#b3202c", "#ffffff", "#ffd23f", "#1d3fa3", "#ff4d5a"];
    for (let row = 0; row < 4; row++) {
      const ry = 58 + row * 11;
      for (let fn = 0; fn < 40; fn++) {
        const fx = fn * 8 + (row % 2) * 4;
        const col = fanColors[(fn + row * 3) % fanColors.length];
        const bounce = Math.sin(f / 10 + fn * 0.4) > 0.4 ? -2 : 0;
        px(g, fx, ry + bounce, 5, 6, col);
        px(g, fx + 1, ry - 3 + bounce, 3, 3, "#f6d0a8");
      }
    }

    // Quattro piloni di fari a riflettore con fasci volumetrici
    const towers = [26, 88, 232, 294];
    towers.forEach((tx, idx) => {
      // Pilone reticolare
      px(g, tx - 6, 12, 12, 45, "#4a5568");
      px(g, tx - 10, 8, 20, 6, "#cbd5e1");
      // Lampade alogene
      for (let l = 0; l < 4; l++) {
        px(g, tx - 8 + l * 4, 9, 3, 4, "#ffffff");
      }
      // Fascio volumetrico verso il campo
      const targetX = idx < 2 ? 100 + idx * 40 : 180 + (idx - 2) * 40;
      const beamGrad = g.createLinearGradient(tx, 14, targetX, 160);
      beamGrad.addColorStop(0, "rgba(255,255,230,0.35)");
      beamGrad.addColorStop(0.5, "rgba(255,255,230,0.12)");
      beamGrad.addColorStop(1, "rgba(255,255,230,0)");
      g.fillStyle = beamGrad;
      g.beginPath();
      g.moveTo(tx - 8, 14);
      g.lineTo(tx + 8, 14);
      g.lineTo(targetX + 45, 175);
      g.lineTo(targetX - 45, 175);
      g.fill();
    });

    // Manto erboso rasato a strisce perfette
    const pitchTop = 110;
    const lawnColors = ["#2f9e55", "#38ab5e"];
    for (let s = 0; s < 10; s++) {
      px(g, s * 32, pitchTop, 32, H - pitchTop, lawnColors[s % 2]);
    }

    // Linee bianche di campo
    g.strokeStyle = "rgba(255,255,255,0.85)";
    g.lineWidth = 2;
    g.strokeRect(10, pitchTop + 6, W - 20, H - pitchTop - 12);
    // Cerchio di centrocampo
    g.beginPath(); g.arc(160, pitchTop + 40, 24, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(160, pitchTop + 6); g.lineTo(160, H - 6); g.stroke();

    // Cartelloni pubblicitari a bordo campo
    const ads = ["RONDINE FC", "PESTO LIGURE", "BANCA COSTA", "RADIO 98.6"];
    ads.forEach((ad, i) => {
      const ax = 14 + i * 74;
      px(g, ax, pitchTop - 4, 70, 8, "#0f172a");
      g.fillStyle = (i % 2 === 0) ? "#ffd23f" : "#ffffff";
      g.font = "bold 5px sans-serif";
      g.fillText(ad, ax + 6, pitchTop + 2);
    });
  }

  // --- 6. VILLA & UFFICI DEI PRESIDENTI ---
  function drawDetailedVilla(g, W, H, f) {
    // Boiserie regale in mogano con carta da parati damascata bordeaux
    const wallGrad = g.createLinearGradient(0, 0, 0, 110);
    wallGrad.addColorStop(0, "#2c0e18");
    wallGrad.addColorStop(1, "#54192d");
    g.fillStyle = wallGrad;
    g.fillRect(0, 0, W, 110);

    // Parquet lucido a spina di pesce
    const floorGrad = g.createLinearGradient(0, 110, 0, H);
    floorGrad.addColorStop(0, "#4a2412");
    floorGrad.addColorStop(1, "#271107");
    g.fillStyle = floorGrad;
    g.fillRect(0, 110, W, H - 110);

    // Ampia vetrata ad arco sul golfo (centro-sinistra)
    px(g, 24, 16, 80, 84, "#241008");
    const gardenGrad = g.createLinearGradient(27, 19, 27, 97);
    gardenGrad.addColorStop(0, "#081226");
    gardenGrad.addColorStop(0.6, "#142c4f");
    gardenGrad.addColorStop(1, "#1e4475");
    g.fillStyle = gardenGrad;
    g.fillRect(27, 19, 74, 78);
    // Pini marittimi in controluce
    g.fillStyle = "#060c18";
    g.beginPath();
    g.moveTo(42, 97); g.lineTo(44, 48); g.lineTo(48, 48); g.lineTo(50, 97); g.fill();
    g.beginPath(); g.arc(46, 42, 18, 0, Math.PI * 2); g.fill();

    // Camino monumentale in marmo con fiammelle vive (centro)
    const fx = 138, fy = 42;
    px(g, fx, fy, 54, 68, "#8c827a"); // Marmo
    px(g, fx + 8, fy + 18, 38, 50, "#141010"); // Bocca camino
    // Fiammelle ardenti
    for (let fl = 0; fl < 5; fl++) {
      const flX = fx + 14 + fl * 6;
      const flH = 12 + Math.sin(f / 5 + fl * 2) * 5;
      g.fillStyle = ["#ff4500", "#ff8c00", "#ffd700"][fl % 3];
      g.beginPath();
      g.moveTo(flX, fy + 64);
      g.lineTo(flX + 3, fy + 64 - flH);
      g.lineTo(flX + 6, fy + 64);
      g.fill();
    }
    // Bagliore del fuoco
    const fireGlow = g.createRadialGradient(fx + 27, fy + 56, 4, fx + 27, fy + 56, 45);
    fireGlow.addColorStop(0, "rgba(255,140,40,0.5)");
    fireGlow.addColorStop(1, "rgba(255,140,40,0)");
    g.fillStyle = fireGlow;
    g.fillRect(fx - 18, fy + 10, 90, 90);

    // Bacheca dei trofei e contratti (destra)
    px(g, 218, 20, 84, 80, "#2c150c");
    px(g, 222, 24, 76, 72, "#402214");
    // Ripiani in vetro con trofei dorati
    for (let s = 0; s < 3; s++) {
      const sy = 44 + s * 24;
      px(g, 222, sy, 76, 3, "rgba(200,235,255,0.7)");
      // Coppe e medaglie
      g.fillStyle = "#ffd23f";
      // Coppa oro
      g.beginPath();
      g.moveTo(234 + s * 18, sy);
      g.lineTo(238 + s * 18, sy - 12);
      g.lineTo(246 + s * 18, sy - 12);
      g.lineTo(250 + s * 18, sy);
      g.fill();
      px(g, 240 + s * 18, sy - 16, 4, 4, "#ffd23f");
    }

    // Tappeto persiano damascato rosso scuro in primo piano
    px(g, 40, 142, W - 80, 52, "#6e1524");
    px(g, 44, 146, W - 88, 44, "#8a1b2e");
    g.strokeStyle = "#ffd23f";
    g.lineWidth = 1;
    g.strokeRect(48, 150, W - 96, 36);
  }

  // --- DISPATCHER PRINCIPALE DEGLI SCENARI ---
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (!window.isBgArtDetailed()) return false;
    const f = frame || 0;

    switch (kind) {
      case "trattoria":
      case "museo":
      case "posta":
        drawDetailedTrattoria(g, W, H, f);
        return true;
      case "beach":
        drawDetailedBeach(g, W, H, f, false);
        return true;
      case "porto":
      case "piazza":
        drawDetailedBeach(g, W, H, f, true);
        return true;
      case "locker":
      case "locker2":
        drawDetailedLocker(g, W, H, f);
        return true;
      case "night":
      case "notte2":
      case "diario":
        drawDetailedNight(g, W, H, f);
        return true;
      case "stadium":
        drawDetailedStadium(g, W, H, f);
        return true;
      case "villa":
        drawDetailedVilla(g, W, H, f);
        return true;
      default:
        return false;
    }
  };

  console.log("✓ Motore Scenari e Sfondi 2D Dettagliati caricato con successo");
})();
