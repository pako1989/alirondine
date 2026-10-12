// js/atb.js - «ATB» · la partita originale di «Le Cronache del Pallone di Cristallo» (motore proprio, NON il kit di partita)
// Una partita di calcio giocata come una battaglia da JRPG classico:
//  - la schermata di battaglia: il gruppo a destra, gli avversari a sinistra, e in alto il SEGNA-ZONE (sette caselle,
//    dalla vostra porta alla loro) con il pallone;
//  - ognuno ha una barra del TEMPO ATTIVO che si riempie in base alla velocità: quando è piena, il tempo si ferma e scegli
//    il comando (come in «attesa» nei JRPG): AVANZA, PASSA, TIRA, MAGIA, OGGETTO… senza palla: PRESSA, MARCA, SMARCATI;
//  - FIATO (si consuma con le azioni: stanchi si sbaglia di più) e CRISTALLO (le magie: Vento, Luce, Gelo, Cura, Fuoco);
//  - gli avversari agiscono quando si riempie la loro barra. Difficoltà e carattere dal motore delle saghe.
// Uso: window.__atb.start({ title, us, opp:{ name, color, players }, party:[compagni { id, name, st:{tiro,pass,dif,vel}, mp, spells }], heroSt, heroSpells, half, theme, onDone })
(function () {
  "use strict";
  if (window.__atb) return;
  const W = 360, H = 200;
  const SPELLS = {
    vento: { name: "Vento", mp: 6, sub: "Chi ha palla avanza di una zona, sicuro", ball: true },
    luce: { name: "Luce", mp: 8, sub: "Il prossimo tiro è più preciso (+30%)" },
    gelo: { name: "Gelo", mp: 6, sub: "Le barre degli avversari si svuotano a metà" },
    cura: { name: "Cura", mp: 5, sub: "+40 fiato a tutto il gruppo" },
    fuoco: { name: "Fuoco", mp: 10, sub: "Chi ha palla tira subito, potentissimo", ball: true, shot: true },
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let STATE = null;
  function start(o) {
    if (document.querySelector(".atbOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1, gk0: 0, gk1: 0 }, style: "" }, DF = cur.opts || { opp: 1, gk0: 0, gk1: 0 }, style = o.oppStyle || cur.style || "equilibrata";
    const mk = (p, i, team) => Object.assign({ name: "?", skin: "#e0ac7e", hair: "#2b1d14" }, p, { st: Object.assign({ tiro: 12, pass: 12, dif: 12, vel: 12 }, p.st || {}), fiato: 100, mp: p.mp || 20, mpMax: p.mp || 20, atb: Math.random() * 40, team, i, spells: p.spells || [] });
    const hero = Object.assign({ name: "Tu", id: "hero" }, o.heroLook || {});
    const party = [mk(Object.assign({}, hero, { st: o.heroSt || { tiro: 15, pass: 13, dif: 11, vel: 14 }, spells: o.heroSpells || [], mp: o.heroMp || 16 }), 0, 0)].concat((o.party || []).slice(0, 3).map((p, i) => mk(p, i + 1, 0)));
    const oppK = (o.opp && o.opp.players) || [{ name: "Avversario" }];
    const opp = oppK.slice(0, 4).map((p, i) => mk(Object.assign({ st: { tiro: 12, pass: 12, dif: 12, vel: 11 } }, p), i, 1));
    const usCol = (o.heroLook && o.heroLook.shirt) || "#2a6ac8", oppCol = (o.opp && o.opp.color) || "#8a2a2a";
    const S = { o, a: 0, b: 0, half: 0, clock: (o.half || 70), zone: 0, ball: { team: 0, h: 0 }, party, opp, menu: null, queue: [], fx: [], t: 0, luce: 0, mark: 0, items: o.items == null ? 3 : o.items, over: false, phase: "intro", swirl: 60, data: { magie: 0, avanzate: 0, passaggi: 0, tiri: 0, rubate: 0 } };
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "atbOv";
    el.innerHTML = `<div class="top"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="row"><div class="win cmd"><div class="who">—</div><div class="list"></div></div><div class="win pty"></div></div><button type="button" class="quit">Esci dalla partita</button>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Il gruppo"; el.querySelector(".n1").textContent = (o.opp && o.opp.name) || "Avversari";
    const cv = el.querySelector("canvas"), g = cv.getContext("2d"); g.scale(2, 2);
    const A = window.__borgoApi, face = (id) => { try { return id && A && A.portraitImg ? A.portraitImg(id) : null; } catch (e) { return null; } };
    const hud = () => { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; };
    function tone(f, d, type, v) { try { const AC = (window.__atbAC = window.__atbAC || new (window.AudioContext || window.webkitAudioContext)()), os = AC.createOscillator(), gn = AC.createGain(); os.type = type || "square"; os.frequency.value = f; gn.gain.value = v || 0.035; gn.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + d); os.connect(gn); gn.connect(AC.destination); os.start(); os.stop(AC.currentTime + d); } catch (e) {} }
    const pop = (txt, x, y, col) => S.fx.push({ txt, x, y, t: 60, col: col || "#fff" });
    const posOf = (m) => (m.team === 0 ? [258 + (m.i % 2) * 34, 78 + m.i * 26] : [102 - (m.i % 2) * 34, 78 + m.i * 26]);
    const holder = () => (S.ball.team === 0 ? party : opp)[S.ball.h];
    const tired = (m) => (m.fiato < 30 ? -0.15 : 0);
    // ------------------------------------------------------------ pannello del gruppo
    function drawParty() {
      el.querySelector(".pty").innerHTML = party.map((m) => `<div class="pm${S.menu && S.menu.m === m ? " act" : ""}">${face(m.id) ? `<img alt="" src="${face(m.id)}">` : "<i></i>"}<div><b>${esc(m.name)}</b>${S.ball.team === 0 && S.ball.h === m.i ? " ⚽" : ""}<span class="bar f"><i style="width:${m.fiato}%"></i></span><span class="bar c"><i style="width:${(m.mp / m.mpMax) * 100}%"></i></span><span class="bar t${m.atb >= 100 ? " full" : ""}"><i style="width:${Math.min(100, m.atb)}%"></i></span></div></div>`).join("");
    }
    // ------------------------------------------------------------ comandi
    function openMenu(m) {
      S.menu = { m }; tone(880, 0.06, "square"); const our = S.ball.team === 0, has = our && S.ball.h === m.i, list = [];
      if (has) { list.push(["AVANZA", "Porta palla verso la loro porta", () => advance(m)]); list.push(["PASSA", "A un compagno", () => passMenu(m)]); list.push(["TIRA", S.zone >= 1 ? `Probabilità: ${Math.round(shotP(m) * 100)}%` : "Troppo lontano dalla porta", () => shoot(m), S.zone < 1]); }
      else if (our) list.push(["SMARCATI", `Dai tempo a ${holder().name} e chiedi palla: il passaggio a te diventa sicuro`, () => free(m)]);
      else { list.push(["PRESSA", `Ruba palla a ${holder().name}: ${Math.round(stealP(m) * 100)}%`, () => press(m)]); list.push(["MARCA", "Il loro prossimo passo in avanti sarà più difficile", () => markC(m)]); }
      if (m.spells.length) list.push(["MAGIA", `Cristallo ${m.mp}/${m.mpMax}`, () => spellMenu(m)]);
      if (S.items > 0) list.push(["OGGETTO", `Borraccia ×${S.items}`, () => item(m)]);
      list.push(["ASPETTA", "Passa il turno, recupera un po' di fiato", () => { m.fiato = Math.min(100, m.fiato + 15); endTurn(m); }]);
      showList(m, list);
    }
    function showList(m, list, back) {
      el.querySelector(".who").textContent = `▶ ${m.name}`;
      const L = el.querySelector(".list"); L.innerHTML = list.map(([t, sub, , dis], i) => `<button type="button" data-i="${i}"${dis ? " disabled" : ""}><b>${esc(t)}</b><small>${esc(sub || "")}</small></button>`).join("") + (back ? `<button type="button" data-back><b>◂ INDIETRO</b></button>` : "");
      L.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => { const x = list[+b.dataset.i]; if (!x[3]) x[2](); }));
      const bk = L.querySelector("[data-back]"); if (bk) bk.onclick = back;
      drawParty();
    }
    function passMenu(m) { showList(m, party.filter((q) => q !== m).map((q) => [q.name.toUpperCase(), `Riuscita: ${Math.round(passP(m, q) * 100)}%`, () => pass(m, q)]), () => openMenu(m)); }
    function spellMenu(m) { showList(m, m.spells.filter((k) => SPELLS[k]).map((k) => { const sp = SPELLS[k], dis = m.mp < sp.mp || (sp.ball && !(S.ball.team === 0 && S.ball.h === m.i)); return [`${sp.name.toUpperCase()} · ${sp.mp}`, sp.sub, () => cast(m, k), dis]; }), () => openMenu(m)); }
    function closeMenu() { S.menu = null; el.querySelector(".who").textContent = "—"; el.querySelector(".list").innerHTML = `<p class="wait">Le barre si stanno riempiendo…</p>`; drawParty(); }
    function endTurn(m) { m.atb = 0; S.queue = S.queue.filter((x) => x !== m); closeMenu(); hud(); }
    // ------------------------------------------------------------ probabilità
    const advP = (m) => Math.max(0.15, Math.min(0.92, 0.66 + (m.st.vel + m.st.pass - 24) * 0.012 - S.zone * 0.035 - (S.mark && S.ball.team === 1 ? 0.25 : 0) + tired(m) - (DF.opp - 1) * 0.5 - (style === "difensiva" ? 0.08 : 0)));
    const passP = (m, q) => Math.max(0.3, Math.min(0.99, 0.84 + (m.st.pass - 12) * 0.012 + (q.free ? 0.3 : 0) + tired(m) - (style === "pressing" ? 0.08 : 0)));
    const shotP = (m) => Math.max(0.05, Math.min(0.9, 0.12 + S.zone * 0.13 + (m.st.tiro - 12) * 0.015 + (S.luce ? 0.3 : 0) + tired(m) - DF.gk1 * 1.2));
    const stealP = (m) => { const h = holder(); return Math.max(0.12, Math.min(0.85, 0.36 + (m.st.dif - h.st.pass) * 0.02 + tired(m) - (DF.opp - 1) * 0.6)); };
    // ------------------------------------------------------------ azioni del gruppo
    function lose(m, txt) { const t = opp[Math.floor(Math.random() * opp.length)]; S.ball = { team: 1, h: t.i }; pop(txt, ...posOf(m), "#ff8a8a"); tone(160, 0.15, "sawtooth"); }
    function advance(m) { S.data.avanzate++; m.fiato = Math.max(0, m.fiato - 10); if (Math.random() < advP(m)) { S.zone = Math.min(3, S.zone + 1); pop("+1 ZONA", ...posOf(m), "#7af0c8"); tone(660, 0.08); } else lose(m, "RUBATA!"); S.mark = 0; endTurn(m); }
    function pass(m, q) { S.data.passaggi++; m.fiato = Math.max(0, m.fiato - 5); if (Math.random() < passP(m, q)) { S.ball.h = q.i; q.free = 0; pop("PASSAGGIO", ...posOf(q), "#9ad8ff"); tone(740, 0.06); q.atb = Math.min(100, q.atb + 25); } else lose(m, "INTERCETTATO!"); endTurn(m); }
    function shoot(m, bonus) { S.data.tiri++; m.fiato = Math.max(0, m.fiato - 12); const p = Math.min(0.95, shotP(m) + (bonus || 0)); S.luce = 0; if (Math.random() < p) goal(0, m); else { pop("PARATA", 50, 60, "#ffd23f"); tone(220, 0.2, "sawtooth"); S.ball = { team: 1, h: 0 }; } endTurn(m); }
    function free(m) { m.free = 1; const h = holder(); h.atb = Math.min(100, h.atb + 40); pop("SMARCATO", ...posOf(m), "#9ad8ff"); endTurn(m); } // chi si smarca dà tempo a chi ha palla, e il passaggio verso di lui è sicuro
    function press(m) { m.fiato = Math.max(0, m.fiato - 8); if (Math.random() < stealP(m)) { S.data.rubate++; S.ball = { team: 0, h: m.i }; pop("PALLA RUBATA!", ...posOf(m), "#7af0c8"); tone(880, 0.1); } else pop("MANCATO", ...posOf(m), "#ff8a8a"); endTurn(m); }
    function markC(m) { S.mark = 1; m.fiato = Math.max(0, m.fiato - 4); pop("MARCATURA", ...posOf(m), "#9ad8ff"); endTurn(m); }
    function item(m) { S.items--; m.fiato = Math.min(100, m.fiato + 60); pop("+60 FIATO", ...posOf(m), "#7af0c8"); tone(990, 0.1, "triangle"); endTurn(m); }
    function cast(m, k) {
      const sp = SPELLS[k]; m.mp -= sp.mp; S.data.magie++; S.spellFx = { k, t: 50 }; tone(440, 0.4, "triangle", 0.05); setTimeout(() => tone(880, 0.3, "triangle", 0.04), 120);
      pop(sp.name.toUpperCase() + "!", ...posOf(m), "#e8b8ff");
      if (k === "vento") { S.zone = Math.min(3, S.zone + 1); pop("+1 ZONA", 180, 30, "#7af0c8"); }
      if (k === "luce") S.luce = 1;
      if (k === "gelo") opp.forEach((q) => (q.atb *= 0.5));
      if (k === "cura") party.forEach((q) => (q.fiato = Math.min(100, q.fiato + 40)));
      if (k === "fuoco") return shoot(m, 0.25);
      endTurn(m);
    }
    function goal(team, m) {
      if (team === 0) { S.a++; pop("GOL!", 180, 90, "#ffd23f"); [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.15, "square", 0.05), i * 100)); S.ball = { team: 1, h: 0 }; }
      else { S.b++; pop("GOL LORO", 180, 90, "#ff8a8a"); tone(130, 0.4, "sawtooth"); S.ball = { team: 0, h: 0 }; }
      S.zone = 0; S.flash = { txt: team === 0 ? "GOL!" : "GOL LORO", t: 70 }; hud(); void m;
    }
    // ------------------------------------------------------------ gli avversari
    function oppAct(q) {
      q.atb = 0;
      if (S.ball.team === 1 && S.ball.h === q.i) {
        if (S.zone <= -2 || (S.zone <= -1 && Math.random() < 0.35)) { const p = Math.max(0.05, Math.min(0.85, 0.14 + -S.zone * 0.13 + (q.st.tiro - 12) * 0.015 + (DF.opp - 1) * 0.5 - DF.gk0 * 1.2)); if (Math.random() < p) goal(1); else { pop("PARATA!", 300, 60, "#7af0c8"); S.ball = { team: 0, h: 0 }; tone(300, 0.15, "triangle"); } }
        else if (Math.random() < (style === "difensiva" ? 0.5 : 0.75)) { const p = Math.max(0.2, Math.min(0.9, 0.6 + (DF.opp - 1) * 0.6 + (style === "contropiede" ? 0.1 : 0) - (S.mark ? 0.25 : 0))); S.mark = 0; if (Math.random() < p) { S.zone = Math.max(-3, S.zone - 1); pop("AVANZANO", ...posOf(q), "#ffb0b0"); } else { const m = party[Math.floor(Math.random() * party.length)]; S.ball = { team: 0, h: m.i }; pop("RECUPERATA!", ...posOf(m), "#7af0c8"); } }
        else { const t = opp[(q.i + 1) % opp.length]; S.ball.h = t.i; pop("PASSANO", ...posOf(t), "#ffb0b0"); }
      } else if (S.ball.team === 0) {
        const h = holder(), p = Math.max(0.08, Math.min(0.6, (0.22 + (q.st.dif - h.st.pass) * 0.015) * DF.opp * (style === "pressing" ? 1.3 : 1)));
        if (Math.random() < p) { S.ball = { team: 1, h: q.i }; pop("RUBATA!", ...posOf(h), "#ff8a8a"); tone(160, 0.12, "sawtooth"); } else pop("…", ...posOf(q), "#ccc");
      }
      hud();
    }
    // ------------------------------------------------------------ ciclo
    let last = performance.now();
    function tick() {
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; S.t++;
      if (S.swirl > 0) { S.swirl--; return; }
      if (S.phase !== "play" || S.menu || S.over) return;
      S.clock -= dt;
      party.forEach((m) => { m.fiato = Math.min(100, m.fiato + dt * 1.5); if (m.atb < 100) m.atb = Math.min(100, m.atb + dt * (8 + m.st.vel * 0.9) * (m.fiato < 30 ? 0.8 : 1) * (S.ball.team === 0 && S.ball.h === m.i ? 1.3 : 1)); else if (!S.queue.includes(m)) S.queue.push(m); });
      opp.forEach((q) => { q.atb += dt * (8 + q.st.vel * 0.9) * DF.opp; if (q.atb >= 100) oppAct(q); });
      if (S.queue.length && !S.menu) openMenu(S.queue[0]);
      if (S.clock <= 0) endHalf();
      if (S.t % 6 === 0) drawParty();
    }
    function endHalf() {
      S.phase = "card";
      if (S.half === 0) { S.half = 1; return card(`Fine del primo tempo · ${S.a} – ${S.b}`, `<p>${esc(o.halftime || "Il gruppo si riposa. Le barre ripartono da zero.")}</p>`, "SECONDO TEMPO ▸", () => { S.clock = o.half || 70; S.zone = 0; S.ball = { team: 1, h: 0 }; party.forEach((m) => { m.fiato = Math.min(100, m.fiato + 30); m.atb = Math.random() * 30; }); S.phase = "play"; last = performance.now(); }); }
      if (S.a === S.b && o.extra !== false && !S.extra) { S.extra = 1; return card("Supplementari", "<p>Golden goal: chi segna vince.</p>", "AVANTI ▸", () => { S.clock = 40; S.zone = 0; S.phase = "play"; last = performance.now(); }); }
      finish();
    }
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="win big"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".win").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over"; S.menu = null;
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: S.data };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA!" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="res">${S.a} – ${S.b}</p><p>Avanzate ${S.data.avanzate} · Passaggi ${S.data.passaggi} · Tiri ${S.data.tiri} · Palle rubate ${S.data.rubate} · Magie ${S.data.magie}</p>`, "CONTINUA ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); try { (o.onDone || (() => {}))(res); } catch (e) { console.error(e); } });
    }
    // ------------------------------------------------------------ disegno: la schermata di battaglia
    function sprite(m, x, y, act) {
      const col = m.team === 0 ? usCol : oppCol, b = act ? Math.sin(S.t / 5) * 1.5 : 0; g.save(); g.translate(x, y + b);
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(0, 14, 9, 3, 0, 0, 7); g.fill();
      g.fillStyle = "#2a2a3a"; g.fillRect(-4, 6, 3, 8); g.fillRect(1, 6, 3, 8);
      g.fillStyle = col; g.fillRect(-6, -4, 12, 11); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(-6, -4, 3, 11);
      g.fillStyle = m.skin; g.fillRect(-5, -13, 10, 9); g.fillStyle = m.hair; g.fillRect(-5, -15, 10, 4); g.fillRect(m.team === 0 ? 3 : -5, -13, 2, 4);
      g.fillStyle = "#111"; g.fillRect(m.team === 0 ? -3 : 1, -10, 2, 2);
      if (m.fiato < 30) { g.fillStyle = "#9ad8ff"; g.fillRect(m.team === 0 ? -9 : 7, -12, 2, 3); }
      g.restore();
      if (act) { g.fillStyle = "#fff"; g.beginPath(); g.moveTo(x - 4, y - 26); g.lineTo(x + 4, y - 26); g.lineTo(x, y - 20); g.closePath(); g.fill(); }
      g.font = "bold 6px monospace"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText(String(m.name).split(" ")[0].slice(0, 9), x, y + 23); g.textAlign = "left";
    }
    function draw() {
      g.setTransform(2, 0, 0, 2, 0, 0);
      const th = o.theme || "prato", sky = { prato: ["#5a9ad8", "#b8e0f0"], mare: ["#2a6ab8", "#8ac8e8"], stelle: ["#0a0a2a", "#3a2a6a"], fuoco: ["#3a1a2a", "#c85a3a"] }[th] || ["#5a9ad8", "#b8e0f0"], fl = { prato: ["#4a9a3a", "#2a6a2a"], mare: ["#3a8a8a", "#1a5a6a"], stelle: ["#2a2a5a", "#10102a"], fuoco: ["#6a3a2a", "#3a1a10"] }[th] || ["#4a9a3a", "#2a6a2a"];
      let gr = g.createLinearGradient(0, 0, 0, 70); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); g.fillStyle = gr; g.fillRect(0, 0, W, 70);
      if (th === "stelle") for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${0.4 + (i % 3) * 0.2})`; g.fillRect((i * 47) % W, (i * 13) % 60, 1, 1); }
      gr = g.createLinearGradient(0, 60, 0, H); gr.addColorStop(0, fl[0]); gr.addColorStop(1, fl[1]); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 62); g.lineTo(W, 62); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 1; for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(W / 2 + i * 18, 62); g.lineTo(W / 2 + i * 60, H); g.stroke(); } for (let k = 0; k < 5; k++) { const y = 62 + k * k * 6 + k * 6; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      // il segna-zone in alto: le sette caselle, dalla vostra porta (destra) alla loro (sinistra)
      for (let z = -3; z <= 3; z++) { const x = W / 2 - z * 22 - 9, on = z === S.zone; g.fillStyle = on ? "#ffd23f" : z > 0 ? "rgba(140,40,40,.6)" : z < 0 ? "rgba(40,80,160,.6)" : "rgba(255,255,255,.3)"; g.fillRect(x, 6, 18, 10); g.strokeStyle = "#fff"; g.strokeRect(x + 0.5, 6.5, 17, 9); }
      g.fillStyle = "#fff"; g.font = "bold 6px monospace"; g.fillText("LA LORO PORTA", 14, 14); g.textAlign = "right"; g.fillText("LA VOSTRA", W - 14, 14); g.textAlign = "left";
      g.fillStyle = "#fff"; g.font = "bold 8px monospace"; g.fillText(`${S.half ? "2°" : "1°"} TEMPO ${Math.max(0, Math.ceil(S.clock))}s${S.luce ? " · LUCE" : ""}${S.mark ? " · MARCATURA" : ""}`, 10, 28);
      const act = S.menu && S.menu.m;
      opp.forEach((q) => sprite(q, ...posOf(q), false)); party.forEach((m) => sprite(m, ...posOf(m), m === act));
      const hh = holder(), [bx, by] = posOf(hh); g.fillStyle = "#fff"; g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.arc(bx + (hh.team === 0 ? -12 : 12), by + 10 + Math.abs(Math.sin(S.t / 8)) * -3, 4, 0, 7); g.fill(); g.stroke();
      if (S.spellFx && S.spellFx.t > 0) { const sf = S.spellFx, col = { vento: "122,240,200", luce: "255,240,160", gelo: "160,220,255", cura: "160,255,160", fuoco: "255,140,60" }[sf.k] || "255,255,255"; sf.t--; for (let i = 0; i < 18; i++) { const a = i / 18 * 6.28 + sf.t / 10, r = (50 - sf.t) * 2; g.fillStyle = `rgba(${col},${sf.t / 50})`; g.fillRect(W / 2 + Math.cos(a) * r, 110 + Math.sin(a) * r * 0.5, 3, 3); } }
      S.fx = S.fx.filter((f) => f.t-- > 0); S.fx.forEach((f) => { g.font = "bold 9px monospace"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "#000"; g.strokeText(f.txt, f.x, f.y - 26 - (60 - f.t) * 0.3); g.fillStyle = f.col; g.fillText(f.txt, f.x, f.y - 26 - (60 - f.t) * 0.3); g.textAlign = "left"; });
      if (S.flash && S.flash.t > 0) { S.flash.t--; g.fillStyle = "rgba(0,0,40,.6)"; g.fillRect(0, 80, W, 40); g.fillStyle = "#ffd23f"; g.font = "bold 26px monospace"; g.textAlign = "center"; g.fillText(S.flash.txt, W / 2, 110); g.textAlign = "left"; }
      if (S.swirl > 0) { const k = S.swirl / 60; g.save(); g.translate(W / 2, H / 2); for (let i = 0; i < 24; i++) { g.rotate(0.26 + k); g.fillStyle = i % 2 ? "#000" : "#1a2a8a"; g.fillRect(0, 0, 400 * k, 18); } g.restore(); }
    }
    function loop() { if (!el.isConnected) return; tick(); draw(); S.raf = requestAnimationFrame(loop); }
    S.finish = finish; S.openMenu = openMenu; S.cmd = (name) => { const b = [...el.querySelectorAll(".list button")].find((x) => x.textContent.startsWith(name)); if (b && !b.disabled) { b.click(); return true; } return false; };
    el.querySelector(".quit").onclick = () => finish(true);
    closeMenu(); hud();
    const sp = [...new Set(party.flatMap((m) => m.spells))].filter((k) => SPELLS[k]);
    card(o.title || "ATB", `${o.intro || ""}<p>Ognuno ha una <b>barra del tempo</b>: quando è piena il tempo si ferma e scegli il comando. Con la palla: <b>AVANZA</b> (verso la loro porta, sul segna-zone in alto), <b>PASSA</b>, <b>TIRA</b> (più sei vicino, meglio è). Senza: <b>PRESSA</b> per rubarla, <b>MARCA</b>, <b>SMARCATI</b>. Il <b>fiato</b> cala con le azioni: stanchi si sbaglia.</p>${sp.length ? `<p>Magie: ${sp.map((k) => `<b>${SPELLS[k].name}</b> (${SPELLS[k].sub})`).join(" · ")}.</p>` : ""}<p style="opacity:.75;font-size:12px">Avversari: ${esc(style)}</p>`, "INIZIA ▸", () => { S.phase = "play"; last = performance.now(); });
    loop();
    return true;
  }
  function css() {
    if (document.getElementById("atbCss")) return; const st = document.createElement("style"); st.id = "atbCss";
    st.textContent = `.atbOv{position:fixed;inset:0;z-index:300;background:#05061a;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 10px;font-family:"Courier New",monospace;color:#fff;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.atbOv .top{width:min(100%,560px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;font-weight:900;font-size:13px}.atbOv .top .n1{text-align:right}.atbOv .top .sc{font-size:22px;color:#ffd23f}
.atbOv canvas{width:min(100%,560px);height:auto;aspect-ratio:9/5;flex:none;border:2px solid #fff;border-radius:6px;image-rendering:pixelated}
.atbOv .row{width:min(100%,560px);display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:1;min-height:0}
.atbOv .win{background:linear-gradient(#2a3aa8,#0a1060);border:2px solid #e8e8ff;border-radius:6px;box-shadow:inset 0 0 0 2px #0a1060;padding:6px;overflow:auto}
.atbOv .who{font-weight:900;color:#ffd23f;margin-bottom:4px;font-size:13px}.atbOv .wait{opacity:.7;font-size:12px;margin:4px}
.atbOv .list button{display:block;width:100%;text-align:left;background:none;border:0;color:#fff;font:inherit;padding:5px 4px 5px 16px;cursor:pointer;position:relative;border-radius:4px}
.atbOv .list button:hover,.atbOv .list button:focus{background:rgba(255,255,255,.12)}.atbOv .list button::before{content:"▶";position:absolute;left:2px;opacity:0;font-size:10px;top:7px}.atbOv .list button:hover::before{opacity:1}
.atbOv .list button b{font-size:14px;display:block}.atbOv .list button small{display:block;font-size:10.5px;opacity:.8}.atbOv .list button:disabled{opacity:.35}
.atbOv .pm{display:grid;grid-template-columns:28px 1fr;gap:5px;align-items:center;margin-bottom:5px;font-size:11px}.atbOv .pm img,.atbOv .pm>i{width:28px;height:28px;border-radius:4px;background:#0a1060;display:block}.atbOv .pm.act b{color:#ffd23f}
.atbOv .bar{display:block;height:4px;background:rgba(0,0,0,.5);margin-top:2px;border-radius:2px;overflow:hidden}.atbOv .bar i{display:block;height:100%}.atbOv .bar.f i{background:#7af0c8}.atbOv .bar.c i{background:#c88aff}.atbOv .bar.t i{background:#e8e8ff}.atbOv .bar.t.full i{background:#ffd23f}
.atbOv .quit{width:min(100%,560px);background:#0a1060;color:#fff;border:2px solid #e8e8ff;border-radius:6px;font:inherit;font-size:12px;padding:8px;cursor:pointer;opacity:.85}
.atbOv .ov{position:absolute;inset:0;background:rgba(0,0,20,.8);display:flex;align-items:center;justify-content:center;padding:16px}
.atbOv .win.big{max-width:440px;width:100%;padding:14px}.atbOv .win.big h3{margin:0 0 6px;color:#ffd23f;font-size:20px}.atbOv .win.big p{margin:6px 0;font-size:13px;line-height:1.4}.atbOv .win.big .res{font-size:30px;font-weight:900}
.atbOv .win.big button{width:100%;margin-top:10px;padding:10px;background:#ffd23f;color:#0a1060;border:2px solid #fff;border-radius:6px;font:inherit;font-weight:900;font-size:15px;cursor:pointer}`;
    document.head.appendChild(st);
  }
  window.__atb = { start, SPELLS, get state() { return STATE; } };
})();
