// js/cavaliere-int.js - «INTERROGATORIO» · il minigioco di «Il Cavaliere del Fischio» (e del cabinato in Sala Giochi)
// Il sospettato mostra un «umore» (spavaldo, spaventato, sarcastico). Scegli come parlare: Calmo, Duro o Ironico. Quello giusto fa salire la Verità; quello sbagliato fa salire i Nervi.
// A Verità 100 confessa; a Nervi 100 si chiude a riccio; hai un numero limitato di domande. Ai livelli alti l'umore può essere nascosto da un falso indizio.
// Opzioni: title, level (1-3), oppName, te (Verità in più per colpo), df (Nervi in meno quando sbagli), at (domande in più), onDone({win, verita, nervi}). Test: window.__interrogatorio.state.finish(win) · .pick("calmo"|"duro"|"ironico").
(function () {
  "use strict";
  if (window.__interrogatorio) return;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const MOODS = {
    spavaldo: { best: "duro", icon: "😏", tell: "Si appoggia allo schienale, braccia larghe, sorriso da biglietto omaggio.", lines: ["«Che cosa vuole da me? Io non ho niente da dire.»", "«Faccia pure. Ho avvocati che si mangiano le sentenze a colazione.»"] },
    spaventato: { best: "calmo", icon: "😰", tell: "Le mani gli tremano. Controlla la porta ogni tre secondi.", lines: ["«Io... io non dovrei essere qui. Non so niente.»", "«Se parlo, mi... mi fanno del male.»"] },
    sarcastico: { best: "ironico", icon: "🙄", tell: "Alza un sopracciglio e fa un applauso lento, a vuoto.", lines: ["«Oh, un interrogatorio. Che originale. Ha pensato anche a un mantello?»", "«Domande, domande... voglio un caffè e un po' di rispetto.»"] }
  };
  const KINDS = { calmo: ["🤝 Calmo", "Parli piano e lo lasci respirare"], duro: ["👊 Duro", "Alzi la voce e lo inchiodi"], ironico: ["🎭 Ironico", "Rispondi alla battuta con la tua"] };
  const ORDER = ["calmo", "duro", "ironico"];
  const LV = { 1: { feint: 0.1, wrong: 18, turns: 9 }, 2: { feint: 0.25, wrong: 22, turns: 8 }, 3: { feint: 0.4, wrong: 26, turns: 8 } };
  let S = null, root = null;
  function css() {
    if (document.getElementById("ivCss")) return;
    const st = document.createElement("style"); st.id = "ivCss";
    st.textContent = `#ivOv{position:fixed;inset:0;z-index:300;background:#07070e;color:#e5e7eb;font-family:Georgia,serif;display:flex;flex-direction:column;gap:8px;padding:10px;overflow:auto}
#ivOv h3{margin:0;font-size:15px;color:#facc15;display:flex;justify-content:space-between;gap:8px}
#ivOv .bars{display:flex;flex-direction:column;gap:6px}
#ivOv .bar{background:#14141f;border:1px solid #3b3b55;border-radius:8px;height:22px;position:relative;overflow:hidden}
#ivOv .bar i{position:absolute;inset:0 auto 0 0;display:block;transition:width .35s}
#ivOv .bar span{position:absolute;inset:0;display:flex;align-items:center;padding:0 8px;font-size:12px;font-weight:700;text-shadow:0 1px 2px #000}
#ivOv .face{background:#14141f;border:2px solid #facc15;border-radius:12px;padding:10px;text-align:center;font-size:44px;line-height:1.1}
#ivOv .face small{display:block;font-size:12px;color:#fde68a;margin-top:4px;line-height:1.35}
#ivOv .bt{display:flex;flex-direction:column;gap:6px}#ivOv .bt button{min-height:52px;border-radius:10px;border:2px solid #facc15;background:#1c1c2e;color:#e5e7eb;font-size:16px;font-weight:700;text-align:left;padding:6px 12px}
#ivOv .bt button small{display:block;font-size:11px;font-weight:400;color:#9ca3af}
#ivOv .lg{font-size:13px;color:#e5e7eb;min-height:46px;background:#10101a;border-radius:8px;padding:8px 10px}
#ivOv .go{min-height:46px;border-radius:10px;border:2px solid #fbbf24;background:#713f12;color:#fff;font-size:16px;font-weight:700;width:100%}`;
    document.head.appendChild(st);
  }
  const L = () => LV[Math.max(1, Math.min(3, S.o.level || 1))];
  function newMood() {
    const keys = Object.keys(MOODS); let k = keys[Math.floor(Math.random() * 3)]; if (k === S.mood) k = keys[(keys.indexOf(k) + 1) % 3];
    S.mood = k; S.shown = Math.random() < L().feint ? keys[(keys.indexOf(k) + 1 + Math.floor(Math.random() * 2)) % 3] : k;
  }
  function paint() {
    if (!root) return; const m = MOODS[S.shown], bar = (id, v, col, t) => { const e = root.querySelector("#" + id); if (e) { e.querySelector("i").style.width = Math.min(100, v) + "%"; e.querySelector("i").style.background = col; e.querySelector("span").textContent = t; } };
    bar("ivV", S.verita, "#16a34a", `Verità ${Math.round(S.verita)}/100`); bar("ivN", S.nervi, "#dc2626", `Nervi ${Math.round(S.nervi)}/100`);
    const f = root.querySelector(".face"); if (f) f.innerHTML = `${m.icon}<small>${esc(S.o.oppName || "Il sospettato")} · ${esc(m.tell)}<br>Domande rimaste: ${S.turns}</small>`;
  }
  function log(t) { S.log = t; const e = root && root.querySelector(".lg"); if (e) e.innerHTML = t; }
  function pick(kind) {
    if (!S || S.over || !KINDS[kind]) return false;
    const best = MOODS[S.mood].best, ok = kind === best, part = ORDER[(ORDER.indexOf(best) + 1) % 3] === kind;
    S.turns--;
    if (ok) { S.verita += 25 + 4 * (S.o.te | 0); S.nervi = Math.max(0, S.nervi - 6); log("Colpo giusto: si incrina e lascia scappare un pezzo di verità."); }
    else if (part) { S.verita += 8; S.nervi += Math.max(4, L().wrong - 10 - 3 * (S.o.df | 0)); log("Non è la corda giusta, ma qualcosa si sposta."); }
    else { S.nervi += Math.max(6, L().wrong - 4 * (S.o.df | 0)); log("Sbagliato: si irrigidisce. «" + esc(MOODS[S.mood].lines[1].replace(/^«|»$/g, "")) + "»"); }
    paint();
    if (S.verita >= 100) return finish(true); if (S.nervi >= 100) return finish(false); if (S.turns <= 0) return finish(S.verita >= 70);
    newMood(); setTimeout(paint, 450); return true;
  }
  function finish(win) {
    if (!S || S.over) return; S.over = true; log(win ? "Confessa. Parla a bassa voce, senza guardarti, con la voce di chi ha tenuto un segreto troppo a lungo." : "Si chiude a riccio. «Non dirò altro.» Per stasera, la porta resta chiusa.");
    const bt = root.querySelector(".bt"); if (bt) bt.innerHTML = `<button class="go" id="ivGo">Continua ▸</button>`; const gb = root.querySelector("#ivGo"); if (gb) gb.onclick = () => close(win);
    window.__interrogatorio.state.done = win; return true;
  }
  function close(win) { const o = S.o, r = { win: !!win, verita: S.verita, nervi: S.nervi }; if (root) root.remove(); root = null; S = null; window.__interrogatorio.state = null; o.onDone && o.onDone(r); }
  function start(o) {
    css(); if (root) root.remove();
    root = document.createElement("div"); root.id = "ivOv"; document.body.appendChild(root);
    S = { o, verita: 0, nervi: 10 + (o.level || 1) * 3, turns: LV[Math.max(1, Math.min(3, o.level || 1))].turns + (o.at | 0), mood: "", shown: "", over: false, log: "Leggi l'umore e scegli come parlare." };
    newMood();
    root.innerHTML = `<h3><span>${esc(o.title || "Interrogatorio")}</span><span>Livello ${o.level || 1}</span></h3><div class="bars"><div class="bar" id="ivV"><i></i><span></span></div><div class="bar" id="ivN"><i></i><span></span></div></div><div class="face"></div>
<div class="bt">${ORDER.map((k) => `<button data-k="${k}">${KINDS[k][0]}<small>${KINDS[k][1]}</small></button>`).join("")}</div><div class="lg">${esc(S.log)}</div>`;
    root.querySelectorAll("button[data-k]").forEach((b) => (b.onclick = () => pick(b.dataset.k)));
    window.__interrogatorio.state = { finish, pick, get verita() { return S.verita; }, get nervi() { return S.nervi; }, get over() { return S.over; }, get mood() { return S.mood; } };
    paint(); return true;
  }
  window.__interrogatorio = { start, state: null };
})();
