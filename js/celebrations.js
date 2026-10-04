// ================= CELEBRAZIONI & CORIANDOLI CON LIBRERIA ESTERNA =================
// Integrazione canvas-confetti per Ali di Rondine:
// - Gol segnato (cannonata di coriandoli amaranto, oro e bianco)
// - Vittoria di fine partita e Trionfo Coppa / Campionato
// - Sblocco grande trofeo o reclutamento stella
// - Completamente disattivabile da Impostazioni -> Aspetto -> Coriandoli & Celebrazioni
(function () {
  "use strict";

  window.isConfettiEnabled = function () {
    try {
      if (window.SET && window.SET.confetti === false) return false;
      return true;
    } catch (e) {
      return true;
    }
  };

  // Celebrazione Gol
  window.triggerGoalCelebration = function (isSpecial) {
    if (!window.isConfettiEnabled()) return;
    if (typeof window.confetti !== "function") return;

    try {
      // Coriandoli con i colori sociali della Rondine FC
      // Oro (#ffd23f), Amaranto (#b3202c), Bianco (#ffffff), Azzurro mare (#3fa7ff)
      window.confetti({
        particleCount: isSpecial ? 90 : 55,
        spread: isSpecial ? 80 : 60,
        origin: { y: 0.65 },
        colors: ["#ffd23f", "#b3202c", "#ffffff", "#3fa7ff"],
        disableForReducedMotion: true,
        zIndex: 9999
      });
    } catch (e) {
      console.warn("Errore lancio coriandoli gol:", e);
    }
  };

  // Celebrazione Trofeo / Vittoria Finale
  window.triggerTrophyCelebration = function () {
    if (!window.isConfettiEnabled()) return;
    if (typeof window.confetti !== "function") return;

    try {
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        window.confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#ffd23f", "#b3202c", "#ffffff"]
        });
        window.confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#ffd23f", "#b3202c", "#ffffff"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {
      console.warn("Errore celebrazione trofeo:", e);
    }
  };

  console.log("✓ Modulo Celebrazioni & Coriandoli (canvas-confetti) caricato");
})();
