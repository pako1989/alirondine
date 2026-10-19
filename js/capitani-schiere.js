// js/capitani-schiere.js - «SCHIERE» · motore di scontro a turni per «Capitani di Ventura»
// Non è calcio: è la battaglia della compagnia. A ogni turno il nemico annuncia 1 o 2 ASSALTI (corsia + forza).
// Ogni compagno schierato va a DIFENDERE un assalto (forza + metà cuore) oppure ad ATTACCARE (tiro + metà ingegno).
// Assalto non coperto = breccia (punto al nemico). Attacco che supera la difesa nemica = punto per noi (+4 = due punti).
// Opzioni: members [{id,n,icon,role,s}], enemy {name, icon, atk:[base,grow], def:[base,grow], lanes:[..]}, rounds, onDone({a,b,win}).
// Test: window.__schiere.state.finish(a, b).
(function () {
  "use strict";
  if (window.__schiere) return;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LANES = ["Sinistra", "Centro", "Destra"];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  let S = null, root = null;
  function css() {
    if (document.getElementById("scCss")) return;
    const st = document.createElement("style"); st.id = "scCss";
    st.textContent = `#scOv{position:fixed;inset:0;z-index:300;background:#1b1410;color:#f6ecd2;font-family:'Trebuchet MS',Georgia,serif;display:flex;flex-direction:column;gap:6px;padding:8px;overflow:auto;box-sizing:border-box}
#scOv h3{margin:0;font-size:15px;color:#fbbf24;display:flex;justify-content:space-between;gap:8px}
#scOv .sc{display:flex;gap:6px;font-size:13px}#scOv .sc b{flex:1;text-align:center;background:#2a1f16;border:1px solid #6b4a2a;border-radius:8px;padding:4px}
#scOv .as{background:#3a1f1a;border:1px solid #b45309;border-radius:8px;padding:6px;font-size:13px}#scOv .as.ok{background:#1f3a22;border-color:#4d9a5a}#scOv .as.no{background:#4a1a1a;border-color:#ef4444}
#scOv .mb{background:#2a1f16;border:1px solid #6b4a2a;border-radius:8px;padding:5px 6px;display:flex;align-items:center;gap:6px;font-size:13px}
#scOv .mb .nm{flex:1;min-width:0}#scOv .mb small{display:block;color:#c9b58a;font-size:11px}
#scOv .mb button{min-width:36px;min-height:36px;border-radius:8px;border:1px solid #92400e;background:#3a2a1a;color:#fde68a;font-size:14px;font-weight:700}
#scOv .mb button.on{background:#fbbf24;color:#201a12}
#scOv .lg{font-size:12px;color:#d9c79a;min-height:34px;background:#150f0b;border-radius:8px;padding:5px 7px}
#scOv .go{min-height:46px;border-radius:10px;border:2px solid #fbbf24;background:#92400e;color:#fff7d6;font-size:16px;font-weight:700}
#scOv .go:disabled{opacity:.5}`;
    document.head.appendChild(st);
  }
  function mine(m) { const s = m.s || {}; return { atk: (s.tiro | 0) + Math.ceil((s.ingegno | 0) / 2), def: (s.forza | 0) + Math.ceil((s.cuore | 0) / 2) }; }
  function newRound() {
    const e = S.enemy, r = S.round, n = r >= 2 && Math.random() < 0.55 ? 2 : 1, lanes = (e.lanes || [0, 1, 2]).slice().sort(() => Math.random() - 0.5);
    S.assaults = Array.from({ length: n }, (_, i) => ({ lane: lanes[i], force: Math.max(2, rnd(e.atk[0], e.atk[0] + 2) + Math.floor(e.atk[1] * r) - (n > 1 ? 1 : 0)) }));
    S.eDef = rnd(e.def[0], e.def[0] + 2) + Math.floor(e.def[1] * r);
    S.asg = {}; S.members.forEach((m) => { S.asg[m.id] = "A"; });
  }
  function totals() {
    const t = { A: 0, 0: 0, 1: 0 };
    S.members.forEach((m) => { const v = mine(m), k = S.asg[m.id]; if (k === "A") t.A += v.atk; else t[k] += v.def; });
    return t;
  }
  function draw() {
    if (!root) return;
    const t = totals(), done = S.phase === "end";
    const as = S.assaults.map((a, i) => { const cls = S.res ? (S.res.def[i] ? "ok" : "no") : ""; return `<div class="as ${cls}">🛡️ Assalto ${i + 1} · <b>${LANES[a.lane]}</b> · forza ${a.force} · difesa <b>${t[i]}</b>${t[i] < a.force && !S.res ? " ⚠️" : ""}</div>`; }).join("");
    const rows = S.members.map((m) => {
      const v = mine(m), k = S.asg[m.id], b = (key, lab) => `<button data-m="${m.id}" data-k="${key}" class="${k === key ? "on" : ""}">${lab}</button>`;
      return `<div class="mb"><span style="font-size:20px">${esc(m.icon)}</span><span class="nm"><b>${esc(m.n)}</b><small>⚔️ ${v.atk} · 🛡️ ${v.def}</small></span>${b("A", "⚔️")}${S.assaults.map((_, i) => b(String(i), String(i + 1))).join("")}</div>`;
    }).join("");
    root.innerHTML = `<h3><span>${esc(S.enemy.icon || "🐺")} ${esc(S.enemy.name)}</span><span>Turno ${Math.min(S.round + 1, S.rounds)}/${S.rounds}${S.extra ? " (supplementare)" : ""}</span></h3>
<div class="sc"><b>Noi ${S.a}</b><b>Loro ${S.b}</b></div>${as}<div class="as">⚔️ Attacco <b>${t.A}</b> contro difesa nemica <b>${S.res ? S.eDef : "?"}</b></div>${rows}
<div class="lg">${S.log || "Assegna ogni compagno: ⚔️ attacca, oppure 1/2 difende l'assalto indicato."}</div>
<button class="go" id="scGo">${done ? "Fine ▸" : "Avanti ▸"}</button>`;
    root.querySelectorAll("button[data-m]").forEach((b) => { b.onclick = () => { if (S.res || done) return; S.asg[b.dataset.m] = b.dataset.k; draw(); }; });
    root.querySelector("#scGo").onclick = go;
  }
  function go() {
    if (S.phase === "end") return close();
    if (S.res) { S.res = null; S.round++; if (S.round >= S.rounds + (S.extra ? 1 : 0)) return endMatch(); newRound(); S.log = ""; return draw(); }
    const t = totals(), res = { def: [] }; let line = [];
    S.assaults.forEach((a, i) => { const ok = t[i] >= a.force; res.def.push(ok); if (!ok) { S.b++; line.push(`Breccia a ${LANES[a.lane]}.`); } else line.push(pick([`${LANES[a.lane]} tiene.`, `Assalto respinto a ${LANES[a.lane]}.`])); });
    if (t.A >= S.eDef + 4) { S.a += 2; line.push("Colpo doppio: la linea nemica cede."); } else if (t.A >= S.eDef) { S.a++; line.push(pick(["Il nostro attacco passa.", "Punto per la Rondine."])); } else line.push(t.A ? "L'attacco si ferma sulle lance." : "Nessuno ha attaccato.");
    S.res = res; S.log = line.join(" "); draw();
    if (S.round === S.rounds - 1 && !S.extra && S.a === S.b) { S.extra = true; S.log += " Pari: turno supplementare!"; draw(); }
  }
  function endMatch() { S.phase = "end"; S.log = S.a > S.b ? "Vittoria. La compagnia tiene il campo." : S.a === S.b ? "Pari: non basta." : "Sconfitta. Si ritirano in ordine (più o meno)."; draw(); }
  function close() { const o = S.o, r = { a: S.a, b: S.b, win: S.a > S.b, recap: "" }; if (root) root.remove(); root = null; S = null; window.__schiere.state = null; o.onDone && o.onDone(r); }
  function start(o) {
    css(); if (root) root.remove();
    const members = (o.members || []).slice(0, 5);
    if (!members.length) return false;
    root = document.createElement("div"); root.id = "scOv"; document.body.appendChild(root);
    S = { o, members, enemy: Object.assign({ name: "Nemico", atk: [4, 0.6], def: [4, 0.5] }, o.enemy || {}), rounds: o.rounds || 6, round: 0, a: 0, b: 0, extra: false, phase: "play", log: "", res: null };
    S.state = null;
    window.__schiere.state = { get a() { return S.a; }, get b() { return S.b; }, finish: (a, b) => { S.a = a; S.b = b; endMatch(); } };
    newRound(); draw();
    return true;
  }
  window.__schiere = { start, state: null };
})();
