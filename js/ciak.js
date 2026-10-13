// js/ciak.js - «CIAK! SI GIOCA» · la partita originale di «Il Cavallo Star» (motore proprio, NON il kit di partita)
// La partita è un set televisivo: si gioca a SCENE. Per ogni scena c'è il COPIONE (un'azione scritta: «Baldo dribbla e passa
// al Campione, che tira sul primo palo: gol»). Puoi SEGUIRE IL COPIONE oppure IMPROVVISARE.
//  - Copione: parte il ciak. Un segno corre sulla barra: tocca CIAK! quando è nella zona verde. Se ci riesci, la scena va come
//    è scritta (anche quando il copione dice che segnano LORO). Se sbagli, è una papera: puoi rifarla finché hai dei «ciak»
//    (le ripetizioni), altrimenti la scena va storta.
//  - Improvvisa: scegli una di tre idee (più rischiose, più belle). La zona verde è più stretta. Se riesce, il pubblico impazzisce;
//    se il copione diceva che segnavano loro, improvvisando puoi impedirlo.
// Il REGISTA dà le stelle a ogni scena (1-5): conta come recitate, non solo il risultato. Vince chi segna di più, ma le stelle
// restano: sono la reputazione.
// Uso: window.__ciak.start({ title, us, usColor, hero:{ name }, mates:[{ name }], opp:{ name, color, players:[{ name }] },
//   script:[{ k: "noi"|"loro"|"pari", t: "testo" }], takes, intro, winTitle, onDone })   → r.data = { scene, stelle, media, improvvisate, papere, copione }
(function () {
  "use strict";
  if (window.__ciak) return;
  const W = 320, H = 170;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random;
  // le idee per improvvisare: p = probabilità che la bravura basti (oltre al tempo giusto), g = gol se riesce in attacco, st = stelle
  const IDEE = {
    att: [{ n: "Rovesciata davanti alla telecamera", p: 0.6, g: 1, st: 5 }, { n: "Tacco a sorpresa al compagno", p: 0.75, g: 1, st: 4 }, { n: "Finta di inciampare (poi tiro)", p: 0.7, g: 1, st: 4 }, { n: "Pallonetto al portiere-comparsa", p: 0.65, g: 1, st: 5 }, { n: "Dribbling sul tappeto rosso", p: 0.8, g: 0, st: 4 }, { n: "Saluto al pubblico e tiro di prima", p: 0.55, g: 1, st: 5 }],
    dif: [{ n: "Scivolata fuori copione", p: 0.7, g: 0, st: 3 }, { n: "Ti butti davanti al tiro", p: 0.75, g: 0, st: 4 }, { n: "Rubi il pallone con un inchino", p: 0.6, g: 0, st: 5 }, { n: "Chiami il «Taglia!» e ricominci", p: 0.8, g: 0, st: 2 }],
  };
  const KIND = { noi: ["⚽", "il copione dice: segnate VOI"], loro: ["🥅", "il copione dice: segnano LORO"], pari: ["🎭", "il copione dice: nessun gol"] };
  let STATE = null;
  function start(o) {
    if (document.querySelector(".ckOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 };
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.82 : 1;
    const usCol = o.usColor || "#f0a8c8", opp = Object.assign({ name: "Avversari", color: "#8ab8e8", players: [] }, o.opp || {});
    const hero = Object.assign({ name: "Tu" }, o.hero || o.heroLook || {}), mates = (o.mates || [{ name: "Il compagno" }]).slice(0, 2);
    const script = (o.script && o.script.length ? o.script : [{ k: "pari", t: "Il calcio d'inizio. Tutti sorridono alla telecamera." }, { k: "noi", t: `${mates[0].name} lancia ${hero.name}, che tira: gol.` }, { k: "loro", t: "Gli avversari ripartono e segnano. Tu guardi il cielo, disperato." }, { k: "pari", t: "Un contrasto a centrocampo, molto drammatico." }, { k: "noi", t: `Calcio d'angolo, colpo di testa di ${hero.name}: gol.` }, { k: "loro", t: "All'ultimo minuto segnano loro. Fine dell'episodio." }]).slice(0, 10);
    const S = { o, a: 0, b: 0, i: 0, phase: "intro", over: false, t: 0, takes: o.takes == null ? 2 : o.takes, mode: null, idea: null, bar: 0, dir: 1, zone: [0.4, 0.6], fx: null, stars: [],
      data: { scene: 0, stelle: 0, media: 0, improvvisate: 0, papere: 0, copione: 0 } };
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "ckOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="scn"></i><span class="st"></span><i class="tk"></i></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="scr"></div><div class="pad"></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__ckAC = window.__ckAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.05; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const hud = () => {
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".scn").textContent = `🎬 Scena ${Math.min(S.i + 1, script.length)}/${script.length}`;
      const m = S.stars.length ? S.stars.reduce((x, y) => x + y, 0) / S.stars.length : 0; el.querySelector(".st").textContent = S.stars.length ? `Regista: ${"★".repeat(Math.round(m))}${"☆".repeat(5 - Math.round(m))}` : "Regista: in attesa";
      el.querySelector(".tk").textContent = `🎞️ ciak ${S.takes}`;
    };
    const pad = (btns) => { const p = el.querySelector(".pad"); p.innerHTML = ""; btns.forEach(([t, sub, cls, fn]) => { const b = document.createElement("button"); b.type = "button"; b.className = cls || ""; b.innerHTML = `${t}${sub ? `<small>${sub}</small>` : ""}`; b.addEventListener("pointerdown", (e) => { e.preventDefault(); fn(); }); p.appendChild(b); }); };
    const scr = (h) => { el.querySelector(".scr").innerHTML = h; };
    // ------------------------------------------------------------ una scena: il copione, la scelta
    function scene() {
      if (S.over) return; if (S.i >= script.length) return finish();
      const sc = script[S.i]; S.phase = "choose"; S.mode = null; S.idea = null; S.fx = { k: "board", t: 0 }; tone(880, 0.05, "square", 0.04); setTimeout(() => tone(440, 0.08, "square", 0.05), 90);
      hud(); scr(`<span class="lab">COPIONE · scena ${S.i + 1}</span><b>«${esc(sc.t)}»</b><small>${KIND[sc.k][0]} ${KIND[sc.k][1]}</small>`);
      const ideas = (sc.k === "loro" ? IDEE.dif : IDEE.att).slice().sort(() => R() - 0.5).slice(0, 3);
      pad([["🎬 Segui il copione", sc.k === "loro" ? "reciti la sconfitta: il regista ama" : "la scena come è scritta", "go", () => follow()], ["🎭 Improvvisa", "più rischio, più applausi", "hot", () => improv(ideas)]]);
      S.ideas = ideas;
    }
    function follow() { if (S.phase !== "choose") return false; S.mode = "copione"; timing(0.2 / oppK); return true; }
    function improv(ideas, k) {
      if (S.phase !== "choose" && S.phase !== "idea") return false; ideas = ideas || S.ideas;
      if (k == null) { S.phase = "idea"; pad(ideas.map((d, j) => [d.n, `${d.g && script[S.i].k !== "loro" ? "può fare gol" : script[S.i].k === "loro" ? "ferma il loro gol" : "spettacolo"} · ${"★".repeat(d.st)}`, "", () => improv(ideas, j)]).concat([["↩ Torna al copione", "", "", () => { S.phase = "choose"; follow(); }]])); return true; }
      S.mode = "improv"; S.idea = ideas[k]; S.data.improvvisate++; timing(0.13 / oppK); return true;
    }
    // il ciak: la barra con il segno che corre
    function timing(w) {
      S.phase = "timing"; const c = 0.25 + R() * 0.5; S.zone = [c - w / 2, c + w / 2]; S.bar = 0; S.dir = 1; S.spd = 0.014 * (DF.opp > 1.05 ? 1.2 : 1);
      pad([["🎬 CIAK!", "quando il segno è nel verde", "go big", () => ciak()]]);
    }
    function ciak(force) {
      if (S.phase !== "timing") return false;
      const ok = force != null ? force : S.bar >= S.zone[0] && S.bar <= S.zone[1]; S.phase = "wait";
      if (!ok && S.mode === "copione" && S.takes > 0) { S.takes--; S.data.papere++; tone(200, 0.3, "sawtooth", 0.05); S.fx = { k: "papera", t: 0 }; scr(`<span class="lab">PAPERA!</span><b>«Taglia! Rifacciamola.»</b><small>Ti restano ${S.takes} ciak per rifare le scene.</small>`); hud(); setTimeout(() => { if (!S.over) timing(0.2 / oppK); }, 700); return true; }
      resolve(ok); return true;
    }
    function resolve(ok) {
      const sc = script[S.i]; let st = 1, txt = "", gol = 0;
      if (S.mode === "copione") {
        S.data.copione++;
        if (ok) { st = 4 + (R() < 0.5 ? 1 : 0); if (sc.k === "noi") { gol = 1; txt = "Buona la prima! La scena va come è scritta: <b>GOL</b>."; } else if (sc.k === "loro") { gol = -1; txt = "Reciti la disperazione alla perfezione. Segnano loro, come da copione. Il regista piange di gioia."; } else txt = "Scena perfetta. Nessun gol, molta emozione."; }
        else { st = 1; txt = sc.k === "loro" ? "Papera: inciampi sul cavo della telecamera. Segnano loro lo stesso." : "Papera: la scena va storta. Niente gol."; if (sc.k === "loro") gol = -1; }
      } else {
        const d = S.idea, good = ok && R() < Math.min(0.95, (d.p + 0.04 * (((o.bonus || {})[sc.k === "noi" ? "at" : sc.k === "loro" ? "df" : "te"]) | 0)) / oppK);
        if (good) { st = d.st; if (sc.k === "loro") txt = `<b>${esc(d.n)}!</b> Fuori copione, ma il gol non arriva. Il pubblico in studio si alza in piedi.`; else if (d.g) { gol = 1; txt = `<b>${esc(d.n)}!</b> Nessuno l'aveva scritto: <b>GOL</b>. Il regista non sa se arrabbiarsi o applaudire.`; } else txt = `<b>${esc(d.n)}!</b> Niente gol, ma che spettacolo.`; }
        else { st = 1; if (sc.k === "loro") { gol = -1; txt = `${esc(d.n)}… non riesce. Segnano loro, e tu sei fuori copione.`; } else txt = `${esc(d.n)}… non riesce. Il regista si mette le mani nei capelli.`; }
      }
      if (gol > 0) { S.a++; S.fx = { k: "gol", t: 0 }; tone(660, 0.5, "triangle", 0.06, 1320); } else if (gol < 0) { S.b++; S.fx = { k: "loro", t: 0 }; tone(180, 0.4, "sawtooth", 0.04); } else S.fx = { k: ok ? "bravo" : "papera", t: 0 };
      S.stars.push(st); S.data.stelle += st; S.data.scene++; S.i++; hud();
      scr(`<span class="lab">IL REGISTA: ${"★".repeat(st)}${"☆".repeat(5 - st)}</span>${txt}`);
      pad([[S.i >= script.length ? "Fine dell'episodio ▸" : "Scena dopo ▸", "", "go", () => scene()]]);
    }
    // ------------------------------------------------------------ disegno: il set, a colori pastello e contorni piatti
    function fig(x, y, col, s, k) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 2; g.strokeStyle = "#3a2a3a"; g.fillStyle = col; g.beginPath(); g.roundRect ? g.roundRect(-7, -22, 14, 18, 4) : g.rect(-7, -22, 14, 18); g.fill(); g.stroke(); g.fillStyle = "#3a2a3a"; g.fillRect(-5, -4, 4, 7); g.fillRect(1, -4, 4, 7);
      if (k === "cavallo") { g.fillStyle = "#c8946a"; g.beginPath(); g.ellipse(0, -32, 6, 10, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#6a4a3a"; g.fillRect(2, -42, 3, 14); } else { g.fillStyle = "#f0d0b0"; g.beginPath(); g.arc(0, -29, 7, 0, 7); g.fill(); g.stroke(); } g.restore(); }
    function draw() {
      S.t++; g.setTransform(2, 0, 0, 2, 0, 0);
      g.fillStyle = "#f8e8f0"; g.fillRect(0, 0, W, H); g.fillStyle = "#e8d0e8"; for (let i = 0; i < 8; i++) g.fillRect(i * 44, 0, 22, 60);
      // il campo-set: prato pastello in prospettiva
      g.fillStyle = "#b8e8c0"; g.beginPath(); g.moveTo(30, 70); g.lineTo(290, 70); g.lineTo(320, 150); g.lineTo(0, 150); g.closePath(); g.fill(); g.strokeStyle = "#3a2a3a"; g.lineWidth = 2; g.stroke(); g.strokeStyle = "rgba(255,255,255,.8)"; g.beginPath(); g.moveTo(160, 70); g.lineTo(160, 150); g.stroke(); g.beginPath(); g.ellipse(160, 108, 30, 12, 0, 0, 7); g.stroke();
      [[22, usCol], [298, opp.color]].forEach(([x, c]) => { g.strokeStyle = "#3a2a3a"; g.fillStyle = "#fff"; g.fillRect(x - 6, 88, 12, 30); g.strokeRect(x - 6, 88, 12, 30); g.fillStyle = c; g.fillRect(x - 6, 88, 12, 3); });
      // luci e telecamera sul carrello
      for (let i = 0; i < 3; i++) { const x = 60 + i * 100; g.fillStyle = "rgba(255,240,180,.25)"; g.beginPath(); g.moveTo(x - 4, 0); g.lineTo(x + 4, 0); g.lineTo(x + 30, 150); g.lineTo(x - 30, 150); g.fill(); g.fillStyle = "#3a2a3a"; g.fillRect(x - 6, 0, 12, 6); }
      const cx = 160 + Math.sin(S.t / 60) * 100; g.fillStyle = "#3a2a3a"; g.fillRect(cx - 14, 152, 28, 6); g.fillRect(cx - 2, 140, 4, 12); g.fillStyle = "#7a6a8a"; g.fillRect(cx - 10, 128, 20, 12); g.strokeStyle = "#3a2a3a"; g.strokeRect(cx - 10, 128, 20, 12); g.fillStyle = "#ff5a5a"; if (S.t % 40 < 20) g.fillRect(cx + 6, 130, 2, 2);
      // gli attori
      const sc = script[Math.min(S.i, script.length - 1)] || { k: "pari" }, shift = sc.k === "loro" ? 30 : sc.k === "noi" ? -30 : 0;
      fig(150 + shift - 20, 112, usCol, 0.9, "cavallo"); fig(130 + shift - 20, 128, usCol, 1, ""); mates[1] && fig(110 + shift - 20, 104, usCol, 0.8, "");
      fig(190 + shift, 110, opp.color, 0.9, ""); fig(210 + shift, 126, opp.color, 1, "");
      const bx = 160 + shift + Math.sin(S.t / 8) * 8; g.fillStyle = "#fff"; g.strokeStyle = "#3a2a3a"; g.lineWidth = 1.5; g.beginPath(); g.arc(bx, 132 - Math.abs(Math.sin(S.t / 8)) * 6, 4, 0, 7); g.fill(); g.stroke();
      // la giraffa del microfono
      g.strokeStyle = "#3a2a3a"; g.lineWidth = 2; g.beginPath(); g.moveTo(300, 20); g.lineTo(200 + Math.sin(S.t / 40) * 20, 60); g.stroke(); g.fillStyle = "#8a8a9a"; g.beginPath(); g.ellipse(200 + Math.sin(S.t / 40) * 20, 62, 8, 4, 0, 0, 7); g.fill(); g.stroke();
      // la barra del ciak
      if (S.phase === "timing") {
        S.bar += S.spd * S.dir; if (S.bar > 1) { S.bar = 1; S.dir = -1; } if (S.bar < 0) { S.bar = 0; S.dir = 1; }
        const x0 = 30, w0 = 260, y0 = 18; g.fillStyle = "#fff"; g.fillRect(x0, y0, w0, 14); g.fillStyle = S.mode === "improv" ? "#ffd23f" : "#7ad87a"; g.fillRect(x0 + S.zone[0] * w0, y0, (S.zone[1] - S.zone[0]) * w0, 14); g.strokeStyle = "#3a2a3a"; g.lineWidth = 2; g.strokeRect(x0, y0, w0, 14);
        g.fillStyle = "#3a2a3a"; g.fillRect(x0 + S.bar * w0 - 2, y0 - 4, 4, 22);
      }
      // gli effetti: il ciak che si chiude, il timbro del regista
      if (S.fx) { const F = S.fx; F.t++;
        if (F.k === "board" && F.t < 40) { const a = Math.max(0, 0.5 - F.t / 20); g.save(); g.translate(250, 40); g.fillStyle = "#3a2a3a"; g.fillRect(-30, 0, 60, 34); g.fillStyle = "#fff"; g.font = "bold 9px 'Courier New', monospace"; g.textAlign = "center"; g.fillText(`SCENA ${S.i + 1}`, 0, 14); g.fillText("CIAK " + (S.data.papere + 1), 0, 27); g.rotate(-a); for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? "#fff" : "#3a2a3a"; g.fillRect(-30 + k * 10, -8, 10, 8); } g.restore(); }
        const words = { gol: ["GOL!", "#ff5a8a"], loro: ["…GOL LORO", "#5a8ad8"], bravo: ["BUONA LA PRIMA!", "#3aa85a"], papera: ["PAPERA!", "#d86a3a"] }[F.k];
        if (words && F.t < 60) { const s = 1 + Math.max(0, 6 - F.t) * 0.15; g.save(); g.translate(160, 60); g.rotate(-0.08); g.scale(s, s); g.font = "900 22px 'Arial Rounded MT Bold', 'Arial Black', sans-serif"; g.textAlign = "center"; g.lineWidth = 6; g.strokeStyle = "#3a2a3a"; g.strokeText(words[0], 0, 0); g.fillStyle = words[1]; g.fillText(words[0], 0, 0); g.restore(); }
        if (F.t > 60) S.fx = null; }
      // la pellicola ai bordi
      g.fillStyle = "#3a2a3a"; g.fillRect(0, 0, W, 6); g.fillRect(0, H - 6, W, 6); g.fillStyle = "#f8e8f0"; for (let i = 0; i < 20; i++) { g.fillRect(i * 16 + ((S.t / 2) % 16), 1.5, 8, 3); g.fillRect(i * 16 + ((S.t / 2) % 16), H - 4.5, 8, 3); }
    }
    function loop() { if (!el.isConnected) return; draw(); S.raf = requestAnimationFrame(loop); }
    // tastiera: Spazio = ciak, C = copione, I = improvvisa
    const kd = (e) => { if (!el.isConnected) return; if (e.key === " ") { e.preventDefault(); ciak(); } else if (e.key === "c" || e.key === "C") follow(); else if (e.key === "i" || e.key === "I") improv(); };
    window.addEventListener("keydown", kd);
    // ------------------------------------------------------------ inizio e fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.className = "goB"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      S.data.media = S.stars.length ? Math.round((S.data.stelle / S.stars.length) * 10) / 10 : 0;
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data) };
      card(quit ? "Riprese interrotte" : res.win ? o.winTitle || "VITTORIA IN DIRETTA!" : S.a === S.b ? "Pareggio" : "Sconfitta (da copione?)", `<p class="big">${S.a} – ${S.b}</p><p>Il regista: <b>${"★".repeat(Math.round(S.data.media))}${"☆".repeat(5 - Math.round(S.data.media))}</b> (${S.data.media}) · improvvisate ${S.data.improvvisate} · papere ${S.data.papere}</p>`, "Fine delle riprese ▸", () => { cancelAnimationFrame(S.raf); window.removeEventListener("keydown", kd); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); });
    }
    S.finish = finish; S.follow = follow; S.improv = (k) => (k == null ? improv() : (S.phase === "idea" || improv(), improv(null, k))); S.ciak = ciak; S.next = () => scene(); S.script = script;
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    card(o.title || "Ciak! Si Gioca", `${o.intro || ""}<p>La partita si gira a <b>scene</b>. Per ognuna c'è il <b>copione</b>: puoi seguirlo o <b>improvvisare</b>.</p><p>Poi tocca <b>CIAK!</b> quando il segno è nella zona colorata. Le papere si rifanno finché hai dei ciak. Il regista dà le stelle: valgono la reputazione. Vince chi segna di più.</p>`, "Motore… azione! ▸", () => scene());
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("ckCss")) return; const st = document.createElement("style"); st.id = "ckCss";
    st.textContent = `.ckOv{position:fixed;inset:0;z-index:300;background:#fbeff5;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:manipulation;user-select:none;-webkit-user-select:none;color:#3a2a3a;overflow:auto}
.ckOv .hud{width:min(100%,440px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:3px solid #3a2a3a;border-radius:16px;background:#fff;padding:4px 12px;font:800 12px system-ui}
.ckOv .hud .n0{color:#3a2a3a}.ckOv .hud .n1{text-align:right}.ckOv .hud .sc{font:900 22px 'Arial Rounded MT Bold','Arial Black',sans-serif;color:#ff5a8a}
.ckOv .bar{width:min(100%,440px);display:flex;gap:8px;align-items:center;justify-content:space-between;font:700 12px system-ui}.ckOv .bar i{font-style:normal}.ckOv .bar .st{color:#d8a020}
.ckOv canvas{width:min(100%,440px);height:auto;aspect-ratio:320/170;flex:none;border:3px solid #3a2a3a;border-radius:16px}
.ckOv .scr{width:min(100%,440px);min-height:54px;background:#fff8d8;border:3px solid #3a2a3a;border-radius:12px;padding:6px 10px;font-size:13px;line-height:1.4}.ckOv .scr .lab{display:block;font:900 10px 'Courier New',monospace;letter-spacing:1px;color:#a85a7a}.ckOv .scr small{display:block;opacity:.75;margin-top:2px}
.ckOv .pad{width:min(100%,440px);display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px}
.ckOv .pad button{min-height:50px;border-radius:14px;border:3px solid #3a2a3a;background:#fff;color:#3a2a3a;font:800 13px system-ui;cursor:pointer;padding:5px}.ckOv .pad button small{display:block;font:600 10px system-ui;opacity:.75;margin-top:2px}.ckOv .pad .go{background:#b8e8c0}.ckOv .pad .hot{background:#ffd8a8}.ckOv .pad .big{min-height:70px;font-size:20px;grid-column:1/-1}
.ckOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px;border-radius:10px;border:2px solid #3a2a3a;background:#fff;color:#3a2a3a}
.ckOv .ov{position:absolute;inset:0;background:rgba(251,239,245,.96);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.ckOv .card{max-width:440px;width:100%;border:3px solid #3a2a3a;border-radius:20px;background:#fff;padding:14px;box-shadow:6px 6px 0 #f0a8c8}.ckOv .card h3{margin:0 0 8px;font:900 22px 'Arial Rounded MT Bold','Arial Black',sans-serif;color:#ff5a8a}.ckOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.ckOv .card .big{font:900 34px 'Arial Rounded MT Bold','Arial Black',sans-serif}
.ckOv .card .goB{width:100%;margin-top:10px;background:#b8e8c0;color:#3a2a3a;font:900 15px system-ui;min-height:50px;border:3px solid #3a2a3a;border-radius:14px}`;
    document.head.appendChild(st);
  }
  window.__ciak = { start, IDEE, get state() { return STATE; } };
})();
