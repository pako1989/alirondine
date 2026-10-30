// js/moviola.js - «L'Ombra della Moviola · Tele-Rondine '84» & minigioco Moviola per «Detective di Campo»
// Due tempi, come un'indagine:
//  1) LA MOVIOLA: l'azione sospetta torna come un vecchio filmato (grana, righe, contatempo). Si mette in pausa, si va avanti e
//     indietro di un fotogramma, si trascina la barra. Toccando il campo si apre la LENTE (ingrandisce il punto toccato) e si
//     SEGNALA il dettaglio. Solo il dettaglio giusto, nel fotogramma giusto, diventa un indizio. Gli errori si contano.
//  2) RIGIOCA L'AZIONE CHIAVE: sapendo cosa cercare, si rigioca l'azione sul campo (kit di partita di js/saga-core.js),
//     con la regola truccata in evidenza: i numeri scambiati, il pallone diverso, il guardalinee distratto…
// Uso minigioco: window.__moviola.start({ title, clip, anomalies, onDone({ found:[id], misses }) })
//               window.__moviola.rigioca({ title, twist, heroLook, onDone })
// Uso saga: window.__moviola.open() - saga completa a 4 capitoli basata su js/saga-core.js
(function () {
  "use strict";
  if (window.__moviolaCore) return;

  const W = 320, H = 200;
  const lerp = (a, b, t) => a + (b - a) * t;
  // posizione su un percorso a fotogrammi chiave [[f, x, y, (z)], ...]
  function at(path, f) {
    if (!path || !path.length) return [0, 0, 0];
    if (f <= path[0][0]) return [path[0][1], path[0][2], path[0][3] || 0];
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i], b = path[i + 1];
      if (f >= a[0] && f <= b[0]) {
        const t = (f - a[0]) / Math.max(1, b[0] - a[0]);
        return [lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3] || 0, b[3] || 0, t)];
      }
    }
    const l = path[path.length - 1];
    return [l[1], l[2], l[3] || 0];
  }

  let M = null;
  function css() {
    if (document.getElementById("movCss")) return;
    const st = document.createElement("style");
    st.id = "movCss";
    st.textContent = `#movOv{position:fixed;inset:0;z-index:300;background:#121014;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px;color:#efe6d2;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none}
#movOv .top{width:min(100%,520px);display:flex;justify-content:space-between;align-items:center;background:#2a2622;border:2px solid #b89a5a;border-radius:6px;padding:4px 10px;font:700 13px Georgia,serif}
#movOv canvas{width:min(100%,520px);aspect-ratio:8/5;border:3px solid #3a3228;border-radius:4px;background:#000;touch-action:none}
#movOv .bar{width:min(100%,520px);display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
#movOv .bar button,#movOv .act button{font:800 16px system-ui;border:2px solid #b89a5a;border-radius:8px;padding:10px 4px;background:#3a3228;color:#efe6d2;cursor:pointer}
#movOv input[type=range]{width:min(100%,520px);accent-color:#d8b46a}
#movOv .act{width:min(100%,520px);display:grid;grid-template-columns:1fr 70px;gap:6px}#movOv .act .seg{background:#8a2a2a}#movOv .act .seg.on{background:#c0392b;box-shadow:0 0 0 3px #ffd36b inset}
#movOv .msg{width:min(100%,520px);min-height:40px;background:#211d1a;border:1px solid #5a4a3a;border-radius:6px;padding:6px 10px;font:14px/1.35 Georgia,serif}
#movOv .found{width:min(100%,520px);display:flex;gap:6px;flex-wrap:wrap;font-size:12px}#movOv .found span{background:#2a3a2a;border:1px solid #6a9a5a;border-radius:10px;padding:2px 8px}#movOv .found span.no{background:#2a2622;border-color:#5a4a3a;color:#8a7a6a}
#movOv .ov{position:absolute;inset:0;background:rgba(10,8,8,.9);display:flex;align-items:center;justify-content:center;padding:16px}
#movOv .card{background:#2a2622;border:2px solid #b89a5a;border-radius:8px;padding:14px;max-width:420px}#movOv .card h3{margin:0 0 6px;font:900 20px Georgia,serif;color:#d8b46a}#movOv .card p{margin:4px 0;font-size:14px;line-height:1.4}
#movOv .card button{margin-top:10px;font:800 16px system-ui;border:2px solid #b89a5a;border-radius:8px;padding:10px 14px;background:#8a2a2a;color:#fff;width:100%}`;
    document.head.appendChild(st);
  }

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function tone(f, d, v) { try { const C = window.__sagaCore; if (C) C.util.tone(f, d, "triangle", v || 0.05); } catch (e) {} }

  function start(o) {
    if (M) return false;
    css();
    const clip = o.clip, F = clip.frames || 360;
    M = { o, f: 0, play: false, speed: 1, seg: true, lens: null, found: [], misses: 0, msg: o.intro || "Metti in pausa, scorri i fotogrammi e tocca il dettaglio che non torna.", over: false };
    const el = document.createElement("div"); el.id = "movOv";
    el.innerHTML = `<div class="top"><span>📼 ${esc(o.title || "Moviola")}</span><span class="tc">TC 00:00:00</span></div><canvas width="${W * 2}" height="${H * 2}"></canvas>
<input type="range" min="0" max="${F - 1}" value="0" aria-label="Scorri il filmato"><div class="bar"><button data-b="start" aria-label="Inizio">⏮</button><button data-b="back" aria-label="Fotogramma indietro">◀︎</button><button data-b="play" aria-label="Play o pausa">▶︎</button><button data-b="fwd" aria-label="Fotogramma avanti">▶︎▏</button><button data-b="slow" aria-label="Velocità">×1</button></div>
<div class="act"><button class="seg on" type="button">🔍 Lente: tocca il campo per segnalare</button><button type="button" class="esci">Esci</button></div><div class="found"></div><div class="msg"></div>`;
    document.body.appendChild(el); M.el = el;
    const cv = el.querySelector("canvas"), g = cv.getContext("2d"); g.scale(2, 2); M.g = g; M.cv = cv;
    const rng = el.querySelector("input"), msgEl = el.querySelector(".msg"), tc = el.querySelector(".tc"), foundEl = el.querySelector(".found");
    const say = (t) => { M.msg = t; msgEl.innerHTML = t; };
    const renderFound = () => { foundEl.innerHTML = o.anomalies.map((a) => (M.found.includes(a.id) ? `<span>✓ ${esc(a.label)}</span>` : `<span class="no">• ???</span>`)).join("") + `<span class="no">segnalazioni a vuoto: ${M.misses}</span>`; };
    say(M.msg); renderFound();
    const setF = (f) => { M.f = Math.max(0, Math.min(F - 1, Math.round(f))); rng.value = M.f; };
    el.querySelectorAll(".bar button").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.b;
      if (k === "play") { M.play = !M.play; if (M.f >= F - 1) setF(0); }
      else if (k === "back") { M.play = false; setF(M.f - 1); }
      else if (k === "fwd") { M.play = false; setF(M.f + 1); }
      else if (k === "start") { M.play = false; setF(0); }
      else if (k === "slow") { M.speed = M.speed === 1 ? 0.25 : M.speed === 0.25 ? 0.5 : 1; b.textContent = "×" + (M.speed === 1 ? "1" : M.speed === 0.5 ? "½" : "¼"); }
      el.querySelector('[data-b="play"]').textContent = M.play ? "⏸" : "▶︎";
    }));
    rng.addEventListener("input", () => { M.play = false; M.f = +rng.value; el.querySelector('[data-b="play"]').textContent = "▶︎"; });
    el.querySelector(".esci").onclick = () => finish(true);
    cv.addEventListener("pointerdown", (e) => {
      e.preventDefault(); if (M.over) return;
      const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
      M.lens = { x, y, t: 90 }; M.play = false; el.querySelector('[data-b="play"]').textContent = "▶︎";
      // il dettaglio giusto, nel fotogramma giusto
      const hit = o.anomalies.find((a) => !M.found.includes(a.id) && M.f >= a.frames[0] && M.f <= a.frames[1] && Math.hypot(posOf(a)[0] - x, posOf(a)[1] - y) < (a.r || 16));
      if (hit) { M.found.push(hit.id); tone(880, 0.12); tone(1320, 0.2, 0.04); say(`<b>📌 Trovato: ${esc(hit.label)}.</b> ${esc(hit.text || "")}`); renderFound(); if (M.found.length >= (o.need || o.anomalies.length)) setTimeout(() => done(), 900); return; }
      const near = o.anomalies.find((a) => !M.found.includes(a.id) && Math.hypot(posOf(a)[0] - x, posOf(a)[1] - y) < (a.r || 16) * 1.8);
      M.misses++; tone(160, 0.2, 0.04); renderFound();
      say(near && near.hint ? `🤔 Quasi. ${esc(near.hint)}` : (o.miss ? o.miss[M.misses % o.miss.length] : "Niente di strano, qui. Riguarda con calma."));
    });
    function posOf(a) { if (a.on) { const p = at((clip.actors.find((q) => q.id === a.on) || {}).path, M.f); return [p[0] + (a.dx || 0), p[1] + (a.dy || 0)]; } if (a.ball) { const p = at(clip.ball, M.f); return [p[0], p[1] - p[2]]; } return [a.x, a.y]; }
    M.posOf = posOf;
    function done() {
      M.over = true; M.play = false;
      const ov = document.createElement("div"); ov.className = "ov";
      ov.innerHTML = `<div class="card"><h3>Moviola chiusa</h3><p>${o.anomalies.map((a) => "📌 " + esc(a.label)).join("<br>")}</p><p style="color:#b8a88a">Segnalazioni a vuoto: ${M.misses}${M.misses === 0 ? " · occhio da ispettore!" : ""}</p>${o.outro ? `<p>${o.outro}</p>` : ""}</div>`;
      const bt = document.createElement("button"); bt.type = "button"; bt.textContent = o.nextLabel || "Continua ▸"; bt.onclick = () => finish(false); ov.querySelector(".card").appendChild(bt); el.appendChild(ov);
    }
    function finish(quit) {
      const s = M; if (!s) return; cancelAnimationFrame(s.raf); s.el.remove(); M = null;
      try { o.onDone({ found: s.found.slice(), misses: s.misses, quit: !!quit }); } catch (e) { console.error(e); }
    }
    M.finishNow = () => done(); M.done = done;
    function draw() {
      const f = M.f;
      // il campo visto dalla telecamera alta (orizzontale), colori slavati da vecchio nastro
      g.fillStyle = "#3f6a3a"; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#456f3e" : "#3c6536"; g.fillRect(i * 40, 0, 40, H); }
      g.strokeStyle = "rgba(240,240,220,.7)"; g.lineWidth = 1.2; g.strokeRect(10, 14, 300, 172); g.beginPath(); g.moveTo(160, 14); g.lineTo(160, 186); g.stroke(); g.beginPath(); g.arc(160, 100, 22, 0, 7); g.stroke();
      g.strokeRect(10, 60, 40, 80); g.strokeRect(270, 60, 40, 80); g.fillStyle = "#e8e2d0"; g.fillRect(4, 84, 6, 32); g.fillRect(310, 84, 6, 32);
      // pubblico a bordo campo (tribuna in alto)
      for (let i = 0; i < 40; i++) { g.fillStyle = ["#7a5a4a", "#5a6a8a", "#8a7a5a", "#6a4a5a"][i % 4]; g.fillRect(i * 8, 2 + (i % 2), 6, 8); }
      if (clip.draw) try { clip.draw(g, f, at); } catch (e) {}
      // i giocatori, l'arbitro, i guardalinee
      clip.actors.forEach((a) => {
        const p = at(a.path, f); if (a.when && (f < a.when[0] || f > a.when[1])) return;
        g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(p[0], p[1] + 5, 5, 2, 0, 0, 7); g.fill();
        const shirt = typeof a.shirt === "function" ? a.shirt(f) : a.shirt; g.fillStyle = shirt; g.beginPath(); g.arc(p[0], p[1], 4.5, 0, 7); g.fill(); g.strokeStyle = "#1a1a1a"; g.lineWidth = 1; g.stroke();
        g.fillStyle = a.skin || "#e0b48a"; g.beginPath(); g.arc(p[0], p[1] - 5.5, 2.8, 0, 7); g.fill();
        const num = typeof a.num === "function" ? a.num(f) : a.num; if (num) { g.font = "bold 6px sans-serif"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText(num, p[0], p[1] + 2); g.textAlign = "left"; }
        if (a.extra) try { a.extra(g, p, f); } catch (e) {}
      });
      const b = at(clip.ball, f); g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(b[0], b[1] + 2, 2.6, 1.2, 0, 0, 7); g.fill();
      g.fillStyle = clip.ballCol ? clip.ballCol(f) : "#fff"; g.beginPath(); g.arc(b[0], b[1] - b[2], 2.6 + b[2] / 20, 0, 7); g.fill(); g.strokeStyle = "#222"; g.lineWidth = 0.6; g.stroke();
      // effetto nastro: seppia, grana, righe, sbavature
      g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = "rgba(220,190,140,.35)"; g.fillRect(0, 0, W, H); g.restore();
      for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`; g.fillRect(Math.random() * W, Math.random() * H, 1, 1); }
      g.fillStyle = "rgba(0,0,0,.08)"; for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
      if (M.play) { const ty = (performance.now() / 8) % H; g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(0, ty, W, 6); }
      g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(0, H - 14, 104, 14); g.fillStyle = "#ffd36b"; g.font = "bold 8px monospace"; g.fillText(`${M.play ? "▶ PLAY" : "❚❚ PAUSA"}  F ${String(f).padStart(3, "0")}`, 5, H - 4);
      // i dettagli già trovati restano cerchiati in rosso (nei loro fotogrammi)
      o.anomalies.forEach((a) => { if (!M.found.includes(a.id) || f < a.frames[0] - 20 || f > a.frames[1] + 20) return; const p = posOf(a); g.strokeStyle = "#e84a3a"; g.lineWidth = 1.6; g.beginPath(); g.arc(p[0], p[1], (a.r || 14) * 0.8, 0, 7); g.stroke(); });
      // la lente: ingrandisce il punto toccato
      if (M.lens && M.lens.t > 0) {
        M.lens.t--; const L = M.lens, R = 30, z = 2.2, sx = Math.max(R, Math.min(W - R, L.x)), sy = Math.max(R, Math.min(H - R, L.y)), cvs = M.cv;
        g.save(); g.beginPath(); g.arc(sx, sy, R, 0, 7); g.clip(); g.setTransform(1, 0, 0, 1, 0, 0);
        const k = cvs.width / W; g.drawImage(cvs, (L.x - R / z) * k, (L.y - R / z) * k, (2 * R / z) * k, (2 * R / z) * k, (sx - R) * k, (sy - R) * k, 2 * R * k, 2 * R * k); g.restore();
        g.strokeStyle = "#d8b46a"; g.lineWidth = 3; g.beginPath(); g.arc(sx, sy, R, 0, 7); g.stroke(); g.strokeStyle = "#5a4a2a"; g.lineWidth = 4; g.beginPath(); g.moveTo(sx + R * 0.7, sy + R * 0.7); g.lineTo(sx + R * 1.1, sy + R * 1.1); g.stroke();
      }
      const s = Math.floor(f / 60), ff = f % 60; tc.textContent = `TC 00:${String(s).padStart(2, "0")}:${String(ff).padStart(2, "0")}`;
    }
    function loop() { if (!M) return; if (M.play && !M.over) { M.acc = (M.acc || 0) + M.speed; while (M.acc >= 1) { M.acc--; if (M.f < F - 1) setF(M.f + 1); else { M.play = false; el.querySelector('[data-b="play"]').textContent = "▶︎"; } } } draw(); M.raf = requestAnimationFrame(loop); }
    loop(); return true;
  }

  // ------------------------------------------------------------------ RIGIOCA L'AZIONE CHIAVE (sul kit di partita)
  function rigioca(o) {
    const C = window.__sagaCore; if (!C || !C.pitch) return false;
    const T = o.twist || "", known = !!o.known;
    const hooks = {
      setup(S) { S.data.flags = 0; S.data.marked = 0; },
      tick(S) {
        if (T === "guardalinee" && !known && S.ball.own && S.ball.own.team === 0 && S.ball.own.y < S.GY0 + 120 && Math.random() < 0.006) { S.flash = { txt: "FUORIGIOCO?!", sub: "la bandierina si alza. Di nuovo.", t: 60 }; S.data.flags++; S.kickoff(1); }
        if (T === "numeri" && known) { const bomber = S.opp[1]; if (Math.hypot(bomber.x - S.hero.x, bomber.y - S.hero.y) < 20) S.data.marked++; }
      },
      speed(S, p, v) { return T === "numeri" && known && p === S.opp[1] && Math.hypot(p.x - S.hero.x, p.y - S.hero.y) < 22 ? v * 0.6 : v; },
      ballForce(S, b) { if (T === "pallone" && !known) { b.vx += (Math.random() - 0.5) * 0.12; b.vy += (Math.random() - 0.5) * 0.12; } },
      keeper(S, gk, b) { return T === "pallone" && known && gk.team === 1 ? 0.35 : null; },
      over(g, S) {
        if (T === "numeri") { const b = S.opp[1], p = S.opp[0]; g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText("9", b.x, b.y + 3); g.fillText("7", p.x, p.y + 3); if (known) { g.strokeStyle = "#e84a3a"; g.lineWidth = 1.5; g.setLineDash([3, 2]); g.beginPath(); g.arc(b.x, b.y, 11, 0, 7); g.stroke(); g.setLineDash([]); g.fillStyle = "#e84a3a"; g.fillText("è lui il bomber", b.x, b.y - 14); } g.textAlign = "left"; }
        if (T === "guardalinee") { const y = S.GY0 + 100, x = S.XR + 8, up = S.flash && /FUORIGIOCO/.test(S.flash.txt); g.fillStyle = "#222"; g.fillRect(x - 1, y - 12, 2, 12); g.fillStyle = up ? "#ffd23f" : "#c0392b"; g.fillRect(x, y - 12 - (up ? 6 : 0), 6, 5); g.fillStyle = "#e0b48a"; g.beginPath(); g.arc(x - 4, y - 2, 3, 0, 7); g.fill(); }
      },
      post(g, S, W2, VH) { g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = "rgba(225,205,165,.25)"; g.fillRect(0, 0, W2, VH); g.restore(); },
      hud(g, S) { g.font = "bold 8px sans-serif"; g.fillStyle = "#ffd36b"; g.textAlign = "right"; g.fillText(o.goalTxt || "RICOSTRUZIONE", 236, 11); g.textAlign = "left"; },
      result(S) { return T === "guardalinee" ? `Bandierine sospette: ${S.data.flags}` : T === "numeri" ? (known ? "Bomber marcato" : "Il bomber ti è sfuggito") : T === "pallone" ? (known ? "Pallone giusto" : "Pallone truccato") : ""; },
    };
    return C.pitch({
      title: o.title || "Rigioca l'azione chiave", us: o.us || "Ricostruzione", opp: o.opp || { name: "Avversari", kit: "#4a4a5a", names: ["7", "9"] }, hero: o.heroLook || {}, mate: o.mate,
      half: o.half || 25, extra: false, hard: !known, long: 480, halftime: o.halftime || "Fermo immagine. L'ispettrice prende appunti su un quaderno a quadretti.",
      theme: { accent: "#d8b46a", bg: "#121014", panel: "#2a2622", border: "#b89a5a", ink: "#efe6d2", font: "Georgia, serif", tira: "#8a2a2a", passa: "#3a5a7a" },
      intro: `<p>${o.intro || "Si rigioca l'azione chiave, sapendo cosa cercare."}</p>${known ? `<p><b>Sai cosa cercare:</b> ${o.knownTxt || ""}</p>` : `<p><b>Non hai trovato tutto, in moviola:</b> il trucco ti remerà contro.</p>`}`,
      hooks, onDone: o.onDone, winTitle: "RICOSTRUZIONE RIUSCITA!",
    });
  }

  // ------------------------------------------------------------------ SAGA: «L'Ombra della Moviola · Tele-Rondine '84»
  const SAGA_H = {
    cast(K) {
      const C = (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio);
      C("mov_walter", "Walter \"Zoom\" Bonetti", "Cameraman veterano", { style: "messy", hair: "#78716c", beard: "baffi", shirt: "#d4b996", skin: "#e0b890", bg: ["#78716c", "#fef3c7"] }, "Ex reporter di guerra disilluso che crede solo in quello che registra la sua cinepresa Zeiss.");
      C("mov_daria", "Daria Ferri", "Giornalista d'inchiesta", { style: "ponytail", hair: "#f59e0b", shirt: "#2563eb", skin: "#f3c59a", bg: ["#1e40af", "#dbeafe"] }, "Annunciatrice determinata a diventare giornalista d'inchiesta e smascherare i padroni del calcio locale.");
      C("mov_corrado", "Corrado Maspero", "Direttore di Tele-Rondine", { style: "bald", hair: "#9ca3af", acc: ["occhiali"], shirt: "#93c5fd", skin: "#e8c4a0", bg: ["#881337", "#fce7f3"] }, "Fondatore dell'emittente sommerso dalle cambiali, combatte tra etica e bancarotta.");
      C("mov_carmela", "Carmela De Rosa", "Centralinista storica", { style: "bun", hair: "#9ca3af", acc: ["occhiali", "cuffie"], shirt: "#64748b", skin: "#e0b890", bg: ["#334155", "#cbd5e1"] }, "Conosce tutti i retroscena del borgo ascoltando gli scatti telefonici del centralino.");
      C("mov_silvano", "Silvano \"Saldatore\" Meazza", "Tecnico delle antenne", { style: "buzz", hair: "#1c1917", acc: ["occhiali"], shirt: "#3b82f6", skin: "#d9a679", bg: ["#1e3a8a", "#bfdbfe"] }, "Mago dei ponti radio pirata capace di captare frequenze con una forcina.");
      C("mov_fosco", "Fosco Banti", "Arbitro federale", { style: "slick", hair: "#334155", shirt: "#475569", skin: "#d4a373", bg: ["#1e293b", "#e2e8f0"] }, "Il fischietto del derby, tormentato dal ricatto subito dalla malavita.");
      C("mov_brando", "Gian Maria Brando", "Conduttore di TVA", { style: "slick", hair: "#1e293b", shirt: "#e2e8f0", skin: "#f0d0b0", bg: ["#991b1b", "#fee2e2"] }, "Anchorman narcisista della tv rivale, pagato per gettare fango e coprire gli scandali.");
      C("mov_valeri", "Commendator Aurelio Valeri", "Magnate dei supermercati", { style: "slick", hair: "#e5e7eb", beard: "pizzetto", shirt: "#b45309", skin: "#e8c4a0", bg: ["#78350f", "#fef3c7"] }, "Presidente dello sponsor Splendor, manovratore occulto delle scommesse e dei favori arbitrali.");
    },
    openBanco(opts) {
      if (window.__moviolaArcade && window.__moviolaArcade.openBanco) {
        return window.__moviolaArcade.openBanco(opts);
      }
    }
  };
  window.__moviolaH = SAGA_H;

  const E = window.__sagaCore.create({
    id: "moviola",
    key: "ali-di-rondine.moviola",
    title: "L'Ombra della Moviola · Tele-Rondine '84",
    icon: "📼",
    bg: "mov_titolo",
    chapters: 4,
    menuSub: "Novembre 1984: tra banchi U-matic, telecamere vintage e antenne clandestine, ricostruisci la moviola del derby.",
    theme: {
      accent: "#ca8a04",
      ink: "#fef08a",
      paper: "rgba(15,23,42,.95)",
      font: "'Courier New', monospace, system-ui",
      chipBg: "#1e293b",
      chipBorder: "#ca8a04"
    },
    stats: {
      chiarezza: [0, 100, 20, "Segnale & Risoluzione Video"],
      etica: [-50, 50, 0, "Integrità Giornalistica"],
      ascolti: [0, 100, 15, "Share Televisivo"]
    },
    regions: {
      tele_rondine: {
        grass: "#1e293b",
        path: "#334155",
        stone: "#0f172a",
        wall: "#020617",
        water: "#0284c7",
        tree: "#1e3a8a",
        tint: "202,138,4",
        tintA: 0.12,
        fx: "rain"
      }
    },
    endings: {
      scoop: { name: "Lo Scoop da Cento Milioni", icon: "📺", desc: "Metti in onda il nastro integrale senza filtri, facendo record storico di ascolti." },
      patto: { name: "Patto di Mezzanotte", icon: "🤝", desc: "Accetti il finanziamento del Commendatore per salvare Tele-Rondine." },
      giustizia: { name: "Il Processo del Lunedì", icon: "⚖️", desc: "Consegni il dossier alla magistratura proteggendo la famiglia dell'arbitro." },
      segreto: { name: "Nastro Zero (1964)", icon: "🎞️", desc: "Ricostruisci la bobina madre del 1964: la verità storica scuote la città." }
    },
    clock: {
      slots: ["Pomeriggio Ragazzi", "Telegiornale Locale", "Prima Serata 20:30", "Televendite Notturne"],
      hud: true
    },
    inv: {
      items: {
        mov_nastro: { n: "Cassetta U-matic Master 3/4\"", icon: "📼", d: "Nastro professionale blindato con l'etichetta rossa del derby.", gift: { mov_walter: 3, mov_corrado: 1 } },
        mov_microfono: { n: "Microfono da Bavero a Spilla", icon: "🎙️", d: "Microfono miniaturizzato con cavo telato.", gift: { mov_daria: 3, mov_brando: 1 } },
        mov_cacciavite: { n: "Cacciavite di Taratura Schermato", icon: "🪛", d: "Strumento di precisione in plastica antimagnetica per allineare le testine.", gift: { mov_silvano: 3, mov_walter: 2 } },
        mov_thermos: { n: "Thermos di Camomilla Corretta", icon: "☕", d: "Bevanda calda con un goccio di grappa casereccia del borgo.", gift: { mov_carmela: 3, mov_corrado: 2 } },
        mov_giornale: { n: "Quotidiano «La Voce della Valle»", icon: "📰", d: "Edizione straordinaria col titolo cubitale sullo scandalo.", gift: { mov_corrado: 3, mov_daria: 2 } },
        mov_fischietto: { n: "Fischietto d'Ottone Brunito", icon: "🪙", d: "Vecchio fischietto d'ordinanza con cordino logoro.", gift: { mov_fosco: 3, mov_walter: 1 } }
      }
    },
    guest: {
      id: "mov_walter",
      lines: [
        "«Sorridi capitano! Se entri in diagonale verso la porta con questa luce, la palla va all'incrocio da sola.»",
        "«Fai un salto alla Sala Giochi! Ho restaurato il vecchio cabinato Moviola '84: se batti il mio record ti regalo una lente polarizzata.»"
      ]
    },
    cases: {
      tele_rondine: {
        t: "Inchiesta Tele-Rondine",
        q: "Chi ha rubato la bobina del 94° minuto e falsato il derby?",
        items: {
          nastro_cam2: { t: "Fotogramma Telecamera 2", icon: "📼", kind: "prova", d: "L'arbitro alza il braccio prima del contatto in area." },
          intercettazione: { t: "Traccia Audio Nagra", icon: "🎙️", kind: "prova", d: "Intercettazione del radiomicrofono arbitrale: minacce alla famiglia." },
          ricevuta_bonifico: { t: "Contabile Bonifico Clandestino", icon: "📄", kind: "prova", d: "Assegno circolare dello sponsor Splendor intestato a intermediari." },
          nastro_zero: { t: "Bobina Nastro Zero 1964", icon: "🎞️", kind: "prova", d: "La registrazione madre storica del derby di vent'anni prima." }
        }
      }
    }
  });

  E.api.start = start;
  E.api.rigioca = rigioca;
  Object.defineProperty(E.api, "state", { get() { return M; }, enumerable: true, configurable: true });
  E.api.at = at;

  window.__moviolaCore = E;
  window.__moviola = E.api;
})();
