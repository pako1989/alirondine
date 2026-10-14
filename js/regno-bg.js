// js/regno-bg.js - Sfondi animati di «Cronache del Regno Ultimo» (registrati nel registro LB di bg-scenarios.js)
(function () {
  "use strict";
  function init() {
    const R = window.__lbBg && window.__lbBg.register;
    if (!R) return false;
    const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };
    const circ = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); };
    const vgrad = (g, W, H, a, b) => { const q = g.createLinearGradient(0, 0, 0, H); q.addColorStop(0, a); q.addColorStop(1, b); g.fillStyle = q; g.fillRect(0, 0, W, H); };
    const glow = (g, x, y, r, rgb, a) => { const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, `rgba(${rgb},${a})`); q.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); };
    const fl = (f, i) => 0.7 + 0.3 * Math.sin(f / 5 + i * 2.1) * Math.sin(f / 9 + i);
    const torch = (g, x, y, f, i) => { px(g, x - 1, y, 3, 9, "#4a3a2a"); const a = fl(f, i); g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, y - 2, 22, "255,170,70", 0.45 * a); g.restore(); circ(g, x, y - 2, 3 * a + 1, "#ffb040"); circ(g, x, y - 3, 1.6, "#fff0a0"); };
    const banner = (g, x, y, w, h, c, f, i) => { const s = Math.sin(f / 18 + i) * 2; px(g, x, y - 3, w + 4, 2, "#4a3a2a"); g.fillStyle = c; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y + s); g.lineTo(x + w, y + h + s); g.lineTo(x + w / 2, y + h - 6); g.lineTo(x, y + h); g.fill(); px(g, x + w / 2 - 2, y + 8, 4, 4, "#e8c860"); };
    const stars = (g, W, H, f, n) => { for (let i = 0; i < n; i++) { const x = (i * 53 + 17) % W, y = (i * 29 + 5) % (H * 0.4); px(g, x, y, 1, 1, `rgba(255,255,255,${0.4 + 0.5 * Math.abs(Math.sin(f / 30 + i))})`); } };
    const tower = (g, x, y, w, h, c) => { px(g, x, y, w, h, c); for (let i = 0; i < w; i += 8) px(g, x + i, y - 5, 5, 5, c); px(g, x + w / 2 - 2, y + 10, 4, 8, "#1a1020"); };
    const flagline = (g, W, y, f) => { for (let i = 0; i < 8; i++) { const x = 20 + i * 40, yy = y + Math.sin(i * 0.9) * 3 + 6 * (1 - Math.abs(i - 3.5) / 4); g.fillStyle = ["#8b95ab", "#38a8d8", "#5aa862", "#e8c860"][i % 4]; g.beginPath(); g.moveTo(x, yy); g.lineTo(x + 10, yy); g.lineTo(x + 5, yy + 9 + Math.sin(f / 12 + i) * 1.5); g.fill(); } };
    const hall = (g, W, H, f, col, floor) => { vgrad(g, W, H, col[0], col[1]); px(g, 0, H * 0.72, W, H * 0.28, floor); for (let x = 0; x < W; x += 40) px(g, x, H * 0.72, 1, H * 0.28, "rgba(0,0,0,.25)"); };

    R("re_titolo", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#1a1030", "#7a2a3a"); stars(g, W, H, f, 40);
        circ(g, 250, 50, 20, "#f4e8c0"); circ(g, 244, 46, 18, "#1a1030");
        px(g, 0, 150, W, 50, "#1e1426");
        tower(g, 40, 90, 40, 70, "#2a2036"); tower(g, 140, 70, 50, 90, "#2e2440"); tower(g, 250, 100, 34, 60, "#2a2036");
        px(g, 80, 130, 60, 30, "#2a2036");
        banner(g, 158, 60, 16, 26, "#a82a3a", f, 0); banner(g, 60, 80, 12, 20, "#38a8d8", f, 1);
        torch(g, 100, 150, f, 0); torch(g, 215, 150, f, 1);
        const c = "#e8c860"; px(g, 150, 22, 40, 5, c); [150, 160, 170, 180, 186].forEach((x, i) => px(g, x, 12 - (i % 2) * 4, 4, 14, c));
      },
      hot: [[145, 8, 50, 22, "👑 La Corona senza testa: nessuno la indossa da tre anni. Il ciambellano la fa lucidare ogni martedì."], [20, 70, 70, 80, "🏰 Castelalto: la rocca delle Tre Casate."], [220, 90, 70, 60, "🌙 La torre ovest: dicono che sia stata la più rumorosa durante l'ultimo Duello."]]
    });
    R("re_cortile", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#e87a4a", "#4a2a4a"); circ(g, 60, 70, 24, "#ffd890");
        px(g, 0, 90, W, 40, "#3a2a3a"); tower(g, 20, 60, 40, 50, "#3a2a40"); tower(g, 240, 56, 50, 56, "#3a2a40");
        px(g, 0, 130, W, 70, "#7a6a58"); for (let y = 130; y < H; y += 12) for (let x = (y / 12 % 2) * 14; x < W; x += 28) px(g, x, y, 27, 1, "rgba(0,0,0,.2)");
        flagline(g, W, 100, f);
        banner(g, 100, 108, 18, 30, "#8b95ab", f, 0); banner(g, 150, 108, 18, 30, "#38a8d8", f, 1); banner(g, 200, 108, 18, 30, "#5aa862", f, 2);
        torch(g, 80, 150, f, 0); torch(g, 250, 150, f, 1);
        px(g, 120, 160, 80, 16, "#5a3a2a"); px(g, 124, 152, 72, 8, "#e8d8b8");
      },
      hot: [[95, 104, 130, 36, "🚩 Tre stendardi, tre Casate: lupo, gabbiano e cervo. Il quarto palo è vuoto da anni."], [118, 150, 84, 28, "🍗 Banchetto della vigilia: il capocuoco giura di non aver contato i polli."], [10, 55, 60, 60, "🌅 Il sole cala sul Duello di domani."]]
    });
    R("re_trono", {
      draw(g, W, H, f) {
        hall(g, W, H, f, ["#3a1426", "#6a2030"], "#4a2a2a");
        px(g, 125, 40, 70, 90, "#7a1f2a"); px(g, 135, 50, 50, 70, "#a82a3a"); px(g, 148, 100, 24, 30, "#e8c860"); px(g, 144, 90, 32, 12, "#c8a040"); px(g, 150, 72, 20, 20, "#e8c860");
        banner(g, 30, 30, 22, 50, "#8b95ab", f, 0); banner(g, 270, 30, 22, 50, "#5aa862", f, 1);
        torch(g, 100, 70, f, 0); torch(g, 220, 70, f, 1);
        px(g, 60, 140, 200, 14, "#8a1a2a"); circ(g, 70, 150, 8, "#e8a860"); circ(g, 66, 144, 3, "#e8a860");
      },
      hot: [[120, 38, 80, 94, "🪑 Il Trono dei Sette Pareri: il re vi siede, il consiglio parla, la corona sta zitta."], [55, 130, 40, 32, "🐈 Sua Maestà Pallina riposa sul cuscino reale. Ha più voce in consiglio del genero."], [20, 20, 50, 70, "🚩 Arazzo del primo Duello. Gli archivisti litigano ancora su chi vinse."]]
    });
    R("re_mura", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#10102a", "#3a2030"); stars(g, W, H, f, 50);
        for (let i = 0; i < 6; i++) { const x = 40 + i * 50; glow(g, x, 118, 14 + 3 * fl(f, i), "255,120,40", 0.4); circ(g, x, 118, 2, "#ffb040"); }
        px(g, 0, 130, W, 70, "#4a4656"); for (let x = 0; x < W; x += 14) px(g, x, 124, 9, 8, "#4a4656");
        for (let y = 140; y < H; y += 10) px(g, 0, y, W, 1, "rgba(0,0,0,.3)");
        px(g, 200, 100, 3, 30, "#2a2030"); px(g, 190, 100, 24, 4, "#2a2030"); px(g, 120, 90, 3, 40, "#4a3a2a"); px(g, 112, 90, 30, 5, "#5a4a3a");
        torch(g, 40, 140, f, 0); torch(g, 280, 140, f, 1);
      },
      hot: [[100, 80, 52, 50, "🏹 Balestre pronte: manca solo chi ricordi dove sono i dardi."], [20, 100, 280, 24, "🔥 I fuochi dell'accampamento nemico. Sono più di quanti fosse cortese portare."], [185, 92, 40, 40, "🎯 Il bersaglio dell'addestramento: nessuno lo colpisce, ma tutti lo salutano."]]
    });
    R("re_strada", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#7ab0d8", "#d8e8c8"); circ(g, 260, 40, 14, "#fff0a8");
        for (let i = 0; i < 3; i++) { const x = (i * 130 + f * 0.1) % (W + 60) - 30; circ(g, x, 30 + i * 8, 10, "rgba(255,255,255,.8)"); circ(g, x + 10, 32 + i * 8, 8, "rgba(255,255,255,.8)"); }
        px(g, 0, 90, W, 110, "#6aa058"); px(g, 0, 110, W, 14, "#5a8a48");
        g.fillStyle = "#c8b080"; g.beginPath(); g.moveTo(140, 90); g.lineTo(180, 90); g.lineTo(260, H); g.lineTo(60, H); g.fill();
        px(g, 150, 100, 1, 6, "#4a3a2a"); px(g, 150, 100, 20, 8, "#e8d8b8"); px(g, 40, 70, 30, 30, "#4a5a3a"); px(g, 250, 74, 26, 26, "#4a5a3a");
        banner(g, 46, 56, 10, 16, "#8b95ab", f, 0);
      },
      hot: [[145, 94, 34, 20, "🪧 Cartello a tre frecce: Forte, Porto, Bosco. Qualcuno ha aggiunto «Casa» in matita."], [30, 60, 50, 40, "🌲 Boschetto di confine."], [240, 66, 50, 40, "⛰️ Colli dove ancora si litiga per le pecore."]]
    });
    R("re_forte", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#5a6a88", "#aab4c8"); px(g, 0, 130, W, 70, "#7a8090");
        tower(g, 30, 60, 60, 80, "#4a5266"); tower(g, 220, 70, 60, 70, "#4a5266"); px(g, 90, 100, 130, 40, "#586078");
        banner(g, 140, 70, 20, 34, "#8b95ab", f, 0); for (let x = 90; x < 220; x += 14) px(g, x, 94, 9, 6, "#586078");
        torch(g, 110, 130, f, 0); torch(g, 210, 130, f, 1); px(g, 130, 140, 60, 12, "#3a4256");
      },
      hot: [[135, 66, 30, 40, "🐺 Lo stendardo grigio dei Lupi: sobrio, severo e leggermente umido."], [125, 136, 70, 20, "⚔️ Rastrelliera d'addestramento: tutto in ordine, tutto in fila, tutto un po' triste."], [25, 55, 70, 80, "🏰 Torre di guardia: tre turni, nessun sorriso."]]
    });
    R("re_porto", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#7ac8e8", "#e8f0e8"); px(g, 0, 110, W, 90, "#2a88b8");
        for (let i = 0; i < 12; i++) px(g, (i * 30 + f * 0.6) % W, 120 + (i % 5) * 14, 14, 1, "rgba(255,255,255,.6)");
        px(g, 0, 140, W, 60, "#9a8060"); for (let x = 0; x < W; x += 20) px(g, x, 140, 1, 60, "rgba(0,0,0,.25)");
        px(g, 200, 70, 3, 60, "#4a3a2a"); g.fillStyle = "#f4f0e0"; g.beginPath(); g.moveTo(203, 72); g.lineTo(240, 118); g.lineTo(203, 118); g.fill();
        px(g, 190, 128, 60, 10, "#5a3a2a"); banner(g, 40, 90, 14, 24, "#38a8d8", f, 0);
        for (let i = 0; i < 3; i++) { const x = 100 + i * 24 + Math.sin(f / 20 + i) * 12, y = 60 + i * 10; px(g, x, y, 6, 1, "#fff"); px(g, x + 6, y - 1, 4, 1, "#fff"); }
      },
      hot: [[198, 68, 50, 70, "⛵ Il veliero dei Gabbiani: vele nuove, bilancio vecchio."], [30, 84, 30, 34, "🚩 Stendardo azzurro: i Gabbiani lo cambiano a seconda del vento."], [10, 142, 280, 40, "⚓ Il molo: quando c'è bassa marea, il Duello diventa una questione di logistica."]]
    });
    R("re_bosco", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#2a4a3a", "#7ab070"); px(g, 0, 140, W, 60, "#4a7a3a");
        for (let i = 0; i < 9; i++) { const x = i * 40 + 6; px(g, x, 60 + (i % 3) * 8, 10, 100, "#3a2a1a"); circ(g, x + 5, 56 + (i % 3) * 8, 26, ["#2a6a3a", "#3a7a3a", "#2a5a3a"][i % 3]); }
        for (let i = 0; i < 5; i++) { const x = 30 + i * 60 + Math.sin(f / 30 + i) * 10; glow(g, x, 100 + i * 8, 12, "255,240,150", 0.5 * fl(f, i)); }
        px(g, 140, 150, 40, 20, "#6a5a3a"); banner(g, 232, 96, 12, 20, "#5aa862", f, 0);
      },
      hot: [[130, 144, 60, 30, "🦌 Il ceppo del Consiglio dei Cervi: si vota alzando le corna, non la voce."], [228, 90, 24, 30, "🚩 Stendardo verde: appeso con muschio, per non disturbare nessuno."], [10, 40, 280, 70, "🌳 Il bosco ascolta. Si dice che ricordi ogni Duello."]]
    });
    R("re_vigilia", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#0a0a22", "#3a1a30"); stars(g, W, H, f, 60); px(g, 0, 140, W, 60, "#2a2434");
        for (let i = 0; i < 5; i++) { const x = 30 + i * 62; px(g, x, 110, 3, 40, "#4a3a2a"); torch(g, x + 1, 108, f, i); }
        tower(g, 120, 70, 80, 70, "#2e2440"); banner(g, 154, 76, 14, 26, "#a82a3a", f, 0);
        px(g, 100, 150, 120, 10, "#5a3a2a");
      },
      hot: [[115, 64, 90, 80, "🌌 La Rocca nella notte: ogni finestra accesa è un consigliere che non dorme."], [20, 100, 280, 56, "🔥 Le torce della vigilia. Se ne spegne una, qualcuno ne fa un presagio."], [95, 148, 130, 14, "📜 Il tavolo dei patti: pergamene, calamai, sospiri."]]
    });
    R("re_cripta", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#10101a", "#2a2a3a"); px(g, 0, 150, W, 50, "#1e1e2a");
        for (let i = 0; i < 4; i++) { const x = 20 + i * 80; px(g, x, 40, 16, 110, "#3a3a4a"); px(g, x - 4, 40, 24, 6, "#4a4a5a"); }
        torch(g, 100, 100, f, 0); torch(g, 230, 100, f, 1);
        px(g, 130, 130, 60, 22, "#4a4a5a"); px(g, 134, 124, 52, 8, "#5a5a6a"); glow(g, 160, 120, 40, "200,180,255", 0.25 * fl(f, 3));
        px(g, 156, 100, 8, 20, "#e8c860");
      },
      hot: [[125, 118, 70, 38, "⚰️ Il sepolcro dei sovrani: uno spazio è già scavato. Nessuno dice per chi."], [10, 36, 300, 20, "🕯️ Le volte: sussurrano. Forse è l'acustica."], [150, 94, 20, 26, "👑 Una corona di pietra, a memoria di quella vera."]]
    });
    R("re_piazza", {
      draw(g, W, H, f) {
        vgrad(g, W, H, "#9ad0f0", "#f4e8c8"); circ(g, 50, 40, 16, "#fff0a8");
        px(g, 0, 110, W, 90, "#a89878"); for (let y = 110; y < H; y += 12) px(g, 0, y, W, 1, "rgba(0,0,0,.15)");
        px(g, 0, 70, 70, 50, "#6a5a6a"); px(g, 250, 70, 70, 50, "#6a5a6a");
        for (let i = 0; i < 9; i++) { const x = 70 + i * 20, y = 118 + (i % 3) * 8; circ(g, x, y, 4, ["#8b95ab", "#38a8d8", "#5aa862"][i % 3]); px(g, x - 3, y + 3, 6, 8, ["#8b95ab", "#38a8d8", "#5aa862"][i % 3]); }
        banner(g, 100, 40, 16, 30, "#8b95ab", f, 0); banner(g, 150, 40, 16, 30, "#38a8d8", f, 1); banner(g, 200, 40, 16, 30, "#5aa862", f, 2);
        px(g, 140, 90, 40, 6, "#e8c860"); px(g, 148, 84, 24, 6, "#e8c860");
        for (let i = 0; i < 20; i++) { const x = (i * 37 + f * 0.8) % W, y = (i * 23 + f * 0.7) % 90; px(g, x, y, 2, 2, ["#e8c860", "#a82a3a", "#38a8d8"][i % 3]); }
      },
      hot: [[135, 80, 50, 20, "🏆 Il palco del Duello: costruito in una notte, rifinito in tre giorni."], [60, 112, 190, 36, "👥 Il popolo di Castelalto: tre fazioni, nessun silenzio."], [90, 34, 140, 40, "🚩 Gli stendardi, uno accanto all'altro. Per ora."]]
    });
    return true;
  }
  if (!init()) { let n = 0; const t = setInterval(() => { if (init() || ++n > 100) clearInterval(t); }, 100); }
})();
