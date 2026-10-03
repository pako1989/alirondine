// ================= ROSTER DELLA SQUADRA & TALENTI DEL BORGO =================
// Dashboard tattica: visualizza i compagni di squadra e equipaggia i Talenti del Borgo
// per ottenere bonus passivi in partita.
(function () {
  const K_EQUIPPED = "ali-di-rondine.equipped-talents";

  const ROSTER_MEMBERS = [
    { id: "leo", name: "Leo Moretti", role: "Attaccante (N. 10)", trait: "Il ragazzo del muro. Tiro della Rondine e determinazione infinita.", icon: "⚡" },
    { id: "tommy", name: "Tommy Diallo", role: "Ala / Spalla d'attacco", trait: "Velocità fulminea, cross tesi e cuore d'oro.", icon: "👟" },
    { id: "nico", name: "Nico Ferri", role: "Portiere Estremo", trait: "La tecnica segreta del Gatto Volante e la passione per il gelato.", icon: "🧤" },
    { id: "sara", name: "Sara Ferri", role: "Team Manager", trait: "Analisi video rigorosa, tablet tattico e zero sconti per nessuno.", icon: "📊" },
    { id: "gigi", name: "Gigi Scotto", role: "Centrocampista", trait: "Non smette mai di parlare, imita i gabbiani e non si arrende mai.", icon: "🐦" },
    { id: "bruno", name: "Bruno Sabatini", role: "Regista / Difensore", trait: "Cinismo d'acciaio, tiro radente e riflessi da campione.", icon: "🦅" },
    { id: "fede", name: "Fede Lanza", role: "Trequartista", trait: "Piedi di velluto, visione sopraffina ed eleganza naturale.", icon: "✨" },
    { id: "nonna", name: "Nonna Ferri", role: "Presidente Morale", trait: "Pilota di Panda 30 e fornitrice ufficiale di focaccia calda.", icon: "🚗" },
    { id: "baciccia", name: "Baciccia", role: "Vecchio Lupo di Mare", trait: "Memoria storica del molo e maestro di nodi e parabole.", icon: "⚓" },
    { id: "aurelio", name: "Don Aurelio", role: "Parroco del Borgo", trait: "Benedice i pali, suona le campane e prega per le ginocchia di Nico.", icon: "⛪" },
    { id: "rita", name: "Rita", role: "Cuoca di Trattoria", trait: "Regina delle trofie e del pesto fatto a mortaio.", icon: "🍲" }
  ];

  const TALENTS = [
    {
      id: "focaccia",
      name: "Focaccia Calda della Nonna",
      desc: "+15 Grinta all'inizio di ogni tempo e dopo l'intervallo.",
      icon: "🥖"
    },
    {
      id: "acciughe",
      name: "Acciughe al Sale di Baciccia",
      desc: "+2 Contrasto e +8% di successo nei contrasti duri sul campo.",
      icon: "🐟"
    },
    {
      id: "cruciverba",
      name: "Cruciverba della Signora Pina",
      desc: "+3 Passaggio e maggiore intesa con i compagni sulle fasce.",
      icon: "📰"
    },
    {
      id: "olio_santo",
      name: "Olio Santo di Don Aurelio",
      desc: "+10% probabilità che il pallone colpisca il palo invece di entrare.",
      icon: "✨"
    },
    {
      id: "appunti",
      name: "Taccuino Tattico di Sara",
      desc: "+3 Dribbling e lettura in anticipo dei movimenti dei difensori rivali.",
      icon: "📋"
    },
    {
      id: "fischietto",
      name: "Fischietto di Ferro del Mister",
      desc: "+4 Potenza d'impatto a tutti i tiri speciali (Rondine, Foglia, Ego).",
      icon: "📢"
    }
  ];

  function getEquippedTalents() {
    try {
      const saved = JSON.parse(localStorage.getItem(K_EQUIPPED));
      if (Array.isArray(saved)) return saved;
    } catch {}
    return ["focaccia", "appunti"]; // Default
  }

  function setEquippedTalents(arr) {
    try {
      localStorage.setItem(K_EQUIPPED, JSON.stringify(arr.slice(0, 2)));
    } catch {}
  }

  function hasTalent(id) {
    return getEquippedTalents().includes(id);
  }

  function toggleTalent(id) {
    let eq = getEquippedTalents();
    if (eq.includes(id)) {
      if (eq.length <= 1) {
        if (window.toast) window.toast("Devi avere almeno 1 Talento equipaggiato!", "info", "⚠️");
        return;
      }
      eq = eq.filter((x) => x !== id);
    } else {
      if (eq.length >= 2) {
        eq.shift(); // Rimuovi il più vecchio e aggiungi il nuovo
      }
      eq.push(id);
    }
    setEquippedTalents(eq);
    const talent = TALENTS.find((t) => t.id === id);
    if (window.toast && talent) {
      window.toast(`Talento: ${talent.name}`, "success", talent.icon);
    }
    renderTalentsContent();
  }

  let rosterModal = null;

  function ensureRosterModal() {
    if (rosterModal && document.body.contains(rosterModal)) return rosterModal;
    rosterModal = document.createElement("div");
    rosterModal.className = "custom-modal-overlay";
    rosterModal.id = "rosterModal";
    rosterModal.innerHTML = `
      <div class="custom-modal-chassis">
        <div class="custom-modal-header">
          <h3>🛡️ Roster & Talenti del Borgo</h3>
          <button type="button" class="mute" id="closeRosterModal" style="padding:4px 9px;">✕</button>
        </div>
        <div class="custom-modal-body" id="rosterBody">
          <div>
            <div style="font-weight:bold; font-size:13px; color:var(--gold); margin-bottom:6px;">
              ⭐ TALENTI EQUIPAGGIABILI (Max 2 attivi contemporaneamente)
            </div>
            <div id="talentsList" style="display:flex; flex-direction:column; gap:6px;"></div>
          </div>
          <div>
            <div style="font-weight:bold; font-size:13px; color:var(--gold); margin:10px 0 6px;">
              👥 FORMAZIONE E COMPAGNI DI BORGO MARINO
            </div>
            <div class="roster-grid" id="rosterGrid"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(rosterModal);

    const closeBtn = rosterModal.querySelector("#closeRosterModal");
    if (closeBtn) closeBtn.onclick = closeRosterModal;
    rosterModal.onclick = (e) => {
      if (e.target === rosterModal) closeRosterModal();
    };
    return rosterModal;
  }

  function renderTalentsContent() {
    const el = ensureRosterModal();
    const tBox = el.querySelector("#talentsList");
    const rBox = el.querySelector("#rosterGrid");
    if (!tBox || !rBox) return;

    const equipped = getEquippedTalents();

    tBox.innerHTML = TALENTS.map((t) => {
      const isEq = equipped.includes(t.id);
      return `
        <div class="talent-card ${isEq ? "equipped" : ""}" data-id="${t.id}">
          <span style="font-size:20px;">${t.icon}</span>
          <div class="talent-info">
            <div class="talent-title">${t.name}</div>
            <div class="talent-desc">${t.desc}</div>
          </div>
          <span class="talent-badge">${isEq ? "ATTIVO ✓" : "EQUIPAGGIA"}</span>
        </div>
      `;
    }).join("");

    tBox.querySelectorAll(".talent-card").forEach((card) => {
      card.onclick = () => toggleTalent(card.dataset.id);
    });

    rBox.innerHTML = ROSTER_MEMBERS.map((m) => `
      <div class="roster-card">
        <div class="roster-card-header">
          <span>${m.icon} ${m.name}</span>
        </div>
        <div class="roster-card-role">${m.role}</div>
        <div class="roster-card-trait">${m.trait}</div>
      </div>
    `).join("");
  }

  function openRosterModal() {
    const el = ensureRosterModal();
    renderTalentsContent();
    el.classList.add("open");
  }

  function closeRosterModal() {
    if (rosterModal) {
      rosterModal.classList.remove("open");
    }
  }

  window.openRosterTalentsModal = openRosterModal;
  window.closeRosterTalentsModal = closeRosterModal;
  window.getEquippedTalents = getEquippedTalents;
  window.hasTalent = hasTalent;
})();
