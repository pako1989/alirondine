// js/dossier-brief.js - «BRIEF DOSSIER»: schermata a moduli (Impostazioni) per dire a Claude / a un'altra IA come vuoi un Dossier
// Incompiuto (saga, protagonista, tono, trama, personaggi, scenari, minigioco, finali). Esce un testo da copiare o scaricare.
// La bozza si salva da sola nel browser (localStorage ali.dossier_brief). Non tocca nessun salvataggio di gioco.
(function () {
  "use strict";
  if (window.__dossierBrief) return;
  const KEY = "ali.dossier_brief", TONI = ["Ironico", "Serio", "Strappalacrime", "Epico", "Giallo/intrigo", "Misterioso", "Romantico", "Horror leggero", "Comico"];
  const MINI = ["Decidi tu (nuovo o riusato)", "Prova a scelte a tempo", "Partita a scelta del giocatore", "Motore proprio della saga", "Minigioco NUOVO (descrivilo)"];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const sagas = () => { try { return (window.__salone && window.__salone.SAGAS || []).map((s) => ({ id: s.id, t: s.title || s.t || s.id })); } catch (e) { return []; } };

  function css() {
    if (document.getElementById("dbCss")) return; const st = document.createElement("style"); st.id = "dbCss";
    st.textContent = `.dbOv{position:fixed;inset:0;z-index:400;background:#0d1020;color:#eef;font-family:system-ui,sans-serif;overflow:auto;-webkit-overflow-scrolling:touch}
.dbIn{max-width:640px;margin:0 auto;padding:12px 16px 130px}.dbIn h2{margin:6px 0;font-size:20px;color:#ffd23f}.dbIn p.s{margin:0 0 10px;font-size:13px;opacity:.8;line-height:1.35}
.dbIn fieldset{border:1px solid #3a4070;border-radius:10px;margin:10px 0;padding:8px 10px;background:#141832}.dbIn legend{padding:0 6px;font-weight:700;color:#9ad}
.dbIn label{display:block;font-size:12.5px;margin:7px 0 2px;opacity:.9}.dbIn input,.dbIn textarea,.dbIn select{width:100%;box-sizing:border-box;font:16px system-ui,sans-serif;padding:8px;border-radius:8px;border:1px solid #4a5090;background:#0b0e20;color:#eef}
.dbIn textarea{min-height:64px;resize:vertical}.dbChips{display:flex;flex-wrap:wrap;gap:6px}.dbChips label{display:flex;align-items:center;gap:5px;margin:0;padding:6px 10px;border:1px solid #4a5090;border-radius:20px;font-size:13px;min-height:36px}
.dbChips input{width:auto}.dbRow{border:1px dashed #4a5090;border-radius:8px;padding:6px 8px;margin:8px 0;position:relative}
.dbBar{position:fixed;left:0;right:0;bottom:0;display:flex;gap:8px;padding:10px 12px;background:#0d1020ee;border-top:1px solid #3a4070;justify-content:center;flex-wrap:wrap}
.dbBar button,.dbIn button{min-height:44px;padding:0 14px;border-radius:10px;border:1.5px solid #6a74c8;background:#232a5a;color:#fff;font:700 14px system-ui,sans-serif;cursor:pointer}
.dbBar button.hot{background:#c83a2a;border-color:#ffd23f}.dbIn .add{width:100%;margin-top:4px;background:#1a2040}.dbIn .rm{position:absolute;right:6px;top:6px;min-height:32px;padding:0 10px}
.dbOut{white-space:pre-wrap;font:12px/1.4 ui-monospace,monospace;background:#05060f;border:1px solid #3a4070;border-radius:8px;padding:8px;max-height:260px;overflow:auto;margin-top:8px}`;
    document.head.appendChild(st);
  }

  function rowHtml(kind, v, i) {
    v = v || {};
    if (kind === "pg") return `<div class="dbRow" data-k="pg"><button class="rm" type="button">✕</button><label>Nome</label><input data-f="n" value="${esc(v.n)}"><label>Ruolo nella storia</label><input data-f="r" value="${esc(v.r)}" placeholder="alleato, rivale, mentore…"><label>Carattere e aspetto</label><textarea data-f="d">${esc(v.d)}</textarea></div>`;
    return `<div class="dbRow" data-k="sc"><button class="rm" type="button">✕</button><label>Luogo</label><input data-f="n" value="${esc(v.n)}"><label>Descrizione (colori, oggetti, atmosfera)</label><textarea data-f="d">${esc(v.d)}</textarea></div>`;
  }

  function collect(root) {
    const g = (n) => (root.querySelector(`[name="${n}"]`) || {}).value || "";
    const rows = (k) => [...root.querySelectorAll(`.dbRow[data-k="${k}"]`)].map((r) => ({ n: r.querySelector('[data-f="n"]').value, r: (r.querySelector('[data-f="r"]') || {}).value || "", d: r.querySelector('[data-f="d"]').value })).filter((x) => x.n || x.d);
    return { saga: g("saga"), base: g("base") || "3", pn: g("pn"), pr: g("pr"), pa: g("pa"), toni: [...root.querySelectorAll('.dbChips input:checked')].map((x) => x.value), tn: g("tn"),
      altro: g("altro"), c4: g("c4"), c5: g("c5"), pgs: rows("pg"), scs: rows("sc"), mini: g("mini"), mind: g("mind"), f1: g("f1"), f2: g("f2"), no: g("no") };
  }

  function text(d) {
    const L = [], line = (t, v) => { if (v && String(v).trim()) L.push(`${t}: ${String(v).trim()}`); };
    const b = Number(d.base) || 3;
    L.push("BRIEF DOSSIER INCOMPIUTO — Ali di Rondine", `Capitoli da aggiungere: ${b + 1} e ${b + 2} (la saga base ha ${b} capitoli).`,
      "Istruzioni: segui prompt/prompt-dossier-capitoli-extra.txt e il formato dati di docs/dossier-dati.md (file js/dossier/<saga>.js). Almeno 1 minigioco. Tutto in italiano.", "");
    line("SAGA", d.saga); line("PROTAGONISTA DEL DOSSIER", d.pn); line("Chi è / ruolo", d.pr); line("Aspetto", d.pa);
    line("TONO", (d.toni || []).join(", ")); line("Note sul tono", d.tn);
    line("COSA VOGLIO VEDERE DALL'ALTRA PARTE", d.altro); line(`Idea capitolo ${b + 1}`, d.c4); line(`Idea capitolo ${b + 2}`, d.c5);
    if ((d.pgs || []).length) { L.push("", "PERSONAGGI:"); d.pgs.forEach((p) => L.push(`- ${p.n || "?"}${p.r ? " (" + p.r + ")" : ""}: ${p.d || ""}`)); }
    if ((d.scs || []).length) { L.push("", "SCENARI:"); d.scs.forEach((s) => L.push(`- ${s.n || "?"}: ${s.d || ""}`)); }
    L.push(""); line("MINIGIOCO", d.mini); line("Dettagli minigioco", d.mind); line("FINALE 1", d.f1); line("FINALE 2", d.f2); line("DA NON FARE / NOTE", d.no);
    return L.join("\n");
  }

  function open() {
    css(); const d = load(), ov = document.createElement("div"); ov.className = "dbOv";
    const S = sagas(), toni = d.toni || [];
    ov.innerHTML = `<div class="dbIn"><h2>📂 Brief Dossier</h2><p class="s">Compila quello che vuoi (tutto è facoltativo). In fondo ottieni un testo da copiare o scaricare e da dare a Claude o a un'altra IA. La bozza si salva da sola.</p>
<fieldset><legend>Saga</legend><label>Quale saga estendere</label><input name="saga" list="dbSagas" value="${esc(d.saga)}" placeholder="scrivi o scegli"><datalist id="dbSagas">${S.map((s) => `<option value="${esc(s.t)}">`).join("")}</datalist>
<label>Capitoli che ha già</label><select name="base"><option value="3"${d.base === "5" ? "" : " selected"}>3 (Dossier = cap. 4-5)</option><option value="5"${d.base === "5" ? " selected" : ""}>5 (Dossier = cap. 6-7)</option></select></fieldset>
<fieldset><legend>Protagonista del Dossier</legend><label>Nome</label><input name="pn" value="${esc(d.pn)}"><label>Chi è nella saga (antagonista, madre, rivale…)</label><input name="pr" value="${esc(d.pr)}"><label>Aspetto</label><textarea name="pa">${esc(d.pa)}</textarea></fieldset>
<fieldset><legend>Tono</legend><div class="dbChips">${TONI.map((t) => `<label><input type="checkbox" value="${t}"${toni.includes(t) ? " checked" : ""}>${t}</label>`).join("")}</div><label>Altro sul tono</label><textarea name="tn">${esc(d.tn)}</textarea></fieldset>
<fieldset><legend>Storia</legend><label>Cosa vuoi vedere dall'altra parte?</label><textarea name="altro">${esc(d.altro)}</textarea><label>Idea per il primo capitolo</label><textarea name="c4">${esc(d.c4)}</textarea><label>Idea per il secondo capitolo (climax)</label><textarea name="c5">${esc(d.c5)}</textarea></fieldset>
<fieldset><legend>Personaggi</legend><div id="dbPg">${(d.pgs || []).map((p) => rowHtml("pg", p)).join("")}</div><button class="add" type="button" data-add="pg">+ Aggiungi personaggio</button></fieldset>
<fieldset><legend>Scenari</legend><div id="dbSc">${(d.scs || []).map((p) => rowHtml("sc", p)).join("")}</div><button class="add" type="button" data-add="sc">+ Aggiungi scenario</button></fieldset>
<fieldset><legend>Minigioco (almeno 1)</legend><label>Tipo</label><select name="mini">${MINI.map((m) => `<option${d.mini === m ? " selected" : ""}>${m}</option>`).join("")}</select><label>Dettagli</label><textarea name="mind">${esc(d.mind)}</textarea></fieldset>
<fieldset><legend>Finali</legend><label>Finale 1</label><textarea name="f1">${esc(d.f1)}</textarea><label>Finale 2</label><textarea name="f2">${esc(d.f2)}</textarea><label>Da non fare / note</label><textarea name="no">${esc(d.no)}</textarea></fieldset>
<div class="dbOut" id="dbOut" hidden></div></div>
<div class="dbBar"><button type="button" class="hot" data-a="copy">Copia brief</button><button type="button" data-a="dl">Scarica .txt</button><button type="button" data-a="clear">Svuota</button><button type="button" data-a="close">Chiudi</button></div>`;
    document.body.appendChild(ov);
    const upd = () => { const c = collect(ov); save(c); return c; };
    ov.addEventListener("input", upd); ov.addEventListener("change", upd);
    ov.addEventListener("click", (e) => {
      const t = e.target.closest("button"); if (!t) return;
      if (t.dataset.add) { const host = ov.querySelector(t.dataset.add === "pg" ? "#dbPg" : "#dbSc"); host.insertAdjacentHTML("beforeend", rowHtml(t.dataset.add, {})); return; }
      if (t.classList.contains("rm")) { t.parentNode.remove(); upd(); return; }
      const a = t.dataset.a, out = ov.querySelector("#dbOut");
      if (a === "close") { upd(); ov.remove(); return; }
      if (a === "clear") { if (confirm("Svuotare tutto il brief?")) { save({}); ov.remove(); open(); } return; }
      const txt = text(upd()); out.hidden = false; out.textContent = txt;
      if (a === "copy") { const done = () => { t.textContent = "Copiato ✓"; setTimeout(() => { t.textContent = "Copia brief"; }, 1800); }; try { navigator.clipboard.writeText(txt).then(done, () => { out.focus && out.focus(); }); } catch (er) {} }
      if (a === "dl") { const bl = new Blob([txt], { type: "text/plain;charset=utf-8" }), u = URL.createObjectURL(bl), l = document.createElement("a"); l.href = u; l.download = "brief-dossier.txt"; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); }
    });
  }
  window.__dossierBrief = { open, text, collect, load };
})();
