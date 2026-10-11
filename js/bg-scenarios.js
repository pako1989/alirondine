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

  // --- 7. SCENARI FEUDALI: LA BILANCIA DELLE TRE CORONE (TRIANGLE STRATEGY) ---

  // Helper per recuperare statistiche e scelte della Bilancia dei Feudi
  function getFeudiState() {
    try {
      if (window.__bilanciaFeudi && typeof window.__bilanciaFeudi.info === "function") {
        return window.__bilanciaFeudi.info();
      }
    } catch (e) {}
    return { ch: 1, step: {}, done: {}, convictions: { moralita: 10, utilita: 10, liberta: 10 }, clues: 0, tokens: 3 };
  }

  // 7A. GRAN SALA DEL CONSIGLIO & LA BILANCIA DELLE CONVINZIONI
  function drawDetailedFeudiConsiglio(g, W, H, f) {
    const st = getFeudiState();
    const cM = (st.convictions && st.convictions.moralita) || 10;
    const cU = (st.convictions && st.convictions.utilita) || 10;
    const cL = (st.convictions && st.convictions.liberta) || 10;

    // Parete in pietra scura gotica con volte a ogiva
    const wallGrad = g.createLinearGradient(0, 0, 0, 130);
    wallGrad.addColorStop(0, "#09090b");
    wallGrad.addColorStop(0.5, "#18181b");
    wallGrad.addColorStop(1, "#27272a");
    g.fillStyle = wallGrad;
    g.fillRect(0, 0, W, 130);

    // Colonne gotiche con capitelli scolpiti
    [24, 76, W - 76, W - 24].forEach((cx) => {
      px(g, cx - 7, 0, 14, 130, "#1f2937");
      px(g, cx - 5, 0, 10, 130, "#374151");
      px(g, cx - 2, 0, 4, 130, "#4b5563");
      px(g, cx - 9, 22, 18, 6, "#6b7280");
    });

    // Tre grandi vetrate ogivali decorate
    const windows = [
      { x: 44, col1: "#1d4ed8", col2: "#93c5fd", label: "Glenbrook" },
      { x: W / 2 - 20, col1: "#b91c1c", col2: "#fbbf24", label: "Wolffort" },
      { x: W - 84, col1: "#db2777", col2: "#fbcfe8", label: "Roselliani" }
    ];

    windows.forEach((win) => {
      // Fascia ogivale
      g.fillStyle = "#111827";
      g.fillRect(win.x - 2, 8, 44, 72);
      // Arco superiore
      g.beginPath();
      g.arc(win.x + 20, 20, 20, Math.PI, 0);
      g.fill();

      // Vetro colorato luminoso
      const winGrad = g.createLinearGradient(win.x, 10, win.x, 76);
      winGrad.addColorStop(0, win.col1);
      winGrad.addColorStop(1, win.col2);
      g.fillStyle = winGrad;
      g.fillRect(win.x + 2, 20, 36, 56);
      g.beginPath();
      g.arc(win.x + 20, 20, 16, Math.PI, 0);
      g.fill();

      // Nervature in piombo della vetrata
      px(g, win.x + 19, 10, 2, 66, "rgba(0,0,0,0.5)");
      px(g, win.x + 2, 38, 36, 2, "rgba(0,0,0,0.5)");
      px(g, win.x + 2, 54, 36, 2, "rgba(0,0,0,0.5)");

      // Fascio di luce volumetrico inclinato che scende sul pavimento
      const rayGrad = g.createLinearGradient(win.x + 20, 20, win.x - 30, H);
      rayGrad.addColorStop(0, "rgba(254, 240, 138, 0.22)");
      rayGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
      g.fillStyle = rayGrad;
      g.beginPath();
      g.moveTo(win.x + 2, 20);
      g.lineTo(win.x + 38, 20);
      g.lineTo(win.x + 10, H);
      g.lineTo(win.x - 50, H);
      g.closePath();
      g.fill();
    });

    // Pavimento in lastre di marmo bicolore scuro e dorato
    const floorGrad = g.createLinearGradient(0, 130, 0, H);
    floorGrad.addColorStop(0, "#271202");
    floorGrad.addColorStop(0.5, "#3b1e08");
    floorGrad.addColorStop(1, "#180a01");
    g.fillStyle = floorGrad;
    g.fillRect(0, 130, W, H - 130);

    for (let x = 0; x < W; x += 32) {
      px(g, x, 130, 1, H - 130, "rgba(251, 191, 36, 0.15)");
    }
    for (let y = 130; y < H; y += 18) {
      px(g, 0, y, W, 1, "rgba(251, 191, 36, 0.12)");
    }

    // Bracieri ardenti laterali con particelle di scintille
    [20, W - 20].forEach((bx, idx) => {
      px(g, bx - 8, 88, 16, 22, "#3f3f46");
      px(g, bx - 12, 84, 24, 5, "#27272a");
      const flameH = 16 + Math.sin(f / 6 + idx * 2.5) * 4;
      const fl = g.createRadialGradient(bx, 80, 2, bx, 80, flameH);
      fl.addColorStop(0, "#fef08a");
      fl.addColorStop(0.4, "#f97316");
      fl.addColorStop(1, "rgba(220, 38, 38, 0)");
      g.fillStyle = fl;
      g.beginPath();
      g.arc(bx, 80, flameH, 0, Math.PI * 2);
      g.fill();

      // Scintille che salgono
      for (let s = 0; s < 3; s++) {
        const sy = 70 - ((f * 1.5 + s * 14 + idx * 7) % 36);
        const sx = bx + Math.sin(f / 8 + s + idx) * 6;
        px(g, sx, sy, 2, 2, "#fde047");
      }
    });

    // LA MONUMENTALE BILANCIA DELLE CONVINZIONI
    const bx = W / 2, by = 60;
    // Fusto centrale in oro brunito
    px(g, bx - 4, by - 26, 8, 70, "#eab308");
    px(g, bx - 2, by - 24, 4, 66, "#fef08a");
    // Base a zampa di leone
    px(g, bx - 16, by + 40, 32, 6, "#ca8a04");
    px(g, bx - 20, by + 44, 40, 4, "#a16207");

    // Inclinazione fisica reale del braccio basata sulla prevalenza tra Utilità e Moralità/Libertà
    const convDiff = (cU - (cM + cL) / 2) * 0.015;
    const tilt = Math.max(-0.25, Math.min(0.25, convDiff)) + Math.sin(f / 35) * 0.02;

    g.save();
    g.translate(bx, by - 16);
    g.rotate(tilt);

    // Braccio orizzontale in bronzo dorato
    px(g, -58, -3, 116, 6, "#ca8a04");
    px(g, -56, -2, 112, 3, "#fef08a");
    // Perno centrale con gemma del Falco
    g.fillStyle = "#dc2626";
    g.beginPath();
    g.arc(0, 0, 5, 0, Math.PI * 2);
    g.fill();

    // Catenelle e Piatto Sinistro (Moralità & Libertà)
    g.strokeStyle = "#eab308";
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(-52, 0); g.lineTo(-62, 28);
    g.moveTo(-52, 0); g.lineTo(-42, 28);
    g.stroke();
    // Piatto d'oro sinistro
    px(g, -66, 28, 28, 4, "#ca8a04");
    px(g, -64, 29, 24, 2, "#fef08a");
    // Gettoni d'Oro impilati sul piatto sinistro in base a Moralità/Libertà
    const leftCoins = Math.min(5, Math.max(1, Math.floor((cM + cL) / 10)));
    for (let c = 0; c < leftCoins; c++) {
      px(g, -56 + (c % 2) * 4, 26 - c * 2, 8, 2, "#fbbf24");
    }

    // Catenelle e Piatto Destro (Utilità)
    g.beginPath();
    g.moveTo(52, 0); g.lineTo(42, 28);
    g.moveTo(52, 0); g.lineTo(62, 28);
    g.stroke();
    // Piatto d'oro destro
    px(g, 38, 28, 28, 4, "#ca8a04");
    px(g, 40, 29, 24, 2, "#fef08a");
    // Gettoni d'Oro impilati sul piatto destro in base a Utilità
    const rightCoins = Math.min(5, Math.max(1, Math.floor(cU / 8)));
    for (let c = 0; c < rightCoins; c++) {
      px(g, 48 + (c % 2) * 4, 26 - c * 2, 8, 2, "#fbbf24");
    }

    g.restore();

    // GRANDE TAVOLO DEL CONSIGLIO DEI SETTE FEUDI
    g.fillStyle = "#3b1e08";
    g.beginPath();
    g.ellipse(W / 2, 162, 102, 28, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#854d0e";
    g.lineWidth = 2.5;
    g.stroke();

    // Mappa tattica srotolata al centro del tavolo
    px(g, W / 2 - 36, 150, 72, 22, "#fef3c7");
    px(g, W / 2 - 34, 152, 68, 18, "#fde68a");
    // Fiumi e confini tracciati sulla pergamena
    px(g, W / 2 - 24, 156, 16, 2, "#2563eb");
    px(g, W / 2 - 8, 158, 28, 2, "#2563eb");
    // Gettoni delle truppe
    px(g, W / 2 - 18, 154, 5, 5, "#dc2626"); // Wolffort
    px(g, W / 2 + 6, 156, 5, 5, "#1e3a8a");  // Glacefort
    px(g, W / 2 + 18, 158, 5, 5, "#ca8a04"); // Glenbrook

    // Calamaio con piuma d'oca e candela sul tavolo
    px(g, W / 2 + 42, 152, 6, 6, "#18181b");
    px(g, W / 2 + 45, 145, 2, 8, "#e2e8f0");
  }

  // 7B. IL MASTIO DI CASTEL WOLFFORT & IL BORGO MEDIEVALE
  function drawDetailedFeudiMastio(g, W, H, f) {
    const st = getFeudiState();
    const cM = (st.convictions && st.convictions.moralita) || 10;
    const cU = (st.convictions && st.convictions.utilita) || 10;
    const cL = (st.convictions && st.convictions.liberta) || 10;

    // Cielo alpino con nuvole che traslano
    const sky = g.createLinearGradient(0, 0, 0, 95);
    sky.addColorStop(0, "#172554");
    sky.addColorStop(0.6, "#2563eb");
    sky.addColorStop(1, "#93c5fd");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 95);

    // Nuvole soffici
    const cloudShift = (f * 0.2) % (W + 80);
    [[-40, 24, 70, 16], [120, 16, 85, 18], [240, 32, 60, 14]].forEach(([cx, cy, cw, ch]) => {
      const rx = (cx + cloudShift) % (W + 80) - 40;
      g.fillStyle = "rgba(255, 255, 255, 0.45)";
      g.beginPath();
      g.ellipse(rx, cy, cw / 2, ch / 2, 0, 0, Math.PI * 2);
      g.fill();
    });

    // Cime montuose innevate sullo sfondo
    g.fillStyle = "#cbd5e1";
    g.beginPath();
    g.moveTo(0, 75);
    g.lineTo(45, 30); g.lineTo(100, 70);
    g.lineTo(165, 22); g.lineTo(235, 76);
    g.lineTo(W, 36); g.lineTo(W, 95); g.lineTo(0, 95);
    g.closePath();
    g.fill();
    // Nevai illuminati
    g.fillStyle = "#f8fafc";
    g.beginPath();
    g.moveTo(45, 30); g.lineTo(58, 44); g.lineTo(34, 44); g.closePath(); g.fill();
    g.beginPath();
    g.moveTo(165, 22); g.lineTo(182, 38); g.lineTo(152, 38); g.closePath(); g.fill();

    // CASE E PALAZZI DEL BORGO SOTTOSTANTE (Elementi Scenografici Ricchi)
    const villageHouses = [
      { x: 12, w: 32, h: 26, roof: "#b45309", wall: "#d6d3d1" },
      { x: 50, w: 26, h: 22, roof: "#9a3412", wall: "#e7e5e4" },
      { x: 236, w: 36, h: 28, roof: "#7c2d12", wall: "#d6d3d1" },
      { x: 278, w: 30, h: 24, roof: "#b45309", wall: "#e7e5e4" }
    ];

    villageHouses.forEach((h) => {
      // Parete casa
      px(g, h.x, 68 - (h.h - 22), h.w, h.h, h.wall);
      // Travi in legno verticali tipiche dei borghi
      for (let tx = h.x + 4; tx < h.x + h.w - 2; tx += 8) {
        px(g, tx, 68 - (h.h - 22), 2, h.h, "#78350f");
      }
      // Tetto a spiovente
      g.fillStyle = h.roof;
      g.beginPath();
      g.moveTo(h.x - 3, 68 - (h.h - 22));
      g.lineTo(h.x + h.w / 2, 54 - (h.h - 22));
      g.lineTo(h.x + h.w + 3, 68 - (h.h - 22));
      g.closePath();
      g.fill();
      // Comignolo con fumo che sale
      px(g, h.x + h.w - 8, 48 - (h.h - 22), 4, 8, "#57534e");
      for (let sm = 0; sm < 3; sm++) {
        const smY = 46 - (h.h - 22) - ((f + sm * 12) % 24);
        const smX = h.x + h.w - 6 + Math.sin(f / 10 + sm) * 4;
        px(g, smX, smY, 3, 3, "rgba(226, 232, 240, 0.45)");
      }
      // Finestre illuminate
      px(g, h.x + 6, 74 - (h.h - 22), 5, 6, "#fef08a");
      px(g, h.x + h.w - 11, 74 - (h.h - 22), 5, 6, "#fef08a");
    });

    // Mura merlate del Mastio di Castel Wolffort in primo piano
    g.fillStyle = "#64748b";
    g.fillRect(0, 68, W, 46);
    // Merli regolari
    for (let x = 0; x < W; x += 22) {
      px(g, x, 54, 13, 15, "#475569");
      px(g, x + 2, 56, 9, 2, "#94a3b8");
    }

    // Pavimentazione in ciottoli del Cortile d'Armi
    const ground = g.createLinearGradient(0, 114, 0, H);
    ground.addColorStop(0, "#78716c");
    ground.addColorStop(1, "#44403c");
    g.fillStyle = ground;
    g.fillRect(0, 114, W, H - 114);

    // Stendardi araldici sventolanti mossi dal vento (Colore basato sulla scelta!)
    const bannerColor = cM > cU && cM > cL ? "#1d4ed8" : cL > cU ? "#db2777" : "#b91c1c";
    [64, W - 64].forEach((bx, idx) => {
      // Asta dello stendardo
      px(g, bx - 1, 26, 3, 58, "#1e293b");
      // Pomello dorato
      px(g, bx - 2, 24, 5, 4, "#fbbf24");
      // Drappo che ondeggia
      const sway = Math.sin(f / 12 + idx * 1.8) * 5;
      g.fillStyle = bannerColor;
      g.beginPath();
      g.moveTo(bx + 2, 28);
      g.lineTo(bx + 32 + sway, 30);
      g.lineTo(bx + 26 + sway, 52);
      g.lineTo(bx + 2, 48);
      g.closePath();
      g.fill();
      // Emblema del Falco al centro
      px(g, bx + 12 + sway * 0.5, 36, 7, 7, "#fef08a");
    });

    // Sentinella in ronda sui bastioni (passante animato)
    const guardWalk = Math.sin(f / 30) * 28;
    const gx = W / 2 + guardWalk;
    px(g, gx, 48, 5, 8, "#94a3b8");  // Busto armatura
    px(g, gx + 1, 44, 3, 4, "#cbd5e1"); // Elmo
    px(g, gx + 6, 42, 1, 14, "#ca8a04"); // Asta alabarda
    px(g, gx + 5, 40, 3, 4, "#e2e8f0"); // Lama alabarda

    // Fucina del fabbro (in basso a sinistra) con braci e scintille
    px(g, 22, 132, 24, 18, "#1e293b");
    px(g, 26, 128, 16, 5, "#ea580c");
    px(g, 30, 126, 8, 4, "#fef08a");
    // Incudine
    px(g, 54, 136, 12, 10, "#334155");
    px(g, 50, 134, 20, 4, "#64748b");
    // Scintille del martello
    if (f % 24 < 8) {
      px(g, 58 + (f % 5), 130 - (f % 4), 2, 2, "#fde047");
      px(g, 62 - (f % 6), 128 - (f % 5), 2, 2, "#f97316");
    }

    // Carro di rifornimenti e sacchi di grano (in basso a destra)
    px(g, W - 58, 136, 36, 14, "#78350f");
    // Ruota cerchiata
    g.strokeStyle = "#451a03"; g.lineWidth = 2;
    g.beginPath(); g.arc(W - 48, 150, 7, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(W - 28, 150, 7, 0, Math.PI * 2); g.stroke();
    // Sacchi di grano/sale
    px(g, W - 54, 130, 10, 8, "#fef3c7");
    px(g, W - 42, 128, 12, 10, "#fde68a");
    px(g, W - 32, 131, 8, 7, "#fef3c7");
  }

  // 7C. LA FORTEZZA DELLE DIGHE DI GLENBROOK & LE CHIUSE FLUVIALI
  function drawDetailedFeudiGlenbrook(g, W, H, f) {
    const st = getFeudiState();
    const voto2 = (st.done && st.done[2]) || "";
    const isFlooded = voto2.includes("utilita");

    // Cielo drammatico sul fiume
    const sky = g.createLinearGradient(0, 0, 0, 75);
    sky.addColorStop(0, "#082f49");
    sky.addColorStop(0.7, "#0284c7");
    sky.addColorStop(1, "#7dd3fc");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 75);

    // Torri della Diga di Glenbrook
    px(g, 32, 16, 52, 85, "#334155");
    px(g, 36, 18, 44, 83, "#475569");
    px(g, W - 84, 16, 52, 85, "#334155");
    px(g, W - 80, 18, 44, 83, "#475569");

    // Finestrelle delle torri di guardia
    [32, W - 84].forEach((tx) => {
      px(g, tx + 14, 28, 6, 10, "#0f172a");
      px(g, tx + 32, 28, 6, 10, "#0f172a");
      px(g, tx + 22, 50, 8, 12, "#fef08a");
    });

    // Ruota idraulica in legno che gira (animata)
    const wx = 94, wy = 88;
    g.save();
    g.translate(wx, wy);
    g.rotate(f * 0.04);
    g.strokeStyle = "#78350f"; g.lineWidth = 3;
    g.beginPath(); g.arc(0, 0, 16, 0, Math.PI * 2); g.stroke();
    for (let a = 0; a < 6; a++) {
      const ang = (a * Math.PI) / 3;
      px(g, Math.cos(ang) * 6, Math.sin(ang) * 6, 8, 2, "#451a03");
    }
    g.restore();

    // Il grande ponte di pietra centrale con parapetti
    px(g, 0, 78, W, 26, "#64748b");
    px(g, 0, 80, W, 3, "#94a3b8");
    for (let x = 10; x < W; x += 18) {
      px(g, x, 72, 8, 8, "#475569");
    }

    // Cascate del fiume: se alluvione attivata, cateratte aperte e piena violenta!
    const waterGrad = g.createLinearGradient(0, 104, 0, H);
    if (isFlooded) {
      waterGrad.addColorStop(0, "#0369a1");
      waterGrad.addColorStop(0.5, "#0284c7");
      waterGrad.addColorStop(1, "#38bdf8");
    } else {
      waterGrad.addColorStop(0, "#0284c7");
      waterGrad.addColorStop(0.5, "#0369a1");
      waterGrad.addColorStop(1, "#075985");
    }
    g.fillStyle = waterGrad;
    g.fillRect(0, 104, W, H - 104);

    // Onde e schiuma fluviale volumetrica animata
    for (let y = 108; y < H; y += 10) {
      const spd = isFlooded ? 6 : 10;
      const waveOffset = Math.sin(f / spd + y) * 16;
      px(g, 15 + waveOffset, y, 90, isFlooded ? 3 : 2, "rgba(240, 249, 255, 0.6)");
      px(g, 140 + waveOffset, y, 110, isFlooded ? 4 : 2, "rgba(224, 242, 254, 0.5)");
    }

    // Barche da pesca dei civili lungo la riva o chiatte d'evacuazione
    const boatX = 220 + Math.sin(f / 16) * 4;
    px(g, boatX, 154, 38, 8, "#78350f");
    px(g, boatX - 4, 152, 8, 8, "#9a3412");
    px(g, boatX + 34, 152, 8, 8, "#9a3412");
    // Lanterna sulla barca
    px(g, boatX + 16, 146, 4, 8, "#18181b");
    px(g, boatX + 17, 148, 2, 4, "#fef08a");
  }

  // 7D. LE MINIERE DI CRISTALLO & SALE DI GLACEFORT
  function drawDetailedFeudiGlacefort(g, W, H, f) {
    const st = getFeudiState();
    const ch3Done = !!(st.done && st.done[3]);

    // Caverna oscura profonda
    const caveGrad = g.createLinearGradient(0, 0, 0, H);
    caveGrad.addColorStop(0, "#020617");
    caveGrad.addColorStop(0.4, "#0f172a");
    caveGrad.addColorStop(1, "#1e293b");
    g.fillStyle = caveGrad;
    g.fillRect(0, 0, W, H);

    // Stalattiti di sale candido e cristallo pendenti dalla volta
    for (let x = 8; x < W; x += 18) {
      const sh = 18 + ((x * 7) % 28);
      g.fillStyle = (x % 36 === 0) ? "#e0f2fe" : "#94a3b8";
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x + 9, 0);
      g.lineTo(x + 4.5, sh);
      g.closePath();
      g.fill();
    }

    // Grandi cristalli di salgemma fosforescenti con bagliore radiale pulsante
    const crystals = [
      { x: 38, y: 88, r: 20 },
      { x: 110, y: 70, r: 24 },
      { x: 210, y: 80, r: 22 },
      { x: 285, y: 72, r: 26 }
    ];

    crystals.forEach((cr, idx) => {
      const pulse = Math.sin(f / 15 + idx * 2) * 4;
      const glow = g.createRadialGradient(cr.x, cr.y, 2, cr.x, cr.y, cr.r + pulse);
      glow.addColorStop(0, "rgba(56, 189, 248, 0.75)");
      glow.addColorStop(0.6, "rgba(14, 165, 233, 0.25)");
      glow.addColorStop(1, "rgba(14, 165, 233, 0)");
      g.fillStyle = glow;
      g.beginPath();
      g.arc(cr.x, cr.y, cr.r + pulse, 0, Math.PI * 2);
      g.fill();

      // Cristallo sfaccettato solido
      g.fillStyle = "#e0f2fe";
      g.beginPath();
      g.moveTo(cr.x, cr.y - 14);
      g.lineTo(cr.x + 8, cr.y);
      g.lineTo(cr.x, cr.y + 14);
      g.lineTo(cr.x - 8, cr.y);
      g.closePath();
      g.fill();
      px(g, cr.x - 2, cr.y - 6, 4, 12, "#ffffff");
    });

    // Pavimento in lastre di sale compatto e polvere bianca
    px(g, 0, 134, W, H - 134, "#64748b");
    px(g, 0, 138, W, 4, "#f1f5f9");

    // Binario in ferro con traverse in legno per i carrelli minerari
    px(g, 0, 156, W, 3, "#334155");
    px(g, 0, 170, W, 3, "#334155");
    for (let x = 4; x < W; x += 16) {
      px(g, x, 153, 5, 22, "#451a03");
    }

    // Carrello minerario carico di cristalli
    const cartX = 148;
    px(g, cartX, 142, 34, 16, "#1e293b");
    // Cristalli scintillanti nel carrello
    px(g, cartX + 4, 138, 8, 6, "#38bdf8");
    px(g, cartX + 14, 136, 10, 8, "#e0f2fe");
    px(g, cartX + 22, 139, 8, 5, "#38bdf8");
    // Ruote ferrate
    px(g, cartX + 4, 156, 6, 6, "#0f172a");
    px(g, cartX + 24, 156, 6, 6, "#0f172a");

    // Catene spezzate se il Capitolo 3 è concluso (Impatto visivo della Libertà!)
    if (ch3Done) {
      px(g, 72, 162, 14, 3, "#fbbf24");
      px(g, 90, 164, 12, 3, "#fbbf24");
      // Bandiera rosa dei Roselliani piantata sulla roccia
      px(g, 42, 114, 2, 28, "#78350f");
      g.fillStyle = "#f472b6";
      g.beginPath();
      g.moveTo(44, 116); g.lineTo(60, 122); g.lineTo(44, 128); g.closePath(); g.fill();
    }
  }

  // 7E. L'ANFITEATRO DEL GRAN GIUDIZIO (CAPITOLO 4 · IL COLOSSEO DEI FEUDI)
  function drawDetailedFeudiColosseo(g, W, H, f) {
    // Cielo dorato imperiale del tramonto
    const sky = g.createLinearGradient(0, 0, 0, 68);
    sky.addColorStop(0, "#78350f");
    sky.addColorStop(0.5, "#d97706");
    sky.addColorStop(1, "#fde68a");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 68);

    // Archi monumentali del Colosseo Imperiale a doppio ordine
    g.fillStyle = "#e7e5e4";
    px(g, 0, 44, W, 48, "#d6d3d1");
    for (let x = 10; x < W; x += 28) {
      g.fillStyle = "#1c1917";
      g.beginPath();
      g.moveTo(x, 82);
      g.lineTo(x, 56);
      g.arc(x + 9, 56, 9, Math.PI, 0);
      g.lineTo(x + 18, 82);
      g.closePath();
      g.fill();

      // Folla animata negli spalti che incita i campioni
      const crowdCol = ["#b91c1c", "#1d4ed8", "#ca8a04", "#db2777"][(x + Math.floor(f / 20)) % 4];
      px(g, x + 3, 62 + (f % 6 > 3 ? 1 : 0), 4, 4, crowdCol);
      px(g, x + 11, 62 + (f % 6 <= 3 ? 1 : 0), 4, 4, "#fbbf24");
    }

    // Tribuna Reale dei Tre Regni al centro con baldacchino damascato
    const cx = W / 2;
    px(g, cx - 44, 30, 88, 26, "#451a03");
    // Bandiere delle tre potenze affiancate
    px(g, cx - 36, 34, 22, 18, "#b91c1c"); // Wolffort
    px(g, cx - 11, 34, 22, 18, "#1d4ed8"); // Glenbrook
    px(g, cx + 14, 34, 22, 18, "#0284c7"); // Glacefort
    // Corona imperiale dorata scolpita sul frontone
    px(g, cx - 8, 24, 16, 7, "#fbbf24");
    px(g, cx - 5, 22, 10, 3, "#fef08a");

    // Il campo di sabbia dorata per la finale suprema
    const sandGrad = g.createLinearGradient(0, 92, 0, H);
    sandGrad.addColorStop(0, "#fef08a");
    sandGrad.addColorStop(0.3, "#fde047");
    sandGrad.addColorStop(1, "#ca8a04");
    g.fillStyle = sandGrad;
    g.fillRect(0, 92, W, H - 92);

    // Linee bianche di calce del rettangolo di gioco
    g.strokeStyle = "rgba(255, 255, 255, 0.85)";
    g.lineWidth = 2;
    g.strokeRect(18, 108, W - 36, H - 120);
    // Cerchio di centrocampo e linea mediana
    g.beginPath();
    g.moveTo(W / 2, 108); g.lineTo(W / 2, H - 12);
    g.stroke();
    g.beginPath();
    g.arc(W / 2, 148, 22, 0, Math.PI * 2);
    g.stroke();

    // Coriandoli dorati festosi nell'aria
    for (let c = 0; c < 8; c++) {
      const confX = (cx - 100 + (c * 31 + f * 1.2) % 200);
      const confY = 40 + ((c * 17 + f * 0.9) % 120);
      px(g, confX, confY, 2, 3, (c % 2 ? "#fbbf24" : "#ffffff"));
    }
  }

  // --- 8. BELOVODIA · IL BORGO INNEVATO DELLE MASCHERE ---
  function drawDetailedBelovodiaVillaggio(g, W, H, f) {
    // Cielo notturno boreale profondo
    const sky = g.createLinearGradient(0, 0, 0, 95);
    sky.addColorStop(0, "#030712");
    sky.addColorStop(0.5, "#081528");
    sky.addColorStop(1, "#0f2744");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 95);

    // Aurora boreale sinuosa e vibrante
    g.save();
    g.globalCompositeOperation = "screen";
    for (let a = 0; a < 3; a++) {
      const grad = g.createLinearGradient(0, 10, 0, 65);
      const col = a === 0 ? "rgba(16, 185, 129, " : a === 1 ? "rgba(6, 182, 212, " : "rgba(168, 85, 247, ";
      grad.addColorStop(0, col + "0)");
      grad.addColorStop(0.5, col + (0.28 + 0.08 * Math.sin(f * 0.04 + a)) + ")");
      grad.addColorStop(1, col + "0)");
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(0, 45 + a * 8);
      for (let x = 0; x <= W; x += 16) {
        const y = 25 + a * 10 + Math.sin(x * 0.02 + f * 0.03 + a * 1.5) * 12 + Math.cos(x * 0.04 - f * 0.02) * 6;
        g.lineTo(x, y);
      }
      g.lineTo(W, 85);
      g.lineTo(0, 85);
      g.closePath();
      g.fill();
    }
    g.restore();

    // Stelle scintillanti
    for (let s = 0; s < 24; s++) {
      const sx = (s * 37 + 11) % W;
      const sy = (s * 19 + 7) % 55;
      const sa = 0.4 + 0.5 * Math.sin(f * 0.08 + s);
      px(g, sx, sy, 1, 1, `rgba(255,255,255,${sa})`);
    }

    // Luna fredda d'inverno
    g.fillStyle = "rgba(254, 243, 199, 0.15)";
    g.beginPath(); g.arc(265, 32, 18, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#fef3c7";
    g.beginPath(); g.arc(265, 32, 10, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#081528";
    g.beginPath(); g.arc(269, 30, 8, 0, Math.PI * 2); g.fill(); // Mezzaluna

    // Taiga di pini e betulle sullo sfondo all'orizzonte
    for (let tr = 0; tr < W; tr += 14) {
      const th = 22 + (tr % 7) * 4;
      g.fillStyle = "#071322";
      g.beginPath();
      g.moveTo(tr + 7, 78 - th);
      g.lineTo(tr, 78);
      g.lineTo(tr + 14, 78);
      g.closePath();
      g.fill();
      // Neve sulle cime degli alberi
      px(g, tr + 6, 78 - th, 2, 4, "#cbd5e1");
    }

    // Pendio di neve soffice intermedia
    const hillGrad = g.createLinearGradient(0, 75, 0, 115);
    hillGrad.addColorStop(0, "#cbd5e1");
    hillGrad.addColorStop(0.4, "#94a3b8");
    hillGrad.addColorStop(1, "#475569");
    g.fillStyle = hillGrad;
    g.beginPath();
    g.moveTo(0, 85);
    g.quadraticCurveTo(W * 0.35, 78, W * 0.65, 84);
    g.quadraticCurveTo(W * 0.85, 88, W, 82);
    g.lineTo(W, 115);
    g.lineTo(0, 115);
    g.closePath();
    g.fill();

    // Izba 1 (Bottega di Boris a sinistra)
    px(g, 16, 70, 72, 42, "#3b2314");
    // Tronchi orizzontali intagliati
    for (let ty = 74; ty < 112; ty += 6) {
      px(g, 16, ty, 72, 1, "#27150c");
      px(g, 16, ty + 1, 72, 1, "#4a2c19");
    }
    // Tetto spiovente di legno con spesso strato di neve candida
    g.fillStyle = "#27150c";
    g.beginPath(); g.moveTo(8, 70); g.lineTo(52, 42); g.lineTo(94, 70); g.closePath(); g.fill();
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.moveTo(6, 69); g.lineTo(52, 38); g.lineTo(96, 69); g.lineTo(94, 74); g.lineTo(52, 44); g.lineTo(8, 74); g.closePath(); g.fill();
    // Comignolo in pietra e fumo animato
    px(g, 68, 40, 10, 18, "#475569");
    px(g, 66, 38, 14, 3, "#64748b");
    for (let sm = 0; sm < 4; sm++) {
      const sx = 72 + Math.sin(f * 0.08 + sm) * (6 + sm * 3);
      const sy = 34 - sm * 8 - (f * 0.4 % 8);
      const sr = 3 + sm * 1.8;
      g.fillStyle = `rgba(241, 245, 249, ${0.45 - sm * 0.1})`;
      g.beginPath(); g.arc(sx, sy, sr, 0, Math.PI * 2); g.fill();
    }
    // Finestrella illuminata con calda luce ambrata
    px(g, 36, 82, 16, 16, "#f59e0b");
    px(g, 38, 84, 12, 12, "#fef08a");
    px(g, 43, 82, 2, 16, "#78350f");
    px(g, 36, 89, 16, 2, "#78350f");
    // Porta in legno scuro
    px(g, 62, 86, 14, 26, "#1f1209");
    px(g, 64, 88, 10, 24, "#2e1a0e");
    px(g, 71, 98, 2, 3, "#fbbf24"); // Maniglia d'ottone

    // Izba 2 (A destra, mezza nascosta)
    px(g, 225, 76, 75, 38, "#3b2314");
    for (let ty = 80; ty < 114; ty += 6) {
      px(g, 225, ty, 75, 1, "#27150c");
    }
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.moveTo(218, 76); g.lineTo(262, 48); g.lineTo(306, 76); g.lineTo(304, 81); g.lineTo(262, 54); g.lineTo(220, 81); g.closePath(); g.fill();
    px(g, 248, 86, 14, 14, "#f59e0b");
    px(g, 250, 88, 10, 10, "#fde68a");

    // Steccato di rami di betulla
    for (let fx = 95; fx < 220; fx += 18) {
      px(g, fx, 96, 3, 14, "#e2e8f0");
      px(g, fx + 1, 98, 1, 10, "#475569");
    }
    px(g, 92, 101, 130, 2, "#94a3b8");
    px(g, 92, 106, 130, 2, "#94a3b8");

    // Suolo innevato del villaggio (primo piano)
    const snowGrad = g.createLinearGradient(0, 110, 0, H);
    snowGrad.addColorStop(0, "#e2e8f0");
    snowGrad.addColorStop(0.3, "#cbd5e1");
    snowGrad.addColorStop(0.8, "#94a3b8");
    snowGrad.addColorStop(1, "#64748b");
    g.fillStyle = snowGrad;
    g.fillRect(0, 110, W, H - 110);

    // Sentiero calpestato e orme nel ghiaccio
    g.fillStyle = "rgba(71, 85, 105, 0.4)";
    g.beginPath();
    g.moveTo(70, 112);
    g.quadraticCurveTo(120, 135, 160, 150);
    g.quadraticCurveTo(200, 165, 230, 200);
    g.lineTo(190, 200);
    g.quadraticCurveTo(150, 160, 105, 135);
    g.quadraticCurveTo(55, 120, 50, 112);
    g.closePath();
    g.fill();

    // Pozzo sacro gelato al centro
    px(g, 136, 122, 28, 18, "#334155");
    px(g, 138, 120, 24, 4, "#64748b");
    // Tettoia pozzo in tronchi
    px(g, 138, 108, 3, 14, "#3b2314");
    px(g, 159, 108, 3, 14, "#3b2314");
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.moveTo(132, 108); g.lineTo(150, 96); g.lineTo(168, 108); g.closePath(); g.fill();
    // Giaccioli pendenti
    [136, 142, 148, 154, 160].forEach((ix, i) => {
      px(g, ix, 108, 2, 4 + (i % 3) * 2, "#bae6fd");
    });

    // Lanterna a stelo di ferro con luce calda oscillante
    const lanX = 185, lanY = 130;
    px(g, lanX, lanY, 3, 28, "#1e293b");
    px(g, lanX - 4, lanY - 6, 11, 8, "#0f172a");
    // Fiamma e alone dorato
    const flicker = Math.sin(f * 0.15) * 2;
    const lGrad = g.createRadialGradient(lanX + 1, lanY - 2, 1, lanX + 1, lanY - 2, 24 + flicker);
    lGrad.addColorStop(0, "rgba(251, 191, 36, 0.65)");
    lGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.25)");
    lGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
    g.fillStyle = lGrad;
    g.fillRect(lanX - 25, lanY - 28, 52, 52);
    px(g, lanX - 1, lanY - 4, 3, 4, "#fef08a");

    // Fiocchi di neve che scendono lenti e poetici
    g.fillStyle = "rgba(255, 255, 255, 0.85)";
    for (let flk = 0; flk < 42; flk++) {
      const fx = (flk * 29 + f * 0.6 + Math.sin(f * 0.05 + flk) * 12) % W;
      const fy = (flk * 17 + f * 1.2) % H;
      const sz = flk % 4 === 0 ? 2 : 1;
      px(g, fx, fy, sz, sz, "rgba(255, 255, 255, 0.8)");
    }
  }

  // --- 9. BELOVODIA · L'ATELIER DELLE MASCHERE DI NONNO BORIS ---
  function drawDetailedBelovodiaBottega(g, W, H, f) {
    // Mura di tronchi pesanti in legno di pino stagionato
    const wallGrad = g.createLinearGradient(0, 0, 0, 130);
    wallGrad.addColorStop(0, "#27150c");
    wallGrad.addColorStop(0.5, "#3d2214");
    wallGrad.addColorStop(1, "#4e2b19");
    g.fillStyle = wallGrad;
    g.fillRect(0, 0, W, 130);
    // Scanalature dei tronchi orizzontali
    for (let y = 14; y < 130; y += 16) {
      px(g, 0, y, W, 2, "#180c06");
      px(g, 0, y + 2, W, 1, "#5a331e");
    }

    // Pavimento in assi rustiche di legno massiccio
    const floorGrad = g.createLinearGradient(0, 130, 0, H);
    floorGrad.addColorStop(0, "#331a0e");
    floorGrad.addColorStop(0.5, "#422313");
    floorGrad.addColorStop(1, "#241209");
    g.fillStyle = floorGrad;
    g.fillRect(0, 130, W, H - 130);
    for (let x = 0; x < W; x += 26) {
      px(g, x, 130, 1, H - 130, "#190c06");
    }

    // Tradizionale tappeto ricamato slavo rosso carminio e oro al centro
    px(g, 70, 142, 180, 52, "#7f1d1d");
    px(g, 72, 144, 176, 48, "#991b1b");
    // Bordura geometrica dorata
    g.strokeStyle = "#fbbf24";
    g.lineWidth = 1.5;
    g.strokeRect(76, 148, 168, 40);
    for (let rx = 82; rx < 240; rx += 14) {
      px(g, rx, 166, 4, 4, "#fbbf24");
      px(g, rx + 2, 168, 1, 1, "#fef08a");
    }

    // Finestra piombata a sinistra con tormenta notturna fuori e ragnatela di brina
    px(g, 18, 22, 48, 64, "#0f172a");
    g.fillStyle = "#091220";
    g.fillRect(20, 24, 44, 60);
    // Luce azzurra notturna
    const winGrad = g.createLinearGradient(20, 24, 20, 84);
    winGrad.addColorStop(0, "rgba(56, 189, 248, 0.35)");
    winGrad.addColorStop(1, "rgba(15, 23, 42, 0.8)");
    g.fillStyle = winGrad;
    g.fillRect(20, 24, 44, 60);
    // Telaio in legno scuro e traversi
    px(g, 18, 22, 48, 3, "#27150c");
    px(g, 18, 83, 48, 4, "#27150c");
    px(g, 41, 24, 3, 60, "#27150c");
    px(g, 20, 52, 44, 3, "#27150c");
    // Cristalli di brina agli angoli della finestra
    px(g, 22, 26, 6, 2, "#e0f2fe");
    px(g, 22, 28, 2, 6, "#e0f2fe");
    px(g, 58, 26, 5, 2, "#e0f2fe");

    // Rastrelliera delle Maschere Ancestrali sulla parete centrale
    px(g, 85, 28, 145, 6, "#27150c");
    px(g, 85, 62, 145, 6, "#27150c");

    // Maschera 1: Maschera del Falco d'Argento (Centrale)
    const mfx = 150, mfy = 36;
    g.fillStyle = "#e2e8f0";
    g.beginPath();
    g.moveTo(mfx, mfy);
    g.lineTo(mfx + 10, mfy + 4);
    g.lineTo(mfx + 6, mfy + 18);
    g.lineTo(mfx, mfy + 24); // Becco
    g.lineTo(mfx - 6, mfy + 18);
    g.lineTo(mfx - 10, mfy + 4);
    g.closePath();
    g.fill();
    // Occhi dorati splendenti
    px(g, mfx - 4, mfy + 8, 2, 2, "#fbbf24");
    px(g, mfx + 2, mfy + 8, 2, 2, "#fbbf24");
    // Piume incise d'argento
    px(g, mfx - 7, mfy + 2, 4, 2, "#94a3b8");
    px(g, mfx + 3, mfy + 2, 4, 2, "#94a3b8");

    // Maschera 2: Maschera dell'Orso di Pietra (A sinistra)
    const mox = 110, moy = 38;
    g.fillStyle = "#57534e";
    g.beginPath();
    g.arc(mox, moy + 8, 9, 0, Math.PI * 2);
    g.fill();
    // Orecchie tonde
    px(g, mox - 9, moy, 4, 4, "#44403c");
    px(g, mox + 5, moy, 4, 4, "#44403c");
    // Muso e zanne
    px(g, mox - 3, moy + 8, 6, 5, "#292524");
    px(g, mox - 2, moy + 12, 1, 2, "#f8fafc");
    px(g, mox + 1, moy + 12, 1, 2, "#f8fafc");

    // Maschera 3: Maschera della Lepre delle Tempeste (A destra)
    const mlx = 195, mly = 35;
    g.fillStyle = "#f1f5f9";
    g.beginPath();
    g.ellipse(mlx, mly + 10, 7, 9, 0, 0, Math.PI * 2);
    g.fill();
    // Orecchie lunghe ritte
    px(g, mlx - 4, mly - 6, 2, 10, "#e2e8f0");
    px(g, mlx + 2, mly - 6, 2, 10, "#e2e8f0");
    px(g, mlx - 3, mly - 4, 1, 6, "#f472b6");
    px(g, mlx + 3, mly - 4, 1, 6, "#f472b6");
    px(g, mlx - 3, mly + 7, 2, 2, "#38bdf8");
    px(g, mlx + 1, mly + 7, 2, 2, "#38bdf8");

    // Maschere minori della seconda mensola
    [95, 130, 170, 205].forEach((mx, i) => {
      const col = ["#78350f", "#b45309", "#451a03", "#713f12"][i];
      px(g, mx, 70, 14, 16, col);
      px(g, mx + 3, 74, 2, 2, "#fef08a");
      px(g, mx + 9, 74, 2, 2, "#fef08a");
      px(g, mx + 5, 80, 4, 2, "#1c1917");
    });

    // Banco di lavoro di Boris con scalpelli e trucioli a sinistra
    px(g, 15, 115, 65, 38, "#451a03");
    px(g, 12, 112, 70, 5, "#5c2406");
    // Scalpelli e sgorbie di metallo sul tavolo
    px(g, 22, 109, 14, 2, "#cbd5e1");
    px(g, 18, 109, 4, 3, "#78350f"); // Manico
    px(g, 42, 108, 16, 2, "#cbd5e1");
    px(g, 38, 108, 4, 3, "#78350f");
    // Blocco di legno in lavorazione
    px(g, 62, 104, 12, 10, "#d97706");
    // Trucioli arricciati caduti sul tavolo e sul pavimento
    px(g, 30, 114, 3, 2, "#fde68a");
    px(g, 50, 114, 4, 2, "#fde68a");
    px(g, 25, 155, 4, 2, "#fde68a");
    px(g, 45, 158, 3, 2, "#fde68a");

    // Grande stufa russa in ghisa a destra con fuoco ardente
    const stx = 245, sty = 78;
    px(g, stx, sty, 55, 68, "#18181b");
    px(g, stx - 3, sty + 4, 61, 4, "#27272a");
    px(g, stx + 12, 38, 12, 40, "#27272a"); // Canna fumaria
    // Bocca del focolare con griglia e fiamme animate
    px(g, stx + 12, sty + 25, 30, 24, "#09090b");
    const flameFlicker = Math.sin(f * 0.2) * 2;
    // Riverbero caldo intorno alla stufa
    const stoveGlow = g.createRadialGradient(stx + 27, sty + 37, 2, stx + 27, sty + 37, 55 + flameFlicker);
    stoveGlow.addColorStop(0, "rgba(249, 115, 22, 0.75)");
    stoveGlow.addColorStop(0.4, "rgba(234, 88, 12, 0.35)");
    stoveGlow.addColorStop(1, "rgba(180, 83, 9, 0)");
    g.fillStyle = stoveGlow;
    g.fillRect(stx - 20, sty - 10, 95, 95);
    // Fiamma viva
    g.fillStyle = "#ef4444";
    g.beginPath();
    g.moveTo(stx + 16, sty + 45);
    g.lineTo(stx + 27, sty + 28 + flameFlicker);
    g.lineTo(stx + 38, sty + 45);
    g.closePath();
    g.fill();
    g.fillStyle = "#fbbf24";
    g.beginPath();
    g.moveTo(stx + 21, sty + 45);
    g.lineTo(stx + 27, sty + 32 + flameFlicker * 0.5);
    g.lineTo(stx + 33, sty + 45);
    g.closePath();
    g.fill();
    // Griglia metallica
    px(g, stx + 18, sty + 30, 1, 15, "#27272a");
    px(g, stx + 27, sty + 30, 1, 15, "#27272a");
    px(g, stx + 36, sty + 30, 1, 15, "#27272a");

    // Teiera / Samovar fumante sopra la stufa
    px(g, stx + 32, sty - 10, 14, 12, "#d97706");
    px(g, stx + 30, sty - 8, 2, 6, "#b45309"); // Manico
    px(g, stx + 45, sty - 7, 4, 3, "#b45309"); // Beccuccio
    // Vapore sottile
    px(g, stx + 46, sty - 12 - (f % 6), 2, 2, "rgba(254, 243, 199, 0.6)");
  }

  // --- 10. BELOVODIA · LA RADURA SACRA DELLE BETULLE ---
  function drawDetailedBelovodiaRadura(g, W, H, f) {
    // Cielo polare notturno con aurora boreale travolgente
    const sky = g.createLinearGradient(0, 0, 0, 100);
    sky.addColorStop(0, "#020617");
    sky.addColorStop(0.5, "#061324");
    sky.addColorStop(1, "#0c213c");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 100);

    // Grande cortina di aurora boreale verde smeraldo e lilla
    g.save();
    g.globalCompositeOperation = "screen";
    for (let l = 0; l < 4; l++) {
      const grad = g.createLinearGradient(0, 5, 0, 80);
      const alpha = 0.35 + 0.12 * Math.sin(f * 0.035 + l * 1.8);
      grad.addColorStop(0, `rgba(16, 185, 129, 0)`);
      grad.addColorStop(0.4, l % 2 ? `rgba(16, 185, 129, ${alpha})` : `rgba(192, 132, 252, ${alpha * 0.9})`);
      grad.addColorStop(0.8, `rgba(56, 189, 248, ${alpha * 0.7})`);
      grad.addColorStop(1, `rgba(6, 182, 212, 0)`);
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(0, 20 + l * 6);
      for (let x = 0; x <= W; x += 12) {
        const y = 15 + l * 10 + Math.sin(x * 0.025 + f * 0.025 + l) * 14 + Math.cos(x * 0.05 - f * 0.015) * 8;
        g.lineTo(x, y);
      }
      g.lineTo(W, 90);
      g.lineTo(0, 90);
      g.closePath();
      g.fill();
    }
    g.restore();

    // Luna d'argento fredda che sbuca tra le nubi
    g.fillStyle = "rgba(248, 250, 252, 0.2)";
    g.beginPath(); g.arc(60, 35, 22, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.arc(60, 35, 12, 0, Math.PI * 2); g.fill();

    // Foresta di maestose Betulle d'Argento sullo sfondo
    for (let bx = 10; bx < W; bx += 22) {
      const bh = 75 + (bx % 5) * 6;
      // Tronco candido di betulla
      px(g, bx, 100 - bh, 5, bh, "#f8fafc");
      // Macchie nere orizzontali caratteristiche della corteccia di betulla
      for (let py = 100 - bh + 6; py < 95; py += 10) {
        px(g, bx + 1, py, 3, 2, "#1e293b");
        if (py % 20 === 0) px(g, bx, py + 4, 2, 2, "#0f172a");
      }
      // Rami spogli innevati
      px(g, bx - 6, 100 - bh + 14, 6, 2, "#e2e8f0");
      px(g, bx + 5, 100 - bh + 22, 8, 2, "#e2e8f0");
    }

    // Suolo innevato della radura sacra
    const fieldGrad = g.createLinearGradient(0, 95, 0, H);
    fieldGrad.addColorStop(0, "#cbd5e1");
    fieldGrad.addColorStop(0.3, "#94a3b8");
    fieldGrad.addColorStop(0.7, "#64748b");
    fieldGrad.addColorStop(1, "#334155");
    g.fillStyle = fieldGrad;
    g.fillRect(0, 95, W, H - 95);

    // Rettangolo del campo di gioco inciso nella brina ghiacciata
    g.strokeStyle = "rgba(186, 230, 253, 0.75)";
    g.lineWidth = 1.5;
    g.strokeRect(24, 115, W - 48, H - 128);

    // Cerchio di centrocampo e linea mediana
    g.beginPath();
    g.moveTo(W / 2, 115);
    g.lineTo(W / 2, H - 13);
    g.stroke();
    g.beginPath();
    g.arc(W / 2, 155, 24, 0, Math.PI * 2);
    g.stroke();

    // Runa ancestrale del Falco nel cerchio di centrocampo
    g.fillStyle = "rgba(56, 189, 248, 0.35)";
    g.beginPath();
    g.moveTo(W / 2, 142);
    g.lineTo(W / 2 + 12, 155);
    g.lineTo(W / 2, 168);
    g.lineTo(W / 2 - 12, 155);
    g.closePath();
    g.fill();

    // Porte cerimoniali da calcio ricavate da tronchi ritorti e maestose corna di cervo
    // Porta sinistra
    px(g, 18, 134, 4, 42, "#451a03");
    px(g, 18, 132, 12, 4, "#5c2406");
    // Corna di cervo innevate montate sulla traversa
    px(g, 22, 126, 2, 8, "#e2e8f0");
    px(g, 24, 124, 4, 2, "#cbd5e1");
    px(g, 26, 122, 2, 3, "#cbd5e1");
    // Rete di rami e corda
    g.strokeStyle = "rgba(226, 232, 240, 0.4)";
    g.lineWidth = 1;
    for (let netY = 136; netY < 176; netY += 6) {
      g.beginPath(); g.moveTo(12, netY); g.lineTo(18, netY); g.stroke();
    }

    // Porta destra
    px(g, W - 22, 134, 4, 42, "#451a03");
    px(g, W - 30, 132, 12, 4, "#5c2406");
    px(g, W - 24, 126, 2, 8, "#e2e8f0");
    px(g, W - 28, 124, 4, 2, "#cbd5e1");
    px(g, W - 28, 122, 2, 3, "#cbd5e1");
    for (let netY = 136; netY < 176; netY += 6) {
      g.beginPath(); g.moveTo(W - 18, netY); g.lineTo(W - 22, netY); g.stroke();
    }

    // Due grandi bracieri cerimoniali ardenti ai lati
    [32, W - 32].forEach((bx) => {
      px(g, bx - 6, 110, 12, 8, "#18181b");
      px(g, bx - 8, 108, 16, 3, "#27272a");
      const bFl = Math.sin(f * 0.2 + bx) * 2;
      // Bagliore
      const bGlow = g.createRadialGradient(bx, 104, 1, bx, 104, 22);
      bGlow.addColorStop(0, "rgba(249, 115, 22, 0.7)");
      bGlow.addColorStop(1, "rgba(249, 115, 22, 0)");
      g.fillStyle = bGlow;
      g.fillRect(bx - 22, 84, 44, 44);
      // Fiamma
      g.fillStyle = "#ef4444";
      g.beginPath(); g.moveTo(bx - 4, 108); g.lineTo(bx, 97 + bFl); g.lineTo(bx + 4, 108); g.closePath(); g.fill();
      g.fillStyle = "#fef08a";
      g.beginPath(); g.moveTo(bx - 2, 108); g.lineTo(bx, 101 + bFl * 0.5); g.lineTo(bx + 2, 108); g.closePath(); g.fill();
    });

    // Tormenta con fiocchi di neve e cristalli di ghiaccio brillanti
    for (let sn = 0; sn < 36; sn++) {
      const sx = (sn * 23 + f * 1.4 + Math.sin(f * 0.06 + sn) * 16) % W;
      const sy = (sn * 13 + f * 1.8) % H;
      px(g, sx, sy, (sn % 5 === 0 ? 2 : 1), (sn % 5 === 0 ? 2 : 1), "rgba(240, 249, 255, 0.8)");
    }
  }

  // --- 11. BELOVODIA · IL LAGO SPECCHIO DI GHIACCIO ---
  function drawDetailedBelovodiaLago(g, W, H, f) {
    // Cielo notturno freddo con sfumature di cobalto
    const sky = g.createLinearGradient(0, 0, 0, 90);
    sky.addColorStop(0, "#020617");
    sky.addColorStop(0.5, "#0b1a30");
    sky.addColorStop(1, "#172554");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 90);

    // Aurora boreale specchiata
    g.save();
    g.globalCompositeOperation = "screen";
    for (let a = 0; a < 2; a++) {
      const grad = g.createLinearGradient(0, 10, 0, 70);
      grad.addColorStop(0, "rgba(6, 182, 212, 0)");
      grad.addColorStop(0.5, `rgba(56, 189, 248, ${0.25 + 0.08 * Math.sin(f * 0.04 + a)})`);
      grad.addColorStop(1, "rgba(6, 182, 212, 0)");
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(0, 35 + a * 12);
      for (let x = 0; x <= W; x += 16) {
        const y = 20 + a * 12 + Math.sin(x * 0.03 + f * 0.03) * 10;
        g.lineTo(x, y);
      }
      g.lineTo(W, 80);
      g.lineTo(0, 80);
      g.closePath();
      g.fill();
    }
    g.restore();

    // Luna piena bianca e gelida
    g.fillStyle = "rgba(248, 250, 252, 0.25)";
    g.beginPath(); g.arc(230, 30, 20, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.arc(230, 30, 12, 0, Math.PI * 2); g.fill();

    // Rive rocciose e abeti innevati lontani
    for (let rx = 0; rx < W; rx += 18) {
      const ph = 18 + (rx % 4) * 4;
      g.fillStyle = "#091424";
      g.beginPath();
      g.moveTo(rx + 9, 78 - ph);
      g.lineTo(rx, 78);
      g.lineTo(rx + 18, 78);
      g.closePath();
      g.fill();
      px(g, rx + 8, 78 - ph, 2, 4, "#cbd5e1");
    }

    // Superficie del Lago di Ghiaccio (specchio riflettente traslucido)
    const iceGrad = g.createLinearGradient(0, 78, 0, H);
    iceGrad.addColorStop(0, "#0284c7");
    iceGrad.addColorStop(0.3, "#0369a1");
    iceGrad.addColorStop(0.7, "#075985");
    iceGrad.addColorStop(1, "#0c4a6e");
    g.fillStyle = iceGrad;
    g.fillRect(0, 78, W, H - 78);

    // Riflesso della luna sul ghiaccio
    g.fillStyle = "rgba(240, 249, 255, 0.25)";
    g.beginPath();
    g.ellipse(230, 115, 16, 32, 0, 0, Math.PI * 2);
    g.fill();

    // Crepe bianche e azzurro chiaro che attraversano il lago
    g.strokeStyle = "rgba(186, 230, 253, 0.65)";
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(30, 95); g.lineTo(85, 118); g.lineTo(140, 112); g.lineTo(190, 145); g.lineTo(260, 140);
    g.moveTo(85, 118); g.lineTo(105, 155); g.lineTo(80, 185);
    g.moveTo(140, 112); g.lineTo(165, 90);
    g.stroke();

    // Pontile in legno di pino a sinistra
    px(g, 10, 105, 75, 18, "#3b2314");
    px(g, 10, 103, 75, 3, "#5c2406");
    for (let pxX = 20; pxX < 85; pxX += 16) {
      px(g, pxX, 122, 4, 38, "#27150c");
      px(g, pxX + 1, 105, 2, 55, "#180c06");
    }

    // Capanno del pescatore di Yakov sulla riva sinistra
    px(g, 0, 75, 45, 34, "#3b2314");
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.moveTo(0, 75); g.lineTo(22, 54); g.lineTo(48, 75); g.closePath(); g.fill();
    px(g, 18, 86, 12, 23, "#180c06");
    // Lanterna appesa al pontile con alone caldo
    const lx = 78, ly = 100;
    px(g, lx, ly, 3, 10, "#1e293b");
    const lGlow = g.createRadialGradient(lx + 1, ly + 8, 1, lx + 1, ly + 8, 22);
    lGlow.addColorStop(0, "rgba(251, 191, 36, 0.75)");
    lGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
    g.fillStyle = lGlow;
    g.fillRect(lx - 20, ly - 12, 42, 42);
    px(g, lx - 2, ly + 6, 7, 6, "#0f172a");
    px(g, lx, ly + 8, 3, 3, "#fef08a");

    // Canneti ghiacciati a destra
    for (let cx = W - 55; cx < W; cx += 8) {
      px(g, cx, 88 + (cx % 3) * 6, 2, 38, "#64748b");
      px(g, cx - 1, 88 + (cx % 3) * 6, 4, 2, "#bae6fd");
    }

    // Neve leggera che cade
    for (let i = 0; i < 30; i++) {
      const nx = (i * 31 + f * 0.7) % W;
      const ny = (i * 19 + f * 1.3) % H;
      px(g, nx, ny, 1, 1, "rgba(255,255,255,0.75)");
    }
  }

  // --- 12. BELOVODIA · LA CAVERNA DI BRINA ---
  function drawDetailedBelovodiaCaverna(g, W, H, f) {
    // Volta rocciosa della caverna in blu cobalto scuro e ghiaccio
    const cavGrad = g.createLinearGradient(0, 0, 0, H);
    cavGrad.addColorStop(0, "#030712");
    cavGrad.addColorStop(0.4, "#0f172a");
    cavGrad.addColorStop(1, "#0284c7");
    g.fillStyle = cavGrad;
    g.fillRect(0, 0, W, H);

    // Stalattiti di ghiaccio pendenti dalla volta
    for (let st = 10; st < W; st += 18) {
      const sl = 22 + (st % 6) * 5;
      g.fillStyle = "#bae6fd";
      g.beginPath();
      g.moveTo(st, 0);
      g.lineTo(st + 6, sl);
      g.lineTo(st + 12, 0);
      g.closePath();
      g.fill();
      px(g, st + 5, 0, 2, sl - 4, "#e0f2fe");
    }

    // Stalagmiti dal pavimento
    for (let sm = 25; sm < W; sm += 26) {
      const sh = 16 + (sm % 4) * 4;
      g.fillStyle = "#38bdf8";
      g.beginPath();
      g.moveTo(sm, H);
      g.lineTo(sm + 5, H - sh);
      g.lineTo(sm + 10, H);
      g.closePath();
      g.fill();
      px(g, sm + 4, H - sh + 2, 2, sh - 2, "#e0f2fe");
    }

    // Pavimento della caverna coperto di lastre di pietra e brina
    const fGrad = g.createLinearGradient(0, 135, 0, H);
    fGrad.addColorStop(0, "#1e293b");
    fGrad.addColorStop(0.5, "#0f172a");
    fGrad.addColorStop(1, "#020617");
    g.fillStyle = fGrad;
    g.fillRect(0, 135, W, H - 135);

    // Grande altare della Maschera dell'Orso al centro
    const ax = W / 2 - 40, ay = 85;
    px(g, ax, ay, 80, 48, "#18181b");
    px(g, ax - 4, ay, 88, 5, "#27272a");
    // Pelli di lupo e orso stese sull'altare
    px(g, ax + 8, ay + 6, 64, 18, "#451a03");
    px(g, ax + 12, ay + 8, 56, 14, "#78350f");

    // Maschera dell'Orso di Pietra scolpita ed esposta al centro
    const mx = W / 2, my = ay - 14;
    g.fillStyle = "#57534e";
    g.beginPath();
    g.arc(mx, my + 10, 16, 0, Math.PI * 2);
    g.fill();
    // Orecchie d'orso
    px(g, mx - 15, my - 2, 7, 7, "#44403c");
    px(g, mx + 8, my - 2, 7, 7, "#44403c");
    // Occhi ambrati ardenti
    const eyeFlicker = Math.sin(f * 0.15) * 0.5;
    px(g, mx - 7, my + 6, 4, 3, "#f59e0b");
    px(g, mx + 3, my + 6, 4, 3, "#f59e0b");
    px(g, mx - 5, my + 7, 1, 1, "#fef08a");
    px(g, mx + 5, my + 7, 1, 1, "#fef08a");
    // Zanne bianche
    px(g, mx - 4, my + 18, 2, 4, "#f8fafc");
    px(g, mx + 2, my + 18, 2, 4, "#f8fafc");

    // Braciere acceso di fronte all'altare
    const bx = W / 2, by = 155;
    px(g, bx - 14, by, 28, 12, "#18181b");
    const bGlow = g.createRadialGradient(bx, by - 4, 2, bx, by - 4, 45);
    bGlow.addColorStop(0, "rgba(249, 115, 22, 0.75)");
    bGlow.addColorStop(1, "rgba(234, 88, 12, 0)");
    g.fillStyle = bGlow;
    g.fillRect(bx - 45, by - 48, 90, 90);
    // Fiamma
    const bFl = Math.sin(f * 0.2) * 3;
    g.fillStyle = "#ef4444";
    g.beginPath(); g.moveTo(bx - 10, by); g.lineTo(bx, by - 16 + bFl); g.lineTo(bx + 10, by); g.closePath(); g.fill();
    g.fillStyle = "#fbbf24";
    g.beginPath(); g.moveTo(bx - 5, by); g.lineTo(bx, by - 10 + bFl * 0.5); g.lineTo(bx + 5, by); g.closePath(); g.fill();
  }

  // --- 13. BELOVODIA · LA FORTEZZA DEI BOIARDI DI BRINA ---
  function drawDetailedBelovodiaFortezza(g, W, H, f) {
    // Cielo notturno tempestoso violaceo
    const sky = g.createLinearGradient(0, 0, 0, 95);
    sky.addColorStop(0, "#090514");
    sky.addColorStop(0.5, "#180d2b");
    sky.addColorStop(1, "#2e1065");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 95);

    // Vento polare e nubi scure animate
    for (let c = 0; c < 3; c++) {
      const cx = ((c * 120 + f * 0.6) % (W + 80)) - 40;
      g.fillStyle = "rgba(15, 23, 42, 0.45)";
      g.beginPath();
      g.ellipse(cx, 35 + c * 15, 60, 20, 0, 0, Math.PI * 2);
      g.fill();
    }

    // Sagoma delle torri della Fortezza di Brina
    // Torre sinistra
    px(g, 15, 30, 48, 85, "#1e293b");
    px(g, 11, 24, 56, 7, "#334155");
    // Merlature sinistra
    [15, 29, 43, 57].forEach((mx) => px(g, mx, 18, 8, 8, "#334155"));
    px(g, 11, 23, 56, 2, "#f8fafc"); // Neve sopra

    // Torre destra
    px(g, W - 63, 30, 48, 85, "#1e293b");
    px(g, W - 67, 24, 56, 7, "#334155");
    [W - 63, W - 49, W - 35, W - 21].forEach((mx) => px(g, mx, 18, 8, 8, "#334155"));
    px(g, W - 67, 23, 56, 2, "#f8fafc");

    // Mastio centrale monumentale con arco d'ingresso
    px(g, 63, 45, W - 126, 70, "#0f172a");
    px(g, 60, 42, W - 120, 5, "#334155");
    // Portale ad arco
    const gx = W / 2;
    g.fillStyle = "#020617";
    g.beginPath();
    g.arc(gx, 88, 22, Math.PI, 0);
    g.lineTo(gx + 22, 120);
    g.lineTo(gx - 22, 120);
    g.closePath();
    g.fill();
    // Saracinesca in ferro battuto
    g.strokeStyle = "#475569";
    g.lineWidth = 1.5;
    for (let lx = gx - 18; lx <= gx + 18; lx += 6) {
      g.beginPath(); g.moveTo(lx, 75); g.lineTo(lx, 115); g.stroke();
    }
    px(g, gx - 20, 92, 40, 3, "#475569");
    px(g, gx - 20, 105, 40, 3, "#475569");

    // Stendardi cerulei dello Zar Moroz appesi ai bastioni
    [32, W - 48].forEach((sx) => {
      px(g, sx, 45, 16, 32, "#0369a1");
      px(g, sx + 2, 47, 12, 28, "#0284c7");
      px(g, sx + 6, 52, 4, 14, "#bae6fd"); // Runa di brina
    });

    // Fiaccole con fiamme cerulee
    [24, W - 32, gx - 32, gx + 32].forEach((fx) => {
      px(g, fx - 2, 65, 4, 12, "#334155");
      const fl = Math.sin(f * 0.25 + fx) * 1.5;
      const fGlow = g.createRadialGradient(fx, 62, 1, fx, 62, 14);
      fGlow.addColorStop(0, "rgba(56, 189, 248, 0.75)");
      fGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      g.fillStyle = fGlow;
      g.fillRect(fx - 14, 48, 28, 28);
      px(g, fx - 1, 60 + fl, 3, 4, "#e0f2fe");
    });

    // Cortile d'armi inferiore (lastricato di pietra ciclopica e neve)
    const courtGrad = g.createLinearGradient(0, 115, 0, H);
    courtGrad.addColorStop(0, "#1e293b");
    courtGrad.addColorStop(0.3, "#0f172a");
    courtGrad.addColorStop(1, "#020617");
    g.fillStyle = courtGrad;
    g.fillRect(0, 115, W, H - 115);

    // Lastre di pietra con neve tra le fessure
    for (let x = 0; x < W; x += 32) {
      px(g, x, 115, 1, H - 115, "#334155");
      px(g, 0, 145, W, 1, "#334155");
      px(g, 0, 175, W, 1, "#334155");
    }

    // Bufera impetuosa con schegge di neve
    for (let b = 0; b < 45; b++) {
      const bx = (b * 27 + f * 2.2 + Math.sin(f * 0.08 + b) * 20) % W;
      const by = (b * 19 + f * 1.6) % H;
      px(g, bx, by, (b % 4 === 0 ? 3 : 1), 1, "rgba(240, 249, 255, 0.85)");
    }
  }

  // --- 14. BELOVODIA · LA FONDERIA DI CENERE E SORGENTE PRIMORDIALE ---
  function drawDetailedBelovodiaSorgente(g, W, H, f) {
    // Volta rocciosa vulcanico-glaciale
    const sky = g.createLinearGradient(0, 0, 0, 80);
    sky.addColorStop(0, "#180804");
    sky.addColorStop(0.5, "#2e1208");
    sky.addColorStop(1, "#0c1a2d");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 80);

    // Ingranaggi ciclopici di bronzo antico nelle pareti
    [45, W - 55].forEach((gx, gi) => {
      const gRot = (f * 0.03 * (gi === 0 ? 1 : -1));
      px(g, gx - 22, 22, 44, 44, "#78350f");
      px(g, gx - 16, 28, 32, 32, "#92400e");
      px(g, gx - 8, 36, 16, 16, "#d97706");
      // Denti ingranaggio
      px(g, gx - 3, 16, 6, 8, "#b45309");
      px(g, gx - 3, 62, 6, 8, "#b45309");
      px(g, gx - 26, 39, 8, 6, "#b45309");
      px(g, gx + 18, 39, 8, 6, "#b45309");
      // Ghiaccioli che bloccano i denti
      px(g, gx - 2, 22, 4, 8, "#bae6fd");
    });

    // Focolare della fonderia e canali di magma/brace calda
    const forgeGrad = g.createLinearGradient(0, 80, 0, H);
    forgeGrad.addColorStop(0, "#1c1917");
    forgeGrad.addColorStop(0.4, "#292524");
    forgeGrad.addColorStop(1, "#0c0a09");
    g.fillStyle = forgeGrad;
    g.fillRect(0, 80, W, H - 80);

    // Bacino termale fumante al centro con acqua turchese calda
    const poolGrad = g.createLinearGradient(0, 110, 0, 175);
    poolGrad.addColorStop(0, "#06b6d4");
    poolGrad.addColorStop(0.5, "#0891b2");
    poolGrad.addColorStop(1, "#0e7490");
    g.fillStyle = poolGrad;
    g.beginPath();
    g.ellipse(W / 2, 142, 75, 32, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(165, 243, 252, 0.65)";
    g.lineWidth = 2;
    g.stroke();

    // Vapore termale denso che sale sinuoso procedurale
    for (let st = 0; st < 6; st++) {
      const sx = W / 2 - 50 + st * 20 + Math.sin(f * 0.08 + st) * 10;
      const sy = 135 - st * 12 - (f * 0.5 % 15);
      const sr = 8 + st * 3.5;
      g.fillStyle = `rgba(240, 253, 250, ${0.35 - st * 0.05})`;
      g.beginPath();
      g.arc(sx, sy, sr, 0, Math.PI * 2);
      g.fill();
    }

    // Altare della Maschera della Lepre delle Tempeste a destra del bacino
    const ax = W - 65, ay = 118;
    px(g, ax, ay, 45, 32, "#292524");
    px(g, ax - 3, ay, 51, 4, "#44403c");
    // Maschera della Lepre con orecchie e occhi celesti
    const lx = ax + 22, ly = ay - 10;
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.ellipse(lx, ly + 8, 8, 10, 0, 0, Math.PI * 2); g.fill();
    // Orecchie ritte
    px(g, lx - 5, ly - 8, 3, 11, "#e2e8f0");
    px(g, lx + 2, ly - 8, 3, 11, "#e2e8f0");
    px(g, lx - 4, ly - 6, 1, 7, "#f472b6");
    px(g, lx + 3, ly - 6, 1, 7, "#f472b6");
    // Occhi turchesi
    const eyeFl = (f % 24 < 12) ? "#38bdf8" : "#7dd3fc";
    px(g, lx - 4, ly + 6, 2, 2, eyeFl);
    px(g, lx + 2, ly + 6, 2, 2, eyeFl);

    // Canali incandescenti con brace a sinistra
    px(g, 15, 120, 25, 45, "#7c2d12");
    px(g, 18, 124, 19, 38, "#c2410c");
    px(g, 22, 130, 11, 26, "#ea580c");
    px(g, 25, 136, 5, 14, "#fef08a");
  }

  // --- 15. BELOVODIA · IL SANTUARIO ASTRALE & IL TRONO DEL GELO ---
  function drawDetailedBelovodiaTrono(g, W, H, f) {
    // Cielo artico con stelle pulsanti e aurora stellare
    const sky = g.createLinearGradient(0, 0, 0, 95);
    sky.addColorStop(0, "#020617");
    sky.addColorStop(0.5, "#0b1329");
    sky.addColorStop(1, "#1e1b4b");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 95);

    // Velo di aurora boreale azzurro-indaco ondulante
    for (let i = 0; i < 4; i++) {
      const aGrad = g.createRadialGradient(W / 2 + Math.sin(f * 0.04 + i) * 50, 25 + i * 15, 10, W / 2, 35, 110);
      aGrad.addColorStop(0, "rgba(56, 189, 248, 0.45)");
      aGrad.addColorStop(0.5, "rgba(129, 140, 248, 0.25)");
      aGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
      g.fillStyle = aGrad;
      g.fillRect(0, 0, W, 95);
    }

    // Stelle scintillanti
    for (let s = 0; s < 30; s++) {
      const sx = (s * 31 + 17) % W;
      const sy = (s * 19 + 7) % 85;
      const sa = Math.sin(f * 0.12 + s) * 0.4 + 0.6;
      px(g, sx, sy, 1, 1, `rgba(255, 255, 255, ${sa})`);
      if (s % 6 === 0) px(g, sx - 1, sy, 3, 1, `rgba(186, 230, 253, ${sa * 0.8})`);
    }

    // Pilastri ciclopici di quarzo ghiacciato ai lati
    [20, 55, W - 60, W - 25].forEach((px0, pi) => {
      px(g, px0 - 8, 25, 16, 115, "#1e293b");
      px(g, px0 - 6, 27, 12, 110, "#334155");
      px(g, px0 - 4, 30, 4, 100, "#38bdf8");
      // Cristalli e riflessi
      px(g, px0 - 2, 35 + (pi * 12) % 30, 2, 18, "#e0f2fe");
      // Capitello runico
      px(g, px0 - 12, 22, 24, 6, "#64748b");
      px(g, px0 - 10, 20, 20, 2, "#f8fafc");
    });

    // Pavimento della sala del trono: lastre di brina pura e cristallo nero
    const floorGrad = g.createLinearGradient(0, 95, 0, H);
    floorGrad.addColorStop(0, "#0f172a");
    floorGrad.addColorStop(0.4, "#020617");
    floorGrad.addColorStop(1, "#030712");
    g.fillStyle = floorGrad;
    g.fillRect(0, 95, W, H - 95);

    // Scalinata monumentale al centro verso il Trono
    for (let st = 0; st < 6; st++) {
      const sy = 125 - st * 6;
      const sw = 90 - st * 8;
      px(g, W / 2 - sw / 2, sy, sw, 5, "#334155");
      px(g, W / 2 - sw / 2, sy, sw, 1, "#e2e8f0"); // Bordo innevato
    }

    // Il Trono di Ghiaccio Eterno
    const tx = W / 2, ty = 72;
    // Spalliera del trono a forma di corna di cervo e guglie di brina
    px(g, tx - 22, ty - 24, 44, 48, "#0284c7");
    px(g, tx - 18, ty - 22, 36, 44, "#0369a1");
    px(g, tx - 12, ty - 18, 24, 38, "#075985");
    // Guglie di brina aguzze
    px(g, tx - 20, ty - 32, 5, 12, "#bae6fd");
    px(g, tx + 15, ty - 32, 5, 12, "#bae6fd");
    px(g, tx - 6, ty - 38, 12, 18, "#e0f2fe");
    // Sedile
    px(g, tx - 16, ty + 12, 32, 10, "#1e293b");
    px(g, tx - 14, ty + 10, 28, 3, "#f8fafc");

    // Sagoma dello Zar Moroz assiso sul trono
    px(g, tx - 8, ty - 8, 16, 22, "#1e1b4b"); // Manto blu notte
    px(g, tx - 5, ty - 14, 10, 8, "#e2d4c0"); // Volto austero
    px(g, tx - 9, ty - 22, 18, 9, "#38bdf8"); // Corona di cristallo di ghiaccio
    px(g, tx - 10, ty + 2, 20, 16, "#cbd5e1"); // Barba canuta fluente
    // Occhi cerulei luminosi
    const morozGlow = (f % 20 < 10) ? "#7dd3fc" : "#38bdf8";
    px(g, tx - 3, ty - 12, 2, 2, morozGlow);
    px(g, tx + 1, ty - 12, 2, 2, morozGlow);

    // Bracieri di fuoco fatuo azzurro ai piedi del trono
    [tx - 42, tx + 42].forEach((bx) => {
      px(g, bx - 3, 115, 6, 14, "#475569");
      const fl = Math.sin(f * 0.3 + bx) * 2;
      const bGlow = g.createRadialGradient(bx, 110, 1, bx, 110, 16);
      bGlow.addColorStop(0, "rgba(56, 189, 248, 0.85)");
      bGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      g.fillStyle = bGlow;
      g.fillRect(bx - 16, 95, 32, 32);
      px(g, bx - 2, 108 + fl, 4, 6, "#e0f2fe");
    });

    // Campo da gioco runico tracciato sul pavimento di ghiaccio vivo
    px(g, 40, 148, W - 80, 42, "rgba(56, 189, 248, 0.15)");
    g.strokeStyle = "#38bdf8";
    g.lineWidth = 1;
    g.strokeRect(40, 148, W - 80, 42);
    // Linea mediana e cerchio
    g.beginPath();
    g.moveTo(W / 2, 148); g.lineTo(W / 2, 190);
    g.stroke();
    g.beginPath();
    g.arc(W / 2, 169, 14, 0, Math.PI * 2);
    g.stroke();
  }

  // --- 16. BELOVODIA · L'ALTA VETTA DELL'AURORA BOREALE (CAMPO FINALE) ---
  function drawDetailedBelovodiaAurora(g, W, H, f) {
    // Cielo cosmico dell'altopiano polare con aurora boreale fiammeggiante
    const sky = g.createLinearGradient(0, 0, 0, 110);
    sky.addColorStop(0, "#030712");
    sky.addColorStop(0.3, "#0c1737");
    sky.addColorStop(0.7, "#064e3b");
    sky.addColorStop(1, "#042f2e");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 110);

    // Fasce d'aurora boreale fluttuanti (verde smeraldo, turchese, magenta)
    for (let a = 0; a < 5; a++) {
      const ay = 15 + a * 14;
      const aWave = Math.sin(f * 0.05 + a * 0.8) * 22;
      const cGrad = g.createLinearGradient(0, ay - 15, 0, ay + 30);
      cGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
      cGrad.addColorStop(0.5, a % 2 === 0 ? "rgba(52, 211, 153, 0.6)" : "rgba(56, 189, 248, 0.55)");
      cGrad.addColorStop(0.8, a === 3 ? "rgba(244, 114, 182, 0.45)" : "rgba(16, 185, 129, 0.2)");
      cGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
      g.fillStyle = cGrad;
      g.beginPath();
      g.moveTo(0, ay + aWave);
      g.quadraticCurveTo(W / 4, ay - aWave * 1.2, W / 2, ay + aWave * 0.8);
      g.quadraticCurveTo((3 * W) / 4, ay + 20 - aWave, W, ay - aWave);
      g.lineTo(W, ay + 45);
      g.lineTo(0, ay + 45);
      g.closePath();
      g.fill();
    }

    // Catena montuosa delle Vette d'Argento all'orizzonte
    for (let p = 0; p < 7; p++) {
      const px0 = p * 50 - 20;
      const ph = 50 + ((p * 23) % 35);
      g.fillStyle = "#0f172a";
      g.beginPath();
      g.moveTo(px0, 105);
      g.lineTo(px0 + 35, 105 - ph);
      g.lineTo(px0 + 70, 105);
      g.closePath();
      g.fill();
      // Calotta di ghiaccio eterno
      g.fillStyle = "#f8fafc";
      g.beginPath();
      g.moveTo(px0 + 25, 105 - ph * 0.7);
      g.lineTo(px0 + 35, 105 - ph);
      g.lineTo(px0 + 45, 105 - ph * 0.7);
      g.closePath();
      g.fill();
    }

    // Altopiano ghiacciato (campo sacro della Prova dell'Aurora)
    const fieldGrad = g.createLinearGradient(0, 105, 0, H);
    fieldGrad.addColorStop(0, "#1e293b");
    fieldGrad.addColorStop(0.2, "#0e7490");
    fieldGrad.addColorStop(0.5, "#0891b2");
    fieldGrad.addColorStop(1, "#155e75");
    g.fillStyle = fieldGrad;
    g.fillRect(0, 105, W, H - 105);

    // Riflessi d'aurora sul ghiaccio vivo
    for (let r = 0; r < 6; r++) {
      const rx = (r * 52 + f * 0.5) % W;
      px(g, rx, 115 + r * 12, 38, 2, "rgba(165, 243, 252, 0.45)");
    }

    // Porte cerimoniali con corna di alce ancestrale e lanterne azzurre
    [25, W - 35].forEach((gx) => {
      px(g, gx - 2, 98, 4, 30, "#475569");
      px(g, gx - 8, 96, 16, 4, "#64748b");
      // Corna di cervo fossile
      px(g, gx - 12, 88, 6, 10, "#e2e8f0");
      px(g, gx + 6, 88, 6, 10, "#e2e8f0");
      // Lanterna boreale
      px(g, gx - 1, 102, 2, 4, "#38bdf8");
    });

    // Schegge di neve boreale che fluttuano verso l'alto spinte dal vento spirituale
    for (let sp = 0; sp < 35; sp++) {
      const spx = (sp * 29 + Math.sin(f * 0.08 + sp) * 25) % W;
      const spy = (H - ((sp * 17 + f * 1.8) % H));
      px(g, spx, spy, 1, 1, "rgba(224, 242, 254, 0.9)");
    }
  }

  // --- 13. RAGNAROK BALL · IL FIORDO DELLE DRAKKAR (CAPITOLO 1) ---
  function drawDetailedRagnarokFiordo(g, W, H, f) {
    // Cielo crepuscolare di Fimbulwinter: cenere vulcanica, viola scuro e bagliori boreali
    const sky = g.createLinearGradient(0, 0, 0, 95);
    sky.addColorStop(0, "#0c0a09");
    sky.addColorStop(0.4, "#26101c");
    sky.addColorStop(0.8, "#450a0a");
    sky.addColorStop(1, "#1c1917");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 95);

    // Aurora cremisi del Ragnarok (il fuoco degli dei caduti)
    g.save();
    g.globalCompositeOperation = "screen";
    for (let a = 0; a < 3; a++) {
      const col = a === 0 ? "rgba(239, 68, 68, " : a === 1 ? "rgba(249, 115, 22, " : "rgba(168, 85, 247, ";
      const grad = g.createLinearGradient(0, 10, 0, 75);
      grad.addColorStop(0, col + "0)");
      grad.addColorStop(0.5, col + (0.32 + 0.1 * Math.sin(f * 0.05 + a)) + ")");
      grad.addColorStop(1, col + "0)");
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(0, 40 + a * 8);
      for (let x = 0; x <= W; x += 16) {
        const y = 20 + a * 12 + Math.sin(x * 0.025 + f * 0.04 + a * 1.3) * 14 + Math.cos(x * 0.04 - f * 0.02) * 6;
        g.lineTo(x, y);
      }
      g.lineTo(W, 85);
      g.lineTo(0, 85);
      g.closePath();
      g.fill();
    }
    g.restore();

    // Vette vulcaniche aguzze innevate all'orizzonte
    for (let tr = 0; tr < W; tr += 18) {
      const th = 26 + (tr % 5) * 6;
      g.fillStyle = "#1c1917";
      g.beginPath();
      g.moveTo(tr + 9, 82 - th);
      g.lineTo(tr, 82);
      g.lineTo(tr + 18, 82);
      g.closePath();
      g.fill();
      // Neve e brina sulle vette
      px(g, tr + 8, 82 - th, 3, 5, "#e2e8f0");
      // Cratere fumante occasionale
      if (tr % 54 === 0) {
        px(g, tr + 8, 82 - th, 2, 2, "#f97316");
      }
    }

    // Pack ghiacciato e mare nero con crepe laviche
    const iceGrad = g.createLinearGradient(0, 80, 0, H);
    iceGrad.addColorStop(0, "#334155");
    iceGrad.addColorStop(0.5, "#1e293b");
    iceGrad.addColorStop(1, "#0f172a");
    g.fillStyle = iceGrad;
    g.fillRect(0, 80, W, H - 80);

    // Crepe laviche luminose sotto la banchisa
    for (let l = 0; l < 4; l++) {
      const lx = 30 + l * 75;
      const ly = 100 + l * 20;
      g.strokeStyle = "rgba(249, 115, 22, 0.65)";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(lx, ly);
      g.lineTo(lx + 25, ly + 8);
      g.lineTo(lx + 45, ly + 4);
      g.lineTo(lx + 65, ly + 12);
      g.stroke();
      px(g, lx + 24, ly + 7, 3, 3, "#fef08a");
    }

    // La Maestosa Drakkar Vichinga incagliata a destra
    const drakX = W - 110, drakY = 88;
    // Scafo in legno scuro
    g.fillStyle = "#27150c";
    g.beginPath();
    g.moveTo(drakX, drakY + 28);
    g.quadraticCurveTo(drakX + 45, drakY + 44, drakX + 90, drakY + 18);
    g.lineTo(drakX + 96, drakY + 8);
    g.lineTo(drakX + 75, drakY + 18);
    g.lineTo(drakX + 15, drakY + 20);
    g.closePath();
    g.fill();
    // Fasciame di pino scuro
    px(g, drakX + 18, drakY + 22, 60, 2, "#451a03");
    px(g, drakX + 22, drakY + 26, 52, 2, "#451a03");
    // Testa di drago intagliata sulla prua
    g.fillStyle = "#78350f";
    g.beginPath();
    g.moveTo(drakX + 90, drakY + 18);
    g.lineTo(drakX + 104, drakY - 4);
    g.lineTo(drakX + 100, drakY - 8);
    g.lineTo(drakX + 86, drakY + 6);
    g.closePath();
    g.fill();
    px(g, drakX + 98, drakY - 6, 2, 2, "#ea580c"); // Occhio di drago fuso
    // Scudi rotondi vichinghi lungo la murata
    for (let s = 0; s < 5; s++) {
      const sx = drakX + 22 + s * 11;
      const sy = drakY + 21;
      g.fillStyle = s % 2 ? "#991b1b" : "#f59e0b";
      g.beginPath(); g.arc(sx, sy, 4, 0, Math.PI * 2); g.fill();
      px(g, sx - 1, sy - 1, 2, 2, "#1c1917"); // Umbone
    }
    // Albero maestro e vela strappata
    px(g, drakX + 48, drakY - 14, 3, 36, "#3b1a0a");
    g.fillStyle = "rgba(153, 27, 27, 0.75)";
    g.beginPath();
    g.moveTo(drakX + 32, drakY - 12);
    g.lineTo(drakX + 64, drakY - 12);
    g.lineTo(drakX + 58, drakY + 6);
    g.lineTo(drakX + 36, drakY + 4);
    g.closePath();
    g.fill();

    // Casa Lunga dello Jarl a sinistra
    px(g, 12, 85, 80, 48, "#27150c");
    for (let ty = 88; ty < 132; ty += 7) {
      px(g, 12, ty, 80, 1, "#1c0b03");
      px(g, 12, ty + 1, 80, 1, "#3b1a0a");
    }
    // Tetto spiovente di legno con neve spessa e teste d'alce
    g.fillStyle = "#1c0b03";
    g.beginPath(); g.moveTo(4, 85); g.lineTo(52, 54); g.lineTo(98, 85); g.closePath(); g.fill();
    g.fillStyle = "#f8fafc";
    g.beginPath(); g.moveTo(2, 84); g.lineTo(52, 50); g.lineTo(100, 84); g.lineTo(98, 89); g.lineTo(52, 56); g.lineTo(4, 89); g.closePath(); g.fill();
    // Corna d'alce sul colmo del tetto
    px(g, 48, 44, 8, 4, "#e2e8f0");
    px(g, 46, 40, 3, 5, "#cbd5e1");
    px(g, 55, 40, 3, 5, "#cbd5e1");
    // Porta e finestrelle illuminate
    px(g, 44, 102, 16, 31, "#451a03");
    px(g, 46, 104, 12, 29, "#78350f");
    px(g, 54, 116, 2, 4, "#f59e0b");
    px(g, 22, 98, 12, 12, "#ea580c");
    px(g, 24, 100, 8, 8, "#fef08a");
    px(g, 72, 98, 12, 12, "#ea580c");
    px(g, 74, 100, 8, 8, "#fef08a");

    // Braciere votivo monumentale al centro-sinistra con fiamme animate
    const brX = 135, brY = 135;
    px(g, brX - 8, brY + 12, 22, 14, "#292524");
    px(g, brX - 11, brY + 8, 28, 5, "#44403c");
    // Fiamme laviche
    const fl = Math.sin(f * 0.15) * 3;
    g.fillStyle = "#ea580c";
    g.beginPath();
    g.moveTo(brX - 7, brY + 8);
    g.quadraticCurveTo(brX + 3, brY - 14 + fl, brX + 13, brY + 8);
    g.closePath();
    g.fill();
    g.fillStyle = "#fef08a";
    g.beginPath();
    g.moveTo(brX - 3, brY + 8);
    g.quadraticCurveTo(brX + 3, brY - 6 + fl, brX + 9, brY + 8);
    g.closePath();
    g.fill();

    // Fumo denso e faville incandescenti che salgono
    for (let sm = 0; sm < 6; sm++) {
      const sx = brX + 3 + Math.sin(f * 0.08 + sm) * (6 + sm * 4);
      const sy = brY - 8 - sm * 11 - (f * 0.5 % 10);
      const sr = 3 + sm * 2;
      g.fillStyle = `rgba(249, 115, 22, ${0.4 - sm * 0.06})`;
      g.beginPath(); g.arc(sx, sy, sr, 0, Math.PI * 2); g.fill();
    }

    // Fiocchi di neve mescolati a scintille di magma
    for (let i = 0; i < 40; i++) {
      const sx = (i * 29 + f * 1.2 + Math.sin(f * 0.06 + i) * 14) % W;
      const sy = (i * 17 + f * 1.6) % H;
      if (i % 3 === 0) {
        px(g, sx, sy, 2, 2, "#f97316"); // Favilla di lava
      } else {
        px(g, sx, sy, 1, 1, "rgba(248, 250, 252, 0.85)"); // Neve
      }
    }
  }

  // --- 14. RAGNAROK BALL · LA SALA DEL MEAD DI RAGNAR (CAPITOLO 1) ---
  function drawDetailedRagnarokSala(g, W, H, f) {
    // Interno della Casa Lunga in quercia affumicata e penombra calda
    const bgGrad = g.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#1c0b03");
    bgGrad.addColorStop(0.6, "#27150c");
    bgGrad.addColorStop(1, "#120702");
    g.fillStyle = bgGrad;
    g.fillRect(0, 0, W, H);

    // Travi monumentali verticali e diagonali del soffitto vichingo
    g.fillStyle = "#1c0b03";
    for (let bx = 20; bx < W; bx += 70) {
      px(g, bx, 0, 8, H - 40, "#140702");
      px(g, bx + 2, 0, 4, H - 40, "#27150c");
    }
    // Capriate del tetto a spiovente
    g.strokeStyle = "#140702";
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(0, 30); g.lineTo(W / 2, 8); g.lineTo(W, 30);
    g.stroke();

    // Camino monumentale in pietra basaltica al centro
    const fireX = W / 2, fireY = H - 65;
    px(g, fireX - 45, fireY - 35, 90, 75, "#292524");
    px(g, fireX - 48, fireY - 38, 96, 6, "#44403c");
    px(g, fireX - 35, fireY - 15, 70, 55, "#0c0a09"); // Bocca camino
    // Ceppi giganteschi ardenti
    px(g, fireX - 25, fireY + 22, 50, 10, "#451a03");
    px(g, fireX - 22, fireY + 18, 44, 6, "#78350f");

    // Fuoco del camino con fiamme animate ad alta luminosità
    const fl = Math.sin(f * 0.18) * 4;
    g.fillStyle = "#ea580c";
    g.beginPath();
    g.moveTo(fireX - 24, fireY + 24);
    g.quadraticCurveTo(fireX, fireY - 22 + fl, fireX + 24, fireY + 24);
    g.closePath();
    g.fill();
    g.fillStyle = "#f59e0b";
    g.beginPath();
    g.moveTo(fireX - 16, fireY + 24);
    g.quadraticCurveTo(fireX, fireY - 12 + fl, fireX + 16, fireY + 24);
    g.closePath();
    g.fill();
    g.fillStyle = "#fef08a";
    g.beginPath();
    g.moveTo(fireX - 8, fireY + 24);
    g.quadraticCurveTo(fireX, fireY - 2 + fl, fireX + 8, fireY + 24);
    g.closePath();
    g.fill();

    // Maestose corna d'alce e teschio sopra la cappa del camino
    px(g, fireX - 8, fireY - 45, 16, 8, "#e2e8f0");
    g.fillStyle = "#cbd5e1";
    g.beginPath();
    g.moveTo(fireX - 8, fireY - 45);
    g.quadraticCurveTo(fireX - 36, fireY - 65, fireX - 44, fireY - 50);
    g.lineTo(fireX - 36, fireY - 42);
    g.closePath();
    g.fill();
    g.beginPath();
    g.moveTo(fireX + 8, fireY - 45);
    g.quadraticCurveTo(fireX + 36, fireY - 65, fireX + 44, fireY - 50);
    g.lineTo(fireX + 36, fireY - 42);
    g.closePath();
    g.fill();

    // Scudi tondi vichinghi appesi lungo le pareti
    [-100, -65, 65, 100].forEach((dx, idx) => {
      const sx = fireX + dx, sy = 65;
      g.fillStyle = idx % 2 === 0 ? "#991b1b" : "#b45309";
      g.beginPath(); g.arc(sx, sy, 12, 0, Math.PI * 2); g.fill();
      px(g, sx - 2, sy - 2, 4, 4, "#1c1917");
      px(g, sx - 1, sy - 1, 2, 2, "#f59e0b");
    });

    // Stendardi con il corvo di Odino
    [-130, 130].forEach((dx) => {
      const stX = fireX + dx, stY = 40;
      px(g, stX - 10, stY, 20, 52, "#7f1d1d");
      px(g, stX - 6, stY + 12, 12, 16, "#1c1917"); // Sagoma corvo
      px(g, stX - 10, stY + 52, 10, 6, "#7f1d1d");
    });

    // Tavolo di quercia massiccia in primo piano
    px(g, 35, H - 36, W - 70, 36, "#3b1a0a");
    px(g, 30, H - 38, W - 60, 4, "#5c2406");
    // Boccali e corni d'idromele sul tavolo
    px(g, 65, H - 48, 8, 11, "#78350f");
    px(g, 66, H - 49, 6, 2, "#fef08a"); // Schiuma idromele
    px(g, W - 85, H - 48, 8, 11, "#78350f");
    px(g, W - 84, H - 49, 6, 2, "#fef08a");
  }

  // --- 15. RAGNAROK BALL · L'ARENA DEL GELO E DELLA BRACE (CAPITOLO 1) ---
  function drawDetailedRagnarokArena(g, W, H, f) {
    // Cielo cupo solcato da fumi vulcanici e aurore purpuree
    const sky = g.createLinearGradient(0, 0, 0, 85);
    sky.addColorStop(0, "#09090b");
    sky.addColorStop(0.5, "#1c1917");
    sky.addColorStop(1, "#450a0a");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 85);

    // Aurore sismiche e fiamme all'orizzonte
    g.save();
    g.globalCompositeOperation = "screen";
    const auroraGrad = g.createLinearGradient(0, 10, 0, 65);
    auroraGrad.addColorStop(0, "rgba(239, 68, 68, 0)");
    auroraGrad.addColorStop(0.5, `rgba(249, 115, 22, ${0.35 + 0.1 * Math.sin(f * 0.05)})`);
    auroraGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
    g.fillStyle = auroraGrad;
    g.fillRect(0, 15, W, 50);
    g.restore();

    // Campo di permafrost tagliato da crepacci lavici
    const arenaGrad = g.createLinearGradient(0, 75, 0, H);
    arenaGrad.addColorStop(0, "#475569");
    arenaGrad.addColorStop(0.4, "#334155");
    arenaGrad.addColorStop(1, "#1c1917");
    g.fillStyle = arenaGrad;
    g.fillRect(0, 75, W, H - 75);

    // Grande Crepa Tellurica fiammeggiante a metà campo (Furia Berserker)
    const midY = 135;
    g.strokeStyle = "#ea580c";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(20, midY);
    for (let x = 20; x <= W - 20; x += 25) {
      const y = midY + Math.sin(x * 0.08 + f * 0.05) * 6 + ((x % 50 === 0) ? 8 : -4);
      g.lineTo(x, y);
    }
    g.stroke();

    // Bagliore di lava all'interno della crepa
    g.strokeStyle = "#fef08a";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(35, midY + 1);
    for (let x = 35; x <= W - 35; x += 30) {
      const y = midY + Math.sin(x * 0.08 + f * 0.05) * 5;
      g.lineTo(x, y);
    }
    g.stroke();

    // Porte cerimoniali da calcio in legno di drakkar e ossa giganti
    [35, W - 45].forEach((gx) => {
      px(g, gx - 3, 92, 6, 42, "#451a03");
      px(g, gx - 10, 88, 20, 5, "#78350f");
      // Ossa di balena ricurve
      px(g, gx - 14, 80, 5, 12, "#e2e8f0");
      px(g, gx + 9, 80, 5, 12, "#e2e8f0");
      // Rete di funi di canapa
      px(g, gx - 6, 95, 12, 36, "rgba(254, 243, 199, 0.25)");
    });

    // Bracieri rituali giganti agli angoli
    [15, W - 25].forEach((bx) => {
      px(g, bx, 105, 14, 18, "#292524");
      const fl = Math.sin(f * 0.16 + bx) * 3;
      g.fillStyle = "#ea580c";
      g.beginPath();
      g.moveTo(bx, 105);
      g.quadraticCurveTo(bx + 7, 88 + fl, bx + 14, 105);
      g.closePath();
      g.fill();
      px(g, bx + 5, 96 + fl, 4, 6, "#fef08a");
    });

    // Faville telluriche e fiocchi di cenere
    for (let sp = 0; sp < 35; sp++) {
      const spx = (sp * 31 + Math.sin(f * 0.06 + sp) * 20) % W;
      const spy = (H - ((sp * 19 + f * 1.5) % H));
      if (sp % 2 === 0) {
        px(g, spx, spy, 2, 2, "#f97316");
      } else {
        px(g, spx, spy, 1, 1, "rgba(226, 232, 240, 0.8)");
      }
    }
  }

  // --- 16. RAGNAROK BALL · LE FUCINE DEI NANI SOTTERRANEI (CAPITOLO 2) ---
  function drawDetailedRagnarokFucine(g, W, H, f) {
    // Volta cavernosa sotterranea in basalto nero e riflessi rosso cupo
    const cavGrad = g.createLinearGradient(0, 0, 0, H);
    cavGrad.addColorStop(0, "#09090b");
    cavGrad.addColorStop(0.5, "#1c1917");
    cavGrad.addColorStop(1, "#450a0a");
    g.fillStyle = cavGrad;
    g.fillRect(0, 0, W, H);

    // Stalattiti di basalto e roccia lavica dalla volta
    for (let st = 8; st < W; st += 20) {
      const sl = 18 + (st % 5) * 6;
      g.fillStyle = "#1c1917";
      g.beginPath();
      g.moveTo(st, 0);
      g.lineTo(st + 6, sl);
      g.lineTo(st + 12, 0);
      g.closePath();
      g.fill();
      px(g, st + 5, sl - 4, 2, 4, "#ea580c"); // Goccia di magma
    }

    // Colate verticali di lava sulle pareti rocciose sullo sfondo
    [45, W - 60].forEach((lx) => {
      const lavaG = g.createLinearGradient(lx, 0, lx, H);
      lavaG.addColorStop(0, "rgba(234, 88, 12, 0.4)");
      lavaG.addColorStop(0.6, "rgba(249, 115, 22, 0.85)");
      lavaG.addColorStop(1, "rgba(254, 240, 138, 0.95)");
      g.fillStyle = lavaG;
      g.fillRect(lx, 15, 14, H - 35);
      px(g, lx + 4, 15, 6, H - 35, "#fef08a");
    });

    // Fornace nanica a cupola a sinistra
    const fnX = 25, fnY = H - 85;
    px(g, fnX, fnY, 65, 65, "#292524");
    px(g, fnX - 4, fnY - 4, 73, 6, "#44403c");
    // Bocca della fornace ardente
    g.fillStyle = "#ea580c";
    g.beginPath();
    g.arc(fnX + 32, fnY + 36, 18, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fef08a";
    g.beginPath();
    g.arc(fnX + 32, fnY + 36, 10, 0, Math.PI * 2);
    g.fill();
    // Tubo di sfogo del vapore
    px(g, fnX + 24, fnY - 24, 16, 24, "#44403c");
    // Fumo sulfureo
    for (let sm = 0; sm < 4; sm++) {
      const sx = fnX + 32 + Math.sin(f * 0.1 + sm) * (4 + sm * 3);
      const sy = fnY - 26 - sm * 8 - (f * 0.4 % 8);
      g.fillStyle = `rgba(249, 115, 22, ${0.4 - sm * 0.08})`;
      g.beginPath(); g.arc(sx, sy, 3 + sm * 1.5, 0, Math.PI * 2); g.fill();
    }

    // Incudine Titanica di Brokk in ferro di meteorite al centro
    const anX = W / 2, anY = H - 55;
    // Base di pietra
    px(g, anX - 35, anY + 12, 70, 24, "#292524");
    px(g, anX - 38, anY + 8, 76, 5, "#44403c");
    // Corpo dell'incudine
    g.fillStyle = "#475569";
    g.beginPath();
    g.moveTo(anX - 25, anY + 8);
    g.lineTo(anX - 35, anY - 8);
    g.lineTo(anX - 45, anY - 8); // Corno dell'incudine
    g.lineTo(anX + 35, anY - 8);
    g.lineTo(anX + 25, anY + 8);
    g.closePath();
    g.fill();
    px(g, anX - 30, anY - 10, 60, 3, "#94a3b8"); // Piano battuto
    // Martello di meteorite appoggiato
    px(g, anX + 8, anY - 22, 18, 12, "#1c1917");
    px(g, anX + 15, anY - 32, 4, 14, "#78350f");

    // Scintille incandescenti che schizzano dall'incudine
    for (let sp = 0; sp < 25; sp++) {
      const spx = (anX + Math.sin(f * 0.2 + sp * 1.5) * (20 + (sp % 4) * 12));
      const spy = (anY - 10 - Math.abs(Math.cos(f * 0.2 + sp)) * (15 + (sp % 3) * 10));
      px(g, spx, spy, 2, 2, (sp % 2 === 0 ? "#fef08a" : "#ea580c"));
    }

    // Pavimento della caverna con lastre di basalto e pozzanghere di lava
    const fGrad = g.createLinearGradient(0, H - 25, 0, H);
    fGrad.addColorStop(0, "#1c1917");
    fGrad.addColorStop(1, "#0c0a09");
    g.fillStyle = fGrad;
    g.fillRect(0, H - 25, W, 25);
  }

  // --- 17. RAGNAROK BALL · IL PONTE DEI FIUMI DI MAGMA (CAPITOLO 2) ---
  function drawDetailedRagnarokPonte(g, W, H, f) {
    // Volta basaltica con riflessi infernali
    const sky = g.createLinearGradient(0, 0, 0, 75);
    sky.addColorStop(0, "#0c0a09");
    sky.addColorStop(0.7, "#291307");
    sky.addColorStop(1, "#451a03");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, 75);

    // Stalattiti rocciose
    for (let st = 12; st < W; st += 24) {
      const sl = 14 + (st % 4) * 6;
      g.fillStyle = "#1c1917";
      g.beginPath();
      g.moveTo(st, 0); g.lineTo(st + 6, sl); g.lineTo(st + 12, 0);
      g.closePath(); g.fill();
    }

    // Fiume di Magma ribollente sottostante
    const lavaGrad = g.createLinearGradient(0, 75, 0, H);
    lavaGrad.addColorStop(0, "#c2410c");
    lavaGrad.addColorStop(0.4, "#ea580c");
    lavaGrad.addColorStop(0.8, "#f97316");
    lavaGrad.addColorStop(1, "#fef08a");
    g.fillStyle = lavaGrad;
    g.fillRect(0, 75, W, H - 75);

    // Onde e bolle di lava che scoppiano
    for (let b = 0; b < 12; b++) {
      const bx = (b * 28 + f * 0.8) % W;
      const by = 85 + (b * 9) % (H - 95);
      const br = 3 + Math.sin(f * 0.15 + b) * 2;
      g.fillStyle = "#fef08a";
      g.beginPath(); g.arc(bx, by, br, 0, Math.PI * 2); g.fill();
    }

    // Ponte di pietra lavica ad arco massiccio al centro
    const pY = 115;
    g.fillStyle = "#1c1917";
    g.beginPath();
    g.moveTo(0, pY + 12);
    g.quadraticCurveTo(W / 2, pY - 14, W, pY + 12);
    g.lineTo(W, pY + 28);
    g.quadraticCurveTo(W / 2, pY + 4, 0, pY + 28);
    g.closePath();
    g.fill();
    // Parapetto di pietra con rune scolpite
    px(g, 0, pY - 4, W, 4, "#292524");
    for (let rx = 15; rx < W; rx += 25) {
      px(g, rx, pY - 2, 4, 2, "#f59e0b"); // Runa brillante
      px(g, rx - 2, pY - 8, 4, 6, "#44403c"); // Pilastrino
    }

    // Vapori sulfurei e scintille che salgono dal fiume
    for (let sp = 0; sp < 25; sp++) {
      const spx = (sp * 27 + Math.sin(f * 0.08 + sp) * 22) % W;
      const spy = H - ((sp * 14 + f * 1.5) % (H - 60));
      px(g, spx, spy, 2, 2, "#fef08a");
    }
  }

  // --- 18. RAGNAROK BALL · L'ARENA DELLE SCINTILLE DI NIDAVELLIR (CAPITOLO 2) ---
  function drawDetailedRagnarokForgia(g, W, H, f) {
    // Volta sotterranea titanica con archi nanici
    const bgGrad = g.createLinearGradient(0, 0, 0, 80);
    bgGrad.addColorStop(0, "#0c0a09");
    bgGrad.addColorStop(0.6, "#1c1917");
    bgGrad.addColorStop(1, "#3c1505");
    g.fillStyle = bgGrad;
    g.fillRect(0, 0, W, 80);

    // Archi nanici scolpiti a tutto sesto
    g.strokeStyle = "#292524";
    g.lineWidth = 5;
    [W * 0.25, W * 0.75].forEach((ax) => {
      g.beginPath();
      g.arc(ax, 45, 35, Math.PI, 0);
      g.stroke();
    });

    // Campo di gioco cerimoniale in basalto scuro levigato
    const fGrad = g.createLinearGradient(0, 75, 0, H);
    fGrad.addColorStop(0, "#292524");
    fGrad.addColorStop(0.5, "#1c1917");
    fGrad.addColorStop(1, "#0c0a09");
    g.fillStyle = fGrad;
    g.fillRect(0, 75, W, H - 75);

    // Canali perimetrali di lava che illuminano il campo
    px(g, 15, 78, W - 30, 4, "#ea580c");
    px(g, 18, 79, W - 36, 2, "#fef08a");

    // Linea di metà campo di lava dorata
    const midY = 135;
    px(g, 25, midY, W - 50, 2, "#f59e0b");
    g.fillStyle = "#fef08a";
    g.beginPath(); g.arc(W / 2, midY, 12, 0, Math.PI * 2); g.stroke();

    // Porte cerimoniali in ossidiana e corna naniche
    [32, W - 42].forEach((gx) => {
      px(g, gx - 4, 90, 8, 44, "#0f172a"); // Ossidiana
      px(g, gx - 12, 86, 24, 6, "#1e293b");
      px(g, gx - 10, 84, 4, 4, "#d97706"); // Runa d'oro
      px(g, gx + 6, 84, 4, 4, "#d97706");
      // Rete di catene di ferro
      px(g, gx - 6, 94, 12, 38, "rgba(148, 163, 184, 0.3)");
    });

    // Bracieri nanici a colonna
    [15, W - 25].forEach((bx) => {
      px(g, bx - 2, 98, 16, 22, "#292524");
      px(g, bx - 4, 95, 20, 4, "#44403c");
      const fl = Math.sin(f * 0.18 + bx) * 4;
      g.fillStyle = "#ea580c";
      g.beginPath();
      g.moveTo(bx - 2, 95);
      g.quadraticCurveTo(bx + 6, 78 + fl, bx + 14, 95);
      g.closePath();
      g.fill();
      px(g, bx + 4, 88 + fl, 4, 5, "#fef08a");
    });

    // Scintille che danzano sopra il campo
    for (let sp = 0; sp < 25; sp++) {
      const spx = (sp * 33 + Math.sin(f * 0.07 + sp) * 18) % W;
      const spy = (H - ((sp * 17 + f * 1.6) % H));
      px(g, spx, spy, 2, 2, (sp % 2 === 0 ? "#fef08a" : "#f97316"));
    }
  }

  // --- 17. RAGNAROK BALL · LA PIANA DI VIGRID SOTTO IL CIELO DI CENERE (CAPITOLO 3) ---
  function drawDetailedRagnarokVigrid(g, W, H, f) {
    // Cielo plumbeo e cremisi solcato da nubi di cenere vulcanica
    const sky = g.createLinearGradient(0, 0, 0, H * 0.65);
    sky.addColorStop(0, "#09090b");
    sky.addColorStop(0.35, "#271212");
    sky.addColorStop(0.7, "#581c1c");
    sky.addColorStop(1, "#9a3412");
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H * 0.65);

    // Aurore boreali di cenere e fuoco che serpeggiano nel cielo
    for (let au = 0; au < 3; au++) {
      const wave = Math.sin(f * 0.04 + au) * 16;
      g.fillStyle = au === 0 ? "rgba(225, 29, 72, 0.2)" : au === 1 ? "rgba(249, 115, 22, 0.25)" : "rgba(254, 240, 138, 0.15)";
      g.beginPath();
      g.moveTo(0, 20 + au * 14 + wave);
      g.bezierCurveTo(W * 0.35, 10 + au * 10 - wave, W * 0.7, 35 + au * 12 + wave, W, 18 + au * 14);
      g.lineTo(W, 35 + au * 14);
      g.bezierCurveTo(W * 0.7, 50 + au * 12 + wave, W * 0.35, 25 + au * 10 - wave, 0, 35 + au * 14 + wave);
      g.closePath();
      g.fill();
    }

    // Vulcani boreali lontani con colate di magma
    const v1X = W * 0.28, v1Y = H * 0.65;
    g.fillStyle = "#1c1917";
    g.beginPath();
    g.moveTo(v1X - 70, v1Y);
    g.lineTo(v1X - 8, v1Y - 45);
    g.lineTo(v1X + 12, v1Y - 45);
    g.lineTo(v1X + 80, v1Y);
    g.closePath();
    g.fill();
    // Colata di lava dal cratere
    px(g, v1X - 4, v1Y - 45, 10, 5, "#fef08a");
    px(g, v1X - 2, v1Y - 40, 6, 25, "#ea580c");

    const v2X = W * 0.78;
    g.fillStyle = "#18181b";
    g.beginPath();
    g.moveTo(v2X - 60, v1Y);
    g.lineTo(v2X, v1Y - 38);
    g.lineTo(v2X + 65, v1Y);
    g.closePath();
    g.fill();
    px(g, v2X - 2, v1Y - 38, 5, 20, "#f97316");

    // Fumo sulfureo che sale dai vulcani
    for (let sm = 0; sm < 6; sm++) {
      const sx = v1X + Math.sin(f * 0.08 + sm) * (6 + sm * 3);
      const sy = v1Y - 48 - sm * 7 - (f * 0.3 % 7);
      g.fillStyle = `rgba(68, 64, 60, ${0.45 - sm * 0.06})`;
      g.beginPath(); g.arc(sx, sy, 4 + sm * 1.5, 0, Math.PI * 2); g.fill();
    }

    // Terreno della Piana di Vigrid: permafrost nero, basalto e crepe
    const grGrad = g.createLinearGradient(0, H * 0.65, 0, H);
    grGrad.addColorStop(0, "#292524");
    grGrad.addColorStop(0.4, "#1c1917");
    grGrad.addColorStop(1, "#0c0a09");
    g.fillStyle = grGrad;
    g.fillRect(0, H * 0.65, W, H * 0.35);

    // Crepa tellurica fiammeggiante sul terreno
    const crY = H * 0.78;
    g.fillStyle = "#ea580c";
    g.beginPath();
    g.moveTo(10, crY + 4);
    g.lineTo(W * 0.3, crY - 3);
    g.lineTo(W * 0.55, crY + 5);
    g.lineTo(W * 0.85, crY - 2);
    g.lineTo(W - 15, crY + 3);
    g.lineTo(W * 0.85, crY + 1);
    g.lineTo(W * 0.55, crY + 8);
    g.lineTo(W * 0.3, crY - 1);
    g.closePath();
    g.fill();
    // Centro rovente della crepa
    px(g, W * 0.28, crY - 2, W * 0.44, 2, "#fef08a");

    // Totem con corna d'alce e rune a sinistra
    const totX = 35, totY = H - 75;
    px(g, totX, totY, 14, 60, "#44403c");
    px(g, totX + 2, totY + 4, 10, 52, "#292524");
    // Corna d'alce ramificate
    g.fillStyle = "#e2e8f0";
    g.beginPath();
    g.moveTo(totX + 7, totY);
    g.lineTo(totX - 18, totY - 18);
    g.lineTo(totX - 14, totY - 12);
    g.lineTo(totX - 22, totY - 8);
    g.lineTo(totX + 7, totY + 4);
    g.lineTo(totX + 36, totY - 8);
    g.lineTo(totX + 28, totY - 12);
    g.lineTo(totX + 32, totY - 18);
    g.closePath();
    g.fill();
    // Rune pulsanti dorate sul tronco del totem
    const tPulse = 0.5 + 0.5 * Math.sin(f * 0.15);
    g.fillStyle = `rgba(245, 158, 11, ${tPulse})`;
    px(g, totX + 5, totY + 14, 4, 6, g.fillStyle);
    px(g, totX + 5, totY + 28, 4, 6, g.fillStyle);
    px(g, totX + 5, totY + 42, 4, 6, g.fillStyle);

    // Braciere votivo delle Ceneri a destra
    const brX = W - 45, brY = H - 55;
    px(g, brX, brY + 10, 18, 30, "#292524");
    px(g, brX - 3, brY + 6, 24, 5, "#44403c");
    const bfl = Math.sin(f * 0.2) * 4;
    g.fillStyle = "#ea580c";
    g.beginPath();
    g.moveTo(brX - 2, brY + 6);
    g.quadraticCurveTo(brX + 9, brY - 14 + bfl, brX + 20, brY + 6);
    g.closePath();
    g.fill();
    px(g, brX + 6, brY - 4 + bfl, 6, 6, "#fef08a");

    // Cenere e fiocchi di neve mescolati che cadono insieme
    for (let p = 0; p < 45; p++) {
      const px_ = (p * 23 + Math.sin(f * 0.05 + p) * 20) % W;
      const py_ = (p * 13 + f * 1.2) % H;
      if (p % 3 === 0) {
        px(g, px_, py_, 2, 2, "#fef08a"); // Scintilla di magma
      } else if (p % 3 === 1) {
        px(g, px_, py_, 2, 2, "#ea580c"); // Brace ardente
      } else {
        px(g, px_, py_, 2, 2, "#e2e8f0"); // Fiocco di neve boreale
      }
    }
  }

  // --- 18. RAGNAROK BALL · I FRAMMENTI DEL BIFROST FRANTUMATO (CAPITOLO 3) ---
  function drawDetailedRagnarokBifrost(g, W, H, f) {
    // Spazio etereo cosmico: buio profondo con nebulose celesti e vapori
    const cosGrad = g.createLinearGradient(0, 0, 0, H);
    cosGrad.addColorStop(0, "#030712");
    cosGrad.addColorStop(0.4, "#0f172a");
    cosGrad.addColorStop(0.8, "#1e1b4b");
    cosGrad.addColorStop(1, "#3b0764");
    g.fillStyle = cosGrad;
    g.fillRect(0, 0, W, H);

    // Aurore cosmiche del Bifrost che serpeggiano
    const colors = ["rgba(56, 189, 248, 0.25)", "rgba(168, 85, 247, 0.25)", "rgba(52, 211, 153, 0.2)"];
    colors.forEach((col, idx) => {
      const off = Math.sin(f * 0.03 + idx * 2) * 20;
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(0, 30 + idx * 22 + off);
      g.bezierCurveTo(W * 0.4, 15 + idx * 18 - off, W * 0.7, 50 + idx * 20 + off, W, 25 + idx * 22);
      g.lineTo(W, 45 + idx * 22);
      g.bezierCurveTo(W * 0.7, 70 + idx * 20 + off, W * 0.4, 35 + idx * 18 - off, 0, 50 + idx * 22 + off);
      g.closePath();
      g.fill();
    });

    // Monoliti di Cristallo Prismatico del Bifrost fluttuanti nel vuoto
    const crystals = [
      { x: 45, y: 75, w: 26, h: 55, rot: -0.15, col: "#38bdf8" },
      { x: W - 55, y: 80, w: 28, h: 60, rot: 0.18, col: "#ec4899" },
      { x: W * 0.24, y: 45, w: 18, h: 40, rot: 0.08, col: "#34d399" },
      { x: W * 0.76, y: 50, w: 20, h: 44, rot: -0.12, col: "#fbbf24" }
    ];
    crystals.forEach((cr, i) => {
      const fl = Math.sin(f * 0.06 + i) * 6;
      g.save();
      g.translate(cr.x, cr.y + fl);
      g.rotate(cr.rot);
      // Corpo del cristallo prisma
      g.fillStyle = cr.col;
      g.globalAlpha = 0.65;
      g.beginPath();
      g.moveTo(0, -cr.h / 2);
      g.lineTo(cr.w / 2, 0);
      g.lineTo(0, cr.h / 2);
      g.lineTo(-cr.w / 2, 0);
      g.closePath();
      g.fill();
      // Riflesso brillante interno
      g.fillStyle = "#ffffff";
      g.globalAlpha = 0.85;
      g.beginPath();
      g.moveTo(0, -cr.h / 2);
      g.lineTo(cr.w / 4, 0);
      g.lineTo(0, cr.h / 4);
      g.closePath();
      g.fill();
      g.restore();
    });
    g.globalAlpha = 1.0;

    // Basamento roccioso fluttuante al centro
    const bGrad = g.createLinearGradient(0, H - 75, 0, H);
    bGrad.addColorStop(0, "#1e293b");
    bGrad.addColorStop(0.5, "#0f172a");
    bGrad.addColorStop(1, "#020617");
    g.fillStyle = bGrad;
    g.fillRect(W * 0.15, H - 65, W * 0.7, 65);
    px(g, W * 0.15 - 4, H - 68, W * 0.7 + 8, 4, "#334155");

    // Monolite Centrale delle Rivelazioni (La Runa Thurisaz)
    const mX = W / 2, mY = H - 55;
    px(g, mX - 16, mY - 35, 32, 60, "#334155");
    px(g, mX - 14, mY - 33, 28, 56, "#1e293b");
    px(g, mX - 18, mY + 22, 36, 6, "#475569");
    // Runa Thurisaz luminosa incisa
    const rPulse = 0.6 + 0.4 * Math.sin(f * 0.12);
    g.fillStyle = `rgba(56, 189, 248, ${rPulse})`;
    px(g, mX - 4, mY - 24, 3, 30, g.fillStyle); // Asta verticale
    px(g, mX - 1, mY - 18, 8, 3, g.fillStyle);
    px(g, mX + 5, mY - 15, 3, 8, g.fillStyle);
    px(g, mX - 1, mY - 7, 8, 3, g.fillStyle);

    // Stelle e polvere di cristallo scintillante
    for (let st = 0; st < 35; st++) {
      const sx = (st * 41 + Math.sin(f * 0.05 + st) * 10) % W;
      const sy = (st * 17) % (H - 50);
      const bright = (st + f) % 6 === 0 ? "#ffffff" : (st % 2 ? "#38bdf8" : "#f472b6");
      px(g, sx, sy, 2, 2, bright);
    }
  }

  // --- 19. RAGNAROK BALL · IL CERCHIO DI CENERE E SPETTRI DI VIGRID (CAPITOLO 3) ---
  function drawDetailedRagnarokCerchioCenere(g, W, H, f) {
    // Cielo cupo di battaglia con bagliori rossastri all'orizzonte
    const cSky = g.createLinearGradient(0, 0, 0, 85);
    cSky.addColorStop(0, "#09090b");
    cSky.addColorStop(0.5, "#1c1917");
    cSky.addColorStop(1, "#450a0a");
    g.fillStyle = cSky;
    g.fillRect(0, 0, W, 85);

    // Campo cerimoniale degli Spettri: basalto e lastroni di cenere dura
    const cFloor = g.createLinearGradient(0, 80, 0, H);
    cFloor.addColorStop(0, "#1c1917");
    cFloor.addColorStop(0.5, "#292524");
    cFloor.addColorStop(1, "#0c0a09");
    g.fillStyle = cFloor;
    g.fillRect(0, 80, W, H - 80);

    // Grande Crepa Tellurica di metà campo: spacca in due il rettangolo di gioco
    const midY = 125;
    g.fillStyle = "#ea580c";
    g.beginPath();
    g.moveTo(20, midY);
    g.lineTo(W * 0.35, midY - 6);
    g.lineTo(W * 0.65, midY + 5);
    g.lineTo(W - 20, midY - 2);
    g.lineTo(W * 0.65, midY + 8);
    g.lineTo(W * 0.35, midY - 2);
    g.closePath();
    g.fill();
    px(g, 25, midY - 1, W - 50, 2, "#fef08a"); // Cuore fuso ribollente

    // Porte cerimoniali in ossidiana e corna titaniche
    [30, W - 50].forEach((gx) => {
      px(g, gx, 90, 20, 48, "#292524");
      px(g, gx - 2, 86, 24, 6, "#44403c");
      // Corna sopra la traversa
      px(g, gx - 4, 80, 6, 8, "#e2e8f0");
      px(g, gx + 18, 80, 6, 8, "#e2e8f0");
      // Rete di catene
      px(g, gx + 4, 94, 12, 38, "rgba(234, 88, 12, 0.25)");
    });

    // Monoliti degli Einherjar a guardia del perimetro
    [W * 0.25, W * 0.75].forEach((mx) => {
      px(g, mx - 6, 68, 12, 28, "#44403c");
      px(g, mx - 4, 70, 8, 24, "#292524");
      px(g, mx - 2, 74, 4, 6, "#ea580c");
    });

    // Scintille telluriche che salgono dalla crepa
    for (let sp = 0; sp < 25; sp++) {
      const spx = (sp * 31 + Math.sin(f * 0.1 + sp) * 12) % (W - 40) + 20;
      const spy = midY - ((sp * 7 + f * 1.4) % 45);
      px(g, spx, spy, 2, 2, (sp % 2 === 0 ? "#fef08a" : "#ea580c"));
    }
  }

  // --- 20. RAGNAROK BALL · LE RADICI CELESTI DI YGGDRASIL (CAPITOLO 4) ---
  function drawDetailedRagnarokYggdrasil(g, W, H, f) {
    // Spazio cosmico: aurore boreali stellari e cielo infinito
    const ySky = g.createLinearGradient(0, 0, 0, H);
    ySky.addColorStop(0, "#030712");
    ySky.addColorStop(0.35, "#1e1b4b");
    ySky.addColorStop(0.7, "#431407");
    ySky.addColorStop(1, "#7c2d12");
    g.fillStyle = ySky;
    g.fillRect(0, 0, W, H);

    // Aurore cosmiche spettacolari cremisi, smeraldo e oro
    const aurCols = ["rgba(239, 68, 68, 0.25)", "rgba(52, 211, 153, 0.25)", "rgba(251, 191, 36, 0.3)"];
    aurCols.forEach((col, idx) => {
      const off = Math.sin(f * 0.04 + idx * 1.8) * 18;
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(0, 15 + idx * 16 + off);
      g.bezierCurveTo(W * 0.35, 5 + idx * 14 - off, W * 0.65, 30 + idx * 18 + off, W, 10 + idx * 16);
      g.lineTo(W, 30 + idx * 16);
      g.bezierCurveTo(W * 0.65, 50 + idx * 18 + off, W * 0.35, 20 + idx * 14 - off, 0, 32 + idx * 16 + off);
      g.closePath();
      g.fill();
    });

    // Tronco e titaniche radici dell'Albero del Mondo Yggdrasil
    const trW = 75;
    const trGrad = g.createLinearGradient(W / 2 - trW / 2, 0, W / 2 + trW / 2, 0);
    trGrad.addColorStop(0, "#27150c");
    trGrad.addColorStop(0.3, "#451a03");
    trGrad.addColorStop(0.7, "#78350f");
    trGrad.addColorStop(1, "#27150c");
    g.fillStyle = trGrad;
    g.beginPath();
    g.moveTo(W / 2 - trW / 2, 0);
    g.lineTo(W / 2 - trW * 0.7, H);
    g.lineTo(W / 2 + trW * 0.7, H);
    g.lineTo(W / 2 + trW / 2, 0);
    g.closePath();
    g.fill();

    // Vene di linfa solare e fuoco che pulsano nella corteccia
    const sapPulse = 0.6 + 0.4 * Math.sin(f * 0.1);
    g.fillStyle = `rgba(251, 191, 36, ${sapPulse})`;
    for (let v = 0; v < 4; v++) {
      const vx = W / 2 - 25 + v * 16;
      g.beginPath();
      g.moveTo(vx, 0);
      g.bezierCurveTo(vx + 6, H * 0.35, vx - 6, H * 0.7, vx + 10, H);
      g.lineTo(vx + 13, H);
      g.bezierCurveTo(vx - 3, H * 0.7, vx + 9, H * 0.35, vx + 3, 0);
      g.closePath();
      g.fill();
    }

    // Radici secondarie che si diramano ai lati
    g.strokeStyle = "#451a03";
    g.lineWidth = 14;
    g.beginPath();
    g.moveTo(W / 2 - 30, H * 0.5);
    g.quadraticCurveTo(W * 0.25, H * 0.65, 10, H);
    g.stroke();
    g.beginPath();
    g.moveTo(W / 2 + 30, H * 0.5);
    g.quadraticCurveTo(W * 0.75, H * 0.65, W - 10, H);
    g.stroke();

    // Foglie argentee dell'Albero che cadono
    for (let lf = 0; lf < 25; lf++) {
      const lx = (lf * 37 + Math.sin(f * 0.05 + lf) * 15) % W;
      const ly = (lf * 19 + f * 1.1) % H;
      px(g, lx, ly, 3, 2, (lf % 2 === 0 ? "#e2e8f0" : "#38bdf8"));
    }
  }

  // --- 21. RAGNAROK BALL · IL CRATERE DEL SOLE DI PIETRA FUSA (CAPITOLO 4) ---
  function drawDetailedRagnarokCratereSole(g, W, H, f) {
    // Firmamento cosmico che si rischiara per l'alba primordiale
    const sGrad = g.createLinearGradient(0, 0, 0, H);
    sGrad.addColorStop(0, "#0c0a09");
    sGrad.addColorStop(0.3, "#450a0a");
    sGrad.addColorStop(0.65, "#9a3412");
    sGrad.addColorStop(1, "#f59e0b");
    g.fillStyle = sGrad;
    g.fillRect(0, 0, W, H);

    // Grande colonna di luce solare che sale dal centro del cratere
    const colPulse = 0.7 + 0.3 * Math.sin(f * 0.15);
    const lGrad = g.createLinearGradient(W / 2 - 40, 0, W / 2 + 40, 0);
    lGrad.addColorStop(0, "rgba(254, 240, 138, 0)");
    lGrad.addColorStop(0.5, `rgba(254, 240, 138, ${colPulse})`);
    lGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
    g.fillStyle = lGrad;
    g.fillRect(W / 2 - 45, 0, 90, H);

    // Bordo circolare del cratere di roccia basaltica
    const cY = H - 55;
    g.fillStyle = "#1c1917";
    g.beginPath();
    g.ellipse(W / 2, cY + 15, W * 0.44, 38, 0, 0, Math.PI * 2);
    g.fill();

    // Calotta interna ribollente di magma solare
    g.fillStyle = "#ea580c";
    g.beginPath();
    g.ellipse(W / 2, cY + 15, W * 0.36, 26, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fef08a";
    g.beginPath();
    g.ellipse(W / 2, cY + 15, W * 0.22, 14, 0, 0, Math.PI * 2);
    g.fill();

    // La Sfera di Pietra Fusa sospesa al centro del cratere
    const sY = cY - 18 + Math.sin(f * 0.12) * 5;
    g.fillStyle = "#ea580c";
    g.beginPath();
    g.arc(W / 2, sY, 14, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fef08a";
    g.beginPath();
    g.arc(W / 2, sY, 7, 0, Math.PI * 2);
    g.fill();

    // Fasci di faville e luce che si irradiano dalla Sfera
    for (let ray = 0; ray < 8; ray++) {
      const ang = (ray / 8) * Math.PI * 2 + f * 0.03;
      const rx = W / 2 + Math.cos(ang) * (20 + (ray % 2) * 10);
      const ry = sY + Math.sin(ang) * (20 + (ray % 2) * 10);
      px(g, rx, ry, 2, 2, "#ffffff");
    }
  }

  // Esportazione funzioni per fallback diretto
  window.drawRagnarokScenario = function (kind, g, W, H, f) {
    if (kind === "rag_fiordo") { drawDetailedRagnarokFiordo(g, W, H, f); return true; }
    if (kind === "rag_sala") { drawDetailedRagnarokSala(g, W, H, f); return true; }
    if (kind === "rag_arena") { drawDetailedRagnarokArena(g, W, H, f); return true; }
    if (kind === "rag_fucine") { drawDetailedRagnarokFucine(g, W, H, f); return true; }
    if (kind === "rag_ponte") { drawDetailedRagnarokPonte(g, W, H, f); return true; }
    if (kind === "rag_forgia") { drawDetailedRagnarokForgia(g, W, H, f); return true; }
    if (kind === "rag_vigrid") { drawDetailedRagnarokVigrid(g, W, H, f); return true; }
    if (kind === "rag_bifrost") { drawDetailedRagnarokBifrost(g, W, H, f); return true; }
    if (kind === "rag_cerchio_cenere") { drawDetailedRagnarokCerchioCenere(g, W, H, f); return true; }
    if (kind === "rag_yggdrasil") { drawDetailedRagnarokYggdrasil(g, W, H, f); return true; }
    if (kind === "rag_cratere_sole") { drawDetailedRagnarokCratereSole(g, W, H, f); return true; }
    return false;
  };

  // INTERAZIONE TOUCH/CLICK CON GLI ELEMENTI DELLO SFONDO (SCENIC INTERACTION)
  function setupScenicCanvasInteraction() {
    const cv = document.getElementById("cv");
    if (!cv || cv.__feudiScenicBound) return;
    cv.__feudiScenicBound = true;

    cv.addEventListener("pointerdown", (e) => {
      // Verifichiamo se siamo in visualizzazione di scena o dialogo
      if (!window.__borgoApi || typeof window.view === "undefined") return;
      const v = window.view;
      if (!v || v.kind !== "scene") return;

      const bg = v.bg || "";
      if (!bg.startsWith("feudi_") && !bg.startsWith("bv_") && !bg.startsWith("rag_")) return;

      const rect = cv.getBoundingClientRect();
      const W = cv.width || 320, H = cv.height || 200;
      const clickX = ((e.clientX - rect.left) / rect.width) * W;
      const clickY = ((e.clientY - rect.top) / rect.height) * H;

      const toast = window.__borgoApi.trToast || window.toast;
      const sfx = window.sfx || (() => {});

      if (bg === "bv_villaggio") {
        if (clickY < 55 && clickX > W * 0.55) {
          if (toast) toast("💨 Comignolo fumante: «L'odore di legno di betulla bruciato e té caldo scalda l'aria gelida di Belovodia.»");
        } else if (clickX < 90 && clickY > 80) {
          if (toast) toast("🪵 Bottega di Nonno Boris: «L'insegna di legno intagliato a forma di lupo dondola sotto la neve.»");
        } else if (Math.abs(clickX - W / 2) < 40 && clickY > 120) {
          if (toast) toast("❄️ Pozzo di pietra gelato: «L'acqua sotto la lastra di ghiaccio riflette le aurore del nord.»");
        } else if (clickX > W - 80 && clickY > 90) {
          if (toast) toast("🌲 Sentiero delle Betulle: «Oltre i tronchi bianchi si estende la foresta silente dello Zar Moroz.»");
        } else if (clickY < 60 && clickX < W * 0.45) {
          if (toast) toast("🌌 Aurora Boreale di Belovodia: «Lame di luce verde smeraldo danzano tra le costellazioni polari.»");
        }
      } else if (bg === "bv_bottega") {
        if (clickX > W - 85 && clickY > 70) {
          if (toast) toast("🔥 Stufa in ghisa: «Il fuoco di ceppi scoppietta allegro, sciogliendo la brina dai vetri dell'izba.»");
          sfx("kick");
        } else if (clickX < 100 && clickY > 95) {
          if (toast) toast("🪓 Banco di lavoro di Boris: «Sgorbie, scalpelli e trucioli profumati di corteccia d'argento.»");
        } else if (clickY < 75 && Math.abs(clickX - W / 2) < 65) {
          if (toast) toast("🎭 Rastrelliera delle Maschere: «Volti di falchi, orsi e lepri sembrano osservarti nell'ombra calda.»");
        } else if (clickX < 60 && clickY < 90) {
          if (toast) toast("🪟 Finestra con brina: «La neve si accumula lenta contro i piccoli vetri piombati.»");
        }
      } else if (bg === "bv_radura") {
        if (Math.abs(clickX - W / 2) < 55 && clickY < 95) {
          if (toast) toast("🥅 Porte di rami e corna: «Intrecciate a mano dai boscaioli per sfidare gli spiriti del gelo.»");
        } else if (clickY < 60) {
          if (toast) toast("🌌 Aurora Boreale: «Fasci di luce cosmica illuminano il manto di neve incontaminata.»");
        } else if (clickX < 70 && clickY > 90) {
          if (toast) toast("🌲 Betulle Guardiane: «I tronchi d'argento delimitano il confine sacro della radura.»");
        } else if (clickY > 120) {
          if (toast) toast("⚽ Ghiaccio del campo: «Il terreno è scivoloso e imprevedibile, ideale per tiri radenti e cariche a sorpresa!»");
        }
      } else if (bg === "bv_lago") {
        if (clickX < 90 && clickY > 90) {
          if (toast) toast("🪵 Pontile dei Pescatori: «Le assi scricchiolano sotto gli stivali nel silenzio del lago.»");
        } else if (Math.abs(clickX - 230) < 40 && clickY > 80 && clickY < 150) {
          if (toast) toast("💎 Riflesso della Luna sul Ghiaccio: «Sotto la lastra azzurra sembra muoversi l'ombra di una Rusalka...»");
          sfx("chime");
        } else if (clickX > W - 70 && clickY > 80) {
          if (toast) toast("🌾 Canneti ghiacciati: «Steli rigidi di giunco incrostati di brina argentina.»");
        } else if (clickY < 60) {
          if (toast) toast("🌌 Aurora sul Lago: «Lampi di luce boreale si specchiano sulle acque addormentate.»");
        }
      } else if (bg === "bv_caverna") {
        if (Math.abs(clickX - W / 2) < 50 && clickY > 70 && clickY < 135) {
          if (toast) toast("🎭 Altare della Maschera dell'Orso: «L'idolo di pietra emana un calore profondo e titanico.»");
          sfx("kick");
        } else if (clickY < 55) {
          if (toast) toast("❄️ Stalattiti di Brina: «Ghiaccioli traslucidi pendono dalla volta di roccia scura.»");
        } else if (Math.abs(clickX - W / 2) < 40 && clickY >= 135) {
          if (toast) toast("🔥 Focolare della Caverna: «Ceppi di pino ardono spargendo un profumo di resina e brace.»");
        }
      } else if (bg === "bv_fortezza") {
        if (clickY < 65 && (clickX < 70 || clickX > W - 70)) {
          if (toast) toast("🏰 Torri della Fortezza di Brina: «Le merlature sono incrostate di ghiaccio spesso dieci spanne.»");
        } else if (Math.abs(clickX - W / 2) < 45 && clickY > 60 && clickY < 125) {
          if (toast) toast("⚔️ Portale dei Boiardi: «La saracinesca di ferro protegge il passaggio verso la Fonderia.»");
          sfx("kick");
        } else if (clickY >= 125) {
          if (toast) toast("🛡️ Cortile d'Armi: «I lastroni neri risuonano sotto i passi dei campioni.»");
        }
      } else if (bg === "bv_sorgente") {
        if (Math.abs(clickX - W / 2) < 60 && clickY > 105 && clickY < 175) {
          if (toast) toast("♨️ Bacino Termale: «L'acqua calda e turchese emana nuvole dense di vapore primordiale.»");
          sfx("crowd");
        } else if (clickX > W - 70 && clickY > 80) {
          if (toast) toast("🎭 Altare della Maschera della Lepre: «Il legno leggero freme con la rapidità del vento.»");
          sfx("chime");
        } else if (clickX < 75 && clickY < 85) {
          if (toast) toast("⚙️ Ingranaggi Titanici: «Le ruote di bronzo della fonderia sono parzialmente bloccate dal ghiaccio.»");
        }
      } else if (bg === "bv_trono") {
        if (Math.abs(clickX - W / 2) < 35 && clickY > 40 && clickY < 95) {
          if (toast) toast("👑 Lo Zar Moroz sul Trono di Brina: «Gli occhi cerulei scrutano ogni tuo battito di cuore.»");
          sfx("whistle");
        } else if (clickY < 50) {
          if (toast) toast("🌌 Volta Astrale di Belovodia: «L'aurora boreale pulsa in armonia con le tre maschere sacre.»");
          sfx("chime");
        } else if (clickX < 65 || clickX > W - 65) {
          if (toast) toast("🏛️ Colonne di Quarzo Glaciale: «Monoliti millenari che sorreggono il peso dell'inverno eterno.»");
        } else if (clickY >= 140) {
          if (toast) toast("⚽ Campo Runico del Gelo: «Il cerchio sacro dove si decide il destino della primavera.»");
        }
      } else if (bg === "bv_aurora") {
        if (clickY < 80) {
          if (toast) toast("✨ Fiamme dell'Aurora Boreale: «I veli verdi e cremisi riscaldano l'aria sopra le vette.»");
          sfx("chime");
        } else if (clickX < 50 || clickX > W - 50) {
          if (toast) toast("🦌 Porte dell'Alce Ancestrale: «Intagliate nel corno fossile a guardia del cielo.»");
        } else if (clickY >= 105) {
          if (toast) toast("🏔️ Altopiano del Disgelo: «Sotto la crosta di ghiaccio la terra comincia a germogliare.»");
          sfx("crowd");
        }
      } else if (bg === "feudi_consiglio") {
        if (clickY < H * 0.55 && Math.abs(clickX - W / 2) < 55) {
          if (toast) toast("⚖️ Bilancia del Giudizio: «Ogni piatto pesa il valore delle tue convinzioni.»");
          if (window.__bilanciaFeudi && window.__bilanciaFeudi.sfxScalesBalance) window.__bilanciaFeudi.sfxScalesBalance();
        } else if (clickY > H * 0.65) {
          if (toast) toast("📜 Tavolo del Gran Consiglio: «I trattati di Norzelia e le mappe dei tre feudi.»");
        } else if (clickX < 55) {
          if (toast) toast("🪟 Vetrata di Glenbrook: «Lo zaffiro e l'onore del principe Roland.»");
        } else if (clickX > W - 55) {
          if (toast) toast("🪟 Vetrata di Rosellia: «Il quarzo rosa e la speranza di Frederica.»");
        }
      } else if (bg === "feudi_mastio") {
        if (clickX < 70 && clickY > 115) {
          if (toast) toast("🔨 La Forgia d'Acciaio: «Il fuoco arde giorno e notte per le armate dei Wolffort!»");
          sfx("kick");
        } else if (clickY < 75 && Math.abs(clickX - W / 2) < 50) {
          if (toast) toast("🛡️ Sentinella dei Bastioni: «Il Mastio è sicuro, Lord Custode!»");
        } else if (clickX > W - 70 && clickY > 115) {
          if (toast) toast("🌾 Carro delle Provviste: «Sacchi di grano e riserve per il lungo assedio.»");
        } else if (clickY > 50 && clickY < 95) {
          if (toast) toast("🏘️ Il Borgo di Castel Wolffort: «I tetti fumanti delle case cittadine.»");
        }
      } else if (bg === "feudi_glenbrook") {
        if (clickY > 105) {
          if (toast) toast("🌊 Le Chiuse Fluviali: «Il flusso impetuoso del fiume che alimenta le valli.»");
          sfx("crowd");
        } else if (clickX < 85 && clickY < 95) {
          if (toast) toast("🗼 La Torre Idraulica: «Gli argani controllano le paratie di Glenbrook.»");
        } else if (clickX > W - 90 && clickY > 135) {
          if (toast) toast("⛵ Banchina dei Pescatori: «Le barche del popolo fluviale ormeggiate.»");
        }
      } else if (bg === "feudi_glacefort") {
        if (clickY < 75) {
          if (toast) toast("💎 Grotte di Cristallo: «Stalattiti di salgemma pura che brillano nel gelo.»");
        } else if (clickX > 130 && clickX < 195 && clickY > 130) {
          if (toast) toast("🛤️ Binari Minerari: «Vagonetti colmi di minerale sottratto alle cave.»");
        }
      } else if (bg === "feudi_colosseo") {
        if (clickY < 75) {
          if (toast) toast("👑 Tribuna Reale dei Feudi: «I sovrani di Norzelia attendono il campione.»");
          if (window.__bilanciaFeudi && window.__bilanciaFeudi.sfxFeudalFanfare) window.__bilanciaFeudi.sfxFeudalFanfare();
        } else if (clickY >= 75) {
          if (toast) toast("⚔️ Arena di Sabbia Dorata: «Dove il destino di tutte le casate viene sigillato!»");
        }
      } else if (bg === "rag_fiordo") {
        if (clickX > W - 110 && clickY > 70) {
          if (toast) toast("🐉 Prua della Drakkar: «La testa di drago intagliata nel pino nero sfida il pack ghiacciato da millenni.»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxHorn) window.__ragnarokStory.sfxHorn();
        } else if (clickX < 100 && clickY > 70) {
          if (toast) toast("🪵 Casa Lunga dello Jarl: «Travi imponenti e fumo di pece: qui si raduna il clan dei Lupi di Ragnar.»");
        } else if (clickY < 55) {
          if (toast) toast("🌌 Aurora Cremisi di Fimbulwinter: «Ceneri incandescenti e fiamme celesti dipingono il cielo degli dei caduti.»");
        } else if (Math.abs(clickX - 135) < 35 && clickY > 120) {
          if (toast) toast("🔥 Braciere Votivo Lavico: «Faville di magma primordiale che riscaldano il respiro dei mortali.»");
          sfx("kick");
        } else {
          if (toast) toast("❄️ Pack Ghiacciato di Midgard: «Sotto la banchisa si intravedono le vene fiammeggianti della terra.»");
        }
      } else if (bg === "rag_sala") {
        if (Math.abs(clickX - W / 2) < 45 && clickY < 140) {
          if (toast) toast("🔥 Camino Monumentale: «Ceppi titanici e fiamme vive: il calore tiene lontana la morsa del Fimbulwinter.»");
          sfx("kick");
        } else if (clickY < 85 && (clickX < 100 || clickX > W - 100)) {
          if (toast) toast("🛡️ Scudi dei Guerrieri Einherjar: «Emblemi di lupi, orsi e corvi scalfiti dalle battaglie del Ragnarok.»");
        } else if (clickY > H - 50) {
          if (toast) toast("🍺 Tavolata dello Jarl: «Corni colmi di idromele speziato per temprare il cuore dei campioni.»");
        } else {
          if (toast) toast("🦅 Stendardo del Corvo: «Munin veglia sulla sala, ricordando che il tempo degli eroi è giunto.»");
        }
      } else if (bg === "rag_arena") {
        if (Math.abs(clickY - 135) < 25) {
          if (toast) toast("🌋 Crepa Tellurica Fiammeggiante: «Il terreno è spaccato a metà: la Furia Berserker blocca gli avversari nella loro metà campo!»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxLava) window.__ragnarokStory.sfxLava();
        } else if (clickX < 60 || clickX > W - 60) {
          if (toast) toast("🥅 Porte in Ossa e Drakkar: «Travi di quercia marina e costole di balena boreale.»");
        } else if (clickY < 70) {
          if (toast) toast("🌌 Cielo di Cenere e Aurora: «Le Valchirie osservano ogni contrasto dall'alto di Vigrid.»");
        } else {
          if (toast) toast("⚽ Terreno Cerimoniale: «Permafrost duro come il ferro e lastre laviche roventi: qui si forgia la leggenda!»");
        }
      } else if (bg === "rag_fucine") {
        if (Math.abs(clickX - W / 2) < 40 && clickY > 100) {
          if (toast) toast("🔨 Incudine Titanica di Brokk: «Forgiata con ferro di meteorite caduto prima del tempo degli dei.»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxDrum) window.__ragnarokStory.sfxDrum();
        } else if (clickX < 90 && clickY > 80) {
          if (toast) toast("🔥 Fornace dei Nani: «Colate di metallo incandescente e fango primordiale per temprare i tacchetti.»");
        } else {
          if (toast) toast("🌋 Caverne di Nidavellir: «Nelle viscere della terra il freddo del Fimbulwinter non può penetrare.»");
        }
      } else if (bg === "rag_ponte") {
        if (Math.abs(clickY - 115) < 25) {
          if (toast) toast("🌉 Ponte di Pietra Lavica: «Un arco millenario sospeso sopra i fiumi ribollenti di magma.»");
        } else {
          if (toast) toast("🌋 Fiumi di Magma Fuso: «Il sangue caldo di Ymir scorre indomito nelle profondità oscure.»");
        }
      } else if (bg === "rag_forgia") {
        if (clickX < 60 || clickX > W - 60) {
          if (toast) toast("🥅 Porte in Ossidiana Nanica: «Intarsi d'oro runico e catene di ferro temprate nel fuoco.»");
        } else if (Math.abs(clickY - 135) < 20) {
          if (toast) toast("⚡ Canali di Lava Cerimoniali: «Definiscono i confini sacri della Fornace di Nidavellir.»");
        } else {
          if (toast) toast("⚽ Arena delle Scintille: «Basalto levigato che moltiplica la velocità di rotazione della sfera!»");
        }
      } else if (bg === "rag_vigrid") {
        if (clickX < 70 && clickY > 90) {
          if (toast) toast("🦌 Totem delle Corna d'Alce: «Intagliato nel legno runico prima del grande silenzio: le corna sfidano la bufera di cenere.»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxHorn) window.__ragnarokStory.sfxHorn();
        } else if (clickX > W - 70 && clickY > 100) {
          if (toast) toast("🕯️ Braciere delle Ceneri: «Fiamme votive accese in memoria degli eroi caduti nella prima fine del mondo.»");
          sfx("kick");
        } else if (Math.abs(clickY - 145) < 25) {
          if (toast) toast("🌋 Crepa Tellurica di Vigrid: «La fessura ribolle di magma primordiale: pronta per la Furia Berserker!»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxLava) window.__ragnarokStory.sfxLava();
        } else if (clickY < 75) {
          if (toast) toast("🌋 Cielo di Cenere e Vulcani: «La cenere ardente copre il firmamento di un manto rosso sangue.»");
        } else {
          if (toast) toast("❄️ Piana Desolata di Vigrid: «Il campo della battaglia cosmica, congelato in un limbo infinito.»");
        }
      } else if (bg === "rag_bifrost") {
        if (Math.abs(clickX - W / 2) < 40 && clickY > 80) {
          if (toast) toast("ᚦ Monolite delle Rivelazioni: «Vi è incisa la terribile verità: il Ragnarok è già accaduto, il mondo è un limbo congelato!»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxValkyrie) window.__ragnarokStory.sfxValkyrie();
        } else if (clickX < 90 || clickX > W - 90) {
          if (toast) toast("🌈 Frammenti del Bifrost: «Monoliti prismatici del ponte arcobaleno infranto che riflettono aurore cosmiche.»");
        } else {
          if (toast) toast("🌌 Voragine Astrale: «Sotto le rovine del ponte si apre il vuoto che separa i Nove Regni.»");
        }
      } else if (bg === "rag_cerchio_cenere") {
        if (Math.abs(clickY - 125) < 25) {
          if (toast) toast("💥 Crepe Telluriche del Cerchio: «Il tiro Berserker spacca la roccia isolando i difensori avversari!»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxLava) window.__ragnarokStory.sfxLava();
        } else if (clickX < 60 || clickX > W - 60) {
          if (toast) toast("🥅 Porte in Teschi e Drakkar: «Ossa titaniche e scudi del crepuscolo che segnano la meta dell'onore.»");
        } else {
          if (toast) toast("⚽ Rettangolo di Cenere: «La terra tremante dove solo i veri cuori indomiti possono prevalere.»");
        }
      } else if (bg === "rag_yggdrasil") {
        if (Math.abs(clickX - W / 2) < 55) {
          if (toast) toast("🌳 Radici Celesti di Yggdrasil: «Vene dorate e linfa di fuoco puro: l'Albero regge ancora la speranza dei Nove Regni.»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxDrum) window.__ragnarokStory.sfxDrum();
        } else if (clickY < 75) {
          if (toast) toast("🌌 Aurora Boreale Stellare: «Luce eterna che danza tra i rami cosmici sopra il Fimbulwinter.»");
        } else {
          if (toast) toast("🍃 Foglie d'Argento Cadute: «Ogni foglia racchiude una memoria del tempo prima del silenzio.»");
        }
      } else if (bg === "rag_cratere_sole") {
        if (Math.abs(clickX - W / 2) < 45 && clickY < 140) {
          if (toast) toast("☀️ Cratere del Sole di Pietra: «Il cuore fuso del mondo: calcia qui la Sfera per decidere il fato di Midgard!»");
          if (window.__ragnarokStory && window.__ragnarokStory.sfxHorn) window.__ragnarokStory.sfxHorn();
        } else {
          if (toast) toast("👑 Altare del Giudizio Divino: «Kara, Sigrid, Brokk e Ragnar attendono il tuo verdetto epico.»");
        }
      }
    });
  }

  // --- DISPATCHER PRINCIPALE DEGLI SCENARI ---
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (!window.isBgArtDetailed()) return false;
    const f = frame || 0;
    setupScenicCanvasInteraction();

    switch (kind) {
      case "rag_fiordo":
        drawDetailedRagnarokFiordo(g, W, H, f);
        return true;
      case "rag_sala":
        drawDetailedRagnarokSala(g, W, H, f);
        return true;
      case "rag_arena":
        drawDetailedRagnarokArena(g, W, H, f);
        return true;
      case "rag_fucine":
        drawDetailedRagnarokFucine(g, W, H, f);
        return true;
      case "rag_ponte":
        drawDetailedRagnarokPonte(g, W, H, f);
        return true;
      case "rag_forgia":
        drawDetailedRagnarokForgia(g, W, H, f);
        return true;
      case "rag_vigrid":
        drawDetailedRagnarokVigrid(g, W, H, f);
        return true;
      case "rag_bifrost":
        drawDetailedRagnarokBifrost(g, W, H, f);
        return true;
      case "rag_cerchio_cenere":
        drawDetailedRagnarokCerchioCenere(g, W, H, f);
        return true;
      case "rag_yggdrasil":
        drawDetailedRagnarokYggdrasil(g, W, H, f);
        return true;
      case "rag_cratere_sole":
        drawDetailedRagnarokCratereSole(g, W, H, f);
        return true;
      case "bv_villaggio":
        drawDetailedBelovodiaVillaggio(g, W, H, f);
        return true;
      case "bv_bottega":
        drawDetailedBelovodiaBottega(g, W, H, f);
        return true;
      case "bv_radura":
        drawDetailedBelovodiaRadura(g, W, H, f);
        return true;
      case "bv_lago":
        drawDetailedBelovodiaLago(g, W, H, f);
        return true;
      case "bv_caverna":
        drawDetailedBelovodiaCaverna(g, W, H, f);
        return true;
      case "bv_fortezza":
        drawDetailedBelovodiaFortezza(g, W, H, f);
        return true;
      case "bv_sorgente":
        drawDetailedBelovodiaSorgente(g, W, H, f);
        return true;
      case "bv_trono":
        drawDetailedBelovodiaTrono(g, W, H, f);
        return true;
      case "bv_aurora":
        drawDetailedBelovodiaAurora(g, W, H, f);
        return true;
      case "feudi_consiglio":
        drawDetailedFeudiConsiglio(g, W, H, f);
        return true;
      case "feudi_mastio":
        drawDetailedFeudiMastio(g, W, H, f);
        return true;
      case "feudi_glenbrook":
        drawDetailedFeudiGlenbrook(g, W, H, f);
        return true;
      case "feudi_glacefort":
        drawDetailedFeudiGlacefort(g, W, H, f);
        return true;
      case "feudi_colosseo":
        drawDetailedFeudiColosseo(g, W, H, f);
        return true;
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

// ================= IL LIBRO CHE MANGIAVA I FINALI · sfondi di scena (chiavi lb_*) =================
// Ogni sfondo ha elementi interattivi: si toccano sul disegno durante i dialoghi e rispondono con una frase
// (e spesso con un'azione: una candela che si spegne, un gufo che sbatte le palpebre, un mulino che accelera).
// I puntini luminosi segnalano cosa si può toccare. Il tocco non fa avanzare il dialogo.
(function () {
  "use strict";
  function px(g, x, y, w, h, col) { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function circ(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
  function ell(g, x, y, rx, ry, col, rot) { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); g.fill(); }
  function vgrad(g, x, y, w, h, stops) { const gr = g.createLinearGradient(x, y, x, y + h); stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s)); g.fillStyle = gr; g.fillRect(x, y, w, h); }
  function glowB(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  // macchia d'acquerello: ellissi sovrapposte trasparenti
  function blot(g, x, y, r, rgb, a, seed) { for (let i = 0; i < 4; i++) { const k = (seed || 1) * 7 + i * 13; ell(g, x + Math.sin(k) * r * 0.25, y + Math.cos(k) * r * 0.2, r * (0.7 + 0.1 * i), r * (0.45 + 0.08 * i), `rgba(${rgb},${a})`, k); } }
  function paperGrain(g, W, H, f, a) { for (let i = 0; i < 70; i++) px(g, (i * 97 + 13) % W, (i * 61 + 7) % H, 1, 1, i % 2 ? `rgba(120,90,50,${a})` : `rgba(255,255,255,${a})`); }
  function letterRain(g, W, H, f, col, n) { g.font = "8px Georgia, serif"; const L = "ABCDEFGHILMNOPQRSTUVZ"; for (let i = 0; i < (n || 14); i++) { const x = (i * 53 + Math.sin(f / 50 + i) * 12) % W, y = (i * 37 + f * (0.25 + (i % 3) * 0.1)) % H; g.fillStyle = col; g.save(); g.translate(x, y); g.rotate(Math.sin(f / 30 + i)); g.fillText(L[i % L.length], 0, 0); g.restore(); } }

  const S = { last: { k: "", t: 0, W: 320, H: 200 }, cap: null, capT: 0, act: {} };
  const now = () => performance.now();
  // frame trascorsi dall'ultima volta che un elemento è stato toccato (Infinity se mai)
  const since = (k, i) => { const t = S.act[k + ":" + i]; return t ? (now() - t) / 16 : Infinity; };
  const toggled = (k, i) => !!S.act["tog:" + k + ":" + i];

  // ---------------------------------------------------------------- COPERTINA (titolo della saga)
  function bgCopertina(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#1a1220", "#2a1c1a", "#1a120e"]);
    // finestra con pioggia
    px(g, 228, 14, 74, 70, "#0e1626"); px(g, 228, 14, 74, 2, "#5a3a22"); px(g, 228, 82, 74, 3, "#5a3a22"); px(g, 263, 14, 2, 70, "#5a3a22"); px(g, 228, 47, 74, 2, "#5a3a22");
    for (let i = 0; i < 18; i++) { const x = 230 + (i * 17) % 70, y = 16 + ((i * 29 + f * 1.6) % 64); px(g, x, y, 1, 4, "rgba(170,200,255,.45)"); }
    if (since("lb_copertina", 3) < 160) { g.font = "italic 7px Georgia, serif"; g.fillStyle = `rgba(200,220,255,${0.8 - since("lb_copertina", 3) / 200})`; g.fillText("aiuto", 238, 40); g.fillText("finisci", 268, 64); }
    // scrivania
    vgrad(g, 0, 120, W, 80, ["#5a3420", "#3a2014"]); for (let i = 0; i < 6; i++) px(g, 0, 128 + i * 12, W, 1, "rgba(0,0,0,.18)");
    // candela
    const lit = !toggled("lb_copertina", 0), fl = Math.sin(f / 6) * 1.5;
    px(g, 40, 92, 10, 30, "#efe6cf"); px(g, 36, 120, 18, 4, "#8a6a3a");
    if (lit) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 45, 86, 70, "255,190,110", 0.4); g.restore(); ell(g, 45, 86 + fl * 0.3, 3, 7, "#ffcf6a"); ell(g, 45, 88, 1.5, 3, "#fff6d0"); }
    else { for (let i = 0; i < 4; i++) ell(g, 45 + Math.sin(f / 20 + i) * 4, 84 - i * 6 - (f % 40) / 4, 3, 2, "rgba(200,200,210,.25)"); }
    // il libro chiuso, grande, con il morso
    const bx = 92, by = 96;
    px(g, bx + 4, by + 6, 140, 52, "rgba(0,0,0,.4)");
    px(g, bx, by, 140, 52, "#6a1f2a"); px(g, bx, by, 140, 4, "#8a2f3a"); px(g, bx, by + 48, 140, 4, "#4a141c");
    px(g, bx + 136, by + 4, 6, 46, "#f4ecd8"); for (let i = 0; i < 9; i++) px(g, bx + 137, by + 6 + i * 5, 4, 1, "#cdbf9f");
    g.strokeStyle = "#d9b45a"; g.lineWidth = 1; g.strokeRect(bx + 6, by + 6, 126, 40);
    g.fillStyle = "#e8c66a"; g.font = "bold 9px Georgia, serif"; g.textAlign = "center"; g.fillText("IL LIBRO CHE", bx + 70, by + 22); g.fillText("MANGIAVA I FINALI", bx + 70, by + 34); g.textAlign = "left";
    // morso sull'angolo
    g.fillStyle = "#2a1c1a"; g.beginPath(); g.arc(bx + 140, by, 12, Math.PI / 2, Math.PI); g.lineTo(bx + 140, by); g.fill();
    for (let i = 0; i < 4; i++) px(g, bx + 128 + i * 3, by + 10 - (i % 2) * 2, 2, 2, "#2a1c1a");
    if (since("lb_copertina", 2) < 90) { g.strokeStyle = "rgba(255,230,140,.8)"; g.beginPath(); g.arc(bx + 138, by + 2, 15, 0, Math.PI * 2); g.stroke(); }
    // calamaio e piuma
    px(g, 262, 118, 16, 12, "#1a1a2a"); px(g, 264, 114, 12, 5, "#2a2a3a"); ell(g, 270, 116, 5, 1.5, "#3a2a6a");
    const bob = Math.sin(f / 18) * (since("lb_copertina", 1) < 120 ? 4 : 1);
    g.strokeStyle = "#e8e0d0"; g.lineWidth = 2; g.beginPath(); g.moveTo(270, 116); g.quadraticCurveTo(290, 80 + bob, 300, 66 + bob); g.stroke(); px(g, 292, 70 + bob, 8, 2, "#f8f2e2");
    // gatto addormentato su una pila di libri
    px(g, 6, 130, 28, 6, "#5a7fa8"); px(g, 8, 124, 24, 6, "#c0644a"); px(g, 5, 118, 26, 6, "#d9a441");
    const awake = since("lb_copertina", 4) < 140, st = awake ? Math.sin(since("lb_copertina", 4) / 10) * 2 : 0;
    ell(g, 18, 112 - st, 11, 6, "#3a3a44"); circ(g, 10, 108 - st, 5, "#3a3a44"); px(g, 6, 102 - st, 3, 4, "#3a3a44"); px(g, 12, 102 - st, 3, 4, "#3a3a44");
    if (awake) { px(g, 8, 107 - st, 2, 2, "#ffd23f"); px(g, 12, 107 - st, 2, 2, "#ffd23f"); } else { g.fillStyle = "rgba(255,255,255,.6)"; g.font = "7px sans-serif"; g.fillText("z", 22, 100 - (f / 10) % 8); }
    letterRain(g, W, 120, f, "rgba(232,198,106,.25)", 10);
    paperGrain(g, W, H, f, 0.06);
  }
  // ---------------------------------------------------------------- LIBRERIA «IL SEGNALIBRO» (prologo)
  function bgLibreria(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#3a2418", "#2a180f"]);
    // scaffali
    for (let s = 0; s < 2; s++) { const x0 = s ? 214 : 0, w = 106; px(g, x0, 10, w, 120, "#4a2c1a"); for (let r = 0; r < 4; r++) { px(g, x0, 36 + r * 28, w, 3, "#2a180f"); for (let b = 0; b < 12; b++) { const bw = 5 + ((b * 7 + r * 3 + s) % 4), bh = 18 + ((b * 5 + r) % 6), cols = ["#8a2f3a", "#2f5a7a", "#c99a3a", "#3a6a4a", "#6a4a8a", "#d8c8a8"]; px(g, x0 + 4 + b * 8.5, 36 + r * 28 - bh, bw, bh, cols[(b + r * 2 + s) % cols.length]); px(g, x0 + 4 + b * 8.5, 36 + r * 28 - bh + 3, bw, 1, "rgba(255,230,160,.4)"); } } }
    // vetrina sulla strada con la pioggia
    px(g, 112, 14, 96, 78, "#0e1626"); vgrad(g, 114, 16, 92, 74, ["#1a2a44", "#0e1626"]);
    px(g, 112, 14, 96, 3, "#6a4a2a"); px(g, 112, 90, 96, 4, "#6a4a2a"); px(g, 158, 14, 3, 80, "#6a4a2a");
    for (let i = 0; i < 6; i++) { const lx = 120 + i * 15; glowB(g, lx, 70, 10, "255,200,120", 0.2); }
    for (let i = 0; i < 26; i++) { const x = 114 + (i * 23) % 92, y = 16 + ((i * 31 + f * 2) % 74); px(g, x, y, 1, 5, "rgba(170,200,255,.5)"); }
    g.fillStyle = "rgba(232,198,106,.85)"; g.font = "italic 8px Georgia, serif"; g.textAlign = "center"; g.fillText("Il Segnalibro", 160, 30); g.textAlign = "left";
    // campanello sopra la porta
    const ring = since("lb_libreria", 0) < 50 ? Math.sin(since("lb_libreria", 0)) * 4 * (1 - since("lb_libreria", 0) / 50) : 0;
    g.save(); g.translate(104, 16); g.rotate(ring / 10); px(g, -1, 0, 2, 6, "#c9a227"); ell(g, 0, 10, 5, 5, "#e8c66a"); g.restore();
    // pavimento e tappeto
    vgrad(g, 0, 130, W, 70, ["#5a3a24", "#3a2414"]); ell(g, 160, 170, 110, 18, "#7a2a2a"); ell(g, 160, 170, 98, 13, "#8a3a2a");
    // leggio con il libro che brilla
    px(g, 154, 128, 12, 40, "#3a2414"); px(g, 132, 118, 56, 14, "#f4ecd8"); px(g, 159, 118, 2, 14, "#cdbf9f");
    g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 160, 118, 46 + Math.sin(f / 15) * 6 + (since("lb_libreria", 3) < 80 ? 20 : 0), "255,215,140", 0.45); g.restore();
    letterRain(g, W, H, f, "rgba(255,215,140,.35)", 8);
    // cartello «torno subito»
    px(g, 252, 136, 54, 26, "#e8d6b0"); px(g, 252, 136, 54, 2, "#6a4a2a"); g.fillStyle = "#3a2414"; g.font = "7px Georgia, serif"; g.fillText("Torno subito", 257, 147); g.fillText("(dal 1987)", 262, 157);
    // lampada
    px(g, 20, 140, 4, 40, "#2a1a10"); ell(g, 22, 140, 14, 6, "#c99a3a"); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 22, 146, 40, "255,200,120", toggled("lb_libreria", 4) ? 0.05 : 0.35); g.restore();
    paperGrain(g, W, H, f, 0.05);
  }
  // ---------------------------------------------------------------- RADURA DELLA PRIMA PAGINA (acquerello)
  function bgRadura(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#f6e6c8", "#f4ecd8", "#e8f0d8"]);
    // sole a macchia d'inchiostro dorato
    const sp = since("lb_radura", 0) < 120 ? 1 + 0.25 * Math.sin(since("lb_radura", 0) / 6) : 1;
    blot(g, 262, 40, 22 * sp, "246,190,90", 0.22, 3); circ(g, 262, 40, 12 * sp, "rgba(246,190,90,.55)");
    // colline ad acquerello
    blot(g, 60, 112, 90, "150,190,130", 0.35, 1); blot(g, 210, 118, 110, "130,175,120", 0.35, 2); blot(g, 320, 110, 70, "160,200,140", 0.3, 4);
    // il grande libro aperto all'orizzonte: le pagine fanno da prato
    g.fillStyle = "#fbf7ec"; g.beginPath(); g.moveTo(10, 150); g.quadraticCurveTo(80, 128, 160, 142); g.quadraticCurveTo(240, 128, 310, 150); g.lineTo(310, 200); g.lineTo(10, 200); g.fill();
    g.strokeStyle = "rgba(59,58,74,.25)"; g.lineWidth = 1; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(26, 160 + i * 8); g.quadraticCurveTo(90, 146 + i * 8, 150, 156 + i * 8); g.stroke(); g.beginPath(); g.moveTo(170, 156 + i * 8); g.quadraticCurveTo(230, 146 + i * 8, 294, 160 + i * 8); g.stroke(); }
    px(g, 159, 142, 2, 58, "rgba(59,58,74,.3)");
    // il fiume bianco: un pezzo di pagina mangiato
    g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(186, 150); g.lineTo(204, 148); g.lineTo(214, 200); g.lineTo(194, 200); g.fill();
    for (let i = 0; i < 6; i++) px(g, 186 + i * 3, 148 + i * 9, 2, 2, "rgba(59,58,74,.4)");
    // mulino a vento di carta
    const mv = since("lb_radura", 2) < 200 ? 0.25 : 0.04;
    S.mill = (S.mill || 0) + mv;
    px(g, 60, 88, 10, 36, "#e8d6b0"); px(g, 58, 84, 14, 6, "#c0644a");
    for (let i = 0; i < 4; i++) { const a = S.mill + i * Math.PI / 2; g.save(); g.translate(65, 88); g.rotate(a); px(g, 0, -1, 22, 4, "#fbf7ec"); g.strokeStyle = "rgba(59,58,74,.4)"; g.strokeRect(0, -1, 22, 4); g.restore(); }
    // coniglio di carta che saltella
    const hop = since("lb_radura", 1) < 80 ? Math.abs(Math.sin(since("lb_radura", 1) / 8)) * 14 : Math.abs(Math.sin(f / 30)) * 2;
    const rx = 112 + (since("lb_radura", 1) < 80 ? since("lb_radura", 1) / 2 : 0);
    ell(g, rx, 146, 7, 2, "rgba(0,0,0,.12)"); ell(g, rx, 138 - hop, 7, 5, "#fbf7ec"); circ(g, rx + 6, 133 - hop, 4, "#fbf7ec"); px(g, rx + 5, 124 - hop, 2, 7, "#fbf7ec"); px(g, rx + 8, 125 - hop, 2, 6, "#fbf7ec"); px(g, rx + 7, 132 - hop, 1, 1, "#3b3a4a");
    g.strokeStyle = "rgba(59,58,74,.45)"; g.beginPath(); g.ellipse(rx, 138 - hop, 7, 5, 0, 0, Math.PI * 2); g.stroke();
    // lettere che cadono come petali (toccate: si radunano in una parola)
    if (since("lb_radura", 3) < 150) { g.font = "bold 12px Georgia, serif"; g.fillStyle = `rgba(59,58,74,${Math.min(1, (150 - since("lb_radura", 3)) / 60)})`; g.textAlign = "center"; g.fillText("C'ERA UNA VOLTA", 160, 70); g.textAlign = "left"; }
    else letterRain(g, W, 140, f, "rgba(59,58,74,.35)", 16);
    // fiori
    for (let i = 0; i < 16; i++) { const x = 14 + i * 19, y = 166 + (i * 7) % 24; circ(g, x, y, 2, ["#f2a5b8", "#ffe28a", "#c9a7f2", "#ffffff"][i % 4]); px(g, x, y + 2, 1, 4, "#7aab6e"); }
    paperGrain(g, W, H, f, 0.08);
  }
  // ---------------------------------------------------------------- BOSCO DEL LUPO (acquerello al tramonto)
  function bgBosco(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#f2c9a8", "#d9a8b8", "#8a7aa8"]);
    blot(g, 80, 30, 40, "255,220,170", 0.25, 5);
    // alberi lontani e vicini
    for (let i = 0; i < 9; i++) { const x = i * 40 + 10, h = 70 + (i * 17) % 30; ell(g, x, 150 - h, 22, h * 0.6, "rgba(90,110,120,.35)"); }
    vgrad(g, 0, 140, W, 60, ["#6a8a6a", "#4a6a50"]);
    for (let i = 0; i < 5; i++) { const x = [12, 70, 250, 300, 190][i]; px(g, x - 3, 70, 7, 80, "#5a4030"); blot(g, x, 70, 30, "70,110,80", 0.55, i + 7); }
    // la casetta del Lupo
    const smoke = since("lb_bosco", 0) < 120 ? 2 : 1;
    px(g, 120, 104, 70, 46, "#c49a6a"); for (let i = 0; i < 6; i++) px(g, 120, 108 + i * 7, 70, 1, "rgba(80,50,25,.4)");
    g.fillStyle = "#8a3a2a"; g.beginPath(); g.moveTo(112, 106); g.lineTo(155, 76); g.lineTo(198, 106); g.fill();
    px(g, 170, 80, 10, 18, "#7a6a5a");
    for (let i = 0; i < 4 * smoke; i++) { const t = ((f / 60 + i / (4 * smoke)) % 1); ell(g, 175 + Math.sin(t * 6 + i) * 6, 76 - t * 50, 4 + t * 8, 3 + t * 5, `rgba(240,240,250,${0.45 * (1 - t)})`); }
    px(g, 148, 124, 14, 26, "#5a3a22"); px(g, 128, 114, 12, 10, "#ffe7a3"); px(g, 170, 114, 12, 10, "#ffe7a3"); px(g, 133, 114, 1, 10, "#5a3a22"); px(g, 175, 114, 1, 10, "#5a3a22");
    g.fillStyle = "#3b3a4a"; g.font = "italic 6px Georgia, serif"; g.fillText("Sig. Lupo", 140, 100);
    // gufo sul ramo
    const blink = since("lb_bosco", 1) < 40 || (f % 220) < 6;
    px(g, 236, 66, 40, 3, "#5a4030"); ell(g, 254, 56, 8, 11, "#8a7060"); circ(g, 250, 52, 3.5, "#fff6d0"); circ(g, 258, 52, 3.5, "#fff6d0");
    if (blink) { px(g, 246, 52, 8, 1, "#3b3a4a"); px(g, 254, 52, 8, 1, "#3b3a4a"); } else { circ(g, 250, 52, 1.5, "#3b3a4a"); circ(g, 258, 52, 1.5, "#3b3a4a"); }
    px(g, 252, 47, 2, 3, "#d9a441"); px(g, 248, 43, 2, 3, "#8a7060"); px(g, 258, 43, 2, 3, "#8a7060");
    // lucciole
    const many = since("lb_bosco", 2) < 200 ? 26 : 10;
    for (let i = 0; i < many; i++) { const x = (i * 47 + Math.sin(f / 40 + i) * 20 + 320) % 320, y = 120 + Math.sin(f / 30 + i * 2) * 30 + (i % 3) * 10; g.save(); g.globalCompositeOperation = "lighter"; glowB(g, x, y, 6, "255,240,150", (Math.sin(f / 10 + i) + 1) * 0.25); g.restore(); }
    // funghi
    for (let i = 0; i < 4; i++) { const x = 40 + i * 22, grow = since("lb_bosco", 3) < 100 && i === 2 ? 1.6 : 1; px(g, x - 1, 166 - 6 * grow, 3, 6 * grow, "#f4ecd8"); g.fillStyle = "#d9534f"; g.beginPath(); g.ellipse(x, 166 - 6 * grow, 6 * grow, 4 * grow, 0, Math.PI, 0); g.fill(); circ(g, x - 2, 163 - 6 * grow, 1, "#fff"); }
    // sentiero buio
    g.fillStyle = "rgba(20,18,28,.55)"; g.beginPath(); g.moveTo(286, 200); g.quadraticCurveTo(300, 160, 320, 150); g.lineTo(320, 200); g.fill();
    if (since("lb_bosco", 4) < 120) { circ(g, 304, 168, 1.5, "#ffd23f"); circ(g, 309, 168, 1.5, "#ffd23f"); }
    paperGrain(g, W, H, f, 0.07);
  }
  // ---------------------------------------------------------------- CAMPO DEI TRE PORCELLINI
  function bgCampo3p(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#cfe3f2", "#eef4f0"]);
    blot(g, 60, 26, 26, "255,255,255", 0.6, 2); blot(g, 220, 18, 30, "255,255,255", 0.6, 6);
    vgrad(g, 0, 120, W, 80, ["#a2cf8b", "#8abd75"]);
    for (let i = 0; i < 8; i++) px(g, i * 40, 120, 20, 80, "rgba(255,255,255,.07)");
    g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 1.5; g.strokeRect(20, 130, 280, 62); g.beginPath(); g.moveTo(160, 130); g.lineTo(160, 192); g.stroke(); g.beginPath(); g.ellipse(160, 161, 20, 10, 0, 0, Math.PI * 2); g.stroke();
    // casa di paglia (traballa)
    const wob = since("lb_campo3p", 0) < 90 ? Math.sin(since("lb_campo3p", 0) / 3) * 3 : Math.sin(f / 40) * 0.6;
    g.save(); g.translate(52, 118); g.rotate(wob / 40);
    px(g, -26, -34, 52, 34, "#e8c46a"); for (let i = -26; i < 26; i += 3) px(g, i, -34, 1, 34, "rgba(150,110,40,.35)");
    g.fillStyle = "#d9b04a"; g.beginPath(); g.moveTo(-32, -32); g.lineTo(0, -56); g.lineTo(32, -32); g.fill(); px(g, -6, -18, 12, 18, "#8a6a3a"); g.restore();
    // casa di legno
    px(g, 132, 70, 56, 48, "#b98a5a"); for (let i = 0; i < 7; i++) px(g, 132, 74 + i * 7, 56, 1, "rgba(80,50,25,.45)");
    g.fillStyle = "#7a4a2a"; g.beginPath(); g.moveTo(126, 72); g.lineTo(160, 48); g.lineTo(194, 72); g.fill(); px(g, 153, 96, 14, 22, "#5a3a22");
    const lit = toggled("lb_campo3p", 1); px(g, 138, 82, 10, 8, lit ? "#ffe7a3" : "#4a3a2a"); px(g, 172, 82, 10, 8, lit ? "#ffe7a3" : "#4a3a2a");
    // casa di mattoni con la bandiera
    px(g, 238, 64, 64, 54, "#c0644a"); for (let r = 0; r < 9; r++) { px(g, 238, 68 + r * 6, 64, 1, "rgba(120,40,30,.45)"); for (let c = 0; c < 8; c++) px(g, 240 + c * 8 + (r % 2) * 4, 64 + r * 6, 1, 6, "rgba(120,40,30,.35)"); }
    g.fillStyle = "#8a3a2a"; g.beginPath(); g.moveTo(232, 66); g.lineTo(270, 40); g.lineTo(308, 66); g.fill(); px(g, 262, 94, 16, 24, "#5a3a22");
    const fw = since("lb_campo3p", 2) < 120 ? 3 : 1; px(g, 284, 20, 2, 26, "#5a5a5a");
    g.fillStyle = "#f2a5b8"; g.beginPath(); g.moveTo(286, 20); for (let i = 0; i <= 6; i++) g.lineTo(286 + i * 4, 22 + Math.sin(f / 8 * fw + i) * 2 * fw); g.lineTo(310, 32); g.lineTo(286, 32); g.fill();
    // tabellone
    px(g, 92, 100, 30, 18, "#2a2a33"); px(g, 94, 102, 26, 14, "#101018"); g.fillStyle = since("lb_campo3p", 3) < 120 ? "#ff8a3d" : "#ffd23f"; g.font = "bold 8px monospace"; g.fillText(since("lb_campo3p", 3) < 120 ? "???" : "0:0", 98, 113);
    // bandierine sulla staccionata
    for (let i = 0; i < 14; i++) { const x = 8 + i * 22, y = 124 + Math.sin(i) * 2, sw = since("lb_campo3p", 4) < 100 ? Math.sin(f / 4 + i) * 3 : 0; g.fillStyle = ["#f2a5b8", "#ffe28a", "#8fb8d8", "#c9a7f2"][i % 4]; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10, y); g.lineTo(x + 5 + sw, y + 8); g.fill(); }
    paperGrain(g, W, H, f, 0.07);
  }

  // ---------------------------------------------------------------- CAPITOLO 2 · XILOGRAFIA (crema, nero, rosso)
  const XK = "#1d1a17", XC = "#efe5cf", XR = "#a8231f";
  function hatch(g, x, y, w, h, gap, col, slope) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = col; g.lineWidth = 1; g.beginPath(); for (let i = -h; i < w + h; i += gap) { g.moveTo(x + i, y); g.lineTo(x + i + h * (slope || 1), y + h); } g.stroke(); g.restore(); }
  function cardShape(g, x, y, w, h, suit, red, rot) {
    g.save(); g.translate(x, y); g.rotate(rot || 0);
    px(g, -w / 2 + 2, -h / 2 + 2, w, h, "rgba(29,26,23,.45)"); px(g, -w / 2, -h / 2, w, h, "#f8f2e2"); g.strokeStyle = XK; g.lineWidth = 1; g.strokeRect(-w / 2 + 0.5, -h / 2 + 0.5, w - 1, h - 1);
    g.fillStyle = red ? XR : XK; g.font = `bold ${Math.round(h * 0.42)}px serif`; g.textAlign = "center"; g.fillText(suit, 0, h * 0.15); g.font = `bold ${Math.round(h * 0.18)}px serif`; g.fillText(suit, -w / 2 + 4, -h / 2 + h * 0.2); g.textAlign = "left"; g.restore();
  }
  function bgCorte(g, W, H, f) {
    px(g, 0, 0, W, H, XC); hatch(g, 0, 0, W, 70, 5, "rgba(29,26,23,.18)", 0.6);
    // sole inciso
    g.strokeStyle = XK; g.lineWidth = 1; g.beginPath(); g.arc(270, 34, 16, 0, Math.PI * 2); g.stroke(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + f / 300; g.beginPath(); g.moveTo(270 + Math.cos(a) * 19, 34 + Math.sin(a) * 19); g.lineTo(270 + Math.cos(a) * 25, 34 + Math.sin(a) * 25); g.stroke(); }
    // castello di carte (torri di carte appoggiate a triangolo)
    const fall = since("lb_corte", 0) < 70 ? Math.sin(since("lb_corte", 0) / 4) * 0.12 * (1 - since("lb_corte", 0) / 70) : 0;
    for (let lv = 0; lv < 4; lv++) for (let i = 0; i < 4 - lv; i++) { const cx = 112 + i * 26 + lv * 13, cy = 116 - lv * 30; cardShape(g, cx - 6, cy, 16, 30, lv % 2 ? "♥" : "♠", lv % 2 === 1, -0.33 + fall); cardShape(g, cx + 6, cy, 16, 30, lv % 2 ? "♠" : "♥", lv % 2 === 0, 0.33 - fall); }
    px(g, 180, 4, 2, 16, XK); g.fillStyle = XR; g.beginPath(); g.moveTo(182, 4); g.lineTo(196, 8 + Math.sin(f / 8) * 2); g.lineTo(182, 13); g.fill();
    // terreno
    px(g, 0, 132, W, 68, "#e2d6bb"); for (let i = 0; i < 9; i++) px(g, 0, 140 + i * 7, W, 1, "rgba(29,26,23,.25)");
    // rose dipinte (a sinistra) e il giardiniere
    for (let i = 0; i < 7; i++) { const x = 12 + i * 12, y = 122 + (i % 2) * 6, painted = since("lb_corte", 1) < 200 && i < 4; circ(g, x, y, 4, painted ? XK : XR); g.strokeStyle = XC; g.beginPath(); g.arc(x, y, 2, 0, 5); g.stroke(); px(g, x, y + 4, 1, 8, XK); }
    px(g, 92, 108, 10, 18, "#f8f2e2"); g.strokeStyle = XK; g.strokeRect(92.5, 108.5, 9, 17); g.fillStyle = XR; g.font = "bold 8px serif"; g.fillText("7", 94, 120); circ(g, 97, 104, 4, "#f2d0b0"); px(g, 100, 112, 8, 2, XK); px(g, 106, 110, 3, 3, since("lb_corte", 1) < 200 ? XK : XR);
    // soldato di picche di guardia (a destra) — saluta se toccato
    const sal = since("lb_corte", 2) < 60;
    px(g, 250, 96, 16, 30, "#f8f2e2"); g.strokeStyle = XK; g.strokeRect(250.5, 96.5, 15, 29); g.fillStyle = XK; g.font = "bold 12px serif"; g.fillText("♠", 253, 116); circ(g, 258, 91, 5, "#f2d0b0"); px(g, 254, 86, 8, 3, XK);
    px(g, 268, sal ? 82 : 92, 2, sal ? 16 : 30, XK); if (sal) px(g, 264, 82, 6, 2, XK); else { g.fillStyle = XK; g.beginPath(); g.moveTo(266, 92); g.lineTo(269, 84); g.lineTo(272, 92); g.fill(); }
    // fontana con le carte che galleggiano
    ell(g, 200, 150, 30, 8, XK); ell(g, 200, 149, 27, 6, "#3a332c"); for (let i = 0; i < 3; i++) cardShape(g, 188 + i * 12, 148 + Math.sin(f / 20 + i) * 1.5, 6, 9, i % 2 ? "♥" : "♠", i % 2, Math.sin(f / 30 + i) * 0.4);
    px(g, 198, 120, 4, 26, XK); for (let i = 0; i < 6; i++) px(g, 199 + Math.sin(f / 6 + i) * 6, 118 - ((f / 2 + i * 5) % 26), 1, 2, "rgba(29,26,23,.6)");
    // bandierine
    for (let i = 0; i < 12; i++) { const x = 6 + i * 27; g.fillStyle = i % 2 ? XR : XK; g.beginPath(); g.moveTo(x, 4); g.lineTo(x + 12, 4); g.lineTo(x + 6, 14 + Math.sin(f / 10 + i)); g.fill(); }
    // il Jolly che fa capolino (tocca: fa una capriola)
    const jr = since("lb_corte", 3) < 50 ? since("lb_corte", 3) / 50 * Math.PI * 2 : 0;
    g.save(); g.translate(300, 150); g.rotate(jr); px(g, -5, -10, 10, 14, XR); px(g, -5, -10, 5, 14, XK); circ(g, 0, -14, 4, "#f2d0b0"); g.fillStyle = XR; g.beginPath(); g.moveTo(-6, -17); g.lineTo(-10, -24); g.lineTo(0, -18); g.lineTo(10, -24); g.lineTo(6, -17); g.fill(); g.restore();
    paperGrain(g, W, H, f, 0.08);
  }
  function bgTrono(g, W, H, f) {
    px(g, 0, 0, W, H, "#2a2420"); hatch(g, 0, 0, W, H, 4, "rgba(239,229,207,.08)", 1);
    // vetrate a forma di semi
    [["♠", 60, false], ["♥", 260, true]].forEach(([s, x, red], i) => { px(g, x - 22, 16, 44, 70, XC); g.strokeStyle = XK; g.lineWidth = 2; g.strokeRect(x - 22, 16, 44, 70); hatch(g, x - 20, 18, 40, 66, 6, "rgba(29,26,23,.25)", -1); g.fillStyle = red ? XR : XK; g.font = "bold 34px serif"; g.textAlign = "center"; g.fillText(s, x, 64); g.textAlign = "left"; if (since("lb_trono", i) < 90) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, x, 50, 50, "239,229,207", 0.4); g.restore(); } });
    // tappeto rosso e trono
    g.fillStyle = XR; g.beginPath(); g.moveTo(140, 200); g.lineTo(180, 200); g.lineTo(170, 110); g.lineTo(150, 110); g.fill(); hatch(g, 140, 110, 40, 90, 5, "rgba(29,26,23,.3)", 0.2);
    px(g, 136, 50, 48, 64, XK); px(g, 142, 56, 36, 52, XC); g.fillStyle = XK; g.font = "bold 26px serif"; g.textAlign = "center"; g.fillText("♠", 160, 92); g.textAlign = "left"; px(g, 132, 44, 56, 8, XR);
    // il leggio con l'invito sigillato
    px(g, 218, 120, 6, 50, XK); px(g, 204, 112, 34, 12, XC); g.strokeStyle = XK; g.strokeRect(204.5, 112.5, 33, 11); circ(g, 221, 118, 3, XR);
    if (since("lb_trono", 2) < 80) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 221, 118, 24, "255,200,160", 0.5); g.restore(); }
    // candelabri
    [[100, 130], [222, 74]].forEach(([x, y], i) => { px(g, x - 1, y, 3, 40, XC); const on = !toggled("lb_trono", 3) || i; if (on) { ell(g, x, y - 4 + Math.sin(f / 7 + i), 2, 5, "#ffcf6a"); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, x, y - 4, 26, "255,200,120", 0.3); g.restore(); } });
    paperGrain(g, W, H, f, 0.05);
  }
  function bgLabirinto(g, W, H, f) {
    px(g, 0, 0, W, H, "#2a2420");
    // cielo notturno inciso e luna
    hatch(g, 0, 0, W, 90, 3, "rgba(239,229,207,.12)", 0.3);
    const moon = since("lb_labirinto", 0) < 150; circ(g, 60, 34, 18, XC); if (!moon) circ(g, 68, 30, 16, "#2a2420"); hatch(g, 42, 16, 36, 36, 5, "rgba(29,26,23,.2)", 1);
    for (let i = 0; i < 20; i++) px(g, (i * 71) % W, (i * 23) % 80, 1, 1, (f / 20 + i) % 6 < 1 ? XC : "rgba(239,229,207,.5)");
    // siepi in prospettiva (corridoio)
    g.fillStyle = "#3a5a3a"; g.beginPath(); g.moveTo(0, 60); g.lineTo(120, 92); g.lineTo(120, 150); g.lineTo(0, 200); g.fill();
    g.beginPath(); g.moveTo(W, 60); g.lineTo(200, 92); g.lineTo(200, 150); g.lineTo(W, 200); g.fill();
    hatch(g, 0, 60, 120, 140, 4, "rgba(29,26,23,.55)", -0.5); hatch(g, 200, 60, 120, 140, 4, "rgba(29,26,23,.55)", 0.5);
    px(g, 120, 92, 80, 58, "#2f4a30"); hatch(g, 120, 92, 80, 58, 3, "rgba(29,26,23,.5)", 1);
    g.fillStyle = "#cfc3a6"; g.beginPath(); g.moveTo(120, 150); g.lineTo(200, 150); g.lineTo(W, 200); g.lineTo(0, 200); g.fill(); for (let i = 0; i < 6; i++) px(g, 0, 156 + i * 8, W, 1, "rgba(29,26,23,.3)");
    // la tana del Gommapane, in fondo: due occhietti
    ell(g, 160, 140, 16, 8, XK); const peek = since("lb_labirinto", 1) < 120;
    if (peek) { ell(g, 160, 134, 12, 9, "#b8b0a8"); circ(g, 156, 132, 2, XK); circ(g, 164, 132, 2, XK); px(g, 157, 137, 6, 1, XK); } else if ((f / 60 | 0) % 3 !== 0) { circ(g, 155, 139, 1.5, XC); circ(g, 165, 139, 1.5, XC); }
    // fiume d'inchiostro che scorre in primo piano
    const dam = since("lb_labirinto", 2) < 100;
    g.fillStyle = XK; g.beginPath(); g.moveTo(0, 176); for (let x = 0; x <= W; x += 10) g.lineTo(x, 176 + Math.sin(x / 20 + f / (dam ? 60 : 12)) * 3); g.lineTo(W, 196); g.lineTo(0, 196); g.fill();
    for (let i = 0; i < 10; i++) px(g, (i * 37 + f * (dam ? 0.1 : 1.2)) % W, 184 + (i % 3) * 3, 6, 1, XC);
    // rose nere sulle siepi
    for (let i = 0; i < 6; i++) { const x = 20 + i * 15, y = 100 + i * 12, b = since("lb_labirinto", 3) < 80 ? 1.5 : 1; circ(g, x, y, 3 * b, i % 2 ? XR : XC); circ(g, W - x, y, 3 * b, i % 2 ? XC : XR); }
    paperGrain(g, W, H, f, 0.05);
  }
  function bgTorneo(g, W, H, f) {
    px(g, 0, 0, W, H, XC); hatch(g, 0, 0, W, 40, 6, "rgba(29,26,23,.15)", 0.4);
    // tribune incise piene di carte-tifosi
    for (let r = 0; r < 4; r++) { px(g, 0, 40 + r * 16, W, 15, r % 2 ? "#e2d6bb" : "#d8cbac"); for (let i = 0; i < 26; i++) { const x = 4 + i * 12 + (r % 2) * 6, jump = since("lb_torneo", 0) < 90 ? Math.abs(Math.sin(f / 4 + i)) * 4 : 0; px(g, x, 44 + r * 16 - jump, 7, 10, (i + r) % 3 ? "#f8f2e2" : XR); g.strokeStyle = XK; g.strokeRect(x + 0.5, 44.5 + r * 16 - jump, 6, 9); } }
    // palco reale con lo stendardo della Regina
    px(g, 128, 22, 64, 24, XK); px(g, 132, 26, 56, 18, XR); g.fillStyle = XC; g.font = "bold 14px serif"; g.textAlign = "center"; g.fillText("♠", 160, 41); g.textAlign = "left";
    const flap = since("lb_torneo", 1) < 120 ? 3 : 1; for (let i = 0; i < 2; i++) { const x = i ? 196 : 112; px(g, x, 2, 2, 30, XK); g.fillStyle = XR; g.beginPath(); g.moveTo(x + 2, 2); for (let k = 0; k <= 5; k++) g.lineTo(x + 2 + k * 3, 4 + Math.sin(f / 8 * flap + k) * flap); g.lineTo(x + 17, 14); g.lineTo(x + 2, 14); g.fill(); }
    // campo inciso
    px(g, 0, 104, W, 96, "#e6dac0"); for (let i = 0; i < 8; i++) hatch(g, i * 40, 104, 20, 96, 6, "rgba(29,26,23,.12)", 0.2);
    g.strokeStyle = XK; g.lineWidth = 1.5; g.strokeRect(16, 112, 288, 82); g.beginPath(); g.moveTo(160, 112); g.lineTo(160, 194); g.stroke(); g.beginPath(); g.ellipse(160, 153, 22, 12, 0, 0, Math.PI * 2); g.stroke();
    // la porta della Regina (a destra): una saracinesca di carte
    const shut = !toggled("lb_torneo", 2); px(g, 290, 128, 22, 50, "rgba(29,26,23,.15)"); g.strokeStyle = XK; g.strokeRect(290.5, 128.5, 21, 49); if (shut) for (let i = 0; i < 4; i++) cardShape(g, 301, 136 + i * 11, 18, 10, i % 2 ? "♥" : "♠", i % 2, 0);
    // tabellone «0 : 0 dal 1450»
    px(g, 24, 80, 50, 22, XK); g.fillStyle = since("lb_torneo", 3) < 120 ? XR : XC; g.font = "bold 9px monospace"; g.fillText(since("lb_torneo", 3) < 120 ? "MAI!" : "0 : 0", 34, 94); g.fillStyle = XC; g.font = "6px serif"; g.fillText("subiti dal 1450", 27, 101);
    // il Jolly telecronista con il cono
    px(g, 250, 82, 12, 16, XR); px(g, 250, 82, 6, 16, XK); circ(g, 256, 78, 4, "#f2d0b0"); g.fillStyle = XK; g.beginPath(); g.moveTo(262, 80); g.lineTo(276, 74); g.lineTo(276, 86); g.fill();
    if (since("lb_torneo", 4) < 100) { g.fillStyle = XK; g.font = "bold 8px serif"; g.fillText("CHE PARATAAA!", 230, 70); }
    paperGrain(g, W, H, f, 0.07);
  }

  // ---------------------------------------------------------------- CAPITOLO 3 · FUMETTO (contorni neri, retino, colori pieni)
  const FK = "#111111";
  function halftone(g, x, y, w, h, col, step, r) { g.fillStyle = col; for (let yy = y; yy < y + h; yy += step) for (let xx = x + ((yy - y) / step % 2) * step / 2; xx < x + w; xx += step) { g.beginPath(); g.arc(xx, yy, r, 0, Math.PI * 2); g.fill(); } }
  function boxO(g, x, y, w, h, fill, lw) { px(g, x, y, w, h, fill); g.strokeStyle = FK; g.lineWidth = lw || 2; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
  function bubble(g, x, y, w, h, txt, tailX, tailY, col) {
    g.fillStyle = col || "#ffffff"; g.strokeStyle = FK; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    if (tailX != null) { g.beginPath(); g.moveTo(x - 5, y + h / 2 - 2); g.lineTo(tailX, tailY); g.lineTo(x + 5, y + h / 2 - 2); g.fill(); g.stroke(); g.fillRect(x - 5, y + h / 2 - 5, 10, 4); }
    if (txt) { g.fillStyle = FK; g.font = "bold 9px sans-serif"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.textAlign = "left"; }
  }
  function boom(g, x, y, r, txt, col, rot) { g.save(); g.translate(x, y); g.rotate(rot || -0.15); g.fillStyle = col || "#ffd95a"; g.strokeStyle = FK; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 24; i++) { const rr = i % 2 ? r * 0.62 : r, a = i / 24 * Math.PI * 2; g.lineTo(Math.cos(a) * rr * 1.3, Math.sin(a) * rr * 0.8); } g.closePath(); g.fill(); g.stroke(); g.font = `900 ${Math.round(r * 0.6)}px Impact, sans-serif`; g.textAlign = "center"; g.fillStyle = "#e63946"; g.lineWidth = 3; g.strokeStyle = "#fff"; g.strokeText(txt, 0, r * 0.22); g.fillText(txt, 0, r * 0.22); g.textAlign = "left"; g.restore(); }
  function bgVignette(g, W, H, f) {
    px(g, 0, 0, W, H, "#7cc4ff"); halftone(g, 0, 0, W, 90, "rgba(255,255,255,.35)", 8, 1.5);
    // palazzi a fumetto
    const B = [[0, 40, 60, "#e63946"], [56, 20, 54, "#ffd95a"], [106, 52, 46, "#4aa3df"], [208, 30, 56, "#7ed957"], [260, 46, 60, "#f28482"]];
    B.forEach(([x, y, w, c], i) => { boxO(g, x, y, w, 130 - y + 20, c, 3); for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) { const lit = (i + r + k) % 3 === 0 || (since("lb_vignette", 1) < 150 && i === 3); boxO(g, x + 8 + k * (w - 16) / 3, y + 10 + r * 20, (w - 16) / 3 - 4, 12, lit ? "#fff4b0" : "#2b2d42", 1.5); } });
    // il cartellone del cinema (BOOM!) al centro dietro
    boxO(g, 150, 10, 60, 40, "#fffbea", 3); g.fillStyle = FK; g.font = "bold 8px sans-serif"; g.fillText("STASERA:", 158, 24); g.fillStyle = "#e63946"; g.font = "900 11px Impact, sans-serif"; g.fillText("IL FINALE!", 156, 40); if (since("lb_vignette", 0) < 120) { g.strokeStyle = FK; g.lineWidth = 3; g.beginPath(); g.moveTo(152, 42); g.lineTo(208, 18); g.stroke(); }
    // strada gialla
    px(g, 0, 150, W, 50, "#ffd95a"); g.strokeStyle = FK; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 150); g.lineTo(W, 150); g.stroke(); halftone(g, 0, 156, W, 44, "rgba(0,0,0,.12)", 6, 1.2);
    for (let i = 0; i < 6; i++) px(g, i * 60 + ((f / 2) % 60), 174, 30, 4, "#fff");
    // balloon rubati che volano via legati a un filo
    for (let i = 0; i < 5; i++) { const x = 30 + i * 62 + Math.sin(f / 30 + i) * 6, y = 70 + Math.sin(f / 22 + i * 2) * 6 - (since("lb_vignette", 2) < 120 ? since("lb_vignette", 2) / 2 : 0); g.strokeStyle = FK; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + 9); g.lineTo(x + 4, y + 50); g.stroke(); bubble(g, x, y, 34, 18, ["…", "ciao!", "?!", "aiuto", "eh?"][i]); }
    // Didascalia: il riquadro giallo dei narratori
    boxO(g, 4, 156, 120, 16, "#ffd95a", 2); g.fillStyle = FK; g.font = "italic bold 8px sans-serif"; g.fillText(since("lb_vignette", 3) < 150 ? "INTANTO, DA QUALCHE PARTE…" : "NELLA CITTÀ DELLE VIGNETTE…", 9, 167);
    // passante muto che gesticola
    const gst = since("lb_vignette", 4) < 90 ? Math.sin(since("lb_vignette", 4) / 3) * 6 : 0;
    boxO(g, 270, 158, 12, 20, "#7ed957", 2); g.fillStyle = "#8d5524"; g.beginPath(); g.arc(276, 152, 6, 0, 7); g.fill(); g.strokeStyle = FK; g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(270, 162); g.lineTo(262, 150 + gst); g.moveTo(282, 162); g.lineTo(290, 150 - gst); g.stroke();
    boom(g, 230, 128, 20, "BOOM!", "#ffd95a", -0.2 + Math.sin(f / 40) * 0.05);
    paperGrain(g, W, H, f, 0.04);
  }
  function bgTipografia(g, W, H, f) {
    px(g, 0, 0, W, H, "#5d6d7e"); halftone(g, 0, 0, W, H, "rgba(0,0,0,.12)", 7, 1.4);
    // finestroni industriali
    for (let i = 0; i < 3; i++) { boxO(g, 20 + i * 100, 12, 70, 50, "#bfe3ff", 3); g.strokeStyle = FK; g.lineWidth = 2; g.beginPath(); g.moveTo(55 + i * 100, 12); g.lineTo(55 + i * 100, 62); g.moveTo(20 + i * 100, 37); g.lineTo(90 + i * 100, 37); g.stroke(); }
    // il grande torchio con la ruota che gira
    const sp = since("lb_tipografia", 0) < 160 ? 4 : 1;
    boxO(g, 110, 80, 100, 70, "#2c3e50", 3); boxO(g, 120, 70, 80, 14, "#e63946", 2);
    g.save(); g.translate(230, 100); g.rotate(f / 40 * sp); g.strokeStyle = FK; g.lineWidth = 3; g.fillStyle = "#ffd95a"; g.beginPath(); g.arc(0, 0, 18, 0, Math.PI * 2); g.fill(); g.stroke(); for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(i) * 18, Math.sin(i) * 18); g.stroke(); } g.restore();
    // fogli che escono dal torchio
    for (let i = 0; i < 4; i++) { const t = ((f * 0.6 * (sp > 1 ? 2 : 1) + i * 30) % 120) / 120; boxO(g, 120 + t * 160, 150 - Math.sin(t * Math.PI) * 30, 26, 18, "#fffbea", 1.5); g.fillStyle = FK; g.font = "bold 6px sans-serif"; g.fillText(["BOOM", "FINE", "SBAM", "???"][i], 123 + t * 160, 161 - Math.sin(t * Math.PI) * 30); }
    // cassettiere dei caratteri mobili
    boxO(g, 10, 100, 80, 70, "#8b5a2b", 3); for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) { boxO(g, 14 + k * 15, 104 + r * 16, 13, 13, since("lb_tipografia", 1) < 120 && (r + k) % 2 ? "#ffd95a" : "#a87a4a", 1); g.fillStyle = FK; g.font = "bold 8px serif"; g.fillText("ABCDEFGHILMNOPQRSTUV"[(r * 5 + k) % 20], 17 + k * 15, 114 + r * 16); }
    // il foglio dell'ordine appeso (prova!)
    const sw = Math.sin(f / 20) * 0.05; g.save(); g.translate(280, 120); g.rotate(sw); boxO(g, -16, 0, 32, 40, "#fffbea", 2); g.fillStyle = FK; g.font = "bold 5px sans-serif"; g.fillText("ORDINE", -11, 9); g.fillText("senza ultima", -14, 18); g.fillText("pagina", -9, 25); g.fillStyle = "#e63946"; g.font = "italic bold 9px serif"; g.fillText("N.", -6, 36); g.restore();
    if (since("lb_tipografia", 2) < 120) boom(g, 280, 108, 14, "!", "#ffd95a", 0.2);
    // pavimento
    px(g, 0, 170, W, 30, "#2b2d42"); for (let i = 0; i < 10; i++) px(g, i * 34, 170, 2, 30, FK);
    boom(g, 60, 180, 14, "CLANG!", "#7cc4ff", 0.1 + (since("lb_tipografia", 3) < 60 ? 0.3 : 0));
    paperGrain(g, W, H, f, 0.04);
  }
  function bgTetti(g, W, H, f) {
    // tramonto a fumetto con il retino
    const gr = g.createLinearGradient(0, 0, 0, 140); gr.addColorStop(0, "#ff9f43"); gr.addColorStop(1, "#ffd95a"); g.fillStyle = gr; g.fillRect(0, 0, W, 140); halftone(g, 0, 0, W, 140, "rgba(230,57,70,.25)", 7, 1.6);
    g.fillStyle = "#fff4b0"; g.strokeStyle = FK; g.lineWidth = 3; g.beginPath(); g.arc(250, 60, 24, 0, Math.PI * 2); g.fill(); g.stroke();
    // nuvolette-piattaforma
    for (let i = 0; i < 4; i++) { const x = 40 + i * 80 + Math.sin(f / 50 + i) * 6, y = 40 + (i % 2) * 22; bubble(g, x, y, 54, 22, since("lb_tetti", 1) < 120 ? ["FINE?", "NO!", "MAI", "…"][i] : "", null, null, "#ffffff"); }
    // skyline di tetti
    const R = [[0, 120, 70], [64, 104, 60], [118, 126, 52], [166, 98, 70], [230, 116, 90]];
    R.forEach(([x, y, w], i) => { boxO(g, x, y, w, 200 - y, ["#4aa3df", "#e63946", "#7ed957", "#2b2d42", "#f28482"][i], 3); g.fillStyle = FK; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w / 2, y - 14); g.lineTo(x + w, y); g.fill(); boxO(g, x + w - 16, y - 22, 10, 14, "#8b5a2b", 2); });
    // antenna che sfrigola
    g.strokeStyle = FK; g.lineWidth = 2; g.beginPath(); g.moveTo(200, 98); g.lineTo(200, 66); g.moveTo(190, 72); g.lineTo(210, 72); g.moveTo(192, 80); g.lineTo(208, 80); g.stroke();
    if (since("lb_tetti", 2) < 90 || (f % 200) < 8) { boom(g, 200, 58, 12, "BZZ", "#7cc4ff", 0.3); }
    // l'ombra del Narratore in cima al tetto più alto (si volta quando la tocchi)
    const turn = since("lb_tetti", 0) < 120;
    px(g, 192, 72 + 26, 16, 0, FK);
    g.fillStyle = FK; g.beginPath(); g.moveTo(186, 98); g.lineTo(214, 98); g.lineTo(206, 60); g.lineTo(194, 60); g.fill(); g.beginPath(); g.arc(200, 54, 7, 0, Math.PI * 2); g.fill(); px(g, 190, 46, 20, 3, FK); px(g, 194, 38, 12, 9, FK);
    if (turn) { px(g, 196, 52, 3, 2, "#ffd95a"); px(g, 202, 52, 3, 2, "#ffd95a"); }
    // pagina che vola (si strappa da un bordo)
    const t = (f % 300) / 300; g.save(); g.translate(20 + t * 300, 150 - Math.sin(t * Math.PI) * 60); g.rotate(t * 6); boxO(g, -8, -10, 16, 20, "#fffbea", 1.5); g.restore();
    if (since("lb_tetti", 3) < 120) boom(g, 70, 150, 18, "RRRIP!", "#ffffff", -0.2);
    paperGrain(g, W, H, f, 0.04);
  }

  // ---------------------------------------------------------------- CAPITOLO 4 · MATITA (grafite su carta bianca, cose non finite)
  const MP = "#f6f5ef", MG = "#5a5a58";
  function sketchLine(g, x1, y1, x2, y2, a, w) { g.strokeStyle = `rgba(70,70,70,${a == null ? 0.7 : a})`; g.lineWidth = w || 1; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2 + 1, y2 - 1); g.stroke(); g.globalAlpha = 0.4; g.beginPath(); g.moveTo(x1 + 1, y1 + 1); g.lineTo(x2, y2 + 1); g.stroke(); g.globalAlpha = 1; }
  function sketchRect(g, x, y, w, h, a) { sketchLine(g, x, y, x + w, y, a); sketchLine(g, x + w, y, x + w, y + h, a); sketchLine(g, x + w, y + h, x, y + h, a); sketchLine(g, x, y + h, x, y, a); }
  function graphiteHatch(g, x, y, w, h, gap, a) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = `rgba(80,80,80,${a || 0.25})`; g.lineWidth = 1; g.beginPath(); for (let i = -h; i < w; i += gap) { g.moveTo(x + i, y + h); g.lineTo(x + i + h * 0.6, y); } g.stroke(); g.restore(); }
  function eraserEdge(g, W, H, f, side) { // il Bianco che avanza dai bordi
    const t = (Math.sin(f / 90) + 1) / 2, wv = 26 + t * 14;
    const gr = g.createLinearGradient(side ? W : 0, 0, side ? W - wv * 2 : wv * 2, 0); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.5, "rgba(255,255,255,.85)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(side ? W - wv * 2 : 0, 0, wv * 2, H);
    for (let i = 0; i < 12; i++) { const y = (i * 37 + f * 0.3) % H, x = side ? W - wv - (i % 3) * 6 : wv + (i % 3) * 6; px(g, x, y, 3, 2, "rgba(255,190,200,.8)"); }
  }
  function bgBozza(g, W, H, f) {
    px(g, 0, 0, W, H, MP); for (let y = 12; y < H; y += 12) px(g, 0, y, W, 1, "rgba(120,140,190,.18)");
    // gli schizzi delle fiabe passate: la casa di paglia, il castello di carte, il palazzo a fumetti
    sketchRect(g, 24, 92, 50, 40); sketchLine(g, 18, 94, 49, 66); sketchLine(g, 49, 66, 80, 94); graphiteHatch(g, 26, 94, 46, 36, 4, 0.18);
    for (let lv = 0; lv < 3; lv++) for (let i = 0; i < 3 - lv; i++) { const cx = 120 + i * 22 + lv * 11, cy = 120 - lv * 26; sketchLine(g, cx - 10, cy + 12, cx, cy - 12); sketchLine(g, cx, cy - 12, cx + 10, cy + 12); }
    sketchRect(g, 232, 60, 60, 80); for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) sketchRect(g, 240 + k * 17, 70 + r * 22, 10, 12, 0.4);
    if (since("lb_bozza", 0) < 120) { g.fillStyle = "rgba(255,217,90,.45)"; g.fillRect(233, 61, 58, 78); }
    // il campione abbozzato (la Bozza), metà disegnato
    const wave = since("lb_bozza", 1) < 90 ? Math.sin(since("lb_bozza", 1) / 4) * 8 : 0;
    g.strokeStyle = "rgba(70,70,70,.8)"; g.lineWidth = 1.5; g.beginPath(); g.arc(186, 120, 8, 0, Math.PI * 2); g.stroke(); sketchRect(g, 178, 130, 16, 22); sketchLine(g, 182, 152, 180, 170); sketchLine(g, 190, 152, 192, 170); sketchLine(g, 194, 134, 204, 120 + wave, 0.5);
    g.setLineDash([2, 3]); sketchLine(g, 178, 134, 168, 148, 0.4); g.setLineDash([]);
    g.fillStyle = "rgba(70,70,70,.7)"; g.font = "italic 7px Georgia, serif"; g.fillText("(da finire)", 170, 182);
    // la matita gigante che disegna da sola
    const mx = 100 + Math.sin(f / 40) * 60 + (since("lb_bozza", 2) < 100 ? 30 : 0), my = 40 + Math.cos(f / 33) * 10;
    g.save(); g.translate(mx, my); g.rotate(0.7); px(g, -4, -40, 8, 34, "#e8c46a"); px(g, -4, -46, 8, 6, "#f2a5b8"); px(g, -4, -48, 8, 2, "#9a9a95"); g.fillStyle = "#e8d6b0"; g.beginPath(); g.moveTo(-4, -6); g.lineTo(4, -6); g.lineTo(0, 4); g.fill(); px(g, -1, 1, 2, 3, MG); g.restore();
    // la linea che lascia
    g.strokeStyle = "rgba(70,70,70,.35)"; g.beginPath(); for (let i = 0; i < 40; i++) { const tt = (f - i * 3) / 40; g.lineTo(100 + Math.sin(tt) * 60 + 6, 40 + Math.cos((f - i * 3) / 33) * 10 + 6); } g.stroke();
    // briciole di gomma
    for (let i = 0; i < 10; i++) px(g, 30 + (i * 29) % 260, 178 + (i % 3) * 6, 3, 2, since("lb_bozza", 3) < 80 ? "rgba(255,170,190,.9)" : "rgba(255,190,200,.6)");
    eraserEdge(g, W, H, f, 0); eraserEdge(g, W, H, f, 1);
  }
  function bgMargine(g, W, H, f) {
    // a sinistra: la pagina a matita. A destra: oltre il bordo, la libreria vera, enorme e calda
    px(g, 0, 0, W, H, MP); for (let y = 12; y < H; y += 12) px(g, 0, y, 200, 1, "rgba(120,140,190,.18)"); px(g, 30, 0, 1, H, "rgba(200,30,58,.35)");
    vgrad(g, 200, 0, 120, H, ["#2a180f", "#4a2c1a"]);
    g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 270, 40, 70, "255,200,120", toggled("lb_margine", 0) ? 0.1 : 0.35); g.restore();
    ell(g, 270, 30, 18, 8, "#c99a3a"); px(g, 268, 0, 4, 22, "#2a1a10");
    // il bordo della pagina, spesso, con l'ombra
    px(g, 196, 0, 6, H, "#e6e2d6"); px(g, 202, 0, 3, H, "rgba(0,0,0,.35)");
    g.fillStyle = "rgba(90,90,90,.8)"; g.font = "italic 9px Georgia, serif"; g.fillText("pag. 213", 150, 190);
    // un dito gigantesco che tiene la pagina (si sposta se toccato)
    const fy = since("lb_margine", 1) < 120 ? 20 : 0;
    g.fillStyle = "#e0b48a"; g.beginPath(); g.ellipse(232, 150 + fy, 26, 44, -0.2, 0, Math.PI * 2); g.fill(); g.fillStyle = "#f2d0b0"; g.beginPath(); g.ellipse(222, 120 + fy, 14, 10, -0.2, 0, Math.PI * 2); g.fill();
    // scaffali sfocati nella libreria
    for (let i = 0; i < 6; i++) px(g, 214 + i * 17, 70, 12, 30, ["#8a2f3a", "#2f5a7a", "#c99a3a", "#3a6a4a", "#6a4a8a", "#d8c8a8"][i]);
    // la scrivania dell'Autrice a matita
    sketchRect(g, 40, 120, 90, 8); sketchLine(g, 46, 128, 46, 170); sketchLine(g, 124, 128, 124, 170); sketchRect(g, 70, 104, 30, 16, 0.5);
    g.fillStyle = "rgba(70,70,70,.7)"; g.font = "italic 7px Georgia, serif"; g.fillText(since("lb_margine", 2) < 150 ? "«Torno subito» — A." : "una tazza di caffè, fredda", 50, 100);
    // pioggia sulla vetrina, al di là
    for (let i = 0; i < 12; i++) px(g, 210 + (i * 23) % 100, (i * 31 + f * 2) % 60, 1, 4, "rgba(170,200,255,.4)");
    eraserEdge(g, 200, H, f, 0);
  }
  function bgUltima(g, W, H, f) {
    px(g, 0, 0, W, H, MP);
    // tribune appena accennate, piene di personaggi a matita (si animano se toccate)
    for (let r = 0; r < 3; r++) { sketchLine(g, 0, 44 + r * 16, W, 44 + r * 16, 0.35); for (let i = 0; i < 22; i++) { const x = 10 + i * 14 + (r % 2) * 7, jump = since("lb_ultima", 0) < 120 ? Math.abs(Math.sin(f / 5 + i)) * 4 : 0; g.strokeStyle = "rgba(70,70,70,.55)"; g.beginPath(); g.arc(x, 36 + r * 16 - jump, 3, 0, Math.PI * 2); g.stroke(); sketchLine(g, x, 39 + r * 16 - jump, x, 43 + r * 16 - jump, 0.5); } }
    // un colore alla volta: i personaggi che hai aiutato
    const COL = [["#c0644a", 40], ["#4a5a7a", 70], ["#1d1a17", 210], ["#ffd95a", 250], ["#c81e3a", 280]];
    COL.forEach(([c, x], i) => { circ(g, x, 36 + (i % 3) * 16, 3.5, c); });
    // campo a matita
    sketchRect(g, 16, 96, 288, 96, 0.6); sketchLine(g, 160, 96, 160, 192, 0.5); g.strokeStyle = "rgba(70,70,70,.5)"; g.beginPath(); g.ellipse(160, 144, 24, 12, 0, 0, Math.PI * 2); g.stroke();
    graphiteHatch(g, 16, 96, 288, 96, 9, 0.08);
    // le porte: una disegnata, l'altra ancora da disegnare
    sketchRect(g, 6, 128, 10, 32); g.setLineDash([3, 3]); sketchRect(g, 304, 128, 10, 32, 0.4); g.setLineDash([]);
    if (since("lb_ultima", 1) < 150) { g.fillStyle = "rgba(255,217,90,.5)"; g.fillRect(305, 129, 8, 30); }
    // il tabellone senza numeri
    sketchRect(g, 136, 4, 48, 20); g.fillStyle = "rgba(70,70,70,.8)"; g.font = "bold 10px Georgia, serif"; g.textAlign = "center"; g.fillText(since("lb_ultima", 2) < 120 ? "? – ?" : "FINE", 160, 18); g.textAlign = "left";
    // il pallone: unico oggetto colorato
    const bx = 160 + Math.sin(f / 30) * 4, by = 144; circ(g, bx, by, 5, "#ffffff"); g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.arc(bx, by, 5, 0, Math.PI * 2); g.stroke(); circ(g, bx, by, 1.6, "#111");
    if (since("lb_ultima", 3) < 100) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, bx, by, 30, "255,230,150", 0.6); g.restore(); }
    eraserEdge(g, W, H, f, 0); eraserEdge(g, W, H, f, 1);
  }
  function bgAlba(g, W, H, f) {
    // la libreria all'alba: la pioggia è finita
    vgrad(g, 0, 0, W, H, ["#3a2418", "#2a180f"]);
    px(g, 112, 14, 96, 78, "#0e1626"); vgrad(g, 114, 16, 92, 74, ["#ffb370", "#ffd59e", "#bfe3ff"]);
    px(g, 112, 14, 96, 3, "#6a4a2a"); px(g, 112, 90, 96, 4, "#6a4a2a"); px(g, 158, 14, 3, 80, "#6a4a2a");
    circ(g, 184, 74, 10, "rgba(255,240,200,.9)");
    if (since("lb_alba", 0) < 160) for (let i = 0; i < 3; i++) { const x = 120 + ((f * 0.6 + i * 40) % 90), y = 40 + i * 8 + Math.sin(f / 8 + i) * 2; px(g, x, y, 4, 1, "#2a2a2a"); px(g, x - 2, y - 1, 2, 1, "#2a2a2a"); px(g, x + 4, y - 1, 2, 1, "#2a2a2a"); }
    g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,210,150,.12)"; g.beginPath(); g.moveTo(114, 92); g.lineTo(206, 92); g.lineTo(260, 200); g.lineTo(60, 200); g.fill(); g.restore();
    for (let s = 0; s < 2; s++) { const x0 = s ? 214 : 0; px(g, x0, 10, 106, 120, "#4a2c1a"); for (let r = 0; r < 4; r++) { px(g, x0, 36 + r * 28, 106, 3, "#2a180f"); for (let b = 0; b < 12; b++) px(g, x0 + 4 + b * 8.5, 36 + r * 28 - 20, 6, 20, ["#8a2f3a", "#2f5a7a", "#c99a3a", "#3a6a4a", "#6a4a8a", "#d8c8a8"][(b + r * 2 + s) % 6]); } }
    vgrad(g, 0, 130, W, 70, ["#5a3a24", "#3a2414"]); ell(g, 160, 170, 110, 18, "#7a2a2a");
    // il libro chiuso sul leggio, con il titolo intero
    px(g, 154, 128, 12, 40, "#3a2414"); px(g, 128, 112, 64, 20, "#6a1f2a"); px(g, 128, 112, 64, 3, "#8a2f3a");
    g.fillStyle = "#e8c66a"; g.font = "bold 5px Georgia, serif"; g.textAlign = "center"; g.fillText("IL LIBRO DELLE PARTITE", 160, 121); g.fillText("CHE FINISCONO BENE", 160, 128); g.textAlign = "left";
    if (since("lb_alba", 1) < 120) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 160, 120, 40, "255,215,140", 0.4); g.restore(); }
    // il segnalibro rosso che spunta
    px(g, 170, 130, 3, 14 + Math.sin(f / 20) * 1.5, "#c81e3a");
    // il cartello girato: «APERTO»
    const flip = toggled("lb_alba", 2); px(g, 252, 136, 54, 26, "#e8d6b0"); px(g, 252, 136, 54, 2, "#6a4a2a"); g.fillStyle = "#3a2414"; g.font = "bold 9px Georgia, serif"; g.fillText(flip ? "Torno subito" : "APERTO", flip ? 256 : 262, 153);
    paperGrain(g, W, H, f, 0.05);
  }

  // ================= DOPPIO TURNO · sfondi di scena (chiavi dt_*) =================
  // Il Dentro: bianco, verde acqua, neon e sorrisi obbligatori. Il Fuori: Porto Livido di sera, lucine e mare scuro.
  const DT = "#2a9d8f", DK = "#2b3a3a";
  function neonFlicker(f) { return (f % 260) < 3 || ((f + 90) % 410) < 2 ? 0.55 : 1; }
  function smileyPoster(g, x, y, w, h, txt) { px(g, x, y, w, h, "#ffffff"); px(g, x, y, w, 6, DT); g.strokeStyle = DT; g.lineWidth = 1.5; g.beginPath(); g.arc(x + w / 2, y + h / 2 + 2, w * 0.18, 0.2, Math.PI - 0.2); g.stroke(); px(g, x + w / 2 - w * 0.12, y + h / 2 - 3, 2, 2, DK); px(g, x + w / 2 + w * 0.1, y + h / 2 - 3, 2, 2, DK); if (txt) { g.fillStyle = DK; g.font = "bold 5px sans-serif"; g.textAlign = "center"; g.fillText(txt, x + w / 2, y + h - 3); g.textAlign = "left"; } }
  function bgDtAtrio(g, W, H, f) {
    const nf = neonFlicker(f);
    px(g, 0, 0, W, H, "#f4f6f5"); px(g, 0, 0, W, 16, "#e2e9e7");
    for (let i = 0; i < 6; i++) { px(g, 20 + i * 52, 4, 36, 4, `rgba(220,255,248,${nf})`); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 38 + i * 52, 8, 26, "200,255,240", 0.2 * nf); g.restore(); }
    px(g, 0, 118, W, 4, DT);
    // parete con il logo e i manifesti
    g.fillStyle = DT; g.font = "900 18px system-ui, sans-serif"; g.textAlign = "center"; g.fillText("VALTORRE", 160, 50); g.font = "bold 7px system-ui, sans-serif"; g.fillText("FOOTBALL CLUB · IL DENTRO È PIÙ BELLO", 160, 62); g.textAlign = "left";
    smileyPoster(g, 20, 30, 34, 44, "SORRIDI"); smileyPoster(g, 266, 30, 34, 44, since("dt_atrio", 2) < 120 ? "ANCORA" : "SEI DENTRO");
    // l'ascensore (si apre se toccato)
    const op = since("dt_atrio", 0) < 120 ? Math.min(1, since("dt_atrio", 0) / 20) * (since("dt_atrio", 0) > 90 ? (120 - since("dt_atrio", 0)) / 30 : 1) : 0;
    px(g, 128, 70, 64, 50, "#c9d1cf"); px(g, 132, 74, 56, 46, "#2b3a3a"); px(g, 132, 74, 28 - op * 26, 46, "#aeb8b5"); px(g, 160 + op * 26, 74, 28 - op * 26, 46, "#aeb8b5"); px(g, 152, 64, 16, 5, "#1a1a1a"); g.fillStyle = "#5af0c8"; g.font = "bold 5px monospace"; g.fillText("-0+", 154, 68);
    // pavimento lucido
    vgrad(g, 0, 122, W, 78, ["#e2e9e7", "#cfd9d6"]); for (let i = 0; i < 10; i++) px(g, i * 36, 122, 1, 78, "rgba(43,58,58,.08)"); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(128, 124, 64, 30);
    // bancone della reception con il campanello
    px(g, 20, 120, 80, 30, "#ffffff"); px(g, 20, 120, 80, 3, DT); circ(g, 84, 116, 4, since("dt_atrio", 1) < 40 ? "#ffd23f" : "#c9a227"); px(g, 80, 118, 8, 2, "#8a948f");
    // pianta perfettamente potata
    px(g, 252, 124, 20, 20, "#ffffff"); circ(g, 262, 110, 14, "#5a9a72"); circ(g, 262, 110, 9, since("dt_atrio", 3) < 100 ? "#7fc49a" : "#5a9a72");
    // fontanella
    px(g, 220, 130, 16, 22, "#dfe6e4"); px(g, 222, 118, 12, 14, "#9fd8f0");
    paperGrain(g, W, H, f, 0.03);
  }
  function bgDtUffici(g, W, H, f) {
    const nf = neonFlicker(f + 50);
    px(g, 0, 0, W, H, "#eef2f1"); for (let i = 0; i < 5; i++) px(g, 10 + i * 64, 6, 44, 4, `rgba(220,255,248,${nf})`);
    // moquette verde
    vgrad(g, 0, 110, W, 90, ["#467f62", "#3a7658"]);
    // file di cubicoli con i terminali
    for (let i = 0; i < 5; i++) { const x = 8 + i * 64, on = (i + Math.floor(f / 50)) % 3 !== 0; px(g, x, 86, 56, 36, "#b9c7c3"); px(g, x, 86, 56, 4, "#dfe9e7"); px(g, x + 14, 64, 28, 24, "#cfd6c8"); px(g, x + 17, 67, 22, 16, "#0e2a24"); if (on) { px(g, x + 19, 70, 12, 1, "#5af0c8"); px(g, x + 19, 73, 16, 1, "#5af0c8"); px(g, x + 19, 76, 8, 1, "#5af0c8"); } if (since("dt_uffici", 0) < 100 && i === 2) { g.fillStyle = "#5af0c8"; g.font = "bold 5px monospace"; g.fillText("CHI SEI?", x + 18, 80); } }
    // la finestra senza vista
    px(g, 120, 18, 80, 36, "#ffffff"); px(g, 122, 20, 76, 32, since("dt_uffici", 1) < 120 ? "#bfe3ff" : "#f4f6f5"); g.fillStyle = "rgba(43,58,58,.4)"; g.font = "italic 6px sans-serif"; g.fillText(since("dt_uffici", 1) < 120 ? "(per un attimo: il mare)" : "(finestra decorativa)", 130, 40);
    // macchina del caffè e distributore d'acqua
    px(g, 280, 124, 22, 40, "#3a3a44"); px(g, 284, 128, 14, 8, "#1a1a22"); px(g, 286, 130, 4, 2, "#ff5a5a"); if (since("dt_uffici", 2) < 120) for (let i = 0; i < 3; i++) circ(g, 291 + Math.sin(f / 8 + i) * 2, 118 - ((f / 2 + i * 6) % 18), 2, "rgba(255,255,255,.5)");
    px(g, 6, 120, 18, 44, "#dfe6e4"); px(g, 8, 108, 14, 14, "#9fd8f0"); if (since("dt_uffici", 3) < 60) circ(g, 15, 116 - (since("dt_uffici", 3) % 12), 2, "#ffffff");
    // la porta numero otto
    px(g, 236, 56, 26, 66, "#d3dcd9"); px(g, 240, 60, 18, 58, since("dt_uffici", 4) < 120 ? "#7f8f8b" : "#c9d1cf"); g.fillStyle = DK; g.font = "bold 7px sans-serif"; g.fillText("8", 246, 76);
    paperGrain(g, W, H, f, 0.03);
  }
  function bgDtCampo(g, W, H, f) {
    px(g, 0, 0, W, H, "#f4f6f5");
    // maxischermo che chiede di sorridere
    px(g, 92, 8, 136, 40, DK); px(g, 96, 12, 128, 32, "#0e2a24"); g.fillStyle = "#5af0c8"; g.font = "900 14px system-ui, sans-serif"; g.textAlign = "center"; g.fillText(since("dt_campo", 0) < 120 ? "BRAVO, " + (((typeof window.heroLoad === "function" && window.heroLoad()) || {}).num || "") + "!" : ["SORRIDI", "OBBEDISCI", "SORRIDI", "GIOCA"][Math.floor(f / 90) % 4], 160, 34); g.textAlign = "left";
    // tribune bianche quasi vuote, con sagome di cartone
    for (let r = 0; r < 3; r++) { px(g, 0, 52 + r * 14, W, 13, r % 2 ? "#dfe6e4" : "#e9ede8"); for (let i = 0; i < 20; i++) if ((i * 7 + r * 3) % 5 === 0) { const turn = since("dt_campo", 1) < 120; px(g, 8 + i * 16, 54 + r * 14, 6, 9, turn ? "#ff9f43" : "#9aa5b1"); circ(g, 11 + i * 16, 53 + r * 14, 3, "#e0b48a"); } }
    // il campo bianco con le righe verde acqua
    vgrad(g, 0, 100, W, 100, ["#d9efe6", "#cfe8de"]); g.strokeStyle = DT; g.lineWidth = 2; g.strokeRect(14, 106, 292, 88); g.beginPath(); g.moveTo(160, 106); g.lineTo(160, 194); g.stroke(); g.beginPath(); g.ellipse(160, 150, 24, 12, 0, 0, Math.PI * 2); g.stroke();
    for (let x = 14; x < 306; x += 12) px(g, x, 106, 1, 88, "rgba(42,157,143,.1)");
    // la cuffia sulla panchina (la tocchi: si accende)
    px(g, 260, 170, 40, 8, "#ffffff"); g.strokeStyle = DK; g.lineWidth = 2; g.beginPath(); g.arc(280, 168, 7, Math.PI, 0); g.stroke(); circ(g, 273, 168, 3, DK); circ(g, 287, 168, 3, DK); if (since("dt_campo", 2) < 120) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 280, 166, 18, "90,240,200", 0.5); g.restore(); }
    // la tribuna della direttrice con il vetro
    px(g, 8, 20, 70, 28, "#ffffff"); px(g, 12, 24, 62, 20, since("dt_campo", 3) < 120 ? "#bfeee6" : "#9fd8f0"); circ(g, 42, 36, 4, "#f0d0b8"); px(g, 39, 30, 7, 3, "#d9d4c8");
    paperGrain(g, W, H, f, 0.03);
  }
  function bgDtPorto(g, W, H, f) {
    // cielo al tramonto che diventa sera
    vgrad(g, 0, 0, W, 110, ["#2a1838", "#7a3b52", "#ffb347"]);
    for (let i = 0; i < 16; i++) px(g, (i * 71) % W, (i * 23) % 50, 1, 1, (f / 30 + i) % 5 < 1 ? "#fff" : "rgba(255,255,255,.4)");
    // il vecchio stadio in lontananza, con i fari spenti (si accendono per un attimo)
    px(g, 200, 52, 110, 50, "#2a1f2e"); for (let i = 0; i < 4; i++) { px(g, 206 + i * 28, 28, 3, 26, "#2a1f2e"); px(g, 202 + i * 28, 24, 11, 6, since("dt_porto", 2) < 90 ? "#fff6c8" : "#3a2f3e"); if (since("dt_porto", 2) < 90) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 207 + i * 28, 27, 30, "255,240,200", 0.4); g.restore(); } }
    g.fillStyle = "rgba(255,200,120,.5)"; g.font = "bold 6px sans-serif"; g.fillText("STADIO DEL PORTO · PROPRIETÀ VALTORRE", 204, 98);
    // mare scuro con i riflessi
    vgrad(g, 0, 110, W, 60, ["#22345a", "#1b2a4a"]); for (let i = 0; i < 14; i++) px(g, (i * 41 + f * 0.4) % W, 116 + (i % 4) * 11, 10, 1, "rgba(255,190,120,.35)");
    // barche che dondolano
    for (let i = 0; i < 3; i++) { const x = 30 + i * 60, b = Math.sin(f / 30 + i) * 2 - (since("dt_porto", 3) < 60 && i === 1 ? 4 : 0); g.fillStyle = ["#c0392b", "#e8e0d0", "#2c7fb8"][i]; g.beginPath(); g.moveTo(x, 130 + b); g.lineTo(x + 34, 130 + b); g.lineTo(x + 28, 142 + b); g.lineTo(x + 6, 142 + b); g.fill(); px(g, x + 16, 112 + b, 1, 18, "#e8e0d0"); }
    // banchina e il Bar Marea con l'insegna al neon
    px(g, 0, 160, W, 40, "#4a3f45"); for (let i = 0; i < 12; i++) px(g, i * 28, 160, 1, 40, "rgba(0,0,0,.3)");
    px(g, 200, 120, 112, 44, "#7a3b2e"); px(g, 200, 116, 112, 6, "#3a2a2e"); px(g, 216, 132, 22, 32, "#2a1a10"); px(g, 248, 130, 50, 20, "#ffcf7a");
    const neon = since("dt_porto", 0) < 120 ? (Math.floor(f / 6) % 2 ? 1 : 0.3) : neonFlicker(f) ; g.fillStyle = `rgba(255,120,160,${neon})`; g.font = "900 11px system-ui, sans-serif"; g.fillText("BAR MAREA", 236, 128); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 266, 124, 30, "255,120,160", 0.25 * neon); g.restore();
    // le lucine sui fili
    for (let k = 0; k < 2; k++) { g.strokeStyle = "rgba(0,0,0,.6)"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 100 + k * 8); g.quadraticCurveTo(100, 122 + k * 8, 200, 104 + k * 8); g.stroke(); for (let i = 0; i < 12; i++) { const t = i / 11, x = t * 200, y = 100 + k * 8 + Math.sin(t * Math.PI) * 11; const on = since("dt_porto", 1) < 150 ? (Math.floor(f / 8) + i) % 2 : 1; circ(g, x, y, 2, on ? ["#ffd36b", "#ff7a7a", "#7ae0ff"][(i + k) % 3] : "#3a3a44"); } }
    // l'ingresso del personale del Complesso (bianco, fuori posto)
    px(g, 150, 136, 30, 28, "#eef2f1"); px(g, 156, 142, 18, 22, "#aeb8b5"); px(g, 150, 136, 30, 3, DT);
    paperGrain(g, W, H, f, 0.04);
  }

  function bgDtGiostre(g, W, H, f) {
    vgrad(g, 0, 0, W, 130, ["#120c1e", "#2a1838", "#4a2a4a"]);
    for (let i = 0; i < 22; i++) px(g, (i * 53) % W, (i * 31) % 70, 1, 1, (f / 25 + i) % 6 < 1 ? "#fff" : "rgba(255,255,255,.35)");
    // la ruota panoramica ferma (gira se toccata)
    const rot = since("dt_giostre", 0) < 200 ? f / 60 : 0.3; g.strokeStyle = "#7a5a8a"; g.lineWidth = 2; g.beginPath(); g.arc(70, 66, 44, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 8; i++) { const a = rot + i * Math.PI / 4, x = 70 + Math.cos(a) * 44, y = 66 + Math.sin(a) * 44; g.beginPath(); g.moveTo(70, 66); g.lineTo(x, y); g.stroke(); px(g, x - 5, y, 10, 8, ["#ffd36b", "#ff7a7a", "#7ae0ff"][i % 3]); }
    px(g, 64, 66, 12, 64, "#3a2a4a");
    // la giostra dei cavalli con il Cartografo dentro (lucine)
    px(g, 140, 96, 90, 40, "#3a2a4a"); g.fillStyle = "#c0392b"; g.beginPath(); g.moveTo(132, 98); g.lineTo(185, 70); g.lineTo(238, 98); g.fill(); for (let i = 0; i < 6; i++) { const on = since("dt_giostre", 1) < 150 ? (Math.floor(f / 6) + i) % 2 : 1; circ(g, 142 + i * 16, 98, 2.5, on ? "#ffd36b" : "#4a3a5a"); }
    for (let i = 0; i < 4; i++) { const b = Math.sin(f / 20 + i) * (since("dt_giostre", 1) < 150 ? 4 : 0); px(g, 150 + i * 20, 108 + b, 10, 8, "#e8e0d0"); px(g, 154 + i * 20, 102 + b, 2, 26, "#c9a227"); }
    // la gabbia di rete (campetto da strada)
    px(g, 246, 80, 70, 56, "rgba(40,30,50,.6)"); g.strokeStyle = "rgba(200,200,220,.55)"; g.lineWidth = 1; for (let x = 246; x <= 316; x += 7) { g.beginPath(); g.moveTo(x, 80); g.lineTo(x, 136); g.stroke(); } for (let y = 80; y <= 136; y += 7) { g.beginPath(); g.moveTo(246, y); g.lineTo(316, y); g.stroke(); }
    if (since("dt_giostre", 2) < 60) { circ(g, 260 + since("dt_giostre", 2) * 0.8, 120 - Math.abs(Math.sin(since("dt_giostre", 2) / 6)) * 20, 3, "#fff"); }
    // terreno e graffiti verdi sul recinto dello stadio
    px(g, 0, 136, W, 64, "#3a3236"); for (let i = 0; i < 9; i++) px(g, i * 36, 136, 1, 64, "rgba(0,0,0,.3)");
    px(g, 0, 150, W, 20, "#eef2f1"); px(g, 0, 150, W, 3, "#2a9d8f");
    g.fillStyle = since("dt_giostre", 3) < 150 ? "#5af06a" : "#3ac05a"; g.font = "900 13px Impact, sans-serif"; g.fillText("IL 14 NON È MORTO", 70, 166);
    // il cartello «chiuso per sempre» (si gira: «riapre presto»)
    px(g, 14, 170, 60, 18, "#e8d6b0"); g.fillStyle = "#3a2414"; g.font = "bold 7px sans-serif"; g.fillText(toggled("dt_giostre", 4) ? "RIAPRE PRESTO" : "CHIUSO", 22, 182);
    paperGrain(g, W, H, f, 0.04);
  }
  function bgDtArchivio(g, W, H, f) {
    px(g, 0, 0, W, H, "#0e1a1a");
    // scaffali infiniti di faldoni in prospettiva
    for (let k = 0; k < 6; k++) { const x = 20 + k * 50, h = 120 - k * 6; px(g, x, 30 + k * 3, 30, h, "#1f2f2e"); for (let r = 0; r < 6; r++) for (let i = 0; i < 4; i++) px(g, x + 3 + i * 7, 34 + k * 3 + r * 18, 5, 14, (r + i + k) % 5 === 0 ? "#2a9d8f" : "#cfd6c8"); }
    // il terminale che mostra il registro
    px(g, 120, 120, 80, 50, "#cfd6c8"); px(g, 126, 124, 68, 38, "#04140f"); g.fillStyle = "#5af0c8"; g.font = "bold 5px monospace";
    const L = since("dt_archivio", 0) < 200 ? ["REGISTRO ARMADIETTO 7", "#031 blu  UFFICIO", "#032 verde FUORI", "#033 verde ??? (14)", "#034 blu  UFFICIO"] : ["REGISTRO ARMADIETTO 7", "accesso riservato", "", "> _", ""];
    L.forEach((t, i) => g.fillText(t, 130, 132 + i * 7));
    // il registratore a bobine (la Voce)
    px(g, 220, 132, 60, 34, "#3a3a44"); const spin = since("dt_archivio", 1) < 200 ? f / 8 : 0; [236, 264].forEach((cx) => { g.save(); g.translate(cx, 146); g.rotate(spin); circ(g, 0, 0, 9, "#1a1a22"); px(g, -1, -9, 2, 18, "#5a5a66"); px(g, -9, -1, 18, 2, "#5a5a66"); g.restore(); });
    if (since("dt_archivio", 1) < 200) { g.fillStyle = "#ffb347"; g.font = "italic 6px sans-serif"; g.fillText("«…sono io. Se mi senti…»", 214, 176); }
    // neon che sfarfalla sopra
    const nf = (f % 120) < 6 ? 0.2 : 1; px(g, 60, 8, 200, 4, `rgba(200,255,240,${nf})`); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 160, 12, 90, "200,255,240", 0.15 * nf); g.restore();
    // la porta numero 8 aperta, alle spalle
    px(g, 6, 120, 30, 60, "#eef2f1"); px(g, 10, 124, 22, 56, toggled("dt_archivio", 2) ? "#1a1a1a" : "#7f8f8b"); g.fillStyle = "#2b3a3a"; g.font = "bold 8px sans-serif"; g.fillText("8", 18, 140);
    paperGrain(g, W, H, f, 0.03);
  }

  function bgDtSala(g, W, H, f) {
    px(g, 0, 0, W, H, "#081010");
    // pareti di schermi con la tua faccia (un occhio, una bocca, un numero)
    for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) { const x = 8 + i * 38, y = 10 + r * 30, on = (i + r + Math.floor(f / 40)) % 4 !== 0; px(g, x, y, 32, 24, "#1a2a28"); px(g, x + 2, y + 2, 28, 20, on ? "#0e3a32" : "#05100e"); if (on) { const k = (i * 3 + r) % 3; g.fillStyle = "#5af0c8"; if (k === 0) { circ(g, x + 16, y + 12, 5, "#5af0c8"); circ(g, x + 16, y + 12, 2, "#0e3a32"); } else if (k === 1) { g.fillRect(x + 9, y + 12, 14, 2); } else { g.font = "bold 9px monospace"; g.textAlign = "center"; g.fillText(String(((typeof window.heroLoad === "function" && window.heroLoad()) || {}).num || "?"), x + 16, y + 16); g.textAlign = "left"; } } }
    if (since("dt_sala", 0) < 120) { g.fillStyle = "rgba(255,179,71,.35)"; g.fillRect(0, 0, W, 100); }
    // il grande registratore a bobine al centro
    px(g, 100, 112, 120, 60, "#2a2a33"); px(g, 100, 112, 120, 4, "#3a3a44"); const sp = since("dt_sala", 1) < 240 ? f / 6 : f / 60;
    [130, 190].forEach((cx) => { g.save(); g.translate(cx, 138); g.rotate(sp); circ(g, 0, 0, 20, "#111"); circ(g, 0, 0, 16, "#3a2a1a"); circ(g, 0, 0, 4, "#888"); for (let i = 0; i < 3; i++) { g.rotate(Math.PI * 2 / 3); px(g, -1, 4, 2, 10, "#888"); } g.restore(); });
    g.strokeStyle = "#3a2a1a"; g.lineWidth = 2; g.beginPath(); g.moveTo(130, 158); g.lineTo(160, 166); g.lineTo(190, 158); g.stroke();
    px(g, 150, 160, 20, 8, "#ff5a5a");
    // microfono con la luce rossa REC
    px(g, 252, 130, 4, 50, "#5a5a66"); ell(g, 254, 124, 8, 12, "#3a3a44"); circ(g, 270, 112, 4, (Math.floor(f / 20) % 2 || since("dt_sala", 2) < 120) ? "#ff3a3a" : "#4a1a1a"); g.fillStyle = "#ff5a5a"; g.font = "bold 6px sans-serif"; g.fillText("REC", 262, 106);
    // la sedia vuota davanti al microfono
    px(g, 40, 150, 30, 6, "#2a9d8f"); px(g, 40, 128, 4, 22, "#2a9d8f"); px(g, 44, 156, 3, 20, "#5a6560"); px(g, 64, 156, 3, 20, "#5a6560");
    if (since("dt_sala", 3) < 120) { g.fillStyle = "rgba(234,246,243,.7)"; g.font = "italic 7px sans-serif"; g.fillText("(qui, tre anni fa, eri seduto tu)", 22, 190); }
    paperGrain(g, W, H, f, 0.03);
  }
  function bgDtStadio(g, W, H, f) {
    vgrad(g, 0, 0, W, 110, ["#05060e", "#141a30", "#1e2440"]);
    for (let i = 0; i < 30; i++) px(g, (i * 67) % W, (i * 29) % 60, 1, 1, "rgba(255,255,255,.6)");
    // tribune vecchie e scrostate, con i seggiolini mancanti
    for (let r = 0; r < 4; r++) { px(g, 0, 50 + r * 12, W, 11, r % 2 ? "#3a2f3e" : "#33293a"); for (let i = 0; i < 32; i++) if ((i * 7 + r * 5) % 4) px(g, 3 + i * 10, 52 + r * 12, 6, 6, ["#7a3b2e", "#c9a227", "#7a3b2e", "#e8e0d0"][(i + r) % 4]); }
    g.fillStyle = "rgba(201,162,39,.7)"; g.font = "900 9px system-ui, sans-serif"; g.fillText("P O R T O   L I V I D O   F C", 96, 46);
    // i fari: accesi dal Cartografo (toccali: si spengono e si riaccendono)
    const on = !toggled("dt_stadio", 0); [[20, 10], [300, 10]].forEach(([x, y]) => { px(g, x - 2, y, 4, 40, "#2a2a33"); px(g, x - 10, y - 6, 20, 8, on ? "#fff6c8" : "#3a3a44"); if (on) { g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,246,200,.08)"; g.beginPath(); g.moveTo(x - 10, y); g.lineTo(x + 10, y); g.lineTo(160 + (x - 160) * 0.2, 200); g.lineTo(160 + (x - 160) * 0.6, 200); g.fill(); g.restore(); } });
    // il prato incolto e il dischetto del rigore che brilla
    vgrad(g, 0, 100, W, 100, on ? ["#3a6a3a", "#2a5a2a"] : ["#1a2a1a", "#122012"]); for (let i = 0; i < 40; i++) px(g, (i * 37) % W, 104 + (i * 13) % 90, 1, 4, "rgba(120,170,90,.6)");
    g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 1.5; g.strokeRect(100, 110, 120, 60); g.strokeRect(130, 110, 60, 22);
    px(g, 134, 100, 52, 12, "rgba(255,255,255,.12)"); g.strokeStyle = "#e8e0d0"; g.strokeRect(134, 96, 52, 14);
    const pulse = 0.4 + 0.3 * Math.sin(f / 15) + (since("dt_stadio", 1) < 120 ? 0.4 : 0); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 160, 150, 22, "255,240,180", pulse); g.restore(); circ(g, 160, 150, 3, "#ffffff");
    // il pallone vecchio, sgonfio, ancora lì
    circ(g, 176, 156, 5, since("dt_stadio", 2) < 90 ? "#ffffff" : "#c9c0b0"); g.strokeStyle = "#555"; g.lineWidth = 1; g.beginPath(); g.arc(176, 156, 5, 0, Math.PI * 2); g.stroke();
    // lo striscione strappato
    px(g, 30, 176, 110, 14, "#7a3b2e"); g.fillStyle = "#ffcf7a"; g.font = "bold 7px sans-serif"; g.fillText(since("dt_stadio", 3) < 150 ? "SEMPRE CON TE, 14" : "SEMPRE CON TE, ..", 38, 186);
    paperGrain(g, W, H, f, 0.04);
  }
  function bgDtRigore(g, W, H, f) {
    // il dischetto in prima persona: la porta, il portiere, il pubblico diviso in due colori
    vgrad(g, 0, 0, W, 90, ["#eef2f1", "#cfe3df"]);
    for (let r = 0; r < 4; r++) for (let i = 0; i < 40; i++) { const x = i * 8 + (r % 2) * 4, left = x < 160, jump = since("dt_rigore", 0) < 120 ? Math.abs(Math.sin(f / 5 + i)) * 3 : 0; px(g, x, 20 + r * 14 - jump, 6, 10, left ? (r % 2 ? "#2a9d8f" : "#9aa5b1") : (r % 2 ? "#7a3b2e" : "#ffcf7a")); }
    vgrad(g, 0, 90, W, 110, ["#d9efe6", "#bfe0d2"]);
    px(g, 70, 80, 180, 6, "#ffffff"); px(g, 70, 80, 6, 70, "#ffffff"); px(g, 244, 80, 6, 70, "#ffffff"); g.strokeStyle = "rgba(43,58,58,.18)"; g.lineWidth = 1; for (let x = 76; x < 244; x += 8) { g.beginPath(); g.moveTo(x, 86); g.lineTo(x, 150); g.stroke(); } for (let y = 86; y < 150; y += 8) { g.beginPath(); g.moveTo(76, y); g.lineTo(244, y); g.stroke(); }
    // il portiere che si sposta (si butta se toccato)
    const dive = since("dt_rigore", 1) < 40 ? since("dt_rigore", 1) * 2 : 0, gx = 160 + Math.sin(f / 18) * 14 - dive;
    px(g, gx - 8, 112, 16, 22, "#e07a3a"); circ(g, gx, 106, 6, "#d9b38c"); px(g, gx - 16, 114, 8, 4, "#e07a3a"); px(g, gx + 8, 114, 8, 4, "#e07a3a");
    // il pallone sul dischetto
    circ(g, 160, 182, 9, "#ffffff"); g.strokeStyle = "#2b3a3a"; g.lineWidth = 1.5; g.beginPath(); g.arc(160, 182, 9, 0, Math.PI * 2); g.stroke(); circ(g, 160, 182, 3, "#2b3a3a");
    // la cuffia che ronza
    if (since("dt_rigore", 2) < 120 || (f % 160) < 40) { px(g, 6, 160, 120, 30, "rgba(14,26,26,.85)"); g.fillStyle = "#5af0c8"; g.font = "bold 7px sans-serif"; g.fillText("LA VOCE: «Non tirare. Passalo.»", 12, 178); for (let i = 0; i < 12; i++) { const hh = 2 + Math.abs(Math.sin(f / 3 + i)) * 6; px(g, 12 + i * 3, 168 - hh / 2, 2, hh, "#5af0c8"); } }
    paperGrain(g, W, H, f, 0.03);
  }

  // ---------------------------------------------------------------- CRISTALLI DEL CAMPO (cr_*) · stile JRPG a 16 bit, luce HD-2D
  function crIsle(g, x, y, w, h, top, rock, f, k) { // un'isola sospesa: erba sopra, roccia a punta sotto, radici che pendono
    g.fillStyle = rock; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w * 0.8, y + h * 0.5); g.lineTo(x + w * 0.55, y + h); g.lineTo(x + w * 0.35, y + h * 0.6); g.lineTo(x + w * 0.15, y + h * 0.45); g.closePath(); g.fill();
    g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.moveTo(x + w * 0.5, y); g.lineTo(x + w, y); g.lineTo(x + w * 0.8, y + h * 0.5); g.lineTo(x + w * 0.55, y + h); g.closePath(); g.fill();
    px(g, x - 2, y - 3, w + 4, 5, top); px(g, x - 2, y - 3, w + 4, 1, "rgba(255,255,255,.25)");
    for (let i = 0; i < 3; i++) px(g, x + w * (0.25 + i * 0.2), y + h * 0.4, 1, 6 + Math.sin(f / 30 + i + (k || 0)) * 2, "rgba(60,40,20,.6)");
  }
  function crCloud(g, x, y, s, a) { g.fillStyle = `rgba(255,255,255,${a})`; [[0, 0, 14], [12, -5, 11], [24, 0, 13], [12, 4, 12]].forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); g.fill(); }); }
  function crCrystal(g, x, y, h, col, f, lit) {
    const b = Math.sin(f / 30) * 2; if (lit) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, x, y + b, h * 1.6, col, 0.45 + 0.1 * Math.sin(f / 20)); g.restore(); }
    g.fillStyle = lit ? `rgba(${col},.95)` : "rgba(150,150,170,.8)"; g.beginPath(); g.moveTo(x, y - h + b); g.lineTo(x + h * 0.42, y + b); g.lineTo(x, y + h * 0.9 + b); g.lineTo(x - h * 0.42, y + b); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255,.5)"; g.beginPath(); g.moveTo(x, y - h + b); g.lineTo(x, y + h * 0.9 + b); g.lineTo(x - h * 0.42, y + b); g.closePath(); g.fill();
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - h + b); g.lineTo(x + h * 0.42, y + b); g.lineTo(x, y + h * 0.9 + b); g.lineTo(x - h * 0.42, y + b); g.closePath(); g.stroke();
  }
  function crTilt(g, W, H) { // la sfocatura «miniatura» ai bordi della scena (finta, a strisce semitrasparenti)
    vgrad(g, 0, 0, W, 22, ["rgba(255,240,220,.18)", "rgba(255,240,220,0)"]); vgrad(g, 0, H - 22, W, 22, ["rgba(20,10,30,0)", "rgba(20,10,30,.3)"]);
  }
  function bgCrBorgo(g, W, H, f) {
    // tramonto, isole lontane, il borgo in primo piano con il campo
    vgrad(g, 0, 0, W, 130, ["#3a2a6a", "#c0507a", "#f0904a", "#ffd07a"]);
    g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 230, 96, 60, "255,200,120", 0.6); g.restore(); circ(g, 230, 96, 16, "#fff0c0");
    crCloud(g, (f * 0.1) % (W + 80) - 40, 40, 1, 0.35); crCloud(g, (f * 0.06 + 200) % (W + 80) - 40, 64, 0.8, 0.3);
    const ship = since("cr_borgo", 3) < 240 ? since("cr_borgo", 3) : -1;
    crIsle(g, 30 + Math.sin(f / 90) * 2, 70, 50, 34, "#6a8a4a", "#7a5a6a", f, 1); crIsle(g, 250, 52 + Math.sin(f / 80) * 2, 40, 26, "#6a8a4a", "#7a5a6a", f, 2); crIsle(g, 120, 84 + Math.sin(f / 70 + 1) * 2, 28, 18, "#6a8a4a", "#7a5a6a", f, 3);
    if (ship >= 0) { const x = ship * 1.6 - 20; px(g, x, 50, 22, 4, "#8a5a3a"); ell(g, x + 11, 45, 13, 5, "#9aa5b1"); }
    // l'isola del borgo
    g.fillStyle = "#5a4a3a"; g.beginPath(); g.moveTo(0, 150); g.lineTo(W, 150); g.lineTo(W, 200); g.lineTo(0, 200); g.fill();
    vgrad(g, 0, 128, W, 30, ["#7ab84a", "#5f9a3e"]);
    // case con i tetti colorati e le finestre accese
    [[20, "#3f6a9a"], [70, "#b8452a"], [250, "#5a5a62"]].forEach(([x, roof], i) => { px(g, x, 104, 44, 26, "#efe2c8"); g.fillStyle = roof; g.beginPath(); g.moveTo(x - 4, 106); g.lineTo(x + 22, 88); g.lineTo(x + 48, 106); g.fill(); px(g, x + 18, 116, 9, 14, "#6a3a1a"); const lit = i !== 1 || toggled("cr_borgo", 0); [6, 32].forEach((wx) => { px(g, x + wx, 110, 7, 7, lit ? "#ffd98a" : "#4a5a7a"); if (lit) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, x + wx + 3, 113, 10, "255,210,120", 0.4); g.restore(); } }); });
    // fumo dal camino della fucina
    for (let i = 0; i < 4; i++) circ(g, 290 + Math.sin(f / 20 + i) * 3, 84 - i * 8 - (f / 5 % 8), 3 + i, `rgba(220,220,220,${0.4 - i * 0.08})`); px(g, 286, 84, 6, 10, "#6a4a3a");
    // la Lampada del Campo e il campo
    const lamp = since("cr_borgo", 1) < 120 ? 1 : 0.45 + 0.15 * Math.sin(f / 9);
    px(g, 158, 98, 3, 34, "#3a2a20"); crCrystal(g, 159, 94, 9, "255,190,90", f, true); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 159, 94, 40, "255,200,110", lamp * 0.5); g.restore();
    vgrad(g, 100, 150, 130, 40, ["#4f9a3e", "#3f8a34"]); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 1; g.strokeRect(104, 154, 122, 32); g.beginPath(); g.moveTo(165, 154); g.lineTo(165, 186); g.stroke();
    const bx = 165 + Math.sin(f / 25) * 40 + (since("cr_borgo", 2) < 60 ? since("cr_borgo", 2) : 0), by = 170 - Math.abs(Math.sin(f / 10)) * 6; circ(g, bx, by, 3, "#ffffff");
    // Trillo, il mufflo con le ali, che svolazza sulla bancarella
    const tx = 60, ty = 150 + Math.sin(f / 8) * 3, wing = Math.sin(f / 3) > 0 ? 4 : 1; circ(g, tx, ty, 7, "#ffffff"); circ(g, tx - 3, ty - 2, 1, "#2a2a6a"); circ(g, tx + 3, ty - 2, 1, "#2a2a6a"); px(g, tx - 11, ty - 4 - wing, 5, wing + 2, "#e8e0ff"); px(g, tx + 6, ty - 4 - wing, 5, wing + 2, "#e8e0ff");
    if (since("cr_borgo", 4) < 120) { g.fillStyle = "#fff"; g.font = "bold 8px Georgia, serif"; g.fillText("frrr!", tx + 10, ty - 10); }
    crTilt(g, W, H);
  }
  function bgCrBosco(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#0e2a2a", "#1a3a2a", "#12261c"]);
    // raggi di luce tra le foglie
    g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 4; i++) { const x = 30 + i * 80 + Math.sin(f / 100 + i) * 10; g.fillStyle = "rgba(200,255,200,.06)"; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 20, 0); g.lineTo(x + 60, H); g.lineTo(x + 30, H); g.fill(); } g.restore();
    // tronchi antichi su tre piani (parallasse)
    [[0.4, "#1a2a1e", 38], [0.7, "#24382a", 30], [1, "#2e4a30", 24]].forEach(([d, col, w], k) => { for (let i = 0; i < 5; i++) { const x = (i * 90 + k * 37) % (W + 60) - 30; px(g, x, 0, w * d, H, col); px(g, x + w * d - 3, 0, 3, H, "rgba(0,0,0,.2)"); } });
    // le radici che pendono e il tappeto di foglie
    vgrad(g, 0, 160, W, 40, ["#1f3a22", "#14281a"]); for (let i = 0; i < 40; i++) px(g, (i * 37) % W, 162 + (i * 11) % 34, 3, 1, "rgba(120,180,90,.4)");
    // la trivella di Ferrogrigio nella radura (toccala: tossisce)
    const cough = since("cr_bosco", 0) < 60; px(g, 200, 110, 40, 56, "#4a4a52"); px(g, 200, 110, 40, 4, "#8a8a9a"); px(g, 206, 120, 28, 18, "#2a2a33"); const lv = (f / 3) % 16; px(g, 208, 136 - lv, 24, lv, cough ? "#ff5a5a" : "#ffb347"); g.fillStyle = "#c0392b"; g.font = "bold 9px sans-serif"; g.fillText("FG·4", 206, 156);
    if (cough) for (let i = 0; i < 4; i++) circ(g, 220 + i * 6, 104 - i * 8, 4 + i, "rgba(150,150,150,.5)"); else { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 220, 130, 30, "255,180,70", 0.3); g.restore(); }
    // l'albero inciso con il canto
    px(g, 60, 60, 34, 120, "#3a4a2a"); px(g, 66, 96, 22, 30, "#2a3a1e"); g.fillStyle = since("cr_bosco", 1) < 150 ? "#ffe9a0" : "rgba(200,220,160,.6)"; g.font = "italic 6px Georgia, serif"; g.fillText("Quattro accesi", 64, 106); g.fillText("e il quinto", 66, 114); g.fillText("gioca con noi", 64, 122);
    // lucciole (toccale: si raccolgono in un cerchio)
    const gather = since("cr_bosco", 2) < 180; g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2 + f / 60, x = gather ? 150 + Math.cos(a) * 30 : (i * 53 + Math.sin(f / 40 + i) * 20) % W, y = gather ? 80 + Math.sin(a) * 30 : (i * 31 + Math.cos(f / 50 + i) * 15) % 160, tw = Math.max(0, Math.sin(f / 15 + i)); if (tw > 0.2) { glowB(g, x, y, 6, "200,255,120", tw * 0.6); px(g, x, y, 1.5, 1.5, "#eaffb0"); } }
    g.restore();
    // lo stagno
    ell(g, 290, 186, 40, 8, "#0a1e22"); for (let i = 0; i < 3; i++) px(g, 260 + i * 20 + Math.sin(f / 20 + i) * 3, 184, 6, 1, "rgba(200,255,150,.4)");
    crTilt(g, W, H);
  }
  function bgCrGrotta(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#1a120a", "#2a1e14", "#3a2a1a"]);
    // stalattiti
    for (let i = 0; i < 18; i++) { const x = i * 19 + 5, h = 18 + (i * 7) % 26; g.fillStyle = "#2e241a"; g.beginPath(); g.moveTo(x - 6, 0); g.lineTo(x + 6, 0); g.lineTo(x, h); g.fill(); if (i % 3 === 0) circ(g, x, h + ((f / 2 + i * 20) % 60), 1, "rgba(200,170,120,.6)"); }
    // il Grande Cristallo della Terra (toccalo: pulsa)
    const lit = toggled("cr_grotta", 0) ? false : true; crCrystal(g, 160, 82, since("cr_grotta", 0) < 30 ? 44 + since("cr_grotta", 0) * 0.2 : 44, "232,160,64", f, lit);
    px(g, 128, 126, 64, 10, "#5a4a3a"); px(g, 128, 126, 64, 2, "#8a7a6a");
    // i golem seduti (toccali: aprono gli occhi)
    [[50, 118], [270, 118]].forEach(([x, y], i) => { px(g, x - 14, y, 28, 30, "#6a5a4a"); px(g, x - 10, y - 16, 20, 18, "#7a6a5a"); px(g, x - 20, y + 6, 8, 18, "#6a5a4a"); px(g, x + 12, y + 6, 8, 18, "#6a5a4a"); const eye = since("cr_grotta", 1 + i) < 120 ? "#ffb347" : "#3a2a1a"; px(g, x - 6, y - 10, 3, 3, eye); px(g, x + 3, y - 10, 3, 3, eye); if (eye !== "#3a2a1a") { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, x, y - 9, 12, "255,180,70", 0.5); g.restore(); } g.fillStyle = "#3a2a1a"; g.font = "bold 9px serif"; g.fillText("1", x - 3, y + 16); });
    // cristalli d'ambra alle pareti e il lago color tè
    [[20, 170, 14], [96, 160, 10], [230, 164, 12], [300, 172, 16]].forEach(([x, y, h], i) => crCrystal(g, x, y, h, "232,160,64", f + i * 40, true));
    vgrad(g, 0, 178, W, 22, ["#3a2a14", "#22180c"]); for (let i = 0; i < 6; i++) px(g, (i * 60 + f / 2) % W, 186 + (i % 2) * 6, 12, 1, "rgba(255,200,120,.3)");
    crTilt(g, W, H);
  }
  function bgCrCielo(g, W, H, f) {
    // il ponte della Rondine Grigia in volo, tra le nuvole
    vgrad(g, 0, 0, W, H, ["#3a6ab8", "#7cb4ef", "#cfe6ff"]);
    for (let i = 0; i < 7; i++) crCloud(g, ((i * 70 - f * (0.4 + (i % 3) * 0.3)) % (W + 120) + W + 120) % (W + 120) - 60, 30 + (i * 37) % 120, 0.7 + (i % 3) * 0.3, 0.6);
    crIsle(g, 230 + Math.sin(f / 90) * 4, 60, 60, 40, "#7ab84a", "#7a6a8a", f, 4); crIsle(g, 40, 100 + Math.sin(f / 70) * 3, 34, 22, "#7ab84a", "#7a6a8a", f, 5);
    // il pallone d'aria e il timone
    ell(g, 160, 18, 150, 26, "#9aa5b1"); ell(g, 140, 10, 110, 10, "#c9d1d8"); for (let i = 0; i < 5; i++) px(g, 40 + i * 60, 30, 1, 120, "#5a3a2a");
    px(g, 0, 150, W, 50, "#8a5a3a"); for (let i = 0; i < 6; i++) px(g, 0, 152 + i * 8, W, 1, "rgba(0,0,0,.25)"); px(g, 0, 148, W, 4, "#c9a227");
    const wheel = since("cr_cielo", 0) < 90 ? since("cr_cielo", 0) / 8 : f / 120; g.save(); g.translate(270, 140); g.rotate(wheel); g.strokeStyle = "#6a3a1a"; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 16, 0, Math.PI * 2); g.stroke(); for (let i = 0; i < 8; i++) { g.rotate(Math.PI / 4); px(g, -1, 0, 2, 22, "#6a3a1a"); } g.restore();
    // la bandiera rossa al vento e la bussola d'ottone
    const fl = Math.sin(f / 6) * 3; g.fillStyle = "#c0392b"; g.beginPath(); g.moveTo(20, 60); g.lineTo(50, 64 + fl); g.lineTo(20, 74); g.fill(); px(g, 18, 56, 2, 94, "#5a3a2a");
    circ(g, 80, 140, 10, "#c9a227"); circ(g, 80, 140, 8, "#f0e6c8"); const na = since("cr_cielo", 1) < 120 ? f / 3 : Math.sin(f / 40) * 0.3; g.save(); g.translate(80, 140); g.rotate(na); px(g, -1, -7, 2, 7, "#c0392b"); px(g, -1, 0, 2, 7, "#2a2a33"); g.restore();
    crTilt(g, W, H);
  }
  function bgCrCitta(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#7cb4ef", "#bfe3ff", "#eaf6ff"]);
    for (let i = 0; i < 5; i++) crCloud(g, ((i * 90 + f * 0.15) % (W + 120)) - 60, 150 + (i * 13) % 40, 1.2, 0.8);
    // la città su tre terrazze di marmo
    crIsle(g, 20, 120, 280, 60, "#8fcf7a", "#a89a88", f, 6);
    [[40, 92, 50], [110, 70, 60], [200, 84, 70]].forEach(([x, y, w], i) => { px(g, x, y, w, 120 - y, "#f2f0ea"); px(g, x, y, w, 2, "#ffffff"); px(g, x + w - 4, y, 4, 120 - y, "rgba(0,0,0,.08)"); g.fillStyle = ["#3f6a9a", "#5a8aba", "#3f6a9a"][i]; g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x + w / 2, y - 16); g.lineTo(x + w + 4, y); g.fill(); for (let k = 0; k < 3; k++) px(g, x + 8 + k * (w / 3), y + 10, 6, 8, "#7aa8d8"); });
    // i mulini (toccali: girano più forte)
    const sp = since("cr_citta", 0) < 150 ? f / 6 : f / 30; [[65, 74], [240, 66]].forEach(([x, y], i) => { px(g, x - 2, y, 4, 18, "#e8e4dc"); g.save(); g.translate(x, y); g.rotate(sp + i); for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); px(g, -2, -20, 4, 18, "#ffffff"); px(g, -2, -20, 4, 3, "#3f6a9a"); } g.restore(); });
    // il Tempio del Vento con il Cristallo azzurro
    px(g, 128, 40, 64, 30, "#f2f0ea"); for (let i = 0; i < 5; i++) px(g, 132 + i * 13, 44, 4, 26, "#e4e2dc"); g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(122, 40); g.lineTo(160, 22); g.lineTo(198, 40); g.fill();
    crCrystal(g, 160, 52, 12, "159,224,255", f, toggled("cr_citta", 1) ? false : true);
    // gli aquiloni dei tifosi (toccali: volano)
    const fly = since("cr_citta", 2) < 200 ? since("cr_citta", 2) : 0; [[30, 30, "#e05a3a"], [280, 24, "#ffd36b"], [250, 50, "#3f6a9a"]].forEach(([x, y, c], i) => { const yy = y + Math.sin(f / 20 + i) * 4 - fly * 0.2; g.fillStyle = c; g.beginPath(); g.moveTo(x, yy - 8); g.lineTo(x + 6, yy); g.lineTo(x, yy + 8); g.lineTo(x - 6, yy); g.fill(); g.strokeStyle = "rgba(60,60,60,.5)"; g.lineWidth = 0.6; g.beginPath(); g.moveTo(x, yy + 8); g.quadraticCurveTo(x + 10, yy + 40, x - 4, 120); g.stroke(); });
    // petali al vento
    for (let i = 0; i < 18; i++) px(g, (i * 61 + f * (1 + (i % 3) * 0.5)) % W, (i * 37 + Math.sin(f / 15 + i) * 8) % 140, 2, 1.5, "rgba(255,180,200,.85)");
    // la nave d'oro del re che passa lontana
    if (since("cr_citta", 3) < 300) { const x = W - since("cr_citta", 3) * 1.2; ell(g, x, 18, 18, 6, "#c9a227"); px(g, x - 12, 22, 24, 4, "#8a6a1a"); }
    crTilt(g, W, H);
  }
  function bgCrForgia(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#1a0806", "#3a1008", "#7a2a10"]);
    // fumo e ciminiere
    for (let i = 0; i < 5; i++) { const x = 20 + i * 70; px(g, x, 30, 14, 90, "#1a1418"); px(g, x - 2, 28, 18, 4, "#2a2226"); for (let k = 0; k < 4; k++) circ(g, x + 7 + Math.sin(f / 30 + k + i) * 4, 24 - k * 9 - (f / 4 % 9), 5 + k * 2, `rgba(60,50,50,${0.5 - k * 0.1})`); }
    // la corazzata di Kael (toccala: accende i fari)
    const on = since("cr_forgia", 0) < 150; g.fillStyle = "#2a2a33"; g.beginPath(); g.moveTo(150, 70); g.lineTo(300, 70); g.lineTo(280, 96); g.lineTo(170, 96); g.closePath(); g.fill(); ell(g, 225, 50, 70, 20, "#3a3a44"); px(g, 160, 68, 130, 3, "#c0392b");
    for (let i = 0; i < 6; i++) { px(g, 176 + i * 18, 78, 6, 5, on ? "#fff6c8" : "#ffb347"); if (on) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 179 + i * 18, 80, 14, "255,240,200", 0.4); g.restore(); } }
    g.fillStyle = "#c0392b"; g.font = "bold 12px sans-serif"; g.fillText("FG", 214, 56);
    // il fiume di lava
    vgrad(g, 0, 150, W, 50, ["#ff7a2a", "#e04a10", "#a02a08"]); for (let i = 0; i < 10; i++) px(g, (i * 41 + f * 0.8) % W, 156 + (i * 7) % 36, 14, 2, "rgba(255,230,120,.7)");
    g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 160, 170, 160, "255,120,40", 0.25); g.restore();
    // l'incudine gigante con il martello (toccala: colpo e scintille)
    const hit = since("cr_forgia", 1); px(g, 30, 124, 60, 16, "#4a4a52"); px(g, 22, 124, 12, 8, "#4a4a52"); px(g, 44, 140, 32, 12, "#3a3a42"); px(g, 30, 124, 60, 2, "#8a8a9a");
    const ang = hit < 20 ? -1.2 + hit * 0.06 : -0.2; g.save(); g.translate(70, 104); g.rotate(ang); px(g, -2, 0, 4, 26, "#6a4a2a"); px(g, -9, -6, 18, 9, "#5a5a62"); g.restore();
    if (hit < 30) for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI - Math.PI, r = hit * 1.5; px(g, 60 + Math.cos(a) * r, 122 + Math.sin(a) * r * 0.6, 2, 2, "#ffd36b"); }
    // il Cristallo del Fuoco in catene
    const lit = toggled("cr_forgia", 2); crCrystal(g, 120, 108, 16, "255,90,58", f, !lit); g.strokeStyle = "#5a5a62"; g.lineWidth = 2; [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { g.beginPath(); g.moveTo(120, 108); g.lineTo(120 + a * 30, 108 + b * 22); g.stroke(); });
    // braci che salgono
    for (let i = 0; i < 30; i++) px(g, (i * 53 + Math.sin(f / 15 + i) * 6) % W, H - ((i * 37 + f * (0.6 + (i % 4) * 0.3)) % H), 2, 2, `rgba(255,${130 + (i % 5) * 20},40,.85)`);
    crTilt(g, W, H);
  }
  function bgCrAcqua(g, W, H, f) {
    vgrad(g, 0, 0, W, 110, ["#0e3a5a", "#1e6a9a", "#7cc8e8"]);
    // il tempio mezzo sommerso
    px(g, 90, 40, 140, 70, "#4a8aa8"); px(g, 90, 40, 140, 3, "#bfeefc"); g.fillStyle = "#5a9ab8"; g.beginPath(); g.moveTo(80, 40); g.lineTo(160, 12); g.lineTo(240, 40); g.fill();
    for (let i = 0; i < 6; i++) px(g, 100 + i * 22, 50, 8, 60, "#6aaac8");
    crCrystal(g, 160, 66, 14, "63,200,255", f, !toggled("cr_acqua", 0));
    // il mare con le onde e i riflessi del cristallo
    vgrad(g, 0, 100, W, 100, ["#2878a8", "#1e5a8a", "#0e3a5a"]);
    for (let r = 0; r < 6; r++) for (let i = 0; i < 9; i++) { const x = ((i * 40 + f * (0.3 + r * 0.1) + r * 17) % (W + 40)) - 20, y = 108 + r * 15; g.strokeStyle = `rgba(255,255,255,${0.35 - r * 0.04})`; g.lineWidth = 1; g.beginPath(); g.arc(x, y, 8, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 8; i++) px(g, 150 + Math.sin(f / 20 + i) * 6, 110 + i * 10, 20 - i * 2, 2, "rgba(120,220,255,.35)"); g.restore();
    // i tre cristalli dell'enigma (toccali: si accendono a turno)
    const k = since("cr_acqua", 1); [[40, 150, "232,160,64"], [280, 150, "159,224,255"], [160, 182, "255,90,58"]].forEach(([x, y, c], i) => { const on = k < 180 && k > i * 40; crCrystal(g, x, y, 10, c, f + i * 30, true); if (on) { g.save(); g.globalCompositeOperation = "lighter"; glowB(g, x, y, 34, c, 0.6); g.restore(); } });
    // il granchio portiere sullo scoglio
    ell(g, 260, 186, 24, 8, "#5a6a6a"); const cx = 260 + Math.sin(f / 10) * 8 + (since("cr_acqua", 2) < 30 ? 10 : 0); ell(g, cx, 176, 7, 4, "#e05a3a"); px(g, cx - 11, 172, 4, 3, "#e05a3a"); px(g, cx + 7, 172, 4, 3, "#e05a3a"); px(g, cx - 2, 171, 1, 2, "#111"); px(g, cx + 2, 171, 1, 2, "#111");
    // bolle
    for (let i = 0; i < 16; i++) { g.strokeStyle = "rgba(200,250,255,.5)"; g.beginPath(); g.arc((i * 47 + Math.sin(f / 30 + i) * 5) % W, H - ((i * 29 + f * 0.6) % 100), 1.5 + (i % 3), 0, Math.PI * 2); g.stroke(); }
    crTilt(g, W, H);
  }
  function bgCrCapitale(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#1a0e2a", "#3a2050", "#6a3a6a"]);
    // la cupola d'oro che ronza (toccala: si incrina)
    const crack = since("cr_capitale", 0) < 240; g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 5; i++) { g.strokeStyle = `rgba(255,210,120,${0.2 - i * 0.03})`; g.lineWidth = 2; g.beginPath(); g.arc(160, 220, 190 + i * 10 + Math.sin(f / 20 + i), Math.PI, 0); g.stroke(); } g.restore();
    if (crack) { g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(80, 60); g.lineTo(100, 80); g.lineTo(92, 96); g.moveTo(100, 80); g.lineTo(124, 84); g.stroke(); }
    // torri e palazzi dorati
    [[10, 90, 40], [60, 70, 30], [250, 80, 36], [290, 100, 30]].forEach(([x, y, w]) => { px(g, x, y, w, 200 - y, "#c9a227"); px(g, x + w - 4, y, 4, 200 - y, "rgba(0,0,0,.2)"); g.fillStyle = "#8a6a1a"; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + w / 2, y - 18); g.lineTo(x + w + 3, y); g.fill(); for (let k = 0; k < 4; k++) px(g, x + 6, y + 12 + k * 20, w - 12, 6, (f / 30 + k + x) % 5 < 1 ? "#fff6c8" : "#ffd98a"); });
    // lo Stadio della Corona
    ell(g, 160, 150, 110, 36, "#8a6a1a"); ell(g, 160, 150, 92, 26, "#3f7a3a"); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 1; g.beginPath(); g.ellipse(160, 150, 86, 22, 0, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(160, 128); g.lineTo(160, 172); g.stroke();
    for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, x = 160 + Math.cos(a) * 102, y = 150 + Math.sin(a) * 31, cheer = since("cr_capitale", 1) < 150 ? Math.abs(Math.sin(f / 4 + i)) * 3 : 0; px(g, x - 2, y - 3 - cheer, 4, 4, ["#c9a227", "#6a1a3a", "#ffffff"][i % 3]); }
    // la statua del re (toccala: ti guarda)
    px(g, 140, 60, 40, 8, "#c9a227"); px(g, 150, 30, 20, 30, "#e8c060"); circ(g, 160, 24, 9, "#f0d070"); px(g, 152, 12, 16, 5, "#c9a227"); const eye = since("cr_capitale", 2) < 90 ? "#c0392b" : "#8a6a1a"; px(g, 156, 22, 2, 2, eye); px(g, 162, 22, 2, 2, eye);
    crTilt(g, W, H);
  }
  function bgCrTrono(g, W, H, f) {
    vgrad(g, 0, 0, W, H, ["#0a0614", "#1e1030", "#2a1a3a"]);
    // colonne di cristallo nero piene di luce rubata
    [20, 70, 250, 300].forEach((x, i) => { px(g, x - 10, 0, 20, H, "#14101e"); px(g, x - 10, 0, 3, H, "rgba(255,255,255,.08)"); for (let k = 0; k < 5; k++) { const y = (k * 47 + f * (0.4 + i * 0.1)) % H; circ(g, x + Math.sin(f / 20 + k) * 4, y, 3, ["rgba(232,160,64,.8)", "rgba(159,224,255,.8)", "rgba(255,90,58,.8)", "rgba(63,200,255,.8)"][(k + i) % 4]); } });
    // il tappeto porpora e il trono
    g.fillStyle = "#6a1a3a"; g.beginPath(); g.moveTo(140, H); g.lineTo(180, H); g.lineTo(168, 110); g.lineTo(152, 110); g.fill(); px(g, 150, 110, 20, 2, "#c9a227");
    px(g, 136, 40, 48, 74, "#6a1a3a"); px(g, 136, 40, 48, 4, "#c9a227"); px(g, 130, 96, 60, 16, "#c9a227"); px(g, 146, 50, 28, 40, "#8a2a4a");
    // il re sul trono (toccalo: invecchia per un istante)
    const old = since("cr_trono", 0) < 90; circ(g, 160, 62, 9, old ? "#d8c8b0" : "#f2d8c0"); px(g, 150, 70, 20, 24, "#6a1a3a"); px(g, 151, 51, 18, 4, "#c9a227"); for (let i = 0; i < 3; i++) px(g, 152 + i * 7, 47, 3, 4, "#c9a227"); px(g, 152, 64, 16, 10, old ? "#ffffff" : "#e8e8e8");
    // la gabbia di luce con Aira (toccala: Aira alza la mano)
    const ax = 110, ay = 150; g.strokeStyle = `rgba(255,240,180,${0.5 + 0.2 * Math.sin(f / 10)})`; g.lineWidth = 1.5; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(ax - 15 + i * 5, ay - 34); g.lineTo(ax - 15 + i * 5, ay + 14); g.stroke(); }
    px(g, ax - 5, ay - 8, 10, 14, "#3fa7ff"); circ(g, ax, ay - 14, 6, "#f2d0b8"); px(g, ax - 7, ay - 22, 14, 5, "#d9d4e8"); if (since("cr_trono", 1) < 120) { px(g, ax + 5, ay - 20, 3, 10, "#f2d0b8"); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, ax + 6, ay - 22, 14, "255,240,180", 0.6); g.restore(); }
    // i quattro frammenti sui piedistalli
    [[200, 150, "232,160,64"], [225, 170, "159,224,255"], [250, 150, "255,90,58"], [275, 170, "63,200,255"]].forEach(([x, y, c], i) => { px(g, x - 6, y + 6, 12, 14, "#c9a227"); crCrystal(g, x, y, 8, c, f + i * 20, !toggled("cr_trono", 2)); });
    crTilt(g, W, H);
  }
  function bgCrFinale(g, W, H, f) {
    // l'alba su Calcistea: isole, mare di nuvole e una partita sul prato
    vgrad(g, 0, 0, W, 140, ["#3a4a9a", "#e88aa0", "#ffd07a", "#fff0c0"]);
    g.save(); g.globalCompositeOperation = "lighter"; glowB(g, 160, 120, 90, "255,220,150", 0.6); g.restore(); circ(g, 160, 120, 22, "#fff6d8");
    for (let i = 0; i < 6; i++) crCloud(g, ((i * 70 + f * 0.2) % (W + 100)) - 50, 120 + (i * 11) % 30, 1, 0.75);
    crIsle(g, 20, 70 + Math.sin(f / 80) * 2, 50, 30, "#7ab84a", "#8a6a7a", f, 7); crIsle(g, 250, 60 + Math.sin(f / 70) * 2, 50, 30, "#7ab84a", "#8a6a7a", f, 8);
    vgrad(g, 0, 150, W, 50, ["#6ab84a", "#4f9a3e"]); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 1; g.strokeRect(60, 156, 200, 36);
    // i giocatori: il gruppo al completo (toccali: esultano)
    const jump = since("cr_finale", 0) < 120; [["#3f5fbf", 90], ["#3fa7ff", 120], ["#a8862a", 150], ["#7a4ab0", 180], ["#ffffff", 210]].forEach(([c, x], i) => { const y = 176 - (jump ? Math.abs(Math.sin(f / 5 + i)) * 6 : 0); px(g, x - 3, y - 6, 6, 8, c); circ(g, x, y - 9, 3, "#f0d0b0"); });
    const bx = 160 + Math.sin(f / 18) * 60, by = 172 - Math.abs(Math.sin(f / 9)) * 12; circ(g, bx, by, 3, "#fff"); g.save(); g.globalCompositeOperation = "lighter"; glowB(g, bx, by, 10, "255,240,180", since("cr_finale", 1) < 120 ? 0.8 : 0.3); g.restore();
    // i quattro cristalli nel cielo
    [[50, 30, "232,160,64"], [120, 22, "159,224,255"], [200, 22, "255,90,58"], [270, 30, "63,200,255"]].forEach(([x, y, c], i) => crCrystal(g, x, y, 7, c, f + i * 25, true));
    crTilt(g, W, H);
  }
  // elementi interattivi: [x, y, w, h, frase, azione?("tog" = acceso/spento)]
  const LB = {
    lb_copertina: { draw: bgCopertina, hot: [
      [30, 70, 30, 56, "🕯️ Candela: «Brucia da sola, come chi legge di notte.»", "tog"],
      [256, 60, 50, 70, "🪶 Calamaio: l'inchiostro respira. La piuma si muove, come se volesse finire una frase."],
      [214, 92, 34, 26, "📕 Il morso sull'angolo: netto, dritto. Non sembrano denti. Sembra il taglio di un pennino."],
      [228, 14, 74, 70, "🌧️ Finestra: le gocce sul vetro, per un attimo, formano delle parole."],
      [0, 96, 40, 44, "🐈 Il gatto della libreria: apre un occhio, ti giudica, decide che vai bene."],
    ] },
    lb_libreria: { draw: bgLibreria, hot: [
      [94, 14, 20, 30, "🔔 Il campanello della porta: suona da solo quando entra qualcuno che sa leggere."],
      [112, 14, 96, 78, "🌧️ La vetrina: fuori piove sul vicolo. Dentro, i libri si tengono caldi a vicenda."],
      [0, 10, 100, 120, "📚 Scaffale delle fiabe: «Cenerentola (ultima pagina strappata)», «Pollicino (finale mancante)», «Biancaneve (si interrompe a metà)»."],
      [130, 110, 60, 30, "📖 Il leggio: un libro aperto che brilla. Le righe scorrono come se qualcuno lo stesse leggendo ad alta voce."],
      [6, 128, 34, 56, "💡 La lampada da lettura: la accendi e la spegni. Clic. Clic. Le ombre dei libri ti salutano.", "tog"],
      [250, 134, 58, 30, "🪧 «Torno subito (dal 1987)». Sotto, a matita: «Ada P.». Una calligrafia minuta."],
    ] },
    lb_radura: { draw: bgRadura, hot: [
      [236, 14, 54, 52, "☀️ Il sole è una macchia d'inchiostro dorato. Lo tocchi: si allarga un poco, come una risata."],
      [98, 118, 40, 34, "🐇 Un coniglio di carta: saltella via. Dietro di sé lascia piccole virgole sul prato."],
      [40, 60, 52, 66, "🌬️ Il mulino di carta: gira più forte quando qualcuno lo guarda."],
      [60, 40, 200, 30, "🍂 Le lettere cadono come petali. Per un attimo si mettono in fila: «C'ERA UNA VOLTA»."],
      [182, 146, 36, 54, "⬜ Il fiume bianco: un pezzo di pagina mangiato. Ci vorrebbe un PONTE."],
    ] },
    lb_bosco: { draw: bgBosco, hot: [
      [112, 74, 86, 76, "🏡 La casetta del Sig. Lupo: dal camino esce fumo profumato di tè alla bergamotto."],
      [236, 38, 40, 32, "🦉 Il gufo: sbatte le palpebre in ritardo, come chi rilegge una frase."],
      [0, 100, 110, 50, "✨ Lucciole: toccale e se ne accendono altre, come virgole luminose."],
      [30, 150, 90, 24, "🍄 Funghi: uno cresce di colpo, offeso di non essere stato notato prima."],
      [282, 140, 38, 60, "🌑 Il sentiero buio: due occhi gialli. Non è il Lupo. Il Lupo è in casa, a piangere."],
    ] },
    lb_campo3p: { draw: bgCampo3p, hot: [
      [20, 60, 70, 64, "🌾 La casa di paglia: traballa anche se nessuno soffia. Per abitudine."],
      [126, 46, 70, 74, "🪵 La casa di legno: accendi e spegni le finestre. Dentro, qualcuno ripassa la tattica.", "tog"],
      [232, 18, 80, 100, "🧱 La casa di mattoni: la bandiera rosa di Mattone sventola più forte quando la guardi."],
      [90, 98, 34, 22, "🔢 Il tabellone: per un attimo segna «???». Questa partita non ha ancora un finale."],
      [0, 118, 320, 14, "🎏 Le bandierine: sventolano tutte insieme, come un tifo che non sa per chi."],
    ] },
    lb_corte: { draw: bgCorte, hot: [
      [100, 20, 110, 116, "🃏 Il castello di carte: lo tocchi e trema tutto. Nessuno respira finché non smette."],
      [0, 108, 90, 26, "🌹 Le rose: il Sette di Cuori le ridipinge di nero. «È un libro inciso, signore: il rosso costa caro.»"],
      [244, 76, 32, 52, "♠ Il Due di Picche saluta con la lancia. Poi si accorge che non sei la Regina e fa finta di grattarsi."],
      [286, 130, 30, 40, "🤡 Il Jolly fa una capriola. «Io posso essere qualsiasi carta. Oggi sono di buonumore.»"],
      [170, 112, 60, 46, "⛲ La fontana: dentro galleggiano carte bagnate. Una è un asso. Nessuno ha il coraggio di prenderlo."],
    ] },
    lb_trono: { draw: bgTrono, hot: [
      [38, 16, 44, 70, "♠ La vetrata di Picche si accende. Sotto, inciso: «Chi non perde mai, non finisce mai»."],
      [238, 16, 44, 70, "♥ La vetrata di Cuori brilla. È quella del Fante: c'è un cuore inciso a mano, un po' storto."],
      [200, 108, 42, 20, "✉️ L'invito sigillato: «Il Torneo delle Fiabe accetta uno sfidante. Uno solo. Da trentanove anni»."],
      [90, 110, 22, 60, "🕯️ Il candelabro: lo spegni e lo riaccendi. Le ombre delle carte si inchinano.", "tog"],
      [132, 44, 56, 70, "👑 Il trono di Picche. Il cuscino è consumato da una parte sola: la Regina si siede sempre di sbieco, pronta a scattare."],
    ] },
    lb_labirinto: { draw: bgLabirinto, hot: [
      [40, 14, 44, 42, "🌙 La luna incisa: per un attimo si fa piena, poi torna a spicchio, come se avesse cambiato idea."],
      [140, 124, 40, 24, "👀 La tana: due occhietti. Poi una testolina grigia e tonda che ti guarda e sparisce. Era tonda. Molto tonda."],
      [0, 172, 320, 26, "〰️ Il fiume d'inchiostro: scorre lento. Se ci fosse un MURO, a monte, si fermerebbe."],
      [0, 90, 100, 80, "🌹 Le rose sulle siepi sbocciano quando le guardi. Sono incise: profumano di legno."],
    ] },
    lb_torneo: { draw: bgTorneo, hot: [
      [0, 40, 110, 62, "📣 Le tribune di carte: saltano tutte insieme. Fa un rumore di mazzo mescolato."],
      [106, 0, 108, 46, "🚩 Lo stendardo di Picche: sventola più forte. La Regina, da qualche parte, ha sentito."],
      [286, 126, 30, 54, "🥅 La porta della Regina: una saracinesca di carte. La apri e la chiudi: dietro c'è un muro. Non le serve una porta: le serve un muro.", "tog"],
      [20, 78, 58, 26, "🔢 Il tabellone: «Gol subiti dalla Regina: 0, dal 1450». Lo tocchi e scrive «MAI!» da solo, offeso."],
      [242, 66, 40, 34, "🎙️ Il Jolly telecronista prova il cono: «CHE PARATAAA!». Non c'era nessun tiro. Si allena."],
    ] },
    lb_vignette: { draw: bgVignette, hot: [
      [150, 10, 60, 40, "🎬 Il cinema: «STASERA: IL FINALE!». Qualcuno ci ha tirato una riga sopra. Una riga dritta."],
      [208, 30, 56, 120, "🏢 Il palazzo verde: accendi tutte le finestre. In ogni finestra un vicino ti saluta. Senza dire niente: gli hanno rubato i balloon."],
      [10, 52, 300, 40, "💬 I balloon rubati volano via legati a un filo. Ognuno ha dentro una parola che qualcuno non ha potuto dire."],
      [4, 154, 122, 20, "🟨 La didascalia gialla cambia da sola: «INTANTO, DA QUALCHE PARTE…». Le didascalie sono le portinaie dei fumetti."],
      [256, 140, 40, 42, "🤷 Un passante muto gesticola. Vuol dire: «Hanno preso anche il mio buongiorno»."],
    ] },
    lb_tipografia: { draw: bgTipografia, hot: [
      [110, 70, 140, 80, "⚙️ Il grande torchio: lo tocchi e accelera. Stampa pagine nuove al ritmo di un cuore emozionato."],
      [10, 100, 80, 70, "🔠 I caratteri mobili: si illuminano come una tastiera. A, B, C… manca solo la F di FINE."],
      [262, 112, 36, 52, "📝 L'ordine appeso: «Rilegare senza l'ultima pagina». Firmato con una N elegante, piena di riccioli."],
      [40, 166, 50, 30, "🔧 CLANG! Una chiave inglese cade da sola. In tipografia le cose cadono quando hanno qualcosa da dire."],
    ] },
    lb_tetti: { draw: bgTetti, hot: [
      [180, 30, 40, 70, "🎩 La sagoma sul tetto più alto: si volta. Due occhi gialli. Poi torna a guardare la città, come se la stesse raccontando."],
      [10, 24, 300, 40, "☁️ Le nuvolette galleggiano sopra i tetti. Toccale e si riempiono: «FINE?» «NO!» «MAI» «…»."],
      [186, 60, 30, 40, "📡 L'antenna: BZZ. Capta una voce lontanissima che legge ad alta voce. È una voce di donna."],
      [0, 120, 160, 80, "📄 Una pagina si strappa dal bordo del libro e vola via: RRRIP! Il libro sta perdendo pezzi."],
    ] },
    lb_bozza: { draw: bgBozza, hot: [
      [228, 56, 68, 88, "✏️ Il palazzo a fumetti, a matita: per un attimo si colora di giallo. Si ricorda com'era."],
      [164, 104, 46, 82, "👋 La Bozza ti saluta con una mano che è ancora solo una riga. «Da finire», c'è scritto sotto."],
      [40, 20, 180, 50, "✏️ La matita gigante disegna da sola. Ogni tanto si ferma, come se aspettasse un suggerimento."],
      [20, 170, 280, 24, "🩷 Briciole di gomma: il Bianco è passato di qui. Odorano di quaderno nuovo."],
      [0, 0, 40, 200, "⬜ Il Bianco, dal bordo: cancella piano, con pazienza. Non è cattivo. È solo quello che succede alle storie lasciate a metà."],
    ] },
    lb_margine: { draw: bgMargine, hot: [
      [250, 10, 40, 40, "💡 Di là dal bordo, la lampada della libreria vera. La spegni e la riaccendi. È enorme. È calda.", "tog"],
      [200, 100, 70, 100, "☝️ Un dito gigantesco tiene ferma la pagina. Qualcuno, fuori, sta leggendo. Si sposta appena, come per non disturbare."],
      [40, 90, 100, 80, "🪑 La scrivania dell'Autrice, a matita. Sopra, una tazza e un biglietto: «Torno subito» — A."],
      [140, 180, 50, 16, "📄 «pag. 213». L'ultima pagina numerata del libro. Dopo, i numeri finiscono."],
    ] },
    lb_ultima: { draw: bgUltima, hot: [
      [0, 26, 320, 50, "📣 Le tribune a matita si alzano tutte: sono i personaggi delle fiabe. Ti fanno il tifo con la voce che gli hai ridato."],
      [300, 124, 18, 40, "🥅 La porta di destra è solo tratteggiata. Diventerà vera quando qualcuno ci segnerà dentro."],
      [134, 2, 52, 24, "🔢 Il tabellone: «? – ?». Poi, per un istante, «FINE». Poi di nuovo «? – ?»."],
      [146, 130, 28, 28, "⚽ Il pallone: l'unica cosa colorata della pagina. Brilla quando lo guardi."],
    ] },
    lb_alba: { draw: bgAlba, hot: [
      [112, 14, 96, 78, "🌅 L'alba sulla città. Passano tre rondini. La pioggia è finita."],
      [126, 108, 68, 30, "📕 Il libro, chiuso. Il titolo adesso è intero: «Il Libro delle Partite che Finiscono Bene»."],
      [250, 134, 58, 30, "🪧 Il cartello sulla porta: lo giri. «APERTO» da una parte, «Torno subito» dall'altra.", "tog"],
    ] },
    dt_atrio: { draw: bgDtAtrio, hot: [
      [128, 64, 64, 56, "🛗 L'ascensore: le porte si aprono da sole, su nessuno. «Ding», dice. È gentile. È sempre gentile."],
      [70, 108, 24, 16, "🛎️ Il campanello della reception: lo suoni e da qualche parte, lontano, qualcuno sorride a comando."],
      [262, 26, 42, 52, "🙂 Il manifesto «SEI DENTRO»: per un istante cambia scritta. Hai letto «ANCORA»?"],
      [244, 92, 36, 52, "🪴 Una pianta potata al millimetro. Tocchi una foglia: è vera. Ti stupisce più del dovuto."],
    ] },
    dt_uffici: { draw: bgDtUffici, hot: [
      [136, 62, 50, 36, "🖥️ Un terminale: scrive da solo «CHI SEI?». Poi cancella. Poi scrive «BUONGIORNO»."],
      [120, 16, 82, 40, "🪟 La finestra decorativa: per un attimo, dietro, vedi il mare. Poi torna bianca."],
      [276, 110, 30, 56, "☕ La macchina del caffè fa il caffè «Conformità»: gusto neutro, temperatura perfetta."],
      [4, 104, 24, 62, "💧 Il distributore d'acqua fa una bolla. Unico rumore libero del reparto."],
      [232, 52, 34, 72, "🚪 La porta numero 8. Nella pianta ufficiale le porte del piano sono sette."],
    ] },
    dt_campo: { draw: bgDtCampo, hot: [
      [92, 8, 136, 40, "📺 Il maxischermo ti fa i complimenti col tuo numero. Non ricordi di averglielo detto."],
      [0, 50, 320, 44, "🧍 Le sagome di cartone in tribuna si girano tutte verso di te. Arancioni, per un istante. Poi grigie."],
      [252, 156, 56, 28, "🎧 La cuffia sulla panchina si accende da sola: dentro, un respiro."],
      [8, 18, 72, 32, "🪟 La tribuna della direttrice: un vetro, un sorriso, una tazza bianca."],
    ] },
    dt_porto: { draw: bgDtPorto, hot: [
      [230, 116, 76, 20, "🍹 L'insegna del Bar Marea lampeggia: è Nina che la accende e la spegne per dire «sono aperta»."],
      [0, 92, 200, 30, "💡 Le lucine sui fili: si accendono a onde, come un coro che non sa le parole."],
      [196, 18, 118, 86, "🏟️ Il vecchio Stadio del Porto: i fari si accendono per un attimo. Qualcuno, lì dentro, ha ancora le chiavi."],
      [80, 104, 60, 44, "⛵ Una barca si abbassa all'improvviso: un gabbiano ci è salito sopra con tutta la sua autorità."],
      [146, 132, 38, 34, "🚪 L'ingresso del personale del Complesso: bianco, pulito, fuori posto tra i muri di mattoni."],
    ] },
    dt_giostre: { draw: bgDtGiostre, hot: [
      [24, 20, 92, 92, "🎡 La ruota panoramica è ferma da tre anni. La tocchi e, per un attimo, gira. Qualcuno ha ancora la corrente."],
      [132, 66, 108, 70, "🎠 La giostra dei cavalli: si accende, i cavalli salgono e scendono. Dentro c'è una luce di schermi: il covo del Cartografo."],
      [244, 78, 74, 60, "🥅 La gabbia di rete: un pallone rimbalza da solo contro la rete. «Qui si gioca senza regole. Cioè: con le nostre»."],
      [60, 152, 200, 18, "🟩 «IL 14 NON È MORTO». La vernice verde è ancora fresca."],
      [10, 168, 68, 22, "🪧 Il cartello del luna park: lo giri. «CHIUSO» da una parte, «RIAPRE PRESTO» dall'altra.", "tog"],
    ] },
    dt_archivio: { draw: bgDtArchivio, hot: [
      [118, 118, 84, 54, "🖥️ Il terminale mostra il registro dell'Armadietto 7: chi ha messo ogni biglietto, e con che inchiostro."],
      [214, 128, 70, 52, "📼 Il registratore a bobine: le bobine girano. Una voce, piano: «…sono io. Se mi senti…». Poi silenzio."],
      [4, 118, 36, 64, "🚪 La porta numero 8: la apri e la chiudi. Dall'altra parte, il ronzio del Reparto Morale.", "tog"],
      [20, 26, 290, 90, "🗂️ Faldoni a perdita d'occhio: «Procedura Duale · contratti». Uno ha il tuo numero sulla costola. E sotto, a matita, un 14."],
    ] },
    dt_sala: { draw: bgDtSala, hot: [
      [0, 6, 320, 94, "📺 Gli schermi: un occhio, una bocca, il tuo numero. Tutti ti guardano. Per un attimo si colorano d'arancio, come un tramonto sul porto."],
      [100, 108, 120, 64, "📼 Il registratore grande: le bobine girano veloci. La voce che ne esce è la tua."],
      [244, 100, 34, 82, "🎙️ Il microfono: la luce REC si accende. Qualcuno, qui, ha parlato a lungo. E poi ha detto «basta»."],
      [30, 120, 50, 60, "🪑 La sedia davanti al microfono: verde acqua, consumata su un bracciolo solo. Il tuo."],
    ] },
    dt_stadio: { draw: bgDtStadio, hot: [
      [8, 0, 30, 50, "💡 I fari dello stadio: li spegni e li riaccendi. Il Cartografo ruba bene la corrente.", "tog"],
      [140, 136, 40, 30, "⚪ Il dischetto del rigore. Brilla. Ci sei già stato. Tre anni fa. Ultimo minuto."],
      [166, 146, 20, 20, "⚽ Un pallone vecchio, sgonfio. Lo tocchi e per un attimo torna bianco, nuovo, pronto."],
      [26, 172, 118, 22, "🏳️ Lo striscione strappato: «SEMPRE CON TE, 14». Nessuno l'ha mai tolto."],
    ] },
    dt_rigore: { draw: bgDtRigore, hot: [
      [0, 12, 320, 60, "📣 Il pubblico: metà verde acqua, metà mattone. Saltano tutti. Per motivi opposti."],
      [120, 96, 80, 44, "🧤 Il portiere: si butta da una parte prima ancora che tu tiri. Ti conosce. O conosce il 14."],
      [4, 156, 126, 36, "🎧 La cuffia: «Non tirare. Passalo.» La tua voce, di tre anni fa."],
    ] },
    cr_borgo: { draw: bgCrBorgo, hot: [
      [70, 100, 50, 30, "🪟 Il Municipio: le finestre si accendono e si spengono. Nonna Ortensia sta cercando gli occhiali.", "tog"],
      [146, 84, 26, 50, "💡 La Lampada del Campo: per un attimo brilla forte, come una volta. Poi torna a tremare."],
      [100, 150, 130, 40, "⚽ Il campo del borgo: il pallone scappa da solo verso la porta. Anche lui ha voglia di giocare."],
      [0, 30, 320, 50, "✈️ Un'aeronave passa lontana tra le isole. Grigia, con una bandiera rossa."],
      [46, 136, 30, 28, "🐑 Trillo svolazza sulla bancarella: «frrr! Mele del cielo, gratis per gli eroi!»"],
    ] },
    cr_bosco: { draw: bgCrBosco, hot: [
      [196, 104, 48, 64, "⚙️ La trivella di Ferrogrigio tossisce e sputa fumo grigio. Dentro, luce d'ambra che non le appartiene."],
      [56, 92, 42, 40, "🌳 L'albero inciso: «Quattro accesi a guardia del cielo, e il quinto gioca con noi sul prato»."],
      [100, 30, 120, 100, "✨ Le lucciole si radunano in cerchio, come giocatori prima del calcio d'inizio."],
      [250, 176, 70, 20, "💧 Lo stagno nero: le lucciole ci si specchiano e diventano il doppio."],
    ] },
    cr_grotta: { draw: bgCrGrotta, hot: [
      [130, 34, 60, 96, "💎 Il Cristallo della Terra: lo tocchi e si spegne, poi si riaccende. Come un cuore che ha deciso di continuare.", "tog"],
      [30, 96, 42, 56, "🗿 Il golem di sinistra apre gli occhi color ambra. Ti guarda. Torna a dormire."],
      [250, 96, 42, 56, "🗿 Il golem di destra apre gli occhi. Sul petto ha un 1: il numero dei portieri."],
      [0, 178, 320, 22, "🍵 Il lago color tè: sul fondo, palloni di pietra lasciati come offerte dagli antichi giocatori."],
    ] },
    cr_cielo: { draw: bgCrCielo, hot: [
      [248, 118, 44, 44, "🛞 Il timone della Rondine Grigia: lo giri e l'aeronave vira. Vela, da qualche parte: «EHI!»"],
      [68, 128, 24, 24, "🧭 La bussola d'ottone gira come impazzita. Poi punta verso un'isola che non c'è sulle mappe."],
      [14, 54, 40, 24, "🚩 La bandiera rossa della Rondine Grigia: schiocca al vento come un applauso."],
      [200, 40, 100, 70, "🏝️ Un'isola sospesa: sotto, le radici pendono nel vuoto come capelli spettinati."],
    ] },
    cr_citta: { draw: bgCrCitta, hot: [
      [40, 50, 50, 50, "🌬️ Il mulino gira più forte: il vento ha visto che lo guardavi."],
      [140, 30, 40, 40, "💎 Il Cristallo del Vento: lo tocchi e trattiene il respiro. Poi lo lascia andare, piano.", "tog"],
      [0, 10, 320, 50, "🪁 Gli aquiloni dei tifosi tirano i fili e salgono, salgono, come se volessero vedere la partita dall'alto."],
      [220, 0, 100, 30, "⛵ Una nave d'oro, lontana, con lo stemma del re. Va verso est. Verso la capitale."],
    ] },
    cr_forgia: { draw: bgCrForgia, hot: [
      [150, 30, 150, 66, "🚢 La corazzata di Kael accende i fari. Per un attimo la Forgia sembra giorno."],
      [20, 96, 72, 56, "🔨 Il martello cade sull'incudine: DONG. Scintille dappertutto. Bram sorride per la prima volta da giorni."],
      [96, 84, 48, 50, "🔥 Il Cristallo del Fuoco tra le catene: lo tocchi e la luce si spegne, poi torna, più rossa.", "tog"],
      [0, 150, 320, 50, "🌋 Il fiume di lava: dentro, ogni tanto, un riflesso a forma di pallone."],
    ] },
    cr_acqua: { draw: bgCrAcqua, hot: [
      [140, 44, 40, 44, "💧 Il Cristallo dell'Acqua: lo tocchi e trattiene la marea. Poi la lascia andare, come un respiro.", "tog"],
      [20, 130, 280, 66, "✨ I tre cristalli dell'enigma si accendono a turno: ambra, cielo, brace. Prima ciò che sorregge, poi ciò che solleva, poi ciò che scalda."],
      [236, 166, 50, 26, "🦀 Il granchio portiere si butta a destra. Para un'onda. Esulta."],
    ] },
    cr_capitale: { draw: bgCrCapitale, hot: [
      [40, 20, 120, 80, "🛡️ La cupola d'oro: la tocchi e si incrina. Da fuori, per un attimo, entra l'odore del vento vero."],
      [50, 110, 220, 80, "🏟️ Lo Stadio della Corona: le tribune saltano tutte insieme. Per la prima volta da trent'anni, senza il cartello «APPLAUSI»."],
      [140, 4, 40, 64, "🗿 La statua d'oro del re: gli occhi si accendono di rosso e ti guardano. Poi tornano d'oro."],
    ] },
    cr_trono: { draw: bgCrTrono, hot: [
      [130, 40, 60, 74, "👑 Il re sul trono: per un istante i suoi capelli diventano bianchi. Ottant'anni, in un battito di ciglia."],
      [90, 110, 40, 70, "✋ Nella gabbia di luce, Aira alza la mano. Un passaggio filtrante. Sai già dove andrà il pallone."],
      [188, 130, 100, 60, "💎 I quattro frammenti dei Cristalli: li tocchi e si spengono, poi si riaccendono, liberi.", "tog"],
    ] },
    cr_finale: { draw: bgCrFinale, hot: [
      [70, 150, 160, 40, "🙌 Il gruppo esulta: Bram, Vela, Trillo, Aira e tu. Anche il fabbro, sì. Quasi sorride."],
      [100, 150, 120, 30, "⚽ Il pallone fa una curva strana e si illumina. Quella è Aira, dicono."],
      [30, 10, 260, 40, "🌅 I quattro Cristalli nel cielo dell'alba: Terra, Vento, Fuoco, Acqua. Brillano come non brillavano da ottant'anni."],
    ] },
  };
  window.__lbBg = { LB, since, S, register: (k, def) => { LB[k] = def; } };

  function drawMarkers(g, k, f) {
    const def = LB[k]; if (!def || !def.hot) return;
    def.hot.forEach((h, i) => {
      if (since(k, i) < 60) return;
      const x = h[0] + h[2] / 2, y = h[1] + h[3] / 2, a = 0.35 + 0.25 * Math.sin(f / 14 + i * 1.7);
      g.save(); g.globalCompositeOperation = "lighter"; glowB(g, x, y, 7, "255,240,190", a); g.restore();
      px(g, x - 1, y - 3, 2, 6, `rgba(255,255,255,${a + 0.2})`); px(g, x - 3, y - 1, 6, 2, `rgba(255,255,255,${a + 0.2})`);
    });
  }
  function drawCaption(g, W) {
    if (!S.cap) return; const age = (now() - S.capT) / 16; if (age > 230) { S.cap = null; return; }
    const a = Math.min(1, (230 - age) / 30);
    g.save(); g.font = "9px Georgia, serif";
    const words = S.cap.split(" "), out = []; let line = "";
    words.forEach((w) => { const t = line ? line + " " + w : w; if (g.measureText(t).width > W - 28) { out.push(line); line = w; } else line = t; }); if (line) out.push(line);
    const h = out.length * 11 + 8;
    g.globalAlpha = a; px(g, 6, 4, W - 12, h, "rgba(251,247,236,.94)"); px(g, 6, 4, W - 12, 1, "#3b3a4a"); px(g, 6, 3 + h, W - 12, 1, "#3b3a4a");
    g.fillStyle = "#2a2838"; out.forEach((l, i) => g.fillText(l, 13, 15 + i * 11));
    g.restore();
  }
  let bound = false;
  function bind() {
    if (bound) return; const cv = document.getElementById("cv"); if (!cv) return; bound = true;
    cv.addEventListener("pointerdown", (e) => {
      const L = S.last; if (!LB[L.k] || now() - L.t > 250) return;
      const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * L.W, y = ((e.clientY - r.top) / r.height) * L.H;
      const hot = LB[L.k].hot || []; let idx = -1;
      for (let i = hot.length - 1; i >= 0; i--) { const h = hot[i]; if (x >= h[0] && x <= h[0] + h[2] && y >= h[1] && y <= h[1] + h[3]) { idx = i; break; } }
      if (idx < 0) return;
      const h = hot[idx]; S.act[L.k + ":" + idx] = now(); if (h[5] === "tog") S.act["tog:" + L.k + ":" + idx] = !S.act["tog:" + L.k + ":" + idx];
      S.cap = h[4]; S.capT = now();
      try { if (window.__libroFinali && window.__libroFinali.SFX) window.__libroFinali.SFX.page(); } catch (er) {}
    });
  }
  const prev = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    const def = LB[kind];
    if (def) {
      bind();
      W = W || 320; H = H || 200; const f = frame || 0;
      try { def.draw(g, W, H, f); } catch (e) { px(g, 0, 0, W, H, "#f4ecd8"); }
      S.last = { k: kind, t: now(), W, H };
      try { drawMarkers(g, kind, f); drawCaption(g, W); } catch (e) {}
      return true;
    }
    return typeof prev === "function" ? prev.apply(this, arguments) : false;
  };
})();
