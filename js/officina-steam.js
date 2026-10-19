// js/officina-steam.js - «STEAM STRIKERS» · calcio a vapore a turni per «L'Officina dei Giganti di Ruggine» (e per il cabinato in Sala Giochi)
// 3 attacchi e 3 difese alternati. In attacco la barra della pressione sale e scende: fermala nella zona verde (62-88) per tirare; sopra 90 la caldaia va in stallo.
// In difesa scegli tra Getto di fumo (disorienta il tiro), Salto propulso (para quasi sempre) o Sfiato (non spende nulla). Le cariche (4) sono comuni a tutto il match.
// Opzioni: title, level (1-3), oppName, mate, onDone({win, a, b}). Test: window.__steam.state.finish(a, b).
(function () {
  "use strict";
  if (window.__steam) return;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let S = null, root = null, timer = null;
  function css() {
    if (document.getElementById("stCss")) return;
    const st = document.createElement("style"); st.id = "stCss";
    st.textContent = `#stOv{position:fixed;inset:0;z-index:300;background:linear-gradient(#2a1a10,#4a2a14);color:#fde8d0;font-family:'Trebuchet MS',Georgia,serif;display:flex;flex-direction:column;gap:6px;padding:8px;overflow:auto}
#stOv h3{margin:0;font-size:15px;color:#fbbf24;display:flex;justify-content:space-between;gap:8px}
#stOv .sc{display:flex;gap:6px;font-size:14px}#stOv .sc b{flex:1;text-align:center;background:#3a2414;border:1px solid #a15a22;border-radius:8px;padding:5px}
#stOv .fd{background:#1a100a;border:2px solid #7c4a1c;border-radius:10px;padding:8px;text-align:center}
#stOv .gauge{position:relative;height:26px;background:#2a1a10;border:2px solid #7c4a1c;border-radius:6px;margin:8px 0;overflow:hidden}
#stOv .gauge .zone{position:absolute;top:0;bottom:0;left:62%;width:26%;background:rgba(74,222,128,.45)}#stOv .gauge .st{position:absolute;top:0;bottom:0;left:90%;right:0;background:rgba(239,68,68,.5)}
#stOv .gauge i{position:absolute;top:0;bottom:0;width:4px;background:#fff;left:0}
#stOv .bt{display:flex;flex-wrap:wrap;gap:6px}#stOv .bt button{flex:1 1 45%;min-height:46px;border-radius:10px;border:2px solid #d97706;background:#7c2d12;color:#fff7ed;font-size:14px;font-weight:700;padding:4px}
#stOv .bt button:disabled{opacity:.4}#stOv .bt button small{display:block;font-size:11px;font-weight:400;color:#fed7aa}
#stOv .lg{font-size:12px;color:#fed7aa;min-height:52px;background:#150b05;border-radius:8px;padding:6px 8px}
#stOv .go{min-height:46px;border-radius:10px;border:2px solid #fbbf24;background:#b45309;color:#fff;font-size:16px;font-weight:700}`;
    document.head.appendChild(st);
  }
  const lv = () => S.o.level || 1, keeper = () => 0.22 + 0.08 * lv(), foePower = () => 40 + Math.floor(Math.random() * 55);
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function draw() {
    if (!root) return;
    const end = S.phase === "end", att = S.turns[S.t] === "A";
    const who = end ? "" : att ? `Attacco · ${esc(S.o.mate || "Brontolo")} contro ${esc(S.o.oppName || "i Giganti")}` : `Difesa · ${esc(S.o.oppName || "i Giganti")} attaccano`;
    let body = "";
    if (S.phase === "bar") body = `<div class="fd"><b>${who}</b><div class="gauge"><span class="zone"></span><span class="st"></span><i id="stNeedle"></i></div>Ferma la barra nella zona verde. Oltre il rosso: stallo.</div><div class="bt"><button id="stStop">🔥 FERMA</button>${S.jets > 0 && !S.jet ? `<button id="stJet">💨 Getto di fumo<small>Il portiere vede peggio · cariche ${S.jets}</small></button>` : ""}</div>`;
    else if (S.phase === "def") body = `<div class="fd"><b>${who}</b><br>Un Gigante ti carica un tiro da potenza ${S.fp}. Come rispondi?</div><div class="bt"><button data-d="jet" ${S.jets <= 0 ? "disabled" : ""}>💨 Getto di fumo<small>Disorienta: poco pericoloso · cariche ${S.jets}</small></button><button data-d="jump" ${S.jets <= 0 ? "disabled" : ""}>🚀 Salto propulso<small>Para quasi sempre · cariche ${S.jets}</small></button><button data-d="vent">♨️ Sfiato<small>Non spende nulla</small></button></div>`;
    root.innerHTML = `<h3><span>${esc(S.o.title || "Steam Strikers")}</span><span>Turno ${Math.min(S.t + 1, S.turns.length)}/${S.turns.length}${S.extra ? " (supplementare)" : ""}</span></h3><div class="sc"><b>Noi ${S.a}</b><b>Loro ${S.b}</b><b>Cariche ${S.jets}</b></div>${body}<div class="lg">${S.log || "Parte il fischio a vapore."}</div>${end ? `<button class="go" id="stGo">Fine ▸</button>` : ""}`;
    const g = root.querySelector("#stGo"); if (g) g.onclick = close;
    const sb = root.querySelector("#stStop"); if (sb) sb.onclick = shoot;
    const jb = root.querySelector("#stJet"); if (jb) jb.onclick = () => { S.jets--; S.jet = true; S.log = "Un getto di fumo avvolge la porta."; draw(); startBar(); };
    root.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => defend(b.dataset.d)));
    if (S.phase === "bar") startBar();
  }
  function startBar() {
    stop(); const nd = root && root.querySelector("#stNeedle"); if (!nd) return; let p = 0, d = 1; const sp = 1.7 + 0.5 * lv();
    S.pos = 0; timer = setInterval(() => { p += d * sp; if (p >= 100) { p = 100; d = -1; } else if (p <= 0) { p = 0; d = 1; } S.pos = p; nd.style.left = p + "%"; }, 30);
  }
  function score(win, line) { if (win) S.a++; S.log = line; next(); }
  function shoot() {
    stop(); const p = S.pos | 0, ks = S.jet ? 0.06 : keeper(); S.jet = false;
    if (p > 90) return score(false, `Pressione ${p}: stallo! La caldaia sbuffa e il tiro muore ai piedi.`);
    const pr = p >= 62 ? 1 - ks : p >= 30 ? 0.35 : 0, ok = Math.random() < pr;
    score(ok, ok ? `Pressione ${p}: GOL! Il pallone esce a vapore e scuote la rete.` : p < 30 ? `Pressione ${p}: tiro debole, il portiere lo ferma con un guanto.` : `Pressione ${p}: parato. Il portiere non ha ceduto.`);
  }
  function defend(k) {
    if (k !== "vent" && S.jets <= 0) return; if (k !== "vent") S.jets--;
    const pr = k === "jump" ? 0.12 : k === "jet" ? 0.2 : S.fp >= 62 ? 0.7 : 0.4, ok = Math.random() < pr;
    if (ok) S.b++; S.log = ok ? `Il tiro (${S.fp}) passa: gol per loro.` : k === "jump" ? "Salto propulso: parata spettacolare." : k === "jet" ? "Il getto di fumo li disorienta: il tiro si spegne." : "Sfiato giusto: il tiro rimbalza sul petto.";
    next();
  }
  function next() {
    S.t++; S.jet = false;
    if (S.t >= S.turns.length) {
      if (S.a === S.b && S.extra < 3) { S.extra++; S.turns.push("A", "D"); S.log += " Pari: turno supplementare!"; }
      else return endMatch();
    }
    S.phase = S.turns[S.t] === "A" ? "bar" : "def"; if (S.phase === "def") S.fp = foePower(); draw();
  }
  function endMatch() { stop(); S.phase = "end"; if (S.a === S.b) S.a++; S.log = (S.log ? S.log + " " : "") + (S.a > S.b ? "Vittoria! La fonderia vibra di vapore." : "Sconfitta. Il vapore si ritira in silenzio."); draw(); }
  function close() { stop(); const o = S.o, r = { win: S.a > S.b, a: S.a, b: S.b, recap: "" }; if (root) root.remove(); root = null; S = null; window.__steam.state = null; o.onDone && o.onDone(r); }
  function start(o) {
    css(); stop(); if (root) root.remove();
    root = document.createElement("div"); root.id = "stOv"; document.body.appendChild(root);
    S = { o, turns: ["A", "D", "A", "D", "A", "D"], t: 0, a: 0, b: 0, jets: 4, jet: false, extra: 0, phase: "bar", log: "", pos: 0, fp: 60 };
    window.__steam.state = { finish: (a, b) => { if (!S) return; S.a = a; S.b = b; endMatch(); }, get a() { return S.a; }, get b() { return S.b; } };
    draw(); return true;
  }
  window.__steam = { start, state: null };
})();
