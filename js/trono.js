// js/trono.js - IL TRONO DI CUOIO · configurazione della saga sul motore comune (js/saga-core.js)
// Saga SERIA, di intrighi. Spunto: i grandi fantasy di casate e troni, ma tutto inventato.
// Il continente di Valdoro: sette casate, sette squadre. Ogni sette anni il Torneo del Trono decide chi siede sul Trono di
// Cuoio, cucito con il primo pallone della storia. Tu sei il figlio non riconosciuto di Casa Tasso, quello che nessuno
// invita ai banchetti, e stai per entrare nel gioco più pericoloso di tutti: quello dei patti.
// Novità di questa saga (oltre a quelle del motore comune):
//  - IL CONCILIO (js/concilio.js): la partita originale, con un motore suo. Prima della partita, al TAVOLO, si firmano
//    patti a carte (sigilli di cera) che le casate possono TRADIRE; poi si gioca a turni su tre corsie. La CREDIBILITÀ
//    (0–10) passa da una partita all'altra, e la saga si ricorda di ogni tradimento.
//  - IL VOTO DEL CONSIGLIO (K.voto): una scena nuova del motore. Le casate votano una dopo l'altra, gli stendardi si
//    girano e cade il sigillo del SÌ o del NO. Ogni voto dipende da quello che hai fatto (patti, partite, segreti).
//  - STENDARDI ANIMATI (tessera Q): bandiere di stoffa che sventolano davvero, con i colori e il simbolo della casata
//    del posto; il Trono di Cuoio (tessera Y) brilla nella sala.
// Salvataggio proprio: ali-di-rondine.trono. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__trono || !window.__sagaCore) return;
  const TS = 16;
  const CASATE = {
    tasso: { n: "Casa Tasso", s: "🦡", c: "#6a5a3a", c2: "#e8d8b0", motto: "«Sotto terra, mai sotto nessuno»" },
    corvonero: { n: "Casa Corvonero", s: "🪶", c: "#2a2a3a", c2: "#9a8ac8", motto: "«Noi sappiamo»" },
    ferroquercia: { n: "Casa Ferroquercia", s: "🌳", c: "#8a6a1a", c2: "#ffd27a", motto: "«Le radici non si piegano»" },
    salmastra: { n: "Casa Salmastra", s: "🐙", c: "#1a4a6a", c2: "#7ad8d8", motto: "«La marea torna sempre»" },
    rovoardente: { n: "Casa Rovoardente", s: "🔥", c: "#a83a1a", c2: "#ffb84a", motto: "«Brucia, e ricresce»" },
    gelaneve: { n: "Casa Gelaneve", s: "❄️", c: "#5a7a9a", c2: "#e8f0f8", motto: "«L'inverno ricorda»" },
    pietrabruna: { n: "Casa Pietrabruna", s: "⛰️", c: "#5a4a3a", c2: "#c8b898", motto: "«Una parola, come una pietra»" },
  };
  const E = window.__sagaCore.create({
    id: "trono", key: "ali-di-rondine.trono", title: "Il Trono di Cuoio", icon: "👑", bg: "tc_titolo", chapters: 3,
    menuSub: "Sette casate, un trono cucito con il primo pallone, e una partita in cui contano più i patti dei gol",
    theme: { accent: "#ffd27a", ink: "#f0e4c8", paper: "rgba(26,16,8,.92)", font: "Georgia, serif", chipBg: "#2a1a0cee", chipBorder: "#c8a050" },
    stats: { onore: [-9, 99, 0, "Onore a corte"], intrighi: [0, 99, 0, "Intrighi scoperti"] },
    travel: true,
    item: ["Sigillo di cera", "Sigilli di cera"],
    regions: {
      rocca: { grass: ["#5a6a3a", "#56663a", "#5e6e40"], path: ["#8a7a5a", "#827252"], stone: ["#8a8478", "#7e786c"], wall: ["#6a6458", "#5e584c"], water: ["#3a5a7a", "#40607e"], tall: "#4a5a2a", tree: ["#2a3a1a", "#344420", "#2e3e1c"], tint: "200,180,140", tintA: 0.1, fx: "", dark: 0.06 },
      capitale: { grass: ["#6a7a3a", "#667638", "#6e7e40"], path: ["#b8a07a", "#b09872"], stone: ["#c8b898", "#c0b090"], wall: ["#a89070", "#9c8464"], water: ["#3a6a9a", "#4070a0"], tall: "#5a6a2a", tree: ["#2a4a1a", "#345420", "#2e4e1c"], tint: "255,220,150", tintA: 0.08, fx: "dust", dark: 0.02 },
      arena: { grass: ["#5a8a3a", "#56863a", "#5e8e40"], path: ["#c8b080", "#c0a878"], stone: ["#b8a888", "#b0a080"], wall: ["#8a7a5a", "#827252"], water: ["#3a6a9a", "#4070a0"], tall: "#4a7a2a", tree: ["#2a4a1a", "#345420", "#2e4e1c"], tint: "255,200,120", tintA: 0.1, fx: "", dark: 0.04 },
      casa: { grass: ["#6a4a2a", "#644424", "#704e2e"], path: ["#9a7a52", "#92724a"], stone: ["#a89878", "#a09070"], wall: ["#3a2a1a", "#342414"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,180,100", tintA: 0.16, fx: "dust", dark: 0.14 },
    },
    floors: "", solid: "QY",
    rest: { ch: "s", label: "Siediti sulla panca", text: "Ti siedi. Da qualche parte un corvo gracchia tre volte: a Valdoro vuol dire «qualcuno ti ascolta». (Il gioco salva da solo: qui puoi rileggere il Libro delle Casate.)" },
    texts: { chestOpen: "Apri lo scrigno.", chestEmpty: "Lo scrigno è vuoto. Sul fondo, un'impronta di sigillo: qualcuno è arrivato prima di te.", nothing: "Niente. Ma a Valdoro anche il niente ha orecchie.", noHero: "Casa Tasso aspetta il suo figlio senza nome. Prima crea il tuo Campione.", chapters: "Tre capitoli, sette casate, un trono. Ogni patto che rompi, Valdoro se lo ricorda." },
    journal: { name: "Il Libro delle Casate", sub: "Casate, patti, voti, finali" },
    endings: {
      trono: ["IL TRONO DI CUOIO", "Ti siedi sul Trono di Cuoio. Scricchiola come un pallone vecchio. Per sette anni Valdoro giocherà secondo le tue regole, e tu imparerai che un trono è soprattutto una sedia scomoda.", "Sempre possibile, alla fine."],
      barriera: ["OLTRE LA BARRIERA DI GHIACCIO", "Lasci il Trono vuoto e porti sette squadre a nord, oltre la Barriera di Ghiaccio, dove Gelaneve gioca da secoli contro l'inverno. Laggiù non c'è nessun trono: solo un campo bianco e una partita che non è mai finita.", "Serve aver ascoltato davvero Casa Gelaneve."],
      repubblica: ["LA REPUBBLICA DELLE SQUADRE", "Il Trono di Cuoio va in un museo. Al suo posto, un tavolo rotondo con sette sedie uguali: Valdoro diventa una lega, e le casate votano il calendario. Litigano sempre. Ma litigano parlando.", "Serve una credibilità altissima al Consiglio."],
      nessuno: ["IL TRONO DI NESSUNO", "Scuci il Trono, pezzo per pezzo, e con il cuoio cuci sette palloni: uno per casata. Il Trono non c'è più. Il primo pallone della storia torna a fare quello per cui era nato: rotolare.", "Segreto: non tradire mai un patto e trovare tutti i sigilli di cera."],
    },
    heroLook: (h, K) => ({ bg: ["#2a1a0c", "#c8a050"], shirt: K.F.is("tc_riconosciuto") ? CASATE.tasso.c : h.shirt }),
    heroTitle: (K) => (K.F.is("tc_riconosciuto") ? "di Casa Tasso" : "il figlio senza nome"),
    act: { q: "Entra", Q: "Guarda lo stendardo", Y: "Guarda il Trono di Cuoio", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      hud(g, zid, spec, K) { // la credibilità a corte, sempre in vista (in alto a destra)
        const c = cred(K), t = `CREDIBILITÀ ${c}/10`; g.save(); g.font = "bold 8px Georgia, serif"; const w = g.measureText(t).width + 22, x = 314 - w;
        g.fillStyle = "rgba(26,16,8,.75)"; g.fillRect(x, 22, w, 13); g.strokeStyle = "#c8a050"; g.lineWidth = 1; g.strokeRect(x + 0.5, 22.5, w - 1, 12);
        g.fillStyle = c >= 7 ? "#ffd27a" : c >= 4 ? "#e8d8b0" : "#ff8a6a"; g.beginPath(); g.arc(x + 8, 28.5, 3.5, 0, 7); g.fill(); g.fillStyle = "#a82a2a"; g.beginPath(); g.arc(x + 8, 28.5, 2, 0, 7); g.fill();
        g.fillStyle = "#f0e4c8"; g.fillText(t, x + 15, 31.5); g.restore();
      },
      obj(ch, tx, ty, zid, spec, K) {
        if (ch !== "Q") return false; const c = CASATE[bannerOf(K, zid, tx, ty)];
        K.say([["voce", `Lo stendardo di ${c.n}: ${c.s} su campo ${c.c === "#2a2a3a" ? "nero" : "di stoffa tinta a mano"}. Il motto, ricamato in fondo: ${c.motto}.`]]); return true;
      },
    }],
    musicMain: "trono",
    music: {
      // un tema da corte: violoncello (triangolo grave), arpa (arpeggio), tamburi da torneo
      trono: { bpm: 84, chords: ["Am", "F", "C", "G", "Am", "F", "E", "E"], lres: 2, lw: "triangle", lv: 0.045,
        lead: "A4 - - C5 B4 - A4 - | F4 - - A4 G4 - F4 - | E4 - G4 - C5 - B4 - | D5 - - - B4 - - - | A4 - C5 - E5 - D5 C5 | F5 - E5 - D5 - C5 - | B4 - G#4 - B4 - E5 - | E5 - - - - - - -",
        bass: "R . . . 5 . . . R . . . 5 . R .", bv: 0.1, arp: "1 5 8 5 1 5 8 5 1 5 8 5 1 5 8 5", aw: "sine", av: 0.014, drum: "k . . . s . . k k . . . s . . .", dv: 0.15 },
    },
    paint: {
      // lo stendardo: un'asta e una bandiera di stoffa che sventola (onda che corre lungo il tessuto), con il simbolo
      Q(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const c = CASATE[bannerOf(K, K.ZX.id, tx, ty)], x = tx * TS - cx + 4, y = ty * TS - cy + 15; g.fillStyle = "#4a3a2a"; g.fillRect(x - 1, y - 36, 2, 36); g.fillStyle = "#c8a050"; g.beginPath(); g.arc(x, y - 37, 2, 0, 7); g.fill();
        const N = 8, L = 16, H = 20; g.fillStyle = c.c; g.beginPath(); for (let i = 0; i <= N; i++) { const u = i / N, w = Math.sin(fr / 9 - u * 4 + tx) * 2.2 * u; g.lineTo(x + 1 + u * L, y - 34 + w); } for (let i = N; i >= 0; i--) { const u = i / N, w = Math.sin(fr / 9 - u * 4 + tx) * 2.2 * u; g.lineTo(x + 1 + u * L, y - 34 + H + w - (i === N ? 0 : 0)); } g.closePath(); g.fill();
        for (let i = 0; i < N; i++) { const u = i / N, sh = Math.cos(fr / 9 - u * 4 + tx); if (sh > 0.3) { g.fillStyle = `rgba(0,0,0,${0.18 * sh})`; g.fillRect(x + 1 + u * L, y - 34 + Math.sin(fr / 9 - u * 4 + tx) * 2.2 * u, L / N + 0.5, H); } }
        g.fillStyle = c.c2; g.fillRect(x + 1, y - 34 + H - 3, 2, 3); const mw = Math.sin(fr / 9 - 2 + tx) * 1.1; g.font = "8px serif"; g.textAlign = "center"; g.fillText(c.s, x + 9, y - 21 + mw); g.textAlign = "left"; }); },
      // il Trono di Cuoio: schienale alto di cuoio cucito a esagoni, come un pallone antico; brilla quando lo guardi
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx + 8, y = ty * TS - cy + 15, gone = K.F.is("tc_scucito");
        g.fillStyle = "#3a2410"; g.fillRect(x - 10, y - 4, 20, 4); if (gone) { [[-6, -8], [0, -10], [6, -8]].forEach(([dx, dy]) => { g.fillStyle = "#8a5a2a"; g.beginPath(); g.arc(x + dx, y + dy, 3, 0, 7); g.fill(); }); return; }
        g.fillStyle = "#8a5a2a"; g.fillRect(x - 9, y - 16, 18, 12); g.fillStyle = "#7a4a1e"; g.beginPath(); g.moveTo(x - 9, y - 16); g.lineTo(x - 7, y - 40); g.quadraticCurveTo(x, y - 46, x + 7, y - 40); g.lineTo(x + 9, y - 16); g.closePath(); g.fill();
        g.strokeStyle = "#e8d8b0"; g.lineWidth = 0.6; for (let r = 0; r < 3; r++) for (let q = 0; q < 2; q++) { const hx = x - 3.5 + q * 7, hy = y - 36 + r * 7; g.beginPath(); for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; g.lineTo(hx + Math.cos(a) * 3, hy + Math.sin(a) * 3); } g.closePath(); g.stroke(); }
        g.fillStyle = "#ffd27a"; g.beginPath(); g.arc(x, y - 44, 2.5, 0, 7); g.fill(); K.light(x, y - 30, 30, "255,210,120", 0.25 + 0.1 * Math.sin(fr / 20)); }); },
    },
    guest: { id: "tc_ysolde", lines: [["tc_ysolde", "[furbo] {n}. Il Borgo Marino… grazioso. Nessun trono, nessun patto, nessun corvo. (Si guarda intorno.) Quasi nessun corvo. Uno ce l'ho mandato io, l'anno scorso: dice che qui il pesce è ottimo."]] },
    cameos: [
      { id: "dc_agata", zone: "tc_capitale", at: [6, 18], when: (K) => !!(K.otherSaga("ali-di-rondine.detective") || {}).done?.[1], lines: [
        ["dc_agata", "[pensa] Una corte piena di patti segreti? Assistente, qui ci vorrebbero tre quaderni di appunti. Un consiglio da ispettrice: chi sorride troppo, di solito, ha un garofano da nascondere."]] },
      { id: "nl_leandro", zone: "tc_arena", at: [4, 16], when: (K) => !!(K.otherSaga("ali-di-rondine.lampioni") || {}).done?.[1], lines: [
        ["nl_leandro", "[ride] Un torneo per un trono? Noi nel '52 giocavamo per una torta di castagne. E litigavamo meno. (Guarda gli stendardi.) Belle bandiere, però."]] },
    ],
  });
  const K = E.K;
  // a chi appartiene uno stendardo: la zona dichiara spec.banners = { "x,y": "casata" } (o una casata per tutti)
  function bannerOf(k, zid, tx, ty) { const z = (k || K).zone(zid), b = z && z.spec && z.spec.banners; const id = b && (typeof b === "string" ? b : b[tx + "," + ty] || b.def); return CASATE[id] ? id : "tasso"; }
  function cred(k) { return Math.max(0, Math.min(10, +(k || K).F.get("tc_cred", 5) || 0)); }
  K.CASATE = CASATE; K.cred = () => cred(K); K.setCred = (v) => K.F.set("tc_cred", Math.max(0, Math.min(10, Math.round(v))));
  // la partita del Concilio, con la credibilità che passa da una partita all'altra e i tradimenti che la saga ricorda
  K.concilio = (o, done) => K.ownMatch(window.__concilio.start, Object.assign({ cred: cred(K), usSigil: CASATE.tasso.s, usColor: CASATE.tasso.c }, o, { done: (r) => {
    if (!r.quit && r.data) { K.setCred(r.data.cred); if (r.data.tradimenti) { K.F.add("tc_tradimenti", r.data.tradimenti); K.bond("onore", -2 * r.data.tradimenti); } else if (r.data.patti) K.bond("onore", 1); if (r.data.traditi) K.bond("intrighi", r.data.traditi); }
    done(r);
  } }));
  // IL VOTO DEL CONSIGLIO: le casate votano una dopo l'altra (stendardo che gira, sigillo SÌ / NO), poi il verdetto.
  // K.voto({ title, need, voters: [{ id: casata, yes: bool, why: "motivo" }], done(passed, yes) })
  K.voto = (o) => {
    voteCss(); const ov = document.createElement("div"); ov.className = "tcVote"; const yes = o.voters.filter((v) => v.yes).length, pass = yes >= o.need;
    ov.innerHTML = `<h3>${K.esc(o.title || "Il voto del Consiglio")}</h3><p class="sub">Servono ${o.need} voti su ${o.voters.length}.</p><div class="seats">${o.voters.map((v, i) => { const c = CASATE[v.id]; return `<div class="seat" style="--c:${c.c};--c2:${c.c2};--d:${0.5 + i * 0.7}s"><div class="flag"><span>${c.s}</span></div><b>${K.esc(c.n.replace("Casa ", ""))}</b><i class="${v.yes ? "si" : "no"}">${v.yes ? "SÌ" : "NO"}</i><small>${K.esc(v.why || "")}</small></div>`; }).join("")}</div><p class="tot" style="--d:${0.6 + o.voters.length * 0.7}s">${pass ? "IL CONSIGLIO APPROVA" : "IL CONSIGLIO RESPINGE"} · ${yes} a ${o.voters.length - yes}</p>`;
    const b = document.createElement("button"); b.type = "button"; b.textContent = "Chiudi il Consiglio ▸"; b.onclick = () => { ov.remove(); safeCall(() => o.done(pass, yes)); }; ov.appendChild(b); document.body.appendChild(ov);
    o.voters.forEach((v, i) => setTimeout(() => K.tone(v.yes ? 520 : 180, 0.25, v.yes ? "triangle" : "square", 0.04), 500 + i * 700));
    setTimeout(() => K.tone(pass ? 660 : 140, 0.6, "triangle", 0.06, 0, pass ? 990 : 90), 700 + o.voters.length * 700);
  };
  function safeCall(fn) { try { fn(); } catch (e) { console.error(e); } }
  function voteCss() {
    if (document.getElementById("tcVoteCss")) return; const st = document.createElement("style"); st.id = "tcVoteCss";
    st.textContent = `.tcVote{position:fixed;inset:0;z-index:320;background:radial-gradient(circle at 50% 10%,#4a2e18,#140a04);color:#f0e4c8;font-family:Georgia,serif;display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 10px;overflow:auto}
.tcVote h3{margin:4px 0 0;font:900 20px Georgia,serif;color:#ffd27a;text-align:center}.tcVote .sub{margin:0;font-size:12px;opacity:.8}
.tcVote .seats{width:min(100%,420px);display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:8px}
.tcVote .seat{border:1.5px solid #8a6a3a;border-radius:8px;background:#2a1a0c;padding:6px 4px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px}
.tcVote .flag{width:34px;height:42px;background:var(--c);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);display:flex;align-items:center;justify-content:center;font-size:16px;transform:rotateY(90deg);animation:tcFlip .5s ease-out var(--d) forwards;border-top:3px solid var(--c2)}
.tcVote .seat b{font-size:11.5px}.tcVote .seat small{font-size:10px;line-height:1.25;opacity:0;animation:tcIn .4s ease-out calc(var(--d) + .3s) forwards;color:#c8b088}
.tcVote .seat i{font:900 13px Georgia,serif;font-style:normal;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;transform:scale(0);animation:tcSeal .35s cubic-bezier(.3,1.6,.6,1) calc(var(--d) + .25s) forwards}
.tcVote .seat i.si{background:#a82a2a;color:#ffe8b8;box-shadow:0 0 0 3px #7a1a1a inset}.tcVote .seat i.no{background:#3a3a3a;color:#c8c8c8;box-shadow:0 0 0 3px #1a1a1a inset}
.tcVote .tot{margin:4px 0;font:900 16px Georgia,serif;color:#ffd27a;opacity:0;animation:tcIn .5s ease-out var(--d) forwards;text-align:center}
.tcVote button{min-height:44px;min-width:220px;border-radius:8px;border:1.5px solid #c8a050;background:#5a2a10;color:#ffe8b8;font:700 14px Georgia,serif;cursor:pointer}
@keyframes tcFlip{to{transform:rotateY(0)}}@keyframes tcIn{to{opacity:1}}@keyframes tcSeal{to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.tcVote .flag,.tcVote .seat i,.tcVote .seat small,.tcVote .tot{animation-duration:.01s}}`;
    document.head.appendChild(st);
  }
  window.__trono = E.api;
})();
