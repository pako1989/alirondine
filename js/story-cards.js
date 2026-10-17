// js/story-cards.js - «LE CRONACHE DEL MOLO · CARTE DEL DESTINO»
// Modalità alternativa a mini-eventi narrativi procedurali per Ali di Rondine.
// Pescata di 5 carte (Ambientazione, Personaggio, Evento, Sfida/Twist, Ricompensa),
// scelte interattive, prova di tempismo/abilità, e sblocco di premi cosmetici e monete.
(function () {
  "use strict";
  if (window.__storyCards) return;

  const KEY = "ali-di-rondine.story-cards";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (_) { return d; } };

  // Salvataggio dedicato
  function loadRec() {
    const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {}) || {};
    return {
      v: 1,
      runsTotal: r.runsTotal || 0,
      runsWon: r.runsWon || 0,
      seen: r.seen && typeof r.seen === "object" ? r.seen : {},
      stamps: r.stamps && typeof r.stamps === "object" ? r.stamps : {}
    };
  }
  function saveRec(r) {
    safe(() => localStorage.setItem(KEY, JSON.stringify(r)));
  }

  // Audio sintetico Web Audio
  function playSound(type) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const t = ctx.currentTime;
      if (type === "card") {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle";
        o.frequency.setValueAtTime(400, t);
        o.frequency.exponentialRampToValueAtTime(800, t + 0.12);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.15);
      } else if (type === "win") {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "sine";
          o.frequency.value = f;
          g.gain.setValueAtTime(0.12, t + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.25);
          o.connect(g); g.connect(ctx.destination);
          o.start(t + i * 0.08); o.stop(t + i * 0.08 + 0.26);
        });
      } else if (type === "hit") {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(220, t);
        o.frequency.exponentialRampToValueAtTime(80, t + 0.1);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.11);
      }
      setTimeout(() => safe(() => ctx.close()), 1200);
    } catch (_) {}
  }

  // Helper premi al giocatore (senza alterare statistiche)
  function addCoins(amount) {
    try {
      if (typeof window.addCoins === "function") {
        window.addCoins(amount);
      } else {
        const BK = "ali-di-rondine.borgo";
        const b = JSON.parse(localStorage.getItem(BK) || "{}");
        b.coins = (b.coins || 0) + amount;
        localStorage.setItem(BK, JSON.stringify(b));
      }
    } catch (_) {}
    if (window.toast) window.toast(`+${amount} Monete del Borgo!`, "info", "🪙");
  }

  function unlockCosmetic(id) {
    try {
      if (typeof window.bCos === "function") {
        window.bCos(id);
      } else {
        const BK = "ali-di-rondine.borgo";
        const b = JSON.parse(localStorage.getItem(BK) || "{}");
        b.cos = b.cos || [];
        if (!b.cos.includes(id)) {
          b.cos.push(id);
          localStorage.setItem(BK, JSON.stringify(b));
        }
      }
      if (window.toast) window.toast("Nuovo oggetto sbloccato nel Guardaroba!", "info", "✨");
    } catch (_) {}
  }

  // Catalogo 16 Carte Narrative
  const CARDS = [
    {
      id: "amb_porto_nebbia",
      cat: "amb",
      name: "Il Molo Avvolto dalla Caligo",
      sub: "Nebbia marina, fari ovattati e risacca",
      desc: "Una fitta caligo sale dal golfo e cancella i contorni delle case pastello. Restano solo le lampare accese e il suono sordo della risacca contro i blocchi di pietra.",
      stateMod: "Visibilità Ridotta: il Campione agisce d'istinto.",
      gameMod: "La zona ideale di tempismo oscilla leggermente nella nebbia.",
      draw(g, w, h) {
        g.fillStyle = "#1e293b"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#334155"; g.fillRect(0, h * 0.65, w, h * 0.35);
        g.fillStyle = "rgba(255,255,255,0.18)";
        for (let i = 0; i < 6; i++) {
          g.beginPath(); g.arc(40 + i * 50, 60 + Math.sin(i) * 15, 30, 0, Math.PI * 2); g.fill();
        }
        g.fillStyle = "#facc15"; g.beginPath(); g.arc(w - 40, 45, 12, 0, Math.PI * 2); g.fill();
        g.fillStyle = "rgba(250,204,21,0.2)"; g.beginPath(); g.arc(w - 40, 45, 35, 0, Math.PI * 2); g.fill();
      }
    },
    {
      id: "amb_campetto_rosso",
      cat: "amb",
      name: "La Terra Battuta di San Rocco",
      sub: "Polvere rossa e porte in legno d'olivo",
      desc: "Il campetto dietro la chiesa di San Rocco. D'estate polvere rossa bruciante, d'inverno fango d'argilla. Qui ogni rimbalzo ha una sua idea.",
      stateMod: "Rimbalzo Secco: il pallone schizza sulle sponde.",
      gameMod: "Tiri più veloci e rimbalzi diagonali imprevisti.",
      draw(g, w, h) {
        g.fillStyle = "#78350f"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#b45309"; g.fillRect(0, h * 0.45, w, h * 0.55);
        g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 2;
        g.strokeRect(20, h * 0.55, w - 40, h * 0.35);
        g.beginPath(); g.arc(w / 2, h * 0.72, 25, 0, Math.PI * 2); g.stroke();
      }
    },
    {
      id: "amb_tetto_officina",
      cat: "amb",
      name: "La Terrazza delle Lamiere",
      sub: "Antenne TV, brezza di mare e reti da pesca",
      desc: "Sopra i capannoni dei vecchi cantieri navali: una gabbia di reti protettive sospesa tra le antenne e il cielo aperto, con vista su tutta la baia.",
      stateMod: "Vertigine Tattica: folate di maestrale laterali.",
      gameMod: "Il vento sposta la lancetta del tiro di mezzo secondo.",
      draw(g, w, h) {
        g.fillStyle = "#0369a1"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#334155"; g.fillRect(0, h * 0.7, w, h * 0.3);
        g.strokeStyle = "#94a3b8"; g.lineWidth = 1;
        for (let x = 10; x < w; x += 25) { g.beginPath(); g.moveTo(x, h * 0.7); g.lineTo(x, h * 0.45); g.stroke(); }
        g.fillStyle = "#f97316"; g.beginPath(); g.arc(w * 0.75, 40, 16, 0, Math.PI * 2); g.fill();
      }
    },
    {
      id: "pg_marinaio_cieco",
      cat: "pg",
      name: "Baciccia «Occhio di Vetro»",
      sub: "Vecchio nostromo dal fiuto infallibile",
      desc: "Ha navigato per cinquant'anni sui trabaccoli del Tigullio. Riconosce la qualità di un tiro dal suono del cuoio contro la brezza salmastra.",
      stateMod: "Ascolto Assoluto: segnali acustici anticipati.",
      gameMod: "Un bip sonoro scandisce il ritmo ideale di tiro.",
      draw(g, w, h) {
        g.fillStyle = "#0f172a"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#1e3a8a"; g.beginPath(); g.arc(w / 2, h / 2 - 10, 35, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#fed7aa"; g.beginPath(); g.arc(w / 2, h / 2 - 10, 26, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#1e293b"; g.fillRect(w / 2 - 28, h / 2 - 32, 56, 14); // berretto
        g.fillStyle = "#ffffff"; g.beginPath(); g.arc(w / 2 - 10, h / 2 - 12, 5, 0, Math.PI * 2); g.fill(); // occhio
        g.fillStyle = "#0284c7"; g.beginPath(); g.arc(w / 2 + 10, h / 2 - 12, 5, 0, Math.PI * 2); g.fill(); // occhio di vetro
      }
    },
    {
      id: "pg_ragazzina_muretto",
      cat: "pg",
      name: "Lia la Palleggiatrice",
      sub: "Dieci anni e palleggi infiniti sul molo",
      desc: "Nessuno l'ha mai vista senza un pallone tra i piedi. Se la sfidi sui muretti o sui tiri a effetto, non accetta di perdere senza aver calciato l'ultimo rigore.",
      stateMod: "Orgoglio da Campetto: rivalità accesa.",
      gameMod: "Ogni successo di fila raddoppia le monete raccolte.",
      draw(g, w, h) {
        g.fillStyle = "#0284c7"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#fed7aa"; g.beginPath(); g.arc(w / 2, h / 2 - 5, 26, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#ea580c"; // trecce arancio
        g.beginPath(); g.arc(w / 2 - 26, h / 2, 10, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(w / 2 + 26, h / 2, 10, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#1e293b"; g.fillRect(w / 2 - 18, h / 2 - 28, 36, 12);
      }
    },
    {
      id: "pg_arbitro_dimenticato",
      cat: "pg",
      name: "Il Professor Severino",
      sub: "Arbitro federale in pensione col taccuino nero",
      desc: "Gira ancora col fischietto d'ottone e ammonisce chi sosta in fuorigioco davanti alla panetteria. Se giochi pulito, però, sa darti il consiglio della vita.",
      stateMod: "Rigore del Regolamento: niente tocchi sporchi.",
      gameMod: "Solo i colpi perfettamente centrati assegnano punti pieni.",
      draw(g, w, h) {
        g.fillStyle = "#1e293b"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#0f172a"; g.fillRect(w / 2 - 30, h / 2 - 40, 60, 80);
        g.fillStyle = "#ffffff";
        for (let x = w / 2 - 24; x < w / 2 + 30; x += 12) { g.fillRect(x, h / 2 - 40, 6, 80); } // strisce arbitro
        g.fillStyle = "#facc15"; g.fillRect(w / 2 - 4, h / 2 - 6, 8, 14); // cartellino
      }
    },
    {
      id: "eve_pallone_scogli",
      cat: "eve",
      name: "La Sfera tra i Denti della Scogliera",
      sub: "Un rinvio sbilenco finito tra le onde",
      desc: "Il pallone di cuoio è rimbalzato tra due scogli bagnati a pelo d'acqua: o lo si recupera con una carambola perfetta, o la prossima onda se lo porta a largo.",
      stateMod: "Urgenza da Marea: tempo limite ridotto.",
      gameMod: "Hai solo 5 secondi per impostare la conclusione.",
      draw(g, w, h) {
        g.fillStyle = "#082f49"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#334155";
        g.beginPath(); g.moveTo(20, h); g.lineTo(70, 70); g.lineTo(120, h); g.fill();
        g.beginPath(); g.moveTo(180, h); g.lineTo(240, 60); g.lineTo(300, h); g.fill();
        g.fillStyle = "#ffffff"; g.beginPath(); g.arc(150, 120, 14, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#0f172a"; g.beginPath(); g.arc(150, 120, 6, 0, Math.PI * 2); g.fill();
      }
    },
    {
      id: "eve_scommessa_bar",
      cat: "eve",
      name: "Il Focaccino del Campione",
      sub: "Scommessa al Bar del Molo tra i vecchi giocatori",
      desc: "Due anziani scommettono un trancio di focaccia calda all'olio: chi riesce a centrare il cartello della fermata del bus senza far cadere il vaso di basilico della signora Pina?",
      stateMod: "Pressione da Bar: pubblico esigente.",
      gameMod: "Il tiro richiede dosaggio: non troppo forte né troppo debole.",
      draw(g, w, h) {
        g.fillStyle = "#451a03"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#78350f"; g.fillRect(20, 40, w - 40, h - 50);
        g.fillStyle = "#facc15"; g.fillRect(w / 2 - 25, 70, 50, 45); // focaccia
        g.fillStyle = "#15803d"; g.beginPath(); g.arc(w / 2 + 40, 85, 12, 0, Math.PI * 2); g.fill(); // basilico
      }
    },
    {
      id: "eve_sfida_ombra",
      cat: "eve",
      name: "Il Duello del Crepuscolo",
      sub: "Una sagoma sconosciuta sfida il tuo Campione",
      desc: "Appena il sole scende dietro il promontorio, un ragazzo con una giacca scura pianta due sassi per terra e lancia una sfida a tiri dal dischetto a specchio.",
      stateMod: "Concentrazione da Duello.",
      gameMod: "Il portiere intuisce la prima direzione: serve variare.",
      draw(g, w, h) {
        const gr = g.createLinearGradient(0, 0, 0, h);
        gr.addColorStop(0, "#4a044e"); gr.addColorStop(1, "#f97316");
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = "#0f172a";
        g.beginPath(); g.arc(w / 2, 70, 22, 0, Math.PI * 2); g.fill();
        g.fillRect(w / 2 - 20, 92, 40, 60);
      }
    },
    {
      id: "sfi_traversa_faro",
      cat: "sfi",
      name: "Il Rintocco sul Ferro del Faro",
      sub: "Colpisci la ringhiera d'ottone con precisione millimetrica",
      desc: "Baciccia chiude gli occhi e attende il suono: tre tentativi per far vibrare il ferro del faro e dimostrare il tocco di velluto.",
      stateMod: "Ascolto del Ferro.",
      gameMod: "Minigioco del tempismo sulla barra a 3 zone.",
      draw(g, w, h) {
        g.fillStyle = "#0c4a6e"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#f8fafc"; g.fillRect(w / 2 - 16, 20, 32, h - 20); // faro
        g.fillStyle = "#dc2626"; g.fillRect(w / 2 - 16, 45, 32, 20);
        g.fillStyle = "#facc15"; g.beginPath(); g.arc(w / 2, 35, 12, 0, Math.PI * 2); g.fill();
      }
    },
    {
      id: "sfi_gabbia_uno_contro_uno",
      cat: "sfi",
      name: "Gabbia di Rete Zoppa",
      sub: "Duello ravvicinato a sponde metalliche",
      desc: "Dentro la recinzione arrugginita: la palla non esce mai, le sponde sono vive e vince chi trova l'anticipo secco.",
      stateMod: "Respiro Corto: scontro ravvicinato.",
      gameMod: "Tre scambi rapidi a tempo per superare la guardia.",
      draw(g, w, h) {
        g.fillStyle = "#1e293b"; g.fillRect(0, 0, w, h);
        g.strokeStyle = "rgba(56,189,248,0.4)"; g.lineWidth = 2;
        for (let x = 0; x < w; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
        for (let y = 0; y < h; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      }
    },
    {
      id: "sfi_slalom_cassette",
      cat: "sfi",
      name: "Lo Slalom delle Cassette",
      sub: "Dribbling tra il pesce fresco senza far cadere nulla",
      desc: "Il porto è pieno di cassette di triglie e acciughe appena scaricate. Conduci il pallone a slalom senza sfiorare le cassette dei pescatori.",
      stateMod: "Equilibrio di Caviglia.",
      gameMod: "Sequenza di tocchi alternati destra/sinistra.",
      draw(g, w, h) {
        g.fillStyle = "#334155"; g.fillRect(0, 0, w, h);
        for (let i = 0; i < 4; i++) {
          g.fillStyle = "#78350f"; g.fillRect(40 + i * 65, 70, 35, 25);
          g.fillStyle = "#94a3b8"; g.fillRect(44 + i * 65, 73, 27, 8); // pesci
        }
      }
    },
    {
      id: "twi_cane_portuale",
      cat: "twi",
      name: "«Arriva Birbante!»",
      sub: "Il meticcio del porto piomba sulla palla",
      desc: "All'improvviso un cane con un foulard rosso al collo salta sul campo abbaiando festoso e comincia a inseguire la traiettoria del pallone!",
      stateMod: "Scompiglio Comico sul Molo.",
      gameMod: "Un ostacolo dinamico si muove sul campo di tiro.",
      draw(g, w, h) {
        g.fillStyle = "#14532d"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#b45309";
        g.beginPath(); g.ellipse(w / 2, h / 2, 30, 18, 0, 0, Math.PI * 2); g.fill(); // corpo
        g.beginPath(); g.arc(w / 2 + 25, h / 2 - 10, 14, 0, Math.PI * 2); g.fill(); // testa
        g.fillStyle = "#dc2626"; g.fillRect(w / 2 + 15, h / 2 - 2, 8, 12); // foulard
      }
    },
    {
      id: "twi_blackout_totale",
      cat: "twi",
      name: "Il Generatore Salta!",
      sub: "Buio improvviso e fascio rotante del faro",
      desc: "Un ronzio e si spengono tutte le luci del molo. Resta solo la luce periodica del faro: bisogna calciare nell'istante esatto in cui il raggio illumina la porta.",
      stateMod: "Fisica Notturna a Scatti.",
      gameMod: "Si calcia solo durante il lampo di luce.",
      draw(g, w, h) {
        g.fillStyle = "#020617"; g.fillRect(0, 0, w, h);
        g.fillStyle = "rgba(250,204,21,0.25)";
        g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, 20); g.lineTo(w, h - 20); g.fill();
      }
    },
    {
      id: "twi_folata_maestrale",
      cat: "twi",
      name: "Raffica Improvvisa di Maestrale",
      sub: "Folate imprevedibili a picco dal promontorio",
      desc: "Una folata improvvisa scende a picco dalla scogliera, sollevando schiuma e muovendo la traiettoria del pallone a zig-zag nell'aria.",
      stateMod: "Sguardo controvento: il Campione deve calibrare la traiettoria.",
      gameMod: "La barra di mira oscilla rapidamente cambiando senso di marcia.",
      draw(g, w, h) {
        g.fillStyle = "#0c4a6e"; g.fillRect(0, 0, w, h);
        g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 2.5;
        for (let i = 0; i < 5; i++) {
          g.beginPath();
          g.moveTo(20, 30 + i * 22);
          g.bezierCurveTo(80, 20 + i * 22, 140, 45 + i * 22, w - 30, 25 + i * 22);
          g.stroke();
        }
      }
    },
    {
      id: "rew_borsa_cuoio",
      cat: "rew",
      name: "Il Borsone del Vecchio Capitano",
      sub: "Cimeli dimenticati sotto la banchina",
      desc: "Una borsa di cuoio impregnata di sale: contiene un distintivo d'epoca, vecchie fotografie e la casacca storica della Rondine del 1968.",
      stateMod: "Nostalgia Vincente.",
      gameMod: "Sblocca una divisa retrò e 120 monete per il borgo.",
      reward: { coins: 120, cos: "sm_strisce" },
      draw(g, w, h) {
        g.fillStyle = "#1e1b4b"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#78350f"; g.fillRect(w / 2 - 40, h / 2 - 25, 80, 50);
        g.fillStyle = "#facc15"; g.fillRect(w / 2 - 10, h / 2 - 6, 20, 12); // fibbia
        g.strokeStyle = "#451a03"; g.lineWidth = 3; g.strokeRect(w / 2 - 40, h / 2 - 25, 80, 50);
      }
    },
    {
      id: "rew_focaccia_calda",
      cat: "rew",
      name: "Il Premio del Panettiere",
      sub: "Tranci caldi all'olio per tutto il gruppo",
      desc: "La signora del forno affacciata alla finestra batte le mani e porge una teglia fumante di focaccia croccante con sale grosso e rosmarino.",
      stateMod: "Ristoro Immediato e Morale alle Stelle.",
      gameMod: "Cancella ogni fatica e regala 60 monete.",
      reward: { coins: 60, cos: "cappellino" },
      draw(g, w, h) {
        g.fillStyle = "#7c2d12"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#fef08a"; g.fillRect(30, 40, w - 60, h - 70);
        g.fillStyle = "#d97706";
        for (let x = 45; x < w - 50; x += 30) {
          for (let y = 55; y < h - 45; y += 25) { g.beginPath(); g.arc(x, y, 6, 0, Math.PI * 2); g.fill(); }
        }
      }
    },
    {
      id: "rew_moneta_oro_antica",
      cat: "rew",
      name: "Il Marengo d'Oro del Porto",
      sub: "Moneta storica della fondazione del Borgo",
      desc: "Una moneta bronzea e dorata riemersa dalla sabbia della vecchia cala, incisa con il simbolo dell'ala di rondine e il motto dei marinai.",
      stateMod: "Benedizione del Mare: rispetto dai veterani del porto.",
      gameMod: "Conferisce 150 monete e la maglia speciale dorata nel Guardaroba.",
      reward: { coins: 150, cos: "oro" },
      draw(g, w, h) {
        g.fillStyle = "#0f172a"; g.fillRect(0, 0, w, h);
        g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(w / 2, h / 2, 38, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#fef08a"; g.beginPath(); g.arc(w / 2, h / 2, 33, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#b45309"; g.beginPath(); g.arc(w / 2, h / 2, 28, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#fef08a"; g.font = "bold 20px serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("🕊️", w / 2, h / 2);
      }
    }
  ];

  const BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

  // Iniezione CSS dedicato
  function injectCss() {
    if (document.getElementById("scStoryCardsStyle")) return;
    const st = document.createElement("style");
    st.id = "scStoryCardsStyle";
    st.textContent = `
.scOv{position:fixed;inset:0;background:rgba(7,11,22,.96);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'M PLUS Rounded 1c',system-ui,sans-serif;color:#f8fafc;padding:10px;box-sizing:border-box}
.scWrap{width:min(440px,100%);max-height:92vh;background:#0f172a;border:2px solid #f97316;border-radius:18px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 12px 34px rgba(0,0,0,.85)}
.scBar{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#1e293b;border-bottom:2px solid #334155}
.scBar h2{margin:0;font-size:16px;font-weight:900;color:#f97316;letter-spacing:.5px;display:flex;align-items:center;gap:6px}
.scBar button.scClose{background:none;border:none;color:#94a3b8;font-size:20px;cursor:pointer;padding:4px 8px;border-radius:6px}
.scBar button.scClose:hover{color:#fff;background:#334155}
.scBody{padding:14px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.scBtnRow{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.scBtn{background:linear-gradient(#ea580c,#c2410c);color:#fff;border:none;border-radius:12px;padding:12px 14px;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 3px 8px rgba(234,88,12,.4);text-align:center;display:flex;flex-direction:column;align-items:center;gap:2px}
.scBtn small{font-size:11px;font-weight:400;opacity:.85}
.scBtn.sec{background:#1e293b;border:1.5px solid #475569;box-shadow:none}
.scBtn.sec:hover{background:#334155}
.scBtn.gold{background:linear-gradient(#f59e0b,#d97706);color:#0f172a;box-shadow:0 3px 8px rgba(245,158,11,.4)}
.scCardBox{border:2px solid #38bdf8;border-radius:14px;overflow:hidden;background:#020617;display:flex;flex-direction:column}
.scCardCv{width:100%;height:140px;display:block}
.scCardInfo{padding:10px;font-size:12px;line-height:1.45;color:#cbd5e1}
.scCardInfo b{font-size:14px;color:#38bdf8;display:block;margin-bottom:2px}
.scCardInfo em{font-size:11px;color:#facc15;display:block;margin-bottom:6px}
.scModBox{background:#1e293b;border-left:3px solid #f97316;padding:8px 10px;border-radius:0 8px 8px 0;font-size:11.5px;color:#fdba74}
.scTimingBar{position:relative;width:100%;height:28px;background:#1e293b;border:2px solid #475569;border-radius:8px;overflow:hidden;margin:8px 0}
.scZone{position:absolute;top:0;bottom:0;background:#22c55e}
.scCenter{position:absolute;top:0;bottom:0;background:#facc15}
.scCursor{position:absolute;top:0;bottom:0;width:5px;background:#fff;box-shadow:0 0 8px #fff}
.scStamp{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:900;text-transform:uppercase}
.scStamp.oro{background:#facc15;color:#0f172a}
.scStamp.argento{background:#cbd5e1;color:#0f172a}
.scStamp.bronzo{background:#b45309;color:#fff}
.scGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px}
.scThumb{border:1.5px solid #334155;border-radius:10px;background:#020617;padding:6px;cursor:pointer;text-align:center;font-size:11px}
.scThumb.seen{border-color:#38bdf8}
.scThumb.unseen{opacity:.4;filter:grayscale(1)}
`;
    document.head.appendChild(st);
  }

  let activeOv = null;
  function closeOv() {
    if (activeOv) {
      activeOv.remove();
      activeOv = null;
    }
  }

  function shell(title, onBack) {
    injectCss();
    closeOv();
    const ov = document.createElement("div");
    ov.className = "scOv";
    ov.innerHTML = `
      <div class="scWrap">
        <div class="scBar">
          <h2>🎴 ${esc(title)}</h2>
          <button type="button" class="scClose" aria-label="Chiudi">✕</button>
        </div>
        <div class="scBody"></div>
      </div>
    `;
    ov.querySelector(".scClose").onclick = () => {
      closeOv();
      if (typeof onBack === "function") onBack();
    };
    document.body.appendChild(ov);
    activeOv = ov;
    return ov.querySelector(".scBody");
  }

  // ---------------------------------------------------------------- SCHERMATA PRINCIPALE
  function open(onBack) {
    const body = shell("Cronache del Molo · Carte", onBack);
    const rec = loadRec();
    const totalSeen = Object.keys(rec.seen).length;

    body.innerHTML = `
      <p style="font-size:13px;line-height:1.5;color:#cbd5e1;margin:0;">
        Benvenuto sul molo di Punta Rondine. Estrai una mano di 5 carte narrative: una storia breve, un bivio e una sfida per guadagnare monete e trofei!
      </p>
      <div style="background:#1e293b;padding:10px 12px;border-radius:10px;display:flex;justify-content:space-between;font-size:12px;">
        <span>Storie vissute: <b>${rec.runsTotal}</b></span>
        <span>Vittorie: <b style="color:#facc15;">${rec.runsWon}</b></span>
        <span>Carte trovate: <b>${totalSeen}/${CARDS.length}</b></span>
      </div>
      <div class="scBtnRow">
        <button type="button" class="scBtn" id="scStartRun">
          <span>🃏 Estrai una Mano di 5 Carte</span>
          <small>Mini-storia autoconclusiva con bivio e prova</small>
        </button>
        <button type="button" class="scBtn sec" id="scOpenArchivio">
          <span>📖 Archivio delle Cronache</span>
          <small>Sfoglia le 18 carte narrative scoperte</small>
        </button>
      </div>
    `;

    body.querySelector("#scStartRun").onclick = () => startRun(onBack);
    body.querySelector("#scOpenArchivio").onclick = () => openArchivio(() => open(onBack));
  }

  // ---------------------------------------------------------------- GENERATORE DI RUN
  function pickRunCards() {
    const byCat = (c) => CARDS.filter((x) => x.cat === c);
    const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const cAmb = rnd(byCat("amb"));
    const cPg = rnd(byCat("pg"));
    const cEve = rnd(byCat("eve"));
    // 35% di probabilità di avere un twist prima della sfida
    const hasTwist = Math.random() < 0.35;
    const cTwist = hasTwist ? rnd(byCat("twi")) : null;
    const cSfi = rnd(byCat("sfi"));
    const cRew = rnd(byCat("rew"));

    return {
      amb: cAmb,
      pg: cPg,
      eve: cEve,
      twist: cTwist,
      sfi: cSfi,
      rew: cRew,
      step: 0
    };
  }

  function startRun(onBack) {
    const run = pickRunCards();
    const rec = loadRec();
    rec.runsTotal++;
    saveRec(rec);

    renderRunStep(run, onBack);
  }

  function renderRunStep(run, onBack) {
    const body = shell("Cronache del Molo · Evento", () => open(onBack));
    const rec = loadRec();

    // Registra come viste le carte pescate
    [run.amb, run.pg, run.eve, run.sfi, run.rew, run.twist].filter(Boolean).forEach((c) => {
      rec.seen[c.id] = (rec.seen[c.id] || 0) + 1;
    });
    saveRec(rec);

    if (run.step === 0) {
      // Step 1: Ambientazione & Incontro
      playSound("card");
      body.innerHTML = `
        <div class="scCardBox">
          <canvas class="scCardCv" width="320" height="140"></canvas>
          <div class="scCardInfo">
            <b>${esc(run.amb.name)}</b>
            <em>${esc(run.amb.sub)}</em>
            ${esc(run.amb.desc)}
          </div>
        </div>
        <div class="scModBox">
          <b>Incontro:</b> ${esc(run.pg.name)} — ${esc(run.pg.sub)}.<br>
          <i>«${esc(run.pg.desc)}»</i>
        </div>
        <div class="scBtnRow">
          <button type="button" class="scBtn" id="scStep1Next">
            Continua ▸ <small>Ascolta l'accaduto</small>
          </button>
        </div>
      `;
      const cv = body.querySelector(".scCardCv");
      run.amb.draw(cv.getContext("2d"), 320, 140);

      body.querySelector("#scStep1Next").onclick = () => {
        run.step = 1;
        renderRunStep(run, onBack);
      };
    } else if (run.step === 1) {
      // Step 2: L'Evento e la Decisione del Giocatore
      playSound("card");
      body.innerHTML = `
        <div class="scCardBox">
          <canvas class="scCardCv" width="320" height="140"></canvas>
          <div class="scCardInfo">
            <b>${esc(run.eve.name)}</b>
            <em>${esc(run.eve.sub)}</em>
            ${esc(run.eve.desc)}
          </div>
        </div>
        <div class="scModBox">
          <b>Modificatore di Stato:</b> ${esc(run.eve.stateMod)}<br>
          <b>Effetto in campo:</b> ${esc(run.eve.gameMod)}
        </div>
        <p style="font-size:12.5px;font-weight:800;color:#facc15;margin:4px 0;">Cosa decidi di fare?</p>
        <div class="scBtnRow">
          <button type="button" class="scBtn" id="scChoiceA">
            🎯 Calcia d'istinto di prima intenzione!
            <small>Punta tutto sulla reattività immediata</small>
          </button>
          <button type="button" class="scBtn sec" id="scChoiceB">
            📐 Studia il rimbalzo e calibra la traiettoria
            <small>Usa la precisione per aggirare l'ostacolo</small>
          </button>
        </div>
      `;
      const cv = body.querySelector(".scCardCv");
      run.eve.draw(cv.getContext("2d"), 320, 140);

      const doChoice = (ch) => {
        run.choice = ch;
        run.step = 2;
        renderRunStep(run, onBack);
      };
      body.querySelector("#scChoiceA").onclick = () => doChoice("A");
      body.querySelector("#scChoiceB").onclick = () => doChoice("B");
    } else if (run.step === 2) {
      // Step 3: Sfida di Tempismo (con eventuale Twist)
      playSound("card");
      let twistHtml = "";
      if (run.twist) {
        twistHtml = `
          <div class="scModBox" style="border-color:#38bdf8;color:#7dd3fc;margin-bottom:6px;">
            <b>COLPO DI SCENA: ${esc(run.twist.name)}!</b><br>
            ${esc(run.twist.desc)}
          </div>
        `;
      }

      body.innerHTML = `
        ${twistHtml}
        <div class="scCardBox">
          <div class="scCardInfo">
            <b>SFIDA: ${esc(run.sfi.name)}</b>
            <em>${esc(run.sfi.sub)}</em>
            ${esc(run.sfi.desc)}
          </div>
        </div>
        <p style="font-size:12px;color:#94a3b8;margin:4px 0;text-align:center;">
          Premi <b>«CALCIA ORA!»</b> quando la barra bianca è nella zona colorata!
        </p>
        <div class="scTimingBar" id="scTimingBar">
          <div class="scZone" id="scZone"></div>
          <div class="scCenter" id="scCenter"></div>
          <div class="scCursor" id="scCursor"></div>
        </div>
        <div class="scBtnRow">
          <button type="button" class="scBtn gold" id="scActionBtn">⚽ CALCIA ORA!</button>
        </div>
      `;

      // Logica del tempismo
      const bar = body.querySelector("#scTimingBar");
      const cursor = body.querySelector("#scCursor");
      const zoneEl = body.querySelector("#scZone");
      const centerEl = body.querySelector("#scCenter");
      const actBtn = body.querySelector("#scActionBtn");

      // Parametri zona
      const zoneW = run.choice === "B" ? 0.35 : 0.26;
      const zoneLeft = 0.25 + Math.random() * 0.35;
      const centerW = 0.08;
      const centerLeft = zoneLeft + (zoneW - centerW) / 2;

      zoneEl.style.left = `${zoneLeft * 100}%`;
      zoneEl.style.width = `${zoneW * 100}%`;
      centerEl.style.left = `${centerLeft * 100}%`;
      centerEl.style.width = `${centerW * 100}%`;

      let pos = 0, dir = 1, raf = 0, stopped = false;
      const spd = run.twist ? 0.024 : 0.018;

      const loop = () => {
        if (stopped || !body.isConnected) return;
        pos += dir * spd;
        if (pos >= 1) { pos = 1; dir = -1; }
        else if (pos <= 0) { pos = 0; dir = 1; }
        cursor.style.left = `${pos * 100}%`;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      actBtn.onclick = () => {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(raf);
        playSound("hit");

        let score = 1; // 1 = fuori, 2 = buono, 3 = perfetto
        if (pos >= centerLeft && pos <= centerLeft + centerW) score = 3;
        else if (pos >= zoneLeft && pos <= zoneLeft + zoneW) score = 2;

        run.score = score;
        actBtn.disabled = true;

        setTimeout(() => {
          run.step = 3;
          renderRunStep(run, onBack);
        }, 600);
      };
    } else if (run.step === 3) {
      // Step 4: Epilogo & Ricompensa
      const win = run.score >= 2;
      const perfect = run.score === 3;
      if (win) {
        playSound("win");
        rec.runsWon++;
      }
      const stampType = perfect ? "oro" : win ? "argento" : "bronzo";
      rec.stamps[run.rew.id] = stampType;
      rec.stamps[run.sfi.id] = stampType;
      saveRec(rec);

      const coinsWon = perfect ? run.rew.reward.coins + 30 : win ? run.rew.reward.coins : 20;
      addCoins(coinsWon);
      if (win && run.rew.reward.cos) unlockCosmetic(run.rew.reward.cos);

      body.innerHTML = `
        <div style="text-align:center;padding:10px 0;">
          <div style="font-size:32px;margin-bottom:6px;">${perfect ? "🌟" : win ? "🏆" : "💨"}</div>
          <h3 style="margin:0;font-size:18px;color:${win ? "#facc15" : "#94a3b8"};">
            ${perfect ? "RINTOCCO PERFETTO D'ORO!" : win ? "PROVA SUPERATA CON SUCCESSO!" : "TIRO SBILENCO... SARÀ PER LA PROSSIMA!"}
          </h3>
          <p style="font-size:12.5px;color:#cbd5e1;line-height:1.45;margin:8px 0 14px;">
            ${perfect
              ? `Una traiettoria magistrale! La folla sul molo applaude e il trofeo è tuo con sigillo d'Oro.`
              : win
              ? `Un tiro solido e ben calibrato! L'evento si conclude tra i sorrisi e le pacche sulle spalle.`
              : `Il pallone finisce di poco a lato, ma la risata generale stempera la tensione. Il Borgo apprezza il coraggio.`}
          </p>
        </div>
        <div class="scCardBox">
          <canvas class="scCardCv" width="320" height="120"></canvas>
          <div class="scCardInfo">
            <b>RICOMPENSA: ${esc(run.rew.name)}</b>
            <em>${esc(run.rew.sub)}</em>
            ${esc(run.rew.desc)}
          </div>
        </div>
        <div style="background:#1e293b;border-radius:10px;padding:10px;display:flex;justify-content:space-between;align-items:center;">
          <span>Bottino ottenuto:</span>
          <b>+${coinsWon} 🪙</b>
          <span class="scStamp ${stampType}">${stampType}</span>
        </div>
        <div class="scBtnRow">
          <button type="button" class="scBtn" id="scFinishRun">
            Torna al Salone ▸
          </button>
        </div>
      `;
      const cv = body.querySelector(".scCardCv");
      run.rew.draw(cv.getContext("2d"), 320, 120);

      body.querySelector("#scFinishRun").onclick = () => open(onBack);
    }
  }

  // ---------------------------------------------------------------- ARCHIVIO DELLE CRONACHE
  function openArchivio(onBack) {
    const body = shell("Archivio Cronache del Molo", onBack);
    const rec = loadRec();

    let filt = "all";
    const drawGrid = () => {
      const list = CARDS.filter((c) => filt === "all" || c.cat === filt);
      body.innerHTML = `
        <p style="font-size:12px;color:#94a3b8;margin:0;">
          Tutte le 18 carte narrative che puoi estrarre. Clicca su una carta scoperta per leggerne la storia e il dipinto.
        </p>
        <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;">
          ${[["all", "Tutte"], ["amb", "Luoghi"], ["pg", "Personaggi"], ["eve", "Eventi"], ["sfi", "Sfide"], ["twi", "Twist"], ["rew", "Premi"]].map(([k, l]) => `
            <button type="button" class="scBtn sec" data-f="${k}" style="padding:6px 10px;font-size:11px;border-radius:999px;flex:none;${filt === k ? "border-color:#f97316;color:#f97316;" : ""}">
              ${l}
            </button>
          `).join("")}
        </div>
        <div class="scGrid">
          ${list.map((c) => {
            const seen = !!rec.seen[c.id];
            const stamp = rec.stamps[c.id];
            return `
              <div class="scThumb ${seen ? "seen" : "unseen"}" data-cid="${c.id}">
                <div style="font-size:20px;margin-bottom:4px;">${c.cat === "amb" ? "🌅" : c.cat === "pg" ? "👤" : c.cat === "eve" ? "⚡" : c.cat === "sfi" ? "⚽" : c.cat === "twi" ? "🌀" : "🎁"}</div>
                <b>${seen ? esc(c.name) : "???"}</b>
                ${stamp ? `<div style="margin-top:4px;"><span class="scStamp ${stamp}">${stamp}</span></div>` : ""}
              </div>
            `;
          }).join("")}
        </div>
        <div class="scBtnRow">
          <button type="button" class="scBtn sec" id="scBackMain">◂ Torna al Menu Carte</button>
        </div>
      `;

      body.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { filt = b.dataset.f; drawGrid(); }));
      body.querySelectorAll("[data-cid]").forEach((el) => (el.onclick = () => {
        const c = BY_ID[el.dataset.cid];
        if (c && rec.seen[c.id]) showCardDetail(c, () => openArchivio(onBack));
      }));
      body.querySelector("#scBackMain").onclick = onBack;
    };

    drawGrid();
  }

  function showCardDetail(c, onBack) {
    const body = shell(c.name, onBack);
    body.innerHTML = `
      <div class="scCardBox">
        <canvas class="scCardCv" width="320" height="150"></canvas>
        <div class="scCardInfo">
          <b>${esc(c.name)}</b>
          <em>${esc(c.sub)}</em>
          <p style="margin:6px 0;">${esc(c.desc)}</p>
          ${c.stateMod ? `<div class="scModBox"><b>Effetto Narrativo:</b> ${esc(c.stateMod)}<br><b>Impatto Gameplay:</b> ${esc(c.gameMod)}</div>` : ""}
        </div>
      </div>
      <div class="scBtnRow">
        <button type="button" class="scBtn sec" id="scDetailBack">◂ Torna all'Archivio</button>
      </div>
    `;
    const cv = body.querySelector(".scCardCv");
    c.draw(cv.getContext("2d"), 320, 150);
    body.querySelector("#scDetailBack").onclick = onBack;
  }

  window.__storyCards = {
    open,
    openArchivio,
    startRun,
    CARDS
  };
})();
