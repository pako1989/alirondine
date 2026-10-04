// ================= v18 · CALCIO D'AZIONE PRO (GRAFICA & GAMEPLAY AVANZATO) =================
// Modulo opzionale per Calcio d'azione:
// - Sprite dettagliati con capelli, pelle, divise personalizzate e numeri di maglia
// - Tasto "Finta" (Roulette / Sombrero acrobatico) con invulnerabilità temporanea
// - Barra "Furia della Rondine" (Overdrive dorato con velocità e tiri infuocati)
// - Scie particellari cometa sui tiri speciali, fumo e zolle d'erba nelle scivolate
// - Rete della porta animata con fisica di impatto
// - Campo speciale "Molo al tramonto" con onde marine e scogliera dorata
(function () {
  const AP = {
    particles: [],
    ballTrail: [],
    netShakeL: 0,
    netShakeR: 0,
    seaWaves: 0,
  };

  window.isProActionFxEnabled = function () {
    try {
      if (window.SET && window.SET.proActionFx === false) return false;
      return true;
    } catch (e) {
      return true;
    }
  };

  window.azProTriggerNetShake = function (side) {
    if (!window.isProActionFxEnabled()) return;
    if (side === 0 || side === "left") AP.netShakeL = 30;
    else AP.netShakeR = 30;
  };

  window.azProInit = function (A) {
    if (!A) return;
    A.furia = A.furia || 0;
    A.overdrive = 0;
    A.netShake = 0;
    AP.particles = [];
    AP.ballTrail = [];
    if (A.ball) { A.ball.z = 0; A.ball.vz = 0; }
  };

  window.azProTick = function (A) {
    if (!A || !A.opt || !A.opt.pro || !window.isProActionFxEnabled()) return;
    AP.seaWaves = (AP.seaWaves + 0.05) % (Math.PI * 2);

    // Overdrive decay
    if (A.overdrive > 0) {
      A.overdrive--;
      if (A.overdrive === 0 && window.toast) {
        window.toast("Furia esaurita", "info", "⚡");
      }
    }

    // Ball height physics for aerial passes/volleys
    const b = A.ball;
    if (b.z == null) b.z = 0;
    if (b.vz == null) b.vz = 0;
    if (b.z > 0 || b.vz !== 0) {
      b.z += b.vz;
      b.vz -= 0.35; // gravity
      if (b.z <= 0) {
        b.z = 0;
        b.vz = -b.vz * 0.4;
        if (Math.abs(b.vz) < 0.6) b.vz = 0;
      }
    }

    // Ball trail on high speed
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > 3.8 || b.sp || A.overdrive > 0) {
      AP.ballTrail.push({
        x: b.x,
        y: b.y - (b.z || 0),
        sp: !!b.sp || A.overdrive > 0,
        life: 14,
        maxLife: 14,
        size: (b.sp || A.overdrive > 0) ? 6 : 4
      });
    }

    // Update ball trail
    for (let i = AP.ballTrail.length - 1; i >= 0; i--) {
      AP.ballTrail[i].life--;
      if (AP.ballTrail[i].life <= 0) AP.ballTrail.splice(i, 1);
    }

    // Slide particles & dribbling update
    const all = [...A.us, ...A.them];
    all.forEach((p) => {
      if (p.drib > 0) p.drib--;
      if (p.slide > 0 && Math.random() < 0.7) {
        const isMolo = A.opt.pitch === "molo";
        const isSand = A.opt.pitch === "sabbia";
        AP.particles.push({
          x: p.x + (Math.random() - 0.5) * 6,
          y: p.y + 6 + (Math.random() - 0.5) * 3,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -Math.random() * 1.5,
          color: isMolo ? "rgba(220,220,230,.7)" : isSand ? "rgba(235,210,140,.8)" : "rgba(80,180,70,.8)",
          life: 16,
          maxLife: 16,
          size: 2.5
        });
      }
    });

    // Update particles
    for (let i = AP.particles.length - 1; i >= 0; i--) {
      const pt = AP.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life--;
      if (pt.life <= 0) AP.particles.splice(i, 1);
    }

    // Net shake
    if (AP.netShakeL > 0) AP.netShakeL--;
    if (AP.netShakeR > 0) AP.netShakeR--;
  };

  // Tasto Finta: Roulette o Sombrero
  window.azProDribble = function (A) {
    if (!A || A.pause || !A.opt || !A.opt.pro) return;
    const l = (typeof azMe === "function") ? azMe(A) : A.us[0];
    if (A.owner !== l || l.drib > 0) return;
    if (A.en < 15 && (!A.overdrive || A.overdrive <= 0)) {
      if (window.toast) window.toast("Energia insufficiente per la Finta!", "warn", "⚡");
      return;
    }
    if (!A.overdrive || A.overdrive <= 0) A.en -= 15;

    l.drib = 24;
    l.lock = 24;
    l.dribType = Math.random() < 0.5 ? "roulette" : "sombrero";

    if (l.dribType === "sombrero") {
      A.ball.z = 2;
      A.ball.vz = 3.6;
    }

    // Stun nearby sliding tacklers
    const foes = (typeof azSide === "function") ? azSide(1) : A.them;
    foes.forEach((p) => {
      if (Math.hypot(p.x - l.x, p.y - l.y) < 32) {
        p.stun = 55;
        p.cd = 55;
        p.slide = 0;
      }
    });

    A.flash = { t: l.dribType === "roulette" ? "ROULETTE DEL BORGO!" : "SOMBRERO AL VOLO!", c: "#ffd23f", u: A.t + 45 };
    try { if (window.sfx) window.sfx("special"); } catch (e) {}
    if (window.haptic) window.haptic(40);

    // Increase furia
    A.furia = Math.min(100, (A.furia || 0) + 20);
    if (A.furia >= 100 && (!A.overdrive || A.overdrive <= 0)) {
      window.azProTriggerOverdrive(A);
    }
  };

  window.azProTriggerOverdrive = function (A) {
    if (!A) return;
    A.furia = 0;
    A.overdrive = 420; // 7 seconds
    A.flash = { t: "FURIA DELLA RONDINE! (OVERDRIVE)", c: "#ffd23f", u: A.t + 75 };
    try { if (window.sfx) window.sfx("goal"); } catch (e) {}
    if (window.toast) window.toast("OVERDRIVE ATTIVO: Velocità e Tiri al massimo!", "success", "🔥");
  };

  // Disegno del campo speciale "Molo al Tramonto"
  window.azProDrawPitchMolo = function (A, g, W, H) {
    // Cielo arancione / tramonto
    const grad = g.createLinearGradient(0, 0, 0, 40);
    grad.addColorStop(0, "#e86524");
    grad.addColorStop(0.5, "#d9822b");
    grad.addColorStop(1, "#3a6888");
    g.fillStyle = grad;
    g.fillRect(0, 0, W, 24);

    // Mare con onde animate a nord
    g.fillStyle = "#16446c";
    g.fillRect(0, 6, W, 18);
    for (let i = 0; i < 7; i++) {
      const wx = ((i * 54 + AP.seaWaves * 25) % (W + 40)) - 20;
      const wy = 12 + Math.sin(AP.seaWaves + i) * 3;
      g.strokeStyle = "#5cb8ff88";
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(wx, wy, 8, 0, Math.PI);
      g.stroke();
    }

    // Banchina in pietra e granito
    g.fillStyle = "#5c6575";
    g.fillRect(0, 24, W, H - 24);

    // Lastroni di pietra
    for (let x = 0; x < W; x += 40) {
      g.fillStyle = (x % 80 === 0) ? "#646d7e" : "#576070";
      g.fillRect(x, 24, 38, H - 24);
    }

    // Bordo banchina in legno consumato e bitte d'ormeggio
    g.fillStyle = "#8a582d";
    g.fillRect(0, 22, W, 4);
    for (let b = 18; b < W; b += 72) {
      g.fillStyle = "#1e1e24";
      g.beginPath();
      g.ellipse(b, 23, 4, 3, 0, 0, 7);
      g.fill();
    }
  };

  // Disegno dettagliato dei giocatori Pro (campioni, capelli, numeri, divise)
  window.azProDrawPlayer = function (p, team, isControlled, isGk, l, A, g) {
    const isHeroActive = (typeof heroLoad === "function" && heroLoad());
    let hairCol = "#2b1d14";
    let skinCol = "#f2c9a0";
    let shirtCol = "#ff4d5a";
    let shortsCol = "#ffffff";
    let numStr = "10";
    let hasCap = false;

    if (team === 0) {
      // Squadra Rondine FC / Tu
      if (isGk) {
        // Nico Ferri
        shirtCol = "#19a0b8"; // Turchese portiere
        shortsCol = "#0b263d";
        hairCol = "#ff7a22"; // Capelli arancioni di Nico!
        skinCol = "#f5cd9f";
        numStr = "1";
      } else if (p.i === 0) {
        // Leo Moretti o Campione Personalizzato
        if (isHeroActive) {
          hairCol = isHeroActive.hair || hairCol;
          skinCol = isHeroActive.skin || skinCol;
          shirtCol = isHeroActive.shirt || shirtCol;
          numStr = String(isHeroActive.num || "9");
          hasCap = isHeroActive.acc === "cappellino";
        } else {
          hairCol = "#2a1810"; // Castano scuro Leo
          skinCol = "#f2c9a0";
          shirtCol = "#ff4d5a";
          numStr = "10";
        }
      } else if (p.i === 1) {
        // Tommy
        hairCol = "#e6be44"; // Biondo Tommy
        skinCol = "#f3cc9c";
        shirtCol = "#ff4d5a";
        numStr = "8";
      } else {
        // Gigi o compagno
        hairCol = "#1a1a1a";
        skinCol = "#dfab7e";
        shirtCol = "#ff4d5a";
        numStr = "17";
      }
    } else {
      // Squadra Avversaria
      shirtCol = (A.T && A.T.color) || "#3fa7ff";
      shortsCol = shirtCol === "#ffffff" ? "#16325c" : "#111118";
      hairCol = isGk ? "#333333" : (p.i === 0 ? "#1b140e" : p.i === 1 ? "#543825" : "#241812");
      skinCol = "#eec398";
      numStr = isGk ? "1" : String(9 + (p.i || 0) * 2);
    }

    g.save();

    // Effetto Dribbling (Roulette / Sombrero): rotazione dinamica attorno a se stesso!
    if (p.drib > 0) {
      const spinAngle = (24 - p.drib) * (Math.PI * 2 / 24);
      g.translate(p.x, p.y);
      g.rotate(spinAngle);
      g.translate(-p.x, -p.y);

      // Scia dorata di velocità
      g.strokeStyle = "rgba(255,210,63,0.5)";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(p.x, p.y + 4, 12, 0, Math.PI * 2);
      g.stroke();
    }

    // Aura dorata Overdrive
    if (team === 0 && A.overdrive > 0) {
      g.strokeStyle = `rgba(255, 210, 63, ${0.4 + Math.sin(A.t * 0.2) * 0.3})`;
      g.lineWidth = 2;
      g.beginPath();
      g.arc(p.x, p.y + 2, 11 + Math.sin(A.t * 0.15) * 2, 0, 7);
      g.stroke();
    }

    // Ombra a terra
    g.fillStyle = "rgba(0,0,0,0.28)";
    g.beginPath();
    g.ellipse(p.x, p.y + 9, 6, 2.5, 0, 0, 7);
    g.fill();

    // Gambe / Pantaloncini
    const legPhase = Math.sin(A.t * 0.3 + (p.x + p.y) * 0.1);
    g.fillStyle = shortsCol;
    g.fillRect(p.x - 4, p.y + 3, 8, 4);

    // Gambette e scarpini
    g.fillStyle = skinCol;
    g.fillRect(p.x - 4, p.y + 7, 3, 3);
    g.fillRect(p.x + 1, p.y + 7, 3, 3);
    g.fillStyle = "#111111"; // Scarpini neri
    g.fillRect(p.x - 4 + Math.round(legPhase), p.y + 9, 3, 2);
    g.fillRect(p.x + 1 - Math.round(legPhase), p.y + 9, 3, 2);

    // Busto / Maglia
    g.fillStyle = shirtCol;
    g.fillRect(p.x - 5, p.y - 4, 10, 8);

    // Banda o colletto bianco
    g.fillStyle = "#ffffffdd";
    g.fillRect(p.x - 2, p.y - 4, 4, 2);

    // Numero di maglia sul retro se guarda a nord / in avanti
    if (numStr && shirtCol !== "#ffffff") {
      g.fillStyle = "#ffffffea";
      g.font = "bold 6px sans-serif";
      g.textAlign = "center";
      g.fillText(numStr, p.x, p.y + 2);
      g.textAlign = "left";
    }

    // Braccia
    g.fillStyle = skinCol;
    g.fillRect(p.x - 7, p.y - 3, 2, 5);
    g.fillRect(p.x + 5, p.y - 3, 2, 5);
    if (isGk) {
      // Guanti da portiere
      g.fillStyle = "#ffd23f";
      g.fillRect(p.x - 8, p.y, 3, 3);
      g.fillRect(p.x + 5, p.y, 3, 3);
    }

    // Collo & Testa
    g.fillStyle = skinCol;
    g.fillRect(p.x - 2, p.y - 6, 4, 3);
    g.beginPath();
    g.arc(p.x, p.y - 9, 4.5, 0, 7);
    g.fill();

    // Capelli sagomati
    g.fillStyle = hairCol;
    g.beginPath();
    g.arc(p.x, p.y - 10.5, 4.5, Math.PI, Math.PI * 2);
    g.lineTo(p.x + 4.5, p.y - 8);
    g.lineTo(p.x - 4.5, p.y - 8);
    g.closePath();
    g.fill();

    // Ciuffo sporgente avanti
    g.fillRect(p.x - 2, p.y - 14, 4, 3);

    if (hasCap) {
      g.fillStyle = "#ffd23f";
      g.fillRect(p.x - 5, p.y - 12, 10, 3);
      g.fillRect(p.x + (p.dir && p.dir > 0 ? 3 : -6), p.y - 11, 4, 2);
    }

    g.restore();
  };

  // Disegno degli effetti speciali (scie di fuoco, particelle, rete elastica, HUD overdrive)
  window.azProDrawEffects = function (A, g, W, H) {
    if (!A || !A.opt || !A.opt.pro) return;

    // Scia cometa della palla
    AP.ballTrail.forEach((t) => {
      const alpha = t.life / t.maxLife;
      g.fillStyle = t.sp ? `rgba(255, 120, 20, ${alpha * 0.85})` : `rgba(255, 230, 100, ${alpha * 0.6})`;
      g.beginPath();
      g.arc(t.x, t.y, t.size * alpha, 0, 7);
      g.fill();
    });

    // Zolle / polvere
    AP.particles.forEach((pt) => {
      const alpha = pt.life / pt.maxLife;
      g.fillStyle = pt.color.replace(/\.[\d]+\)/, `${alpha})`);
      g.beginPath();
      g.arc(pt.x, pt.y, pt.size * alpha, 0, 7);
      g.fill();
    });

    // Rete elastica animata (sinistra e destra)
    if (AP.netShakeL > 0) {
      g.strokeStyle = "rgba(255,255,255,0.7)";
      g.lineWidth = 1.5;
      const bulge = Math.sin(AP.netShakeL * 0.5) * 5;
      g.beginPath();
      g.moveTo(12 - 6, 84);
      g.quadraticCurveTo(12 - 6 - bulge, 101, 12 - 6, 118);
      g.stroke();
    }
    if (AP.netShakeR > 0) {
      g.strokeStyle = "rgba(255,255,255,0.7)";
      g.lineWidth = 1.5;
      const bulge = Math.sin(AP.netShakeR * 0.5) * 5;
      g.beginPath();
      g.moveTo(308 + 6, 84);
      g.quadraticCurveTo(308 + 6 + bulge, 101, 308 + 6, 118);
      g.stroke();
    }

    // Barra Furia della Rondine in basso a destra
    const furiaPct = (A.overdrive > 0) ? (A.overdrive / 420) : ((A.furia || 0) / 100);
    const barW = 60, barH = 7;
    const bx = W - barW - 10, by = H - 12;

    g.fillStyle = "#000000a0";
    g.fillRect(bx - 2, by - 2, barW + 4, barH + 4);

    const grad = g.createLinearGradient(bx, by, bx + barW, by);
    if (A.overdrive > 0) {
      grad.addColorStop(0, "#ffd23f");
      grad.addColorStop(1, "#ff4d5a");
    } else {
      grad.addColorStop(0, "#ff9e2e");
      grad.addColorStop(1, "#ffd23f");
    }
    g.fillStyle = grad;
    g.fillRect(bx, by, barW * furiaPct, barH);

    g.fillStyle = "#ffffff";
    g.font = "bold 7px sans-serif";
    g.textAlign = "right";
    g.fillText(A.overdrive > 0 ? "🔥 OVERDRIVE!" : `FURIA ${Math.round((A.furia || 0))}%`, bx - 4, by + 6);
    g.textAlign = "left";
  };
})();
