// js/neve.js - «IL GUARDIANO DI NEVE» · saga a scorrimento sulla neve (motore js/scorri.js col kit «guanti»: niente pallone, PARATA che respinge e TUFFO-PLANATA)
// Valdigelo, paese di montagna sopra il Borgo, la settimana di Santa Lucia. Dalla vetrina del Bar Stambecco sparisce la Coppa delle Vette del 1979,
// vinta grazie a una parata di Olmo Brina, il portiere del paese. Olmo ha le ginocchia finite e ti dà i suoi guanti: sali tu.
// Novità nel motore comune: IL TERMOMETRO (cfg.cold): nelle zone all'aperto il Calore scende, risale vicino ai fuochi e al chiuso.
(function () {
  "use strict";
  if (!window.__sagaCore) return;
  const LV = {
    bosco: { name: "Il bosco degli abeti", icon: "🌲", theme: "neve", d: "Il sentiero nel bosco sopra il paese: yeti che tirano palle di neve, aquile che scendono in picchiata, ghiaccio e crepacci.",
      signs: ["◀ ▶ cammina, ⤒ salta. Arriva una palla di neve? Tocca 🧤 al momento giusto: la PARI e torna indietro!", "Crepaccio! Salta e TIENI PREMUTO ⤒: ti tuffi e plani come un portiere che vola sul palo.", "La radura del Raccattapalle è oltre il rifugio. Le sue palle si battono solo respingendole."],
      map: [
        "#............................................................................................................#",
        "#............................................................................................................#",
        "#............................................................................................................#",
        "#...................................#####....................................................................#",
        "#...................S.................f.f....................................................................#",
        "#..................................................................S..............S..........................#",
        "#..................ooo......................................a......................................a.........#",
        "#.................=====...........................................y.oo.......................................#",
        "#......ooo.....................................o.o.o.o..........#######..........===.............ooo.........#",
        "#...............................................................#######...h....o......o......................#",
        "#.P.i.........y.................C..........i............C.......#######..................C.i...y........E....#",
        "##########################...#####~~~~~~~~####........########################..........############~~~~######",
        "##########################...#################........########################..........######################"] },
    radura: { name: "La radura del Raccattapalle", icon: "🦍", theme: "neve", boss: "yetone", d: "Una radura bianca piena di palloni bucati: è la tana del Grande Raccattapalle.",
      map: [
        "#........................#", "#........................#", "#........................#", "#........................#", "#........................#", "#........................#",
        "#..h.....................#", "#.====..............====.#", "#........................#", "#........................#", "#...P....o...Z...o.......#", "##########################", "##########################"] },
    canalone: { name: "Il canalone delle valanghe", icon: "🏔️", theme: "canalone", d: "Il canalone sopra Valdigelo: pareti di roccia, stalattiti, palle di valanga che rotolano e crescono.",
      signs: ["Le palle di valanga rotolano verso di te e crescono: saltale, o PARALE con 🧤 finché sono piccole.", "Le stalattiti sotto le rocce tremano prima di cadere: passa svelto, non fermarti sotto."],
      map: [
        "#......................................................................................................................#",
        "#......................................................................................................................#",
        "#...........................######........................#######......................................................#",
        "#...........................######........................#######...................####...............................#",
        "#............................f.f.f.........................f.f.f.....................f.f...............................#",
        "#............S.........................................a.................................................a....S........#",
        "#...........o.oo...............................S.......................................................................#",
        "#...........====................................................h.................................ooo.......=====......#",
        "#...............................ooo..........oo.oo.............###................................===..................#",
        "#.......ooo...........oo........###.........................o.o###..........................oo............oo...........#",
        "#.P..i...................y..r...###...i.C......................###.....r........y.......C.r...................r.....E..#",
        "##################...#######################.......#~~~~~~################...#~~~~~~~###########........################",
        "##################...#######################.......#######################...###################........################"] },
    valanga: { name: "La valanga", icon: "🌨️", theme: "canalone", chase: { from: 6, sp: 1.55 }, d: "La valanga ti insegue giù per il canalone: corri, salta, plana. Non fermarti.",
      signs: ["Sopra di te la neve si stacca. Quando parte la valanga, CORRI ▶▶: se ti prende, torni all'ultimo ometto."],
      map: [
        "#......................................................................................................#",
        "#......................................................................................................#",
        "#......................................................................................................#",
        "#......................................................................................................#",
        "#......................................................................................................#",
        "#.............................................................S........................S...............#",
        "#......................................................................................................#",
        "#...........................................................====......................===..............#",
        "#....................................................oooo..............................................#",
        "#.......ooo.......oo......oo..........oo..##..o.................oo..............o...........oo.........#",
        "#.P.i.................##...........C......##...r....................C.........r...##...............E...#",
        "##############..##############...###################......##############...############...~~~~~#########",
        "##############..##############...###################......##############...############...##############"] },
    seracchi: { name: "I seracchi del ghiacciaio", icon: "🧊", theme: "ghiacciaio", d: "Il ghiacciaio di notte, sotto l'aurora: ponti di neve che crollano, seracchi, pupazzi di guardia.",
      signs: ["Ponti di neve sui crepacci: reggono un attimo, poi crollano. Non fermarti sopra.", "I pupazzi di neve fanno la guardia e tirano palle: parale o saltagli in testa."],
      map: [
        "#..........................................................................................................................#",
        "#..........................................................................................................................#",
        "#.............................................#######...........................................................S.####.....#",
        "#.............................................#######.............................................................####.....#",
        "#.............................S................f.f.f...........................................................%%%f.f......#",
        "#.......................................................a..............................................a...................#",
        "#...........................====..............................S............................................................#",
        "#..................................................................................h......................=====............#",
        "#................................%%%%%%%%.........................................###......................................#",
        "#......ooo...o.o.o..oo....##................oo.............%%%.%%%..oo.....oo.....###............oo.........oo.............#",
        "#.P..i................n...##.............C.i..........................r.y.....C...###..............n....................E..#",
        "############%%%%%%###############........#####~~~~~~~#####.........###################%%%%%%%%%%############################",
        "############......###############........#################.........###################..........############################"] },
    conca: { name: "La conca dello Stambecco", icon: "🐐", theme: "ghiacciaio", boss: "stambecco", d: "Lo Stambecco Nero carica a testa bassa: si ferma solo con una parata.",
      map: [
        "#........................#",
        "#........................#",
        "#........................#",
        "#........................#",
        "#........................#",
        "#........................#",
        "#..h.....................#",
        "#.===................===.#",
        "#........................#",
        "#........................#",
        "#..P.........Z...........#",
        "##########################",
        "##########################"] },
    slitta: { name: "La slitta di Fiocco", icon: "🛷", theme: "vetta", sled: { sp: 2.2 }, d: "Fiocco ti tira in slitta fino alla vetta: la slitta va da sola, tu salti, pari e plani.",
      signs: ["La slitta la tira Fiocco e va da sola: ⤒ salti, ▶ spingi, ◀ freni. Tieni premuto ⤒ per planare sui crepacci."],
      map: [
        "#..............................................................................................................................................................#",
        "#..............................................................................................................................................................#",
        "#..............................................................................................................................................................#",
        "#..............................................................................................................................................................#",
        "#..............................................................................................................................................................#",
        "#...............................................................................a.................S............................................................#",
        "#....................................................S.....................................................................................S...................#",
        "#..................................................oooo.........................................====...........................................................#",
        "#..............................................................................................................................................................#",
        "#.........ooo.......oo........oo..............oo..........oo..#...o...oo..........oo..........o...............o....oo...........o...o.....##...................#",
        "#.P...i.........#.................##....n...C.................#.....n.................##..C.....................n.................C.......##..............E....#",
        "########################...#######################......##################...#######################........################...#################......##########",
        "########################...#######################......##################...#######################........################...#################......##########"] },
    vetta: { name: "La vetta della Regina", icon: "👑", theme: "vetta", boss: "regina", d: "La Regina del Gelo tira rigori a tre altezze: parali tutti.",
      map: [
        "#......................#",
        "#......................#",
        "#......................#",
        "#......................#",
        "#......................#",
        "#......................#",
        "#......................#",
        "#......................#",
        "#......................#",
        "#......................#",
        "#..P................Z..#",
        "########################",
        "########################"] }
  };
  window.__neveLV = LV;
  const E = window.__sagaCore.create({
    id: "neve", key: "ali-di-rondine.neve", title: "Il Guardiano di Neve", icon: "🧤", bg: "gn_titolo", chapters: 4,
    menuSub: "Valdigelo, sopra il Borgo, a dicembre. Sparisce la Coppa delle Vette del 1979 e le orme salgono in montagna. Olmo, il vecchio portiere, ti presta i suoi guanti: livelli a scorrimento sulla neve, dove si para invece di calciare.",
    theme: { accent: "#38bdf8", ink: "#f0f9ff", paper: "rgba(14,30,48,.94)", font: "'Trebuchet MS', system-ui, sans-serif", chipBg: "#0c4a6e", chipBorder: "#7dd3fc" },
    stats: { verita: [0, 12, 0, "Verità"], leggenda: [0, 12, 0, "Leggenda"] },
    weight: { name: "Il peso della neve", axes: { verita: ["Verità", "🕯️"], leggenda: ["Leggenda", "⭐"] } },
    item: ["Fiocco d'argento", "Fiocchi d'argento"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.4); g.rotate(f / 40 + i); g.fillStyle = "#bae6fd"; for (let k = 0; k < 3; k++) { g.rotate(Math.PI / 3); g.fillRect(-5, -0.5, 10, 1.5); } g.fillStyle = "#ffffff"; g.fillRect(-1, -1, 2, 2); g.restore(); },
    regions: {
      valdigelo: { grass: ["#e8eef6", "#e2e9f2", "#edf2f8"], path: ["#c8d0dc", "#c0c8d6"], stone: ["#9aa4b4", "#929cac"], wall: ["#5a4a3e", "#524236"], water: ["#9ccbe8", "#94c4e2"], tall: "#d8e2ee", tree: ["#1e3a32", "#2e5246", "#e8f0f8"], tint: "200,220,255", tintA: 0.12, fx: "snow", dark: 0.06 },
      bosco: { grass: ["#dfe8f2", "#d8e2ee", "#e6eef6"], path: ["#b8c4d2", "#b0bccc"], stone: ["#8a96a8", "#828ea0"], wall: ["#3e4a5a", "#384454"], water: ["#8cbcdc", "#84b4d4"], tall: "#c8d6e4", tree: ["#142a24", "#1e3a32", "#dce8f4"], tint: "170,200,255", tintA: 0.16, fx: "snow", dark: 0.14 },
      bar: { grass: ["#4a3426", "#453022", "#503828"], path: ["#6a4a34", "#64452f"], stone: ["#5a4434", "#544030"], wall: ["#2a1a10", "#24160c"], water: ["#2a4a6a", "#264662"], tall: "#4a3426", tint: "255,180,110", tintA: 0.16, fx: "", dark: 0.14 },
      quota: { grass: ["#c8d8ec", "#c0d2e8", "#d0deef"], path: ["#a8b8d0", "#a0b0c8"], stone: ["#7a88a0", "#728098"], wall: ["#3a4660", "#34405a"], water: ["#9ad0f0", "#92c8ea"], tall: "#b8c8de", tree: ["#10241e", "#1a3028", "#c8d8ec"], tint: "110,140,220", tintA: 0.22, fx: "snow", dark: 0.32 },
      vetta: { grass: ["#f6e8ec", "#f0e0e6", "#faeef0"], path: ["#d8c0c8", "#d0b8c0"], stone: ["#9a8890", "#928088"], wall: ["#5a4250", "#523a48"], water: ["#c8b0d0", "#c0a8c8"], tall: "#e8d4dc", tree: ["#2a1e2a", "#3a2a3a", "#f6e8ec"], tint: "255,170,140", tintA: 0.16, fx: "snow", dark: 0.05 },
      casa: { grass: ["#3e3430", "#3a302c", "#443a34"], path: ["#5e4e44", "#58483e"], stone: ["#6a5a50", "#62524a"], wall: ["#2a201c", "#241c18"], water: ["#2a4a6a", "#264662"], tall: "#3e3430", tint: "255,190,130", tintA: 0.14, fx: "", dark: 0.18 }
    },
    floors: "QYUE", solid: "IKFAOJPCXMNRGSVZ",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g;
      if (f === "Q") { // neve battuta: bianca e azzurrina, con orme, scintille e qualche sasso che spunta
        const v = (tx * 7 + ty * 13) % 5; g.fillStyle = v === 0 ? "#e6edf6" : "#eef3f9"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(150,175,210,.22)"; g.fillRect(sx, sy + 12 + (tx % 3), 16, 2);
        if ((tx + ty * 3) % 6 === 0) { g.fillStyle = "rgba(120,140,175,.35)"; g.fillRect(sx + 3, sy + 4, 3, 4); g.fillRect(sx + 9, sy + 9, 3, 4); }
        if ((tx * 11 + ty * 5) % 13 === 0) { g.fillStyle = "#8a94a4"; g.fillRect(sx + 10, sy + 3, 4, 3); g.fillStyle = "#ffffff"; g.fillRect(sx + 10, sy + 3, 4, 1); }
        const sp = (Math.floor(performance.now() / 300) + tx * 3 + ty) % 9; if (sp === 0) { g.fillStyle = "#ffffff"; g.fillRect(sx + (tx * 5) % 13 + 1, sy + (ty * 7) % 13 + 1, 1, 1); }
        return true;
      }
      if (f === "Y") { // assi di larice del bar e della casa di Olmo
        g.fillStyle = (tx + ty) % 2 ? "#8a5a34" : "#93623a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.26)"; g.fillRect(sx, sy + 7, 16, 1); g.fillRect(sx, sy + 15, 16, 1); g.fillRect(sx + ((ty * 5) % 12) + 2, sy, 1, 7); g.fillRect(sx + ((ty * 3 + 7) % 12) + 2, sy + 8, 1, 7);
        g.fillStyle = "rgba(255,220,170,.1)"; g.fillRect(sx, sy, 16, 1); g.fillStyle = "#5a361c"; g.fillRect(sx + 4, sy + 3, 1, 1); g.fillRect(sx + 11, sy + 11, 1, 1); return true;
      }
      if (f === "U") { // tappeto a rombi rossi e verdi della stube
        const d = (tx + ty) % 2; g.fillStyle = d ? "#8a2a2a" : "#2f5a3a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = d ? "#c8a050" : "#e8d8b0"; g.fillRect(sx + 7, sy + 3, 2, 10); g.fillRect(sx + 3, sy + 7, 10, 2); g.fillStyle = "rgba(0,0,0,.15)"; g.fillRect(sx, sy + 15, 16, 1); return true;
      }
      if (f === "E") { // il campo della Partita della Neve: neve spalata e battuta, righe tracciate con la cenere
        g.fillStyle = (tx + ty) % 2 ? "#f4f8fc" : "#eef4fa"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(150,175,210,.18)"; g.fillRect(sx, sy + 13, 16, 1);
        const Z = K.zone && K.zone("gn_campo"), sp = Z && (Z.spec || Z), lx = sp && sp.lines; if (lx && (tx === lx[0] || tx === lx[2] || ty === lx[1] || ty === lx[3] || tx === Math.round((lx[0] + lx[2]) / 2))) { g.fillStyle = "#5a6474"; if (tx === lx[0] || tx === lx[2] || tx === Math.round((lx[0] + lx[2]) / 2)) g.fillRect(sx + 7, sy, 2, 16); if (ty === lx[1] || ty === lx[3]) g.fillRect(sx, sy + 7, 16, 2); }
        if ((tx * 5 + ty * 3) % 11 === 0) { g.fillStyle = "rgba(120,140,175,.3)"; g.fillRect(sx + 4, sy + 5, 2, 3); g.fillRect(sx + 9, sy + 9, 2, 3); } return true;
      }
      return false;
    },
    paint: {
      // lapide o croce di pietra sotto la neve (cimitero, cippi in quota)
      S(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(60,80,110,.3)"; g.fillRect(sx + 3, sy + 13, 10, 3);
        if ((tx + ty) % 2) { g.fillStyle = "#6a7484"; g.fillRect(sx + 7, sy - 6, 3, 20); g.fillRect(sx + 3, sy - 1, 11, 3); g.fillStyle = "#ffffff"; g.fillRect(sx + 7, sy - 7, 3, 1); g.fillRect(sx + 3, sy - 2, 11, 1); }
        else { g.fillStyle = "#7a8496"; g.fillRect(sx + 3, sy, 10, 14); g.fillStyle = "#8a94a4"; g.fillRect(sx + 4, sy - 2, 8, 3); g.fillStyle = "#ffffff"; g.fillRect(sx + 3, sy - 3, 10, 2); g.fillStyle = "#4a5464"; g.fillRect(sx + 5, sy + 4, 6, 1); g.fillRect(sx + 6, sy + 7, 4, 1); }
        if ((tx * 3 + ty) % 4 === 0) { const a = 0.5 + 0.3 * Math.sin(fr / 6 + tx); g.fillStyle = "#3a3a44"; g.fillRect(sx + 12, sy + 9, 3, 5); g.fillStyle = `rgba(255,190,90,${a})`; g.fillRect(sx + 13, sy + 10, 1, 2); K.light(sx + 13, sy + 11, 14, "255,190,90", 0.25); }
      },
      // televisore col videoregistratore (Pro Loco) o la radio del rifugio
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a3a20"; g.fillRect(sx + 1, sy + 8, 14, 7); g.fillStyle = "#3a3a44"; g.fillRect(sx + 2, sy - 6, 12, 13); g.fillStyle = "#16141f"; g.fillRect(sx + 3, sy - 5, 10, 9);
        for (let k = 0; k < 10; k++) { g.fillStyle = (k * 7 + Math.floor(fr / 4)) % 3 ? "#8a94a4" : "#e8eef6"; g.fillRect(sx + 3 + (k * 3) % 10, sy - 5 + (k * 5) % 9, 1, 1); } g.fillStyle = "#2a2a32"; g.fillRect(sx + 3, sy + 9, 10, 3); g.fillStyle = Math.floor(fr / 20) % 2 ? "#ef4444" : "#4a1010"; g.fillRect(sx + 11, sy + 10, 1, 1);
        K.light(sx + 8, sy - 1, 18, "180,200,255", 0.18);
      },
      // porta da calcio di legno, con la rete di corda e la neve sulla traversa
      Z(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a3a20"; g.fillRect(sx + 1, sy - 10, 2, 26); g.fillRect(sx + 13, sy - 10, 2, 26); g.fillRect(sx + 1, sy - 11, 14, 2); g.fillStyle = "#ffffff"; g.fillRect(sx, sy - 13, 16, 2);
        g.fillStyle = "rgba(220,220,230,.6)"; for (let x = 4; x < 13; x += 3) g.fillRect(sx + x, sy - 8, 1, 22); for (let y = -7; y < 14; y += 3) g.fillRect(sx + 3, sy + y, 10, 1);
      },
      // muretto di sassi coperto di neve (bordo del paese)
      I(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#5a6474"; g.fillRect(sx, sy, 16, 16);
        [[0, 3, 7, 5], [8, 2, 8, 6], [1, 9, 6, 6], [8, 9, 7, 6]].forEach(([x, y, w, h], i) => { g.fillStyle = ["#8a94a4", "#7a8496", "#9aa4b2"][(tx + ty + i) % 3]; g.fillRect(sx + x, sy + y, w, h); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(sx + x, sy + y, w, 1); });
        g.fillStyle = "#f4f8fc"; g.fillRect(sx - 1, sy - 3, 18, 5); g.fillStyle = "#ffffff"; g.fillRect(sx, sy - 3, 16, 1); g.fillStyle = "#dbe6f2"; g.fillRect(sx + (tx % 3) * 4, sy + 2, 3, 2);
      },
      // abete carico di neve (alto, sporge sopra la casella)
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(60,80,110,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 8, 3, 0, 0, 7); g.fill();
        g.fillStyle = "#4a3020"; g.fillRect(sx + 7, sy + 9, 3, 6);
        for (let k = 0; k < 4; k++) { const w = 4 + k * 2, y = sy - 14 + k * 6; g.fillStyle = "#1e3a32"; g.fillRect(sx + 8 - w, y + 2, w * 2, 5); g.fillStyle = "#2e5246"; g.fillRect(sx + 8 - w + 1, y + 2, w, 3); g.fillStyle = "#f4f8fc"; g.fillRect(sx + 8 - w, y + 1, w * 2, 2); }
        g.fillStyle = "#ffffff"; g.fillRect(sx + 7, sy - 16, 2, 2);
        if ((tx * 3 + ty) % 5 === 0 && Math.floor(fr / 30 + tx) % 8 === 0) { g.fillStyle = "#ffffff"; g.fillRect(sx + 12, sy + 4 + (fr % 30) / 4, 1, 1); }
      },
      // fontana ghiacciata con le stalattiti
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#7a8496"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 8, 5, 0, 0, 7); g.fill(); g.fillStyle = "#bfe3f8"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 6, 3.4, 0, 0, 7); g.fill();
        g.fillStyle = "#9aa4b4"; g.fillRect(sx + 7, sy, 2, 10); g.fillStyle = "#e0f2fe"; for (let i = 0; i < 4; i++) g.fillRect(sx + 4 + i * 2, sy + 2, 1, 3 + (i % 2) * 2);
        g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect(sx + 4 + ((fr / 10) % 7), sy + 9, 2, 1); K.light(sx + 8, sy + 8, 16, "190,230,255", 0.15);
      },
      // vetrina vuota della Coppa delle Vette (bar)
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 13, 14, 3); g.fillStyle = "#4a2e18"; g.fillRect(sx + 1, sy + 8, 14, 7); g.fillStyle = "#6a4426"; g.fillRect(sx + 1, sy + 8, 14, 1);
        g.fillStyle = "#16141f"; g.fillRect(sx + 2, sy - 9, 12, 17); g.fillStyle = "rgba(200,230,255,.22)"; g.fillRect(sx + 3, sy - 8, 10, 15); g.fillStyle = "rgba(255,255,255,.45)"; g.fillRect(sx + 4, sy - 7, 1, 8);
        g.fillStyle = "#3a2a1a"; g.fillRect(sx + 6, sy + 4, 4, 2); g.fillStyle = "#e8dcc0"; g.fillRect(sx + 5, sy + 1, 6, 2); if (Math.floor(fr / 25) % 2) { g.fillStyle = "#ef4444"; g.fillRect(sx + 7, sy - 4, 2, 4); g.fillRect(sx + 7, sy + 1, 2, 1); }
      },
      // stufa di ghisa accesa (scalda: fonte di calore)
      O(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 2, sy + 13, 12, 3); g.fillStyle = "#2a2a32"; g.fillRect(sx + 3, sy - 2, 10, 15); g.fillStyle = "#3a3a46"; g.fillRect(sx + 3, sy - 2, 10, 2);
        g.fillStyle = "#16141f"; g.fillRect(sx + 5, sy + 3, 6, 6); const fl = Math.abs(Math.sin(fr / 4 + tx)); g.fillStyle = "#f59e0b"; g.fillRect(sx + 6, sy + 8 - Math.round(fl * 4), 4, 1 + Math.round(fl * 4)); g.fillStyle = "#fde68a"; g.fillRect(sx + 7, sy + 7, 2, 2);
        g.fillStyle = "#2a2a32"; g.fillRect(sx + 7, sy - 14, 2, 12); K.light(sx + 8, sy + 6, 34, "255,160,70", 0.4 + 0.1 * Math.sin(fr / 5));
      },
      // catasta di legna
      J(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 13, 16, 3);
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3 - (r === 2 ? 1 : 0); c++) { const x = sx + 1 + c * 5 + (r === 2 ? 2 : 0), y = sy + 9 - r * 4; g.fillStyle = "#6a4426"; g.fillRect(x, y, 5, 4); g.fillStyle = "#c8945a"; g.fillRect(x + 1, y + 1, 3, 2); g.fillStyle = "#8a5a32"; g.fillRect(x + 2, y + 1, 1, 2); }
        g.fillStyle = "#f4f8fc"; g.fillRect(sx + 2, sy - 3, 12, 2);
      },
      // rastrelliera degli sci e delle slitte
      P(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a3a20"; g.fillRect(sx + 1, sy + 10, 14, 2); g.fillRect(sx + 1, sy + 2, 14, 2);
        ["#dc2626", "#2563eb", "#f59e0b", "#16a34a"].forEach((c, i) => { g.fillStyle = c; g.fillRect(sx + 2 + i * 3, sy - 8 + (i % 2) * 2, 2, 20); g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(sx + 2 + i * 3, sy - 8 + (i % 2) * 2, 1, 3); });
        g.fillStyle = "#f4f8fc"; g.fillRect(sx + 1, sy + 1, 14, 1);
      },
      // cippo di pietra con la croce di vetta e il cartello del sentiero
      C(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 3, sy + 13, 10, 3); g.fillStyle = "#7a8496"; g.fillRect(sx + 4, sy + 2, 8, 12); g.fillStyle = "#9aa4b4"; g.fillRect(sx + 4, sy + 2, 8, 2);
        g.fillStyle = "#5a3a20"; g.fillRect(sx + 7, sy - 10, 2, 12); g.fillRect(sx + 4, sy - 7, 8, 2); g.fillStyle = "#f4f8fc"; g.fillRect(sx + 4, sy - 8, 8, 1); g.fillRect(sx + 4, sy + 1, 8, 1);
      },
      // il cancello del sentiero (avvia i livelli): tronchi, catena, bandierine di preghiera
      X(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#e8eef6"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#4a3020"; g.fillRect(sx + 1, sy - 12, 3, 28); g.fillRect(sx + 12, sy - 12, 3, 28); g.fillStyle = "#6a4426"; g.fillRect(sx + 2, sy - 12, 1, 28); g.fillRect(sx + 13, sy - 12, 1, 28);
        g.fillStyle = "#5a3a20"; g.fillRect(sx + 1, sy - 13, 14, 3); g.fillStyle = "#f4f8fc"; g.fillRect(sx, sy - 15, 16, 2);
        for (let i = 0; i < 5; i++) { g.fillStyle = ["#dc2626", "#f59e0b", "#16a34a", "#2563eb", "#f4f4f4"][(i + tx) % 5]; g.fillRect(sx + 1 + i * 3, sy - 9 + Math.round(Math.sin(fr / 7 + i)), 2, 3); }
        g.fillStyle = "#9aa0b4"; for (let x = 4; x < 12; x += 2) g.fillRect(sx + x, sy + 2 + Math.abs(x - 8) / 2, 1, 1);
      },
      // braciere acceso in piazza (fonte di calore)
      M(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 7, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#3a3a44"; g.fillRect(sx + 3, sy + 6, 10, 6); g.fillRect(sx + 4, sy + 12, 2, 3); g.fillRect(sx + 10, sy + 12, 2, 3); g.fillStyle = "#5a5a66"; g.fillRect(sx + 3, sy + 6, 10, 1);
        for (let i = 0; i < 4; i++) { const h = 3 + Math.abs(Math.sin(fr / 4 + i * 1.7)) * 6; g.fillStyle = i % 2 ? "#f59e0b" : "#ef4444"; g.fillRect(sx + 4 + i * 2, sy + 6 - h, 2, h); } g.fillStyle = "#fde68a"; g.fillRect(sx + 7, sy + 3, 2, 3);
        for (let i = 0; i < 3; i++) { const t = (fr * 0.6 + i * 20) % 60; g.fillStyle = `rgba(255,200,120,${0.8 - t / 70})`; g.fillRect(sx + 6 + Math.sin(t / 8 + i) * 3, sy - t * 0.5, 1, 1); }
        K.light(sx + 8, sy + 4, 46, "255,150,60", 0.45 + 0.1 * Math.sin(fr / 4));
      },
      // bancone del bar con la macchina del caffè
      N(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#5a361c"; g.fillRect(sx, sy + 2, 16, 14); g.fillStyle = "#8a5a32"; g.fillRect(sx, sy, 16, 3); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 8, 16, 1);
        if (tx % 3 === 0) { g.fillStyle = "#c8c8d0"; g.fillRect(sx + 3, sy - 8, 10, 8); g.fillStyle = "#16141f"; g.fillRect(sx + 5, sy - 5, 6, 3); for (let i = 0; i < 2; i++) { const t = (fr * 0.5 + i * 12) % 24; g.fillStyle = `rgba(240,240,250,${0.5 - t / 50})`; g.fillRect(sx + 6 + i * 3, sy - 10 - t / 2, 2, 2); } }
        else if (tx % 3 === 1) { ["#16a34a", "#b45309", "#f4f4f4"].forEach((c, i) => { g.fillStyle = c; g.fillRect(sx + 3 + i * 4, sy - 6, 3, 6); }); }
      },
      // gagliardetti e foto della squadra del 1979 alla parete (bar)
      R(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#3a2416"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#4a2e1a"; g.fillRect(sx, sy + 14, 16, 2);
        if (tx % 2) { g.fillStyle = "#16a34a"; g.beginPath(); g.moveTo(sx + 3, sy + 2); g.lineTo(sx + 13, sy + 2); g.lineTo(sx + 8, sy + 13); g.fill(); g.fillStyle = "#f4f4f4"; g.fillRect(sx + 6, sy + 4, 4, 2); }
        else { g.fillStyle = "#c8a050"; g.fillRect(sx + 2, sy + 2, 12, 10); g.fillStyle = "#4a4a4a"; g.fillRect(sx + 3, sy + 3, 10, 8); g.fillStyle = "#9a9a9a"; for (let i = 0; i < 4; i++) g.fillRect(sx + 4 + i * 2, sy + 6 + (i % 2), 1, 3); }
      },
      // porta della stalla / scala per i livelli in casa di Olmo (non usata nel cap.1)
      G(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#4a3020"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#16141f"; g.fillRect(sx + 2, sy + 2, 12, 14); g.fillStyle = "#6a4426"; g.fillRect(sx + 3, sy + 3, 10, 13); g.fillStyle = "#3a2010"; g.fillRect(sx + 7, sy + 3, 1, 13); g.fillStyle = "#c8a050"; g.fillRect(sx + 10, sy + 9, 2, 2);
      }
    },
    act: { S: "Guarda la croce", V: "Guarda il televisore", Z: "Guarda la porta", F: "Guarda la fontana", A: "Guarda la vetrina", O: "Scaldati alla stufa", J: "Guarda la legna", P: "Guarda gli sci", C: "Leggi il cippo", X: "Prendi il sentiero", M: "Scaldati al braciere", N: "Guarda il bancone", R: "Guarda le foto", G: "Apri la porta", n: "Leggi il cartello", x: "Apri il baule", s: "Riposa un momento", q: "Entra", l: "Guarda la lanterna", b: "Siediti", u: "Guarda il tavolo", z: "Guarda le casse" },
    rest: { ch: "s", label: "Riposa un momento", text: "Ti siedi e soffi sulle mani. Il gioco salva da solo. Dal menu: 🏔️ Livelli a scorrimento per rigiocare quelli superati." },
    texts: { nothing: "Neve, neve e ancora neve. Bellissima, ma non aiuta.", noHero: "Tecla cerca un calciatore per la Partita della Neve. Crea prima il tuo Campione.", chestOpen: "Apri il baule.", chestEmpty: "Il baule è vuoto. Solo naftalina e un guanto spaiato." },
    journal: { name: "Il Diario di Vetta", sub: "Salite, stelle alpine, persone e finali" },
    cold: { name: "Calore", icon: "🌡️", max: 8, sec: 13, home: (K, zid) => ({ gn_paese: ["gn_paese", 15, 14], gn_campo: ["gn_campo", 9, 12], gn_rifugio: ["gn_rifugio_in", 8, 8], gn_morena: ["gn_grotta", 8, 8], gn_cima: ["gn_capanna", 8, 8] })[zid] || ["gn_paese", 15, 14], onZero: () => [["voce", "Le dita non le senti più, poi neanche i piedi. Qualcuno ti prende sotto le braccia e ti trascina vicino al braciere della piazza."], ["gn_tecla", "[arrabbiata] In montagna il freddo non perdona, campione. Stai vicino al fuoco e bevi questo. È solo tè. Quasi solo tè."]] },
    scroll: { eng: "__scorri", kit: "guanti", name: "🏔️ Le salite di Valdigelo", banName: "Stelle alpine", banIcon: "❄️", practiceName: "Il pendio d'allenamento", practiceSub: "Prova i comandi coi guanti: salto, parata, tuffo-planata, ghiaccio", hint: "Nessuna salita superata, per ora. Le salite vere partono dal cancello del sentiero (a nord del paese), dopo aver avuto i guanti di Olmo. Intanto: il pendio d'allenamento.", levels: LV, bonus: (K) => (K.inv.has("gn_lana") ? 1 : 0) + (K.inv.has("gn_berretto") ? 1 : 0) },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Forestiero", "Conoscente", "Amico", "Di casa", "Gente di Valdigelo"],
      scenes: {
        gn_olmo: [{ lv: 2, id: "olm2", lines: [["gn_olmo", "Sai cosa fa un portiere per novanta minuti? Aspetta. Il centravanti corre, segna, si prende gli applausi. Il portiere aspetta."], ["gn_olmo", "[pensa] Io ho aspettato tutta la vita. Che finisse la partita, che finisse l'inverno, che qualcuno mi chiedesse la cosa giusta. Nessuno me l'ha chiesta. Meglio così. Forse."]], reward: (K) => K.bond("verita", 1) }],
        gn_tecla: [{ lv: 2, id: "tec2", prize: "Un gomitolo di lana grossa (+1 pezzo nelle salite)", lines: [["gn_tecla", "Questo bar l'ha aperto mia nonna nel '51. Lei faceva il vin brulè, mia madre la cioccolata, io faccio tutte e due e il commercialista dice che sbaglio."], ["gn_tecla", "[felice] Tieni, gomitolo di lana grossa: fatti una sciarpa in più. Lassù una sciarpa vale una vita. Lo diceva la nonna, e la nonna è morta a centotré anni."]], reward: (K) => K.inv.give("gn_lana") }],
        gn_fulvio: [{ lv: 2, id: "ful2", lines: [["gn_fulvio", "Nel '79 io giocavo terzino. Ero lento, ero scarso, ma tiravo calci a tutto ciò che si muoveva. Il mister diceva che ero un muro. Un muro con le gambe storte."], ["gn_fulvio", "[serio] Poi mi sono fatto prete. Non per vocazione, all'inizio: per senso di colpa. La vocazione è arrivata dopo, come il secondo tempo."]], reward: (K) => K.bond("verita", 1) }],
        gn_lilli: [{ lv: 2, id: "lil2", lines: [["gn_lilli", "Lo sai che il nonno Olmo non mi ha mai fatto vedere la sua parata famosa? Dice che non c'è la cassetta. Ma c'è, in soffitta. L'ho vista."], ["gn_lilli", "[pensa] Una volta l'ho messa nel videoregistratore. Si vedeva solo neve. Neve vera, sul campo. E il nonno che si butta. Poi la cassetta si è mangiata il nastro."]], reward: (K) => K.bond("leggenda", 1) }]
      }
    },
    inv: {
      items: {
        gn_guanti: { n: "Guanti di Olmo", icon: "🧤", d: "Guanti da portiere del 1979, cuciti e ricuciti. Arancioni una volta, ora color «fiducia». Nelle salite servono a PARARE: le palle di neve tornano indietro.", gift: {}, giftAny: 0 },
        gn_lana: { n: "Gomitolo di Tecla", icon: "🧶", d: "Lana grossa di pecora di Valdigelo. Diventa una sciarpa in più: nelle salite vale un colpo in più.", gift: {}, giftAny: 0 },
        gn_berretto: { n: "Berretto degli Stambecchi", icon: "🧢", d: "Berretto di lana verde e bianco con il pompon. Il Raccattapalle ne aveva una collezione. Nelle salite vale un colpo in più.", gift: {}, giftAny: 0 },
        gn_brule: { n: "Vin brulè di Tecla", icon: "🍷", d: "Vino caldo, cannella, chiodi di garofano e un segreto di famiglia che, dice Tecla, «è più cannella».", gift: { gn_olmo: 6, gn_fulvio: 8 }, giftAny: 2, react: { gn_olmo: "Quello di Tecla. Il migliore della valle. Non dirglielo, che alza i prezzi.", gn_fulvio: "Benedetto. Il vin brulè, dico. Anche Tecla, ma lei lo sa già." } },
        gn_sciarpa: { n: "Sciarpa con la A", icon: "🧣", d: "Una sciarpa degli Stambecchi del 1979, piccola, da ragazzo. Su un angolo, ricamata a mano, una A. Era nella tana del Raccattapalle, piegata con cura.", gift: { gn_fulvio: 6 }, giftAny: 0, react: { gn_fulvio: "[serio] La A. Lo sapevo che prima o poi tornava fuori. Tienila tu. Io non sono pronto." } },
        gn_chiave: { n: "Chiave del cancello", icon: "🗝️", d: "La chiave del cancello del canalone, chiuso dal Comune nel 1979. Don Fulvio la teneva nel tabernacolo, «perché lì nessuno guarda».", gift: {}, giftAny: 0 },
        gn_pagina: { n: "Pagina del libro del rifugio", icon: "📖", d: "13 dicembre 1979. Due firme: una grande, una piccola. «Abbiamo vinto. Domani lo dico a tutti. A.»", gift: { gn_olmo: 2 }, giftAny: 0, react: { gn_olmo: "[serio] ...Questa calligrafia la conosco. Mettila via. No: tienila in mano. Così la vedo." } },
        gn_maglia12: { n: "Maglia numero 12", icon: "👕", d: "Una maglia verde degli Stambecchi, numero 12, da portiere di riserva. Ai gomiti, due toppe di cuoio. Sopra, infilata al contrario, una maglia numero 1.", gift: { gn_ilde: 10, gn_olmo: 4 }, giftAny: 0, react: { gn_ilde: "[commosso] La sua. La portava sotto quella di Olmo. Lo sapevo che era lì.", gn_olmo: "[serio] La 12. Gliel'avevo prestata io, la mia. No. Gliel'avevo presa io, la sua." } },
        gn_lettere: { n: "Lettere mai spedite", icon: "✉️", d: "Quarantacinque lettere, una per inverno, tutte indirizzate a «Olmo Brina, Valdigelo». Timbrate. Mai spedite.", gift: { gn_olmo: 8 }, giftAny: 0, react: { gn_olmo: "[commosso] Ilde. Sono di Ilde. ...Le leggo stanotte. Tutte. Una alla volta." } },
        gn_coppa: { n: "Coppa delle Vette", icon: "🏆", d: "La Coppa delle Vette del 1979, lucidata come non lo era da anni. Sulla targhetta c'è un nome solo. Ne manca uno.", gift: {}, giftAny: 0 },
        gn_cassetta: { n: "Videocassetta del 1979", icon: "📼", d: "«FINALE COPPA DELLE VETTE · 1979 · NON CANCELLARE». Il nastro è mangiato a metà.", gift: { gn_olmo: 2, gn_lilli: 8 }, giftAny: 0, react: { gn_olmo: "[serio] Dove l'hai trovata? ...Lasciala qui. No. Tienila. Non lo so.", gn_lilli: "La cassetta! Allora non me lo sono inventato!" } }
      }
    },
    endings: {
      verita: ["La Parata Vera", "Olmo racconta a tutto il paese cosa successe davvero nel 1979. La Coppa torna in vetrina con un nome in più sulla targa.", "Fai venire fuori la verità, fino in fondo."],
      leggenda: ["La Leggenda di Valdigelo", "La Coppa torna al bar e la storia resta quella di sempre: Olmo il Guardiano, la parata impossibile. Qualcuno, in cima alla montagna, resta solo.", "Proteggi la leggenda del paese."],
      vetta: ["La Coppa sulla Vetta", "La Coppa resta lassù, accanto a chi l'aspettava da quarantacinque anni. Il paese ne fa una nuova, di latta, e la chiama «la Coppa di Aurelio».", "Lascia la Coppa dove è giusto che stia."],
      neve: ["Il Guardiano di Neve", "Segreto: con tutte le stelle alpine, Olmo sale fino in vetta sulla slitta di Fiocco. Ilde tira l'ultimo rigore, e Olmo, per la prima volta, si butta dalla parte sbagliata apposta.", "Segreto: trova tutte le stelle alpine e porta Olmo in vetta."]
    },
    heroLook: (h, K) => (K && K.F && K.F.is("gn_guanti") ? { bg: ["#0c4a6e", "#7dd3fc"], shirt: "#2f6b3a" } : { bg: ["#0c4a6e", "#bae6fd"] }),
    heroTitle: () => "portiere di montagna",
    musicMain: "neve",
    music: { neve: { bpm: 92, chords: ["Am", "F", "C", "G", "Am", "F", "E", "E"], lres: 2, lw: "triangle", lv: 0.03,
      lead: "A4 - C5 - E5 - - - | F5 - E5 - C5 - - - | G5 - E5 - C5 - D5 - | E5 - - - - - - - | A5 - G5 - E5 - C5 - | D5 - C5 - A4 - - - | B4 - C5 - D5 - B4 - | A4 - - - - - - -",
      bass: "R . . . 5 . . . R . . . 5 . . .", bv: 0.08, arp: "1 5 8 5 3 5 8 5", aw: "triangle", av: 0.014, drum: "k . . . h . . . s . . . h . . .", dv: 0.05 } },
    guide: () => [["🏔️ Livelli a scorrimento", "Al cancello del sentiero parte una salita in pixel art. ◀ ▶ cammini, ⤒ salti, 🧤 PARI: una palla di neve parata torna indietro e colpisce chi l'ha tirata (all'ultimo istante è una PARATA! e vale un gettone). Dopo il salto tieni premuto ⤒ per il tuffo-planata. Il ghiaccio blu scivola."], ["❄️ Stelle alpine", "Ogni salita nasconde delle stelle alpine: in alto, sopra i crepacci, sopra le assi. Dal menu, 🏔️ Livelli a scorrimento, rigiochi quelli superati per trovarle tutte. Contano per un finale."], ["🕯️⭐ Verità e Leggenda", "Le scelte pesano: Verità (dire come sono andate le cose) o Leggenda (proteggere la storia che il paese racconta). Alcune risposte si aprono solo con abbastanza punti."]],
    zoneMenuExtra: (K) => (K.scroll ? [{ label: "🏔️ Livelli a scorrimento", sub: Object.keys(LV).some((id) => K.scroll.won(id)) ? "Rigioca le salite superate (stelle alpine e record) o allenati sul pendio" : "Allenati subito sul pendio. Le salite vere partono dal cancello del sentiero", fn: () => K.scroll.open(() => K.done()) }] : []),
    cameos: [],
    guest: { id: "gn_olmo", lines: ["Olmo Brina, portiere. In pensione. Cioè: portiere lo stesso, ma seduto.", "Il mare d'inverno non l'avevo mai visto. Assomiglia alla neve, ma si muove. Non mi fido."] }
  });
  window.__neveH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1f2937", skin: "#e0b890" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "700 6px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(14,30,48,.9)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#7dd3fc"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = col || "#e0f2fe"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.restore(); },
      // una salita: cb(r) con r.win; prima una riga di Olmo (dalla radiolina che ti ha dato)
      level(id, line, cb) { const go = () => K.scroll.play(id, {}, (r) => cb(r || {})); const l = H.flush().concat(line ? [["gn_olmo", line]] : []); if (l.length) K.say(l, go); else go(); },
      people() {
        H.cast("gn_olmo", "Olmo Brina", "Ex portiere degli Stambecchi", { style: "bald", hair: "#e5e7eb", shirt: "#2f6b3a", skin: "#d9a679", eye: "#1e3a8a", beard: "corta", acc: ["berretto"], bg: ["#0c4a6e", "#bae6fd"] }, "Settantaquattro anni, ginocchia di cristallo, mani ancora grandi come pale. Nel 1979 parò il rigore che diede a Valdigelo la Coppa delle Vette. Da allora lo chiamano «il Guardiano». Lui dice che è un soprannome da cane.");
        H.cast("gn_tecla", "Tecla Morandin", "Barista del Bar Stambecco", { style: "ponytail", hair: "#7c2d12", shirt: "#b91c1c", skin: "#f1d1b0", eye: "#365314", acc: ["grembiule"], bg: ["#7c2d12", "#fed7aa"] }, "Terza generazione dietro il bancone del Bar Stambecco. Fa il miglior vin brulè della valle e lo sa. Conosce tutti, perdona quasi tutti, fa credito solo a Olmo.");
        H.cast("gn_fulvio", "Don Fulvio", "Parroco di Valdigelo", { style: "short", hair: "#a8a29e", shirt: "#1c1917", skin: "#e8c4a0", eye: "#44403c", acc: ["occhiali"], bg: ["#1c1917", "#e7e5e4"] }, "Parroco da trent'anni, terzino degli Stambecchi nel 1979. Benedice gli sci, le slitte e una volta, per sbaglio, un gatto. Ha un segreto che pesa più della campana.");
        H.cast("gn_lilli", "Lilli Brina", "Nipote di Olmo", { style: "twintails", hair: "#b45309", shirt: "#db2777", skin: "#f1d1b0", eye: "#1e3a8a", acc: ["fiore"], bg: ["#831843", "#fbcfe8"] }, "La nipote di Olmo: undici anni, una slitta rossa e la certezza di aver visto lo yeti dalla finestra. Ha ragione, ma nessuno le crede, che è il suo argomento preferito.");
        H.cast("gn_ilde", "Ilde Rovere", "La Regina del Gelo", { style: "long", hair: "#e5e7eb", shirt: "#e0f2fe", skin: "#e8c4a0", eye: "#1e3a8a", acc: ["sciarpa"], bg: ["#0c4a6e", "#e0f2fe"] }, "Settantadue anni, vive da sola in cima alla montagna da quando suo fratello non è tornato. In paese la chiamano la Regina del Gelo e la usano per spaventare i bambini. I bambini, invece, le lasciano i disegni sul cippo.");
        H.cast("gn_fiocco", "Il Grande Raccattapalle", "Yeti del bosco", { shape: "ombra", skin: "#eef4fa", shirt: "#d23a3a", eye: "#16141f", hair: "#eef4fa", bg: ["#bae6fd", "#ffffff"] }, "Uno yeti grande come un fienile, con la sciarpa degli Stambecchi. Da quarant'anni raccoglie i palloni che finiscono nel bosco. Non li restituisce. Dice che è il suo lavoro, ma non sa chi l'ha assunto.");
      }
    };
    return H;
  };
  window.__neve = E.api; window.__neveCore = E;
})();
