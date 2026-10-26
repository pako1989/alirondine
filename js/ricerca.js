// js/ricerca.js - «Cerca Ovunque»: ricerca globale rapida e zero-spoiler in tutta l'app.
// Indicizza dal vivo Saghe, Giochi & Cabinati, Carte dei Sogni possedute, Personaggi incontrati e Guardaroba.
(function () {
  "use strict";
  if (window.__ricerca) return;

  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const norm = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  let OV = null, BACK = null, CUR_CAT = "all", CUR_Q = "", SEL_IDX = 0, CUR_ITEMS = [];

  const CATS = [
    ["all", "Tutti"],
    ["saghe", "📚 Saghe"],
    ["giochi", "🕹️ Giochi"],
    ["carte", "🃏 Carte"],
    ["personaggi", "👥 Incontrati"],
    ["guardaroba", "👕 Guardaroba"],
  ];

  function css() {
    if (document.getElementById("ricercaCss")) return;
    const st = document.createElement("style");
    st.id = "ricercaCss";
    st.textContent = `@media (max-width:380px){.topr{gap:4px!important}.topr .mute{font-size:16px!important}}
.rcOv{position:fixed;inset:0;z-index:420;background:rgba(8,13,26,0.92);color:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;display:flex;flex-direction:column;align-items:center;padding:10px 10px 20px;overflow-y:auto;overflow-x:hidden}
.rcOv *{box-sizing:border-box}
.rcPanel{width:100%;max-width:540px;background:#111a2e;border:1.5px solid #334155;border-radius:14px;padding:12px;box-shadow:0 14px 36px rgba(0,0,0,.65)}
.rcBar{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.rcBar h2{margin:0;font:900 18px/1.2 system-ui;color:#ffd23f;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rcClose{width:40px;height:40px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#f8fafc;font-size:16px;cursor:pointer;flex-shrink:0;touch-action:manipulation}
.rcInpWrap{display:flex;align-items:center;gap:8px;background:#0a1020;border:1.5px solid #3b82f6;border-radius:10px;padding:6px 10px}
.rcInpWrap:focus-within{border-color:#ffd23f}
.rcInp{flex:1;min-width:0;background:transparent;border:0;color:#f8fafc;font:600 14.5px system-ui;outline:none;min-height:30px}
.rcInp::placeholder{color:#64748b}
.rcClr{background:transparent;border:0;color:#94a3b8;font-size:14px;cursor:pointer;padding:4px 6px}
.rcTabs{display:flex;gap:5px;overflow-x:auto;padding:8px 0 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.rcTabs::-webkit-scrollbar{display:none}
.rcTab{background:#19253f;border:1px solid #334155;color:#cbd5e1;border-radius:8px;padding:6px 10px;font:700 11.5px system-ui;cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:34px;touch-action:manipulation}
.rcTab.active{background:#ffd23f;border-color:#ffd23f;color:#0f172a;font-weight:900}
.rcMeta{font-size:11.5px;color:#94a3b8;margin:4px 2px 8px;display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap}
.rcList{display:flex;flex-direction:column;gap:6px;max-height:62vh;overflow-y:auto;overflow-x:hidden}
.rcRow{width:100%;min-height:50px;background:#16223a;border:1px solid #293a5a;border-radius:10px;padding:8px 10px;display:flex;align-items:center;gap:10px;text-align:left;color:#f1f5f9;cursor:pointer;touch-action:manipulation;transition:border-color .12s,background .12s}
.rcRow:hover,.rcRow.sel{border-color:#ffd23f;background:#1d2d4d}
.rcIc{width:36px;height:36px;border-radius:8px;background:#0c1324;border:1px solid #334155;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;overflow:hidden}
.rcIc img{width:100%;height:100%;object-fit:cover}
.rcTxt{flex:1;min-width:0}
.rcTxt b{display:block;font:800 13.5px/1.2 system-ui;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rcTxt span{display:block;font:500 11.5px/1.3 system-ui;color:#94a3b8;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rcGo{font:800 12px system-ui;color:#ffd23f;flex-shrink:0}
.rcEmpty{padding:22px 12px;text-align:center;color:#94a3b8;font-size:13px;background:#141e33;border:1px dashed #334155;border-radius:10px}
.rcFoot{margin-top:8px;padding-top:7px;border-top:1px solid #1e293b;font-size:11px;color:#64748b;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px}`;
    document.head.appendChild(st);
  }

  function closeAllModalsBeforeJump() {
    close();
    safe(() => window.__gabbia3d && window.__gabbia3d.close && window.__gabbia3d.close(), 0);
    safe(() => window.__portieri && window.__portieri.close && window.__portieri.close(), 0);
    safe(() => window.__arena && window.__arena.close && window.__arena.close(), 0);
    safe(() => window.__sogni && window.__sogni.close && window.__sogni.close(), 0);
    safe(() => window.__salone && window.__salone.close && window.__salone.close(), 0);
  }

  function buildIndex() {
    const out = [];
    const sal = window.__salone;
    const sog = window.__sogni;
    const api = window.__borgoApi;

    // 1. Giochi, Modalità Principali e Strumenti rapidi
    const addGame = (id, icon, title, sub, kw, run) => {
      out.push({ cat: "giochi", id: "gm_" + id, icon, img: null, title, sub, search: norm(`${title} ${sub} ${kw || ""}`), run });
    };

    if (window.__gabbia3d) {
      addGame("gabbia3d", "🏟️", "Gabbia 3D · 3 contro 3", "Giochi 3D · Calcio arcade con sponde luminose e Super delle carte", "threejs 3d gabbia sponde coppa calcio sogni", () => {
        closeAllModalsBeforeJump();
        window.__gabbia3d.open();
      });
    }
    if (sog) {
      addGame("sogni", "🃏", "La Squadra dei Sogni", "Collezione carte, 5 Mazzi Tattici, Torneo, Stagione e Draft", "carte mazzi formazioni sinergie bustine intesa", () => {
        closeAllModalsBeforeJump();
        sog.open();
      });
      if (sog.openVoci) {
        addGame("voci", "🎙️", "Voci dallo Spogliatoio", "Dialoghi d'intesa sbloccati giocando con coppie affiatate", "dialoghi spogliatoio legami intesa", () => {
          closeAllModalsBeforeJump();
          sog.openVoci(() => sog.open());
        });
      }
    }
    if (window.__arena) {
      addGame("arena", "⚔️", "Arena dei Sogni", "Battaglie tattiche a turni, Torre dei Duelli e Arena del giorno", "arena torre battaglie turni reliquie", () => {
        closeAllModalsBeforeJump();
        window.__arena.open();
      });
      if (window.__arena.openStaffetta) {
        addGame("staffetta", "📟", "Staffetta dei Dieci · Boss Rush", "Arena · 5 titolari + 5 riserve in panchina su 4 ondate", "staffetta dieci panchina ondate boss", () => {
          closeAllModalsBeforeJump();
          window.__arena.openStaffetta(() => window.__arena.open());
        });
      }
    }
    if (window.__portieri) {
      addGame("portieri", "🧤", "Sfida di Portieri", "Duello 1 contro 1 porta a porta, Coppa dei Numeri Uno e Muro Infinito", "portieri parate tuffi muro porta", () => {
        closeAllModalsBeforeJump();
        window.__portieri.open();
      });
    }
    if (window.__eroi) {
      addGame("eroi", "⚽", "Calcio d'Azione Eroi", "Partita 3v3 o 5v5 coi campioni dei Sogni e Coppa degli Eroi", "calcio azione eroi 5v5", () => {
        closeAllModalsBeforeJump();
        window.__eroi.open();
      });
    }
    if (window.__picchia) {
      addGame("picchia", "🥊", "Duello dei Sogni", "Picchiaduro 1 contro 1 coi campioni delle saghe", "picchiaduro lotta duello", () => {
        closeAllModalsBeforeJump();
        window.__picchia.open();
      });
    }
    if (window.__corsa) {
      addGame("corsa", "🏁", "Gran Premio dei Sogni", "Corsa arcade a squadre con le tue carte", "corsa auto gran premio piste", () => {
        closeAllModalsBeforeJump();
        window.__corsa.open();
      });
    }
    if (window.__beat) {
      addGame("beat", "🥋", "Rissa dei Sogni", "Beat 'em up a scorrimento in 3 stadi", "rissa scorrimento ondate", () => {
        closeAllModalsBeforeJump();
        window.__beat.open();
      });
    }
    if (typeof window.openStadium3D === "function") {
      addGame("stadium3d", "🥅", "Stadio della Rondine 3D", "Giochi 3D · Sfida dei tiri a effetto e parate in 3D", "stadio 3d punizioni rigori leo", () => {
        closeAllModalsBeforeJump();
        window.openStadium3D();
      });
    }
    if (sal) {
      addGame("salone", "🏛️", "Salone delle Saghe", "Mappamondo e catalogo completo di tutte le avventure", "salone mappamondo catalogo", () => {
        closeAllModalsBeforeJump();
        sal.open();
      });
      addGame("salagiochi", "🕹️", "Sala Giochi", "Tutti i cabinati arcade sbloccati dalle saghe", "cabinato sala giochi record", () => {
        closeAllModalsBeforeJump();
        sal.salaGiochi(() => sal.open());
      });
      addGame("album", "🏆", "Album dei Finali & Albero Bivi", "Tutti i finali scoperti e la mappa delle scelte", "album finali bivi albero", () => {
        closeAllModalsBeforeJump();
        sal.album(() => sal.open());
      });
      addGame("diario", "📖", "Diario del Borgo", "Avanzamento globale tra saghe, finali e incontri", "diario progressi completamento", () => {
        closeAllModalsBeforeJump();
        sal.diario(() => sal.open());
      });
    }
    if (window.__bar) {
      addGame("bar", "🍺", "Bar del Borgo", "Chiacchiere, incontri e storie al bancone", "bar borgo tavoli", () => {
        closeAllModalsBeforeJump();
        window.__bar.open();
      });
    }
    if (window.__carteDecks) {
      addGame("cartedestino", "🎴", "Carte del Destino", "Sfide di mazzi tematici ispirati alle saghe", "carte destino mazzi", () => {
        closeAllModalsBeforeJump();
        window.__carteDecks.openHub();
      });
    }

    // Cabinati della Sala Giochi (mostra stato aperto/bloccato senza spoiler)
    if (sal && sal.MACHINES) {
      sal.MACHINES.forEach((m) => {
        const st = safe(() => sal.machineState ? sal.machineState(m.id) : null, null);
        const isOpen = st ? st.open : true;
        const sagaTitle = st && st.s ? st.s.t : m.saga;
        out.push({
          cat: "giochi",
          id: "cab_" + m.id,
          icon: isOpen ? m.e : "🔒",
          img: null,
          title: `Cabinato · ${m.t}`,
          sub: isOpen ? `Sala Giochi · ${sagaTitle}` : `Bloccato · Finisci il cap. 1 di «${sagaTitle}»`,
          search: norm(`cabinato sala giochi ${m.t} ${sagaTitle} ${isOpen ? m.d : ""}`),
          run: () => {
            closeAllModalsBeforeJump();
            if (isOpen && sal.openMachine) sal.openMachine(m.id, () => sal.salaGiochi(() => sal.open()));
            else sal.salaGiochi(() => sal.open());
          },
        });
      });
    }

    // 2. Saghe del Salone
    if (sal && Array.isArray(sal.SAGAS)) {
      sal.SAGAS.forEach((s) => {
        if (!s || s.id === "carte") return;
        const info = safe(() => sal.sagaStatus ? sal.sagaStatus(s.id) : null, null);
        if (info && !info.avail) return;
        const statusTxt = info ? (info.finished ? "✓ Conclusa" : info.started ? `In corso (Cap. ${info.ch})` : "Da iniziare") : "Saga";
        const genres = Array.isArray(s.g) ? s.g.join(" ") : "";
        out.push({
          cat: "saghe",
          id: "sg_" + s.id,
          icon: s.e || "📚",
          img: null,
          title: s.t,
          sub: `Saga · ${statusTxt} · ${s.d || ""}`,
          search: norm(`${s.t} ${s.d || ""} ${genres} ${s.id} saga`),
          run: () => {
            closeAllModalsBeforeJump();
            if (sal.openSaga) sal.openSaga(s.id);
            else sal.open();
          },
        });
      });
    }

    // 3. Carte dei Sogni (RIGOROSAMENTE ZERO-SPOILER: solo carte possedute!)
    if (sog && sog._load) {
      safe(() => sog.sync && sog.sync(), 0);
      const r = sog._load();
      const roleMap = { A: "Attaccante", C: "Centrocampista", D: "Difensore", P: "Portiere", B: "Jolly" };
      (r.own || []).forEach((id) => {
        const c = sog.BY && sog.BY[id];
        if (!c) return;
        const nm = sog.name ? sog.name(id) : id;
        const sgName = sog.SAGHE && sog.SAGHE[c.saga] ? sog.SAGHE[c.saga][1] : c.saga;
        const e = sog.eff ? sog.eff(c) : c;
        const rl = roleMap[c.role] || c.role;
        const im = sog.port ? sog.port(id) : null;
        out.push({
          cat: "carte",
          id: "cd_" + id,
          icon: "🃏",
          img: im,
          title: nm,
          sub: `Carta Sogni · ${rl} · ATT ${e.at} DIF ${e.df} TEC ${e.te} · ${sgName}`,
          search: norm(`${nm} ${rl} ${sgName} ${id} carta sogni`),
          run: () => {
            closeAllModalsBeforeJump();
            if (sog.openCardLore) sog.openCardLore(id, () => sog.open());
            else sog.open();
          },
        });
      });
    }

    // 4. Personaggi incontrati (RIGOROSAMENTE ZERO-SPOILER: solo cardsSeen()!)
    if (api && api.BIO && api.cardsSeen && sal) {
      const seen = new Set(safe(() => api.cardsSeen(), []));
      seen.forEach((id) => {
        if (!id || id === "hero" || !api.BIO[id]) return;
        const nm = (api.CAST && api.CAST[id] && api.CAST[id].name) || id;
        const bio = api.BIO[id] || "";
        const im = safe(() => api.portraitImg && api.portraitImg(id), null);
        out.push({
          cat: "personaggi",
          id: "pr_" + id,
          icon: "👤",
          img: im,
          title: nm,
          sub: `Personaggio incontrato · ${bio}`,
          search: norm(`${nm} ${bio} personaggio`),
          run: () => {
            closeAllModalsBeforeJump();
            if (sal.openPersonaggioCard) sal.openPersonaggioCard(id, () => sal.open());
            else sal.personaggi(() => sal.open());
          },
        });
      });
    }

    // 5. Guardaroba (capi posseduti + capi visibili nel catalogo)
    if (api && api.COSM && sal) {
      const own = new Set(safe(() => api.cosOwned(), []));
      const kindLbl = { shirt: "Maglia", hairc: "Capelli", style: "Taglio", acc: "Accessorio", shot: "Tiro speciale" };
      Object.keys(api.COSM).forEach((k) => {
        const c = api.COSM[k];
        if (!c || !own.has(k)) return; // mostra solo i cosmetici già sbloccati per zero spoiler
        const kl = kindLbl[c.kind] || "Collezione";
        out.push({
          cat: "guardaroba",
          id: "cs_" + k,
          icon: "👕",
          img: null,
          title: c.label || k,
          sub: `Guardaroba · ${kl} sbloccato`,
          search: norm(`${c.label || k} ${kl} guardaroba`),
          run: () => {
            closeAllModalsBeforeJump();
            if (sal.openGuardarobaItem) sal.openGuardarobaItem(k, () => sal.open());
            else sal.guardaroba(() => sal.open());
          },
        });
      });
    }

    return out;
  }

  function filterItems(all) {
    const words = norm(CUR_Q).split(/\s+/).filter(Boolean);
    return all.filter((it) => {
      if (CUR_CAT !== "all" && it.cat !== CUR_CAT) return false;
      if (!words.length) return true;
      return words.every((w) => it.search.includes(w));
    });
  }

  function renderResults(allIndex) {
    if (!OV) return;
    const all = allIndex || buildIndex();
    const matched = filterItems(all);
    CUR_ITEMS = matched.slice(0, 45);
    if (SEL_IDX >= CUR_ITEMS.length) SEL_IDX = 0;

    const listEl = OV.querySelector(".rcList");
    const metaEl = OV.querySelector(".rcMeta");
    const clrBtn = OV.querySelector(".rcClr");
    if (clrBtn) clrBtn.style.display = CUR_Q ? "" : "none";

    OV.querySelectorAll(".rcTab").forEach((t) => {
      t.classList.toggle("active", t.dataset.cat === CUR_CAT);
    });

    if (metaEl) {
      metaEl.innerHTML = `<span>Risultati: <b style="color:#ffd23f">${matched.length}</b>${matched.length > 45 ? " (primi 45)" : ""}</span><span>Zero spoiler attivi</span>`;
    }

    if (!listEl) return;
    if (!CUR_ITEMS.length) {
      listEl.innerHTML = `<div class="rcEmpty">Nessuna voce trovata per «${esc(CUR_Q)}».<br><small>Le carte e i personaggi non ancora scoperti restano nascosti per evitare spoiler.</small></div>`;
      return;
    }

    listEl.innerHTML = CUR_ITEMS.map((it, idx) => `
      <button type="button" class="rcRow${idx === SEL_IDX ? " sel" : ""}" data-ridx="${idx}">
        <div class="rcIc">${it.img ? `<img alt="" src="${it.img}">` : it.icon}</div>
        <div class="rcTxt">
          <b>${esc(it.title)}</b>
          <span>${esc(it.sub)}</span>
        </div>
        <span class="rcGo">Apri ▸</span>
      </button>
    `).join("");

    listEl.querySelectorAll(".rcRow").forEach((btn) => {
      btn.onclick = () => {
        const item = CUR_ITEMS[+btn.dataset.ridx];
        if (item && typeof item.run === "function") item.run();
      };
    });
  }

  function open(back, initialQuery) {
    css();
    if (typeof back === "function") BACK = back;
    if (typeof initialQuery === "string") CUR_Q = initialQuery;
    SEL_IDX = 0;
    if (OV) OV.remove();

    const allIndex = buildIndex();
    OV = document.createElement("div");
    OV.className = "rcOv";
    OV.innerHTML = `
      <div class="rcPanel" role="dialog" aria-label="Ricerca globale rapida">
        <div class="rcBar">
          <h2>🔍 Cerca Ovunque</h2>
          <button type="button" class="rcClose" aria-label="Chiudi">✕</button>
        </div>
        <div class="rcInpWrap">
          <span>🔍</span>
          <input type="search" class="rcInp" placeholder="Cerca saghe, giochi 3D, carte, personaggi incontrati..." value="${esc(CUR_Q)}" aria-label="Cerca in tutta l'app">
          <button type="button" class="rcClr" title="Cancella">✕</button>
        </div>
        <div class="rcTabs">
          ${CATS.map(([k, lbl]) => `<button type="button" class="rcTab${CUR_CAT === k ? " active" : ""}" data-cat="${k}">${lbl}</button>`).join("")}
        </div>
        <div class="rcMeta"></div>
        <div class="rcList"></div>
        <div class="rcFoot">
          <span>Scorciatoia: Ctrl+K · ↑↓ Invio</span>
          <span>Solo contenuti sbloccati / incontrati</span>
        </div>
      </div>
    `;

    OV.onclick = (e) => {
      if (e.target === OV) {
        const b = BACK;
        close();
        if (typeof b === "function") b();
      }
    };
    OV.querySelector(".rcClose").onclick = () => {
      const b = BACK;
      close();
      if (typeof b === "function") b();
    };

    const inp = OV.querySelector(".rcInp");
    const clr = OV.querySelector(".rcClr");
    inp.oninput = () => {
      CUR_Q = inp.value;
      SEL_IDX = 0;
      renderResults(allIndex);
    };
    inp.onkeydown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (CUR_ITEMS.length) { SEL_IDX = (SEL_IDX + 1) % CUR_ITEMS.length; renderResults(allIndex); }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (CUR_ITEMS.length) { SEL_IDX = (SEL_IDX - 1 + CUR_ITEMS.length) % CUR_ITEMS.length; renderResults(allIndex); }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (CUR_ITEMS[SEL_IDX]) CUR_ITEMS[SEL_IDX].run();
      } else if (e.key === "Escape") {
        e.preventDefault();
        const b = BACK;
        close();
        if (typeof b === "function") b();
      }
    };
    clr.onclick = () => {
      CUR_Q = "";
      inp.value = "";
      SEL_IDX = 0;
      renderResults(allIndex);
      inp.focus();
    };
    OV.querySelectorAll(".rcTab").forEach((btn) => {
      btn.onclick = () => {
        CUR_CAT = btn.dataset.cat;
        SEL_IDX = 0;
        renderResults(allIndex);
      };
    });

    document.body.appendChild(OV);
    renderResults(allIndex);
    setTimeout(() => { if (inp && inp.isConnected) inp.focus(); }, 20);
  }

  function close() {
    if (OV) { OV.remove(); OV = null; }
  }

  // Scorciatoia globale Ctrl+K / Cmd+K + aggancio pulsante topbar #searchGlobalBtn
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (OV) close();
      else open();
    } else if (e.key === "Escape" && OV) {
      e.preventDefault();
      close();
    }
  });

  function bindTopBtn() {
    const btn = document.getElementById("searchGlobalBtn");
    if (btn && !btn._rcBound) {
      btn._rcBound = true;
      btn.onclick = () => open();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindTopBtn);
  else bindTopBtn();

  window.__ricerca = { open, close, buildIndex };
})();
