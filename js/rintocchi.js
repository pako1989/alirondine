// js/rintocchi.js - «I CENTO RINTOCCHI» · Il motore di partita originale di «La Notte dei Cento Rintocchi»
// Partita di calcio notturna sul sagrato lastricato di ciottoli di Rocca Campanaria:
//  - Il Battito del Campanile (Rintocco DIN-DON): il grande orologio monumentale scandisce i secondi;
//    al momento del rintocco, il frastuono delle campane copre ogni rumore e stordisce il portiere!
//  - Il Rintoccometro (Sospettometro): i contrasti rumorosi e i tiri sbilenchi allarmano il Maresciallo Cacace;
//    se raggiunge 100%, scatta la ronda dei Carabinieri e il pressing avversario raddoppia.
//  - Azioni dei Soliti Ignoti:
//      * Tiro a Scasso: rasoiata radente tra i ciottoli che coglie alla sprovvista la retroguardia.
//      * Finta del Fiasco: dribbling scanzonato con disorientamento del marcatore.
//      * Campanile d'Oro: super-pallonetto parabolico verso il cielo stellato che scende a foglia morta.
(function () {
  "use strict";
  if (window.__rintocchi) return;

  const W = 360, H = 210;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function snd(type) {
    const ctx = getAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    try {
      if (type === "bell") {
        // Rintocco maestoso di campana d'oro (due oscillatori armonici metallici + decadimento lungo)
        [440, 880, 1320].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.18 / (idx + 1), t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 1.85);
        });
      } else if (type === "kick") {
        // Calcio sordo sul cuoio
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      } else if (type === "whistle") {
        // Fischietto del Maresciallo
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1800, t);
        osc.frequency.setValueAtTime(2200, t + 0.08);
        osc.frequency.setValueAtTime(1900, t + 0.16);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      } else if (type === "goal") {
        // Tifo e doppio rintocco festoso
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, t + i * 0.08);
          gain.gain.setValueAtTime(0.15, t + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.005, t + i * 0.08 + 0.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.95);
        });
      }
    } catch (e) {}
  }

  let STATE = null;

  function start(opts) {
    const o = opts || {};
    const wrap = document.createElement("div");
    wrap.className = "rinOv";

    if (!document.getElementById("rinCss")) {
      const st = document.createElement("style");
      st.id = "rinCss";
      st.textContent = `
.rinOv { position:fixed; inset:0; z-index:9000; background:#0c0f1d; color:#f8fafc; font-family:'Trebuchet MS',serif,system-ui,sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:space-between; user-select:none; overflow:hidden; }
.rinOv header { width:100%; max-width:640px; display:flex; justify-content:space-between; align-items:center; padding:8px 14px; background:linear-gradient(180deg,#1e1b4b,#0f172a); border-bottom:2px solid #ca8a04; box-shadow:0 3px 10px rgba(0,0,0,.6); }
.rinOv .rinScore { font-size:20px; font-weight:900; letter-spacing:1px; color:#fde047; text-shadow:0 2px 4px #000; display:flex; align-items:center; gap:8px; }
.rinOv .rinMeter { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:800; color:#fcd34d; background:rgba(0,0,0,.45); padding:4px 8px; border-radius:4px; border:1px solid #ca8a04; }
.rinOv .meterBar { width:70px; height:8px; background:#334155; border-radius:3px; overflow:hidden; border:1px solid #64748b; }
.rinOv .meterFill { height:100%; background:linear-gradient(90deg,#eab308,#ef4444); transition:width .2s ease; width:0%; }
.rinOv .cvWrap { position:relative; width:100%; max-width:640px; display:flex; justify-content:center; align-items:center; flex:1; }
.rinOv canvas { width:100%; max-width:640px; height:auto; flex:none; border:2px solid #ca8a04; border-radius:6px; background:#18181b; box-shadow:0 8px 24px rgba(0,0,0,.8); aspect-ratio:360/210; }
.rinOv footer { width:100%; max-width:640px; padding:8px 12px; background:linear-gradient(0deg,#0f172a,#1e1b4b); border-top:2px solid #ca8a04; display:flex; flex-direction:column; gap:6px; }
.rinOv .rinMsg { min-height:22px; font-size:12.5px; text-align:center; font-weight:700; color:#fef08a; text-shadow:0 1px 2px #000; }
.rinOv .btnGrid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; }
.rinOv .rinBtn { background:linear-gradient(180deg,#854d0e,#713f12); border:1.5px solid #facc15; color:#fef08a; padding:8px 4px; border-radius:6px; font-weight:900; font-size:12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; box-shadow:0 3px 0 #3f2206; min-height:46px; }
.rinOv .rinBtn:active { transform:translateY(2px); box-shadow:none; }
.rinOv .rinBtn small { font-size:9.5px; color:#fef9c3; opacity:.85; font-weight:normal; }
.rinOv .bellTimer { font-size:11px; font-weight:900; color:#fde047; background:rgba(0,0,0,.6); padding:2px 8px; border-radius:10px; border:1px solid #eab308; display:flex; align-items:center; gap:4px; }
.rinOv .bellPulse { animation:rinBell 1s infinite alternate ease-in-out; }
@keyframes rinBell { from { transform:scale(1); } to { transform:scale(1.2) rotate(6deg); } }
.rinOv .ov { position:absolute; inset:0; background:rgba(15,23,42,.92); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:18px; text-align:center; z-index:20; border-radius:6px; animation:rinFadeIn .3s ease both; }
@keyframes rinFadeIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
.rinOv .ov h2 { font-size:22px; color:#facc15; margin:0 0 6px; text-transform:uppercase; text-shadow:0 2px 4px #000; }
.rinOv .ov p { font-size:13.5px; color:#e2e8f0; line-height:1.45; margin:6px 0 16px; max-width:440px; }
.rinOv .goB { background:linear-gradient(180deg,#ca8a04,#a16207); color:#fff; border:2px solid #fef08a; padding:10px 24px; font-size:14px; font-weight:900; border-radius:8px; cursor:pointer; box-shadow:0 4px 0 #713f12; text-transform:uppercase; }
.rinOv .goB:active { transform:translateY(2px); box-shadow:none; }
`;
      document.head.appendChild(st);
    }

    wrap.innerHTML = `
      <header>
        <div class="rinScore">
          <span style="color:${esc(o.usColor || "#ca8a04")}">${esc(o.us || "I Soliti Ignoti")}</span>
          <span id="rinScoreText">0 - 0</span>
          <span style="color:${esc(o.opp && o.opp.color ? o.opp.color : "#3b82f6")}">${esc(o.opp && o.opp.name ? o.opp.name : "I Rivali")}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="bellTimer" id="rinBellTimer"><span class="bellPulse">🔔</span> <span id="rinBellStatus">DIN...</span></div>
          <div class="rinMeter" title="Rintoccometro del Maresciallo">
            <span>🚨 ALLARME</span>
            <div class="meterBar"><div class="meterFill" id="rinMeterFill"></div></div>
          </div>
        </div>
      </header>
      <div class="cvWrap">
        <canvas id="rinCv" width="${W}" height="${H}"></canvas>
      </div>
      <footer>
        <div class="rinMsg" id="rinMsg">Tocca un'azione per iniziare la manovra sul sagrato!</div>
        <div class="btnGrid">
          <button type="button" class="rinBtn" id="btnScasso">
            <span>🗝️ TIRO A SCASSO</span>
            <small>Rasoiata radente</small>
          </button>
          <button type="button" class="rinBtn" id="btnFiasco">
            <span>🍷 FINTA DEL FIASCO</span>
            <small>Dribbla e disorienta</small>
          </button>
          <button type="button" class="rinBtn" id="btnCampanile">
            <span>🔔 CAMPANILE D'ORO</span>
            <small>Super-pallonetto al rintocco</small>
          </button>
        </div>
      </footer>
    `;

    document.body.appendChild(wrap);

    const cv = wrap.querySelector("#rinCv");
    const g = cv.getContext("2d");
    const totalTurns = o.turns || 5;

    const S = {
      turn: 1,
      totalTurns,
      a: 0,
      b: 0,
      meter: 15,
      bellTime: 0,
      bellPhase: "calm", // calm, chime, toll
      bellWindow: false,
      ball: { x: W * 0.35, y: H * 0.5, tx: W * 0.35, ty: H * 0.5, vx: 0, vy: 0, z: 0, vz: 0 },
      players: [
        { name: (o.hero && o.hero.name) || "Campione", x: 90, y: 105, col: o.usColor || "#ca8a04", role: "hero" },
        { name: "Tito", x: 130, y: 70, col: o.usColor || "#ca8a04", role: "mate" },
        { name: "Peppe", x: 120, y: 145, col: o.usColor || "#ca8a04", role: "mate" },
        { name: "Cacace", x: 230, y: 105, col: (o.opp && o.opp.color) || "#1e3a8a", role: "opp" },
        { name: "Difensore", x: 260, y: 65, col: (o.opp && o.opp.color) || "#1e3a8a", role: "opp" },
        { name: "Portiere", x: 325, y: 105, col: "#991b1b", role: "keeper" }
      ],
      effects: [],
      particles: [],
      msg: "La campana di Rocca Campanaria incomincia a rintoccare. Studia il tempo del rintocco!",
      busy: false,
      over: false
    };

    STATE = S;

    const fillEl = wrap.querySelector("#rinMeterFill");
    const scoreEl = wrap.querySelector("#rinScoreText");
    const msgEl = wrap.querySelector("#rinMsg");
    const bellTimerEl = wrap.querySelector("#rinBellTimer");
    const bellStatusEl = wrap.querySelector("#rinBellStatus");

    function updHUD() {
      fillEl.style.width = Math.min(100, Math.max(0, S.meter)) + "%";
      scoreEl.textContent = `${S.a} - ${S.b}`;
      msgEl.textContent = S.msg;
      if (S.bellWindow) {
        bellTimerEl.style.background = "#eab308";
        bellTimerEl.style.color = "#000";
        bellStatusEl.textContent = "DIN-DON! ORA!";
      } else {
        bellTimerEl.style.background = "rgba(0,0,0,.6)";
        bellTimerEl.style.color = "#fde047";
        bellStatusEl.textContent = `Rintocco ${S.turn}/${S.totalTurns}`;
      }
    }

    let animId = null;
    let frame = 0;
    let animActive = true;

    function loop() {
      if (!animActive) return;
      frame++;

      // Gestione del ciclo del rintocco (ogni 160 frame ~ 2.6s)
      const cycle = frame % 160;
      if (cycle >= 120 && cycle <= 155) {
        if (!S.bellWindow) {
          S.bellWindow = true;
          snd("bell");
          S.effects.push({ x: W * 0.5, y: 30, text: "🔔 DIN... DON!", col: "#fde047", life: 40 });
        }
      } else {
        S.bellWindow = false;
      }

      // Aggiornamento palla
      S.ball.x += (S.ball.tx - S.ball.x) * 0.12;
      S.ball.y += (S.ball.ty - S.ball.y) * 0.12;
      if (S.ball.z > 0 || S.ball.vz !== 0) {
        S.ball.z += S.ball.vz;
        S.ball.vz -= 0.35;
        if (S.ball.z <= 0) { S.ball.z = 0; S.ball.vz = 0; }
      }

      // Particelle
      for (let i = S.particles.length - 1; i >= 0; i--) {
        const p = S.particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) S.particles.splice(i, 1);
      }

      // Effetti testuali fluttuanti
      for (let i = S.effects.length - 1; i >= 0; i--) {
        const ef = S.effects[i];
        ef.y -= 0.5; ef.life--;
        if (ef.life <= 0) S.effects.splice(i, 1);
      }

      render();
      updHUD();
      animId = requestAnimationFrame(loop);
    }

    function render() {
      // Pavimentazione a ciottoli medievali del sagrato
      const grad = g.createRadialGradient(W * 0.5, H * 0.5, 30, W * 0.5, H * 0.5, W * 0.6);
      grad.addColorStop(0, "#27272a");
      grad.addColorStop(1, "#09090b");
      g.fillStyle = grad;
      g.fillRect(0, 0, W, H);

      // Disegno ciottoli e piastrelle a griglia irregolare
      g.strokeStyle = "rgba(113,113,122,0.22)";
      g.lineWidth = 1;
      for (let x = 15; x < W; x += 18) {
        g.beginPath();
        g.moveTo(x, 15);
        g.lineTo(x, H - 15);
        g.stroke();
      }
      for (let y = 15; y < H; y += 18) {
        g.beginPath();
        g.moveTo(15, y);
        g.lineTo(W - 15, y);
        g.stroke();
      }

      // Sagrato e linee di campo in gesso bianco consumato
      g.strokeStyle = "rgba(250,250,250,0.5)";
      g.lineWidth = 2;
      g.strokeRect(20, 20, W - 40, H - 40);
      g.beginPath();
      g.moveTo(W * 0.5, 20);
      g.lineTo(W * 0.5, H - 20);
      g.stroke();

      // Cerchio di centrocampo con rosone in pietra
      g.beginPath();
      g.arc(W * 0.5, H * 0.5, 34, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = "rgba(202,138,4,0.12)";
      g.fill();

      // Aree di rigore
      g.strokeRect(20, H * 0.5 - 35, 45, 70);
      g.strokeRect(W - 65, H * 0.5 - 35, 45, 70);

      // Porta avversaria (destra)
      g.fillStyle = "#713f12";
      g.fillRect(W - 22, H * 0.5 - 30, 4, 60);
      g.strokeStyle = "#ca8a04";
      g.lineWidth = 2.5;
      g.strokeRect(W - 22, H * 0.5 - 30, 4, 60);

      // Porta nostra (sinistra)
      g.fillRect(18, H * 0.5 - 30, 4, 60);
      g.strokeRect(18, H * 0.5 - 30, 4, 60);

      // Lampioni a gas agli angoli della piazza con alone caldo tremolante
      const flicker = Math.sin(frame * 0.15) * 2;
      [ [25, 25], [W - 25, 25], [25, H - 25], [W - 25, H - 25] ].forEach(([lx, ly]) => {
        const lg = g.createRadialGradient(lx, ly, 2, lx, ly, 18 + flicker);
        lg.addColorStop(0, "rgba(253,224,71,0.6)");
        lg.addColorStop(0.5, "rgba(234,179,8,0.2)");
        lg.addColorStop(1, "rgba(234,179,8,0)");
        g.fillStyle = lg;
        g.beginPath(); g.arc(lx, ly, 20, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#78350f";
        g.fillRect(lx - 2, ly - 2, 4, 4);
      });

      // Campanile stilizzato sullo sfondo in alto al centro
      g.fillStyle = "#1e293b";
      g.fillRect(W * 0.5 - 20, 2, 40, 18);
      g.fillStyle = S.bellWindow ? "#fde047" : "#ca8a04";
      g.beginPath();
      g.arc(W * 0.5, 11, S.bellWindow ? 7 : 5.5, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#451a03";
      g.lineWidth = 1;
      g.stroke();

      // Disegno Giocatori
      S.players.forEach((p) => {
        // Ombra
        g.fillStyle = "rgba(0,0,0,0.5)";
        g.beginPath();
        g.ellipse(p.x, p.y + 6, 7, 3, 0, 0, Math.PI * 2);
        g.fill();

        // Corpo
        g.fillStyle = p.col;
        g.beginPath();
        g.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = "#000";
        g.lineWidth = 1.2;
        g.stroke();

        // Testa
        g.fillStyle = "#fed7aa";
        g.beginPath();
        g.arc(p.x, p.y - 7, 4.5, 0, Math.PI * 2);
        g.fill();
        g.stroke();

        // Coppola o berretto
        g.fillStyle = p.role === "hero" ? "#78350f" : p.role === "opp" ? "#1e3a8a" : "#451a03";
        g.fillRect(p.x - 4, p.y - 12, 8, 3);

        // Nome
        g.fillStyle = "#f8fafc";
        g.font = "8.5px sans-serif";
        g.textAlign = "center";
        g.fillText(p.name, p.x, p.y - 14);
      });

      // Disegno Palla
      const bx = S.ball.x;
      const by = S.ball.y - S.ball.z;
      // Ombra palla
      g.fillStyle = `rgba(0,0,0,${Math.max(0.15, 0.5 - S.ball.z * 0.02)})`;
      g.beginPath();
      g.ellipse(S.ball.x, S.ball.y + 4, Math.max(2, 5 - S.ball.z * 0.1), Math.max(1, 2.5 - S.ball.z * 0.05), 0, 0, Math.PI * 2);
      g.fill();

      // Cuoio con cuciture
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(bx, by, 5, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#09090b";
      g.lineWidth = 1;
      g.stroke();
      g.fillStyle = "#09090b";
      g.fillRect(bx - 1.5, by - 1.5, 3, 3);

      // Particelle
      S.particles.forEach((p) => {
        g.fillStyle = p.col;
        g.fillRect(p.x, p.y, p.sz || 2, p.sz || 2);
      });

      // Effetti testuali
      S.effects.forEach((ef) => {
        g.fillStyle = ef.col;
        g.font = "bold 13px serif";
        g.textAlign = "center";
        g.fillText(ef.text, ef.x, ef.y);
      });
    }

    function spawnDust(x, y, col, n) {
      for (let i = 0; i < (n || 8); i++) {
        S.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          col: col || "#fde047",
          life: 20 + Math.random() * 15,
          sz: 2
        });
      }
    }

    function playAction(type) {
      if (S.busy || S.over) return;
      S.busy = true;
      snd("kick");

      const inSync = S.bellWindow;
      const hero = S.players[0];

      if (type === "scasso") {
        // Tiro a scasso: rasoiata
        hero.x += 15;
        S.ball.tx = W - 30;
        S.ball.ty = H * 0.5 + (Math.random() * 20 - 10);
        spawnDust(hero.x, hero.y, "#ca8a04", 10);

        if (inSync) {
          S.meter = Math.max(0, S.meter - 10);
          S.effects.push({ x: hero.x + 30, y: hero.y - 10, text: "SCASSO AL RINTOCCO! 🔔", col: "#fde047", life: 45 });
          setTimeout(() => goalResult(true, "Il tiro a scasso sfreccia radente tra i ciottoli mentre la campana copre lo schiocco: GOL PERFETTO!"), 600);
        } else {
          S.meter += 20;
          if (S.meter >= 90) {
            snd("whistle");
            setTimeout(() => goalResult(false, "Il Maresciallo Cacace sente lo schiocco e fischia la carica: il difensore mura il tiro a scasso!"), 600);
          } else {
            setTimeout(() => goalResult(Math.random() > 0.35, "Tiro a scasso potente! La sfera rimbalza su un ciottolo."), 600);
          }
        }
      } else if (type === "fiasco") {
        // Finta del fiasco: dribbling
        hero.y += (Math.random() > 0.5 ? 25 : -25);
        S.ball.tx = W * 0.65;
        S.ball.ty = hero.y;
        spawnDust(hero.x, hero.y, "#ef4444", 8);

        S.meter = Math.max(0, S.meter - 15);
        S.effects.push({ x: hero.x + 20, y: hero.y, text: "FINTA DEL FIASCO! 🍷", col: "#f87171", life: 40 });
        S.msg = "Finta del fiasco! I difensori inseguono l'ombra tra i portici.";

        setTimeout(() => {
          // Secondo tocco: conclusione
          snd("kick");
          S.ball.tx = W - 25;
          S.ball.ty = H * 0.5 + (Math.random() * 24 - 12);
          setTimeout(() => goalResult(Math.random() > 0.3, "Dalla finta nasce un corridoio pulito verso la porta!"), 500);
        }, 500);
      } else if (type === "campanile") {
        // Campanile d'oro: super pallonetto
        S.ball.tx = W - 25;
        S.ball.ty = H * 0.5 + (Math.random() * 10 - 5);
        S.ball.vz = 8;
        spawnDust(hero.x, hero.y, "#facc15", 14);

        if (inSync) {
          S.meter = 0;
          snd("bell");
          S.effects.push({ x: W * 0.5, y: 50, text: "CAMPANILE D'ORO PERFETTO! 🌟", col: "#fef08a", life: 55 });
          setTimeout(() => goalResult(true, "Pallonetto ad altissima quota! Scende a foglia morta nell'incrocio all'ultimo rintocco: CAPOLAVORO!"), 800);
        } else {
          S.meter += 25;
          setTimeout(() => goalResult(Math.random() > 0.45, "Il pallone sale verso il cielo stellato... rimbalzo imprevedibile!"), 700);
        }
      }
    }

    function goalResult(success, text) {
      if (success) {
        S.a++;
        snd("goal");
        spawnDust(W - 25, H * 0.5, "#fde047", 20);
        S.msg = `⚽ RETE! ${text}`;
      } else {
        S.msg = `❌ RESPINTO! ${text}`;
        // Possibile contropiede avversario se il rintoccometro è alto
        if (S.meter > 65 && Math.random() > 0.5) {
          S.b++;
          snd("whistle");
          S.msg += ` Attenzione: contropiede dei rivali approfittando del parapiglia!`;
        }
      }

      setTimeout(() => {
        S.turn++;
        if (S.turn > S.totalTurns) {
          endMatch();
        } else {
          // Reset posizioni
          S.ball.x = W * 0.35; S.ball.y = H * 0.5;
          S.ball.tx = W * 0.35; S.ball.ty = H * 0.5;
          S.ball.z = 0; S.ball.vz = 0;
          S.players[0].x = 90; S.players[0].y = 105;
          S.busy = false;
        }
      }, 1000);
    }

    function endMatch() {
      S.over = true;
      animActive = false;
      if (animId) cancelAnimationFrame(animId);

      const win = S.a > S.b;
      const tie = S.a === S.b;

      const ov = document.createElement("div");
      ov.className = "ov";
      ov.innerHTML = `
        <h2>${win ? "🏆 VITTORIA SUL SAGRATO!" : tie ? "⚖️ PAREGGIO AL CENTESIMO RINTOCCO!" : "🚨 ALLARME GENERALE!"}</h2>
        <p style="font-size:26px;font-weight:900;color:#facc15;margin:6px 0">${S.a} - ${S.b}</p>
        <p>${win ? "Hai beffato la ronda e infilato la porta avversaria col tempismo perfetto dei maestri campanari!" : tie ? "La campana ha suonato a distesa senza decretare padroni: una notte memorabile per tutta Rocca Campanaria." : "Il Maresciallo Cacace ha circondato il sagrato. Tocca riprovare con più tempismo al prossimo rintocco!"}</p>
        <button type="button" class="goB" id="btnRinClose">Concludi Partita ▸</button>
      `;
      wrap.appendChild(ov);

      ov.querySelector("#btnRinClose").onclick = () => {
        close();
        if (typeof o.done === "function") {
          o.done({ win, a: S.a, b: S.b, tie, quit: false });
        }
        if (typeof o.onDone === "function") {
          o.onDone({ win, a: S.a, b: S.b, tie, quit: false });
        }
      };
    }

    function close() {
      animActive = false;
      if (animId) cancelAnimationFrame(animId);
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      STATE = null;
    }

    // Eventi pulsanti
    wrap.querySelector("#btnScasso").onclick = () => playAction("scasso");
    wrap.querySelector("#btnFiasco").onclick = () => playAction("fiasco");
    wrap.querySelector("#btnCampanile").onclick = () => playAction("campanile");

    updHUD();
    loop();

    return { close };
  }

  window.__rintocchi = {
    start,
    state: () => STATE,
    stop: () => {
      const el = document.querySelector(".rinOv");
      if (el) el.remove();
      STATE = null;
    }
  };
})();
