// ================= v17 · LA CORSA DELLA PANDA 30 IN 3D =================
// Minigioco arcade 3D con Three.js:
// Mettiti al volante della leggendaria Panda 30 di Nonna per i caruggi e la strada costiera
// di Borgo Marino! Consegna le teglie di focaccia calda al campetto prima del fischio d'inizio!
(function () {
  const K_SAVE = "ali-di-rondine.panda3d";
  let scene, camera, renderer, animFrame = null;
  let pandaGroup, roadGroup, seaMesh;
  let obstacles = [];
  let pickups = [];
  let scenery = [];
  let isPlaying = false;
  let score = 0, distance = 0, focacce = 0;
  let carSpeed = 0.42;
  let carTargetX = 0;
  let returnCallback = null;
  let boostTimer = 0;

  function loadHighScore() {
    try {
      const d = JSON.parse(localStorage.getItem(K_SAVE));
      if (d && typeof d.highScore === "number") return d.highScore;
    } catch (e) {}
    return 0;
  }
  function saveHighScore(s) {
    try { localStorage.setItem(K_SAVE, JSON.stringify({ highScore: s })); } catch (e) {}
  }
  let bestScore = loadHighScore();

  function playCarHorn() {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const g = actx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(420, actx.currentTime);
      osc.frequency.setValueAtTime(390, actx.currentTime + 0.12);
      g.gain.setValueAtTime(0.25, actx.currentTime);
      g.gain.linearRampToValueAtTime(0, actx.currentTime + 0.35);
      osc.connect(g);
      g.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.35);
    } catch (e) {}
  }

  function initPandaScene(wrapper) {
    if (!window.THREE) return false;
    const THREE = window.THREE;
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }

    const rect = wrapper.getBoundingClientRect();
    const w = Math.max(300, Math.round(rect.width || wrapper.clientWidth || 320));
    const h = Math.max(200, Math.round(rect.height || wrapper.clientHeight || 260));

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.FogExp2(0x0a1628, 0.022);

    camera = new THREE.PerspectiveCamera(54, w / h, 0.1, 150);
    camera.position.set(0, 3.2, 7.8);
    camera.lookAt(0, 1.2, -6);

    if (renderer) {
      try { renderer.dispose(); } catch (e) {}
    }
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    wrapper.innerHTML = "";
    wrapper.appendChild(renderer.domElement);

    // Illuminazione serale ligure
    const amb = new THREE.AmbientLight(0xdbe9ff, 0.75);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xfffaed, 1.1);
    dir.position.set(10, 20, 10);
    scene.add(dir);

    buildRoad(THREE);
    buildPandaCar(THREE);

    // Resetta variabili gioco
    score = 0; distance = 0; focacce = 0;
    carSpeed = 0.45;
    carTargetX = 0;
    obstacles.forEach(o => scene.remove(o.mesh));
    pickups.forEach(p => scene.remove(p.mesh));
    obstacles = [];
    pickups = [];
    isPlaying = true;

    return true;
  }

  function buildPandaCar(THREE) {
    if (pandaGroup) scene.remove(pandaGroup);
    pandaGroup = new THREE.Group();
    pandaGroup.position.set(0, 0, 3.6);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf5eed7, roughness: 0.35, metalness: 0.1 }); // Crema vintage
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 }); // Plastica nera fascioni
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x162c4a, roughness: 0.2, transparent: true, opacity: 0.75 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff0aa });

    // Corpo principale squadrato della Panda 30
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 2.6), bodyMat);
    mainBody.position.y = 0.65;
    pandaGroup.add(mainBody);

    // Tetto e finestrini inclinati
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.62, 1.55), glassMat);
    cabin.position.set(0, 1.25, -0.15);
    pandaGroup.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 1.58), bodyMat);
    roof.position.set(0, 1.58, -0.15);
    pandaGroup.add(roof);

    // Portapacchi con le teglie di focaccia di Nonna!
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5 });
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 1.3), rackMat);
    rack.position.set(0, 1.64, -0.15);
    pandaGroup.add(rack);

    const trayMat = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.6 }); // Focaccia ligure dorata
    for (let i = 0; i < 3; i++) {
      const tray = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.09, 0.34), trayMat);
      tray.position.set(0, 1.72 + i * 0.07, -0.45 + i * 0.38);
      pandaGroup.add(tray);
    }

    // Fascioni neri laterali tipici della prima serie
    const sideTrimL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 2.6), trimMat);
    sideTrimL.position.set(-0.71, 0.52, 0);
    pandaGroup.add(sideTrimL);

    const sideTrimR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 2.6), trimMat);
    sideTrimR.position.set(0.71, 0.52, 0);
    pandaGroup.add(sideTrimR);

    // Fari anteriori gialli vintage
    const lightL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.08), lightMat);
    lightL.position.set(-0.48, 0.72, -1.32);
    pandaGroup.add(lightL);

    const lightR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.08), lightMat);
    lightR.position.set(0.48, 0.72, -1.32);
    pandaGroup.add(lightR);

    // Fari posteriori rossi
    const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.06), new THREE.MeshBasicMaterial({ color: 0xff2222 }));
    tailL.position.set(-0.52, 0.75, 1.31);
    pandaGroup.add(tailL);

    const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.06), new THREE.MeshBasicMaterial({ color: 0xff2222 }));
    tailR.position.set(0.52, 0.75, 1.31);
    pandaGroup.add(tailR);

    // 4 Ruote
    const wheelGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.2, 16);
    wheelGeo.rotateZ(Math.PI / 2);

    const wFL = new THREE.Mesh(wheelGeo, wheelMat);
    wFL.position.set(-0.68, 0.26, -0.85);
    pandaGroup.add(wFL);

    const wFR = new THREE.Mesh(wheelGeo, wheelMat);
    wFR.position.set(0.68, 0.26, -0.85);
    pandaGroup.add(wFR);

    const wRL = new THREE.Mesh(wheelGeo, wheelMat);
    wRL.position.set(-0.68, 0.26, 0.85);
    pandaGroup.add(wRL);

    const wRR = new THREE.Mesh(wheelGeo, wheelMat);
    wRR.position.set(0.68, 0.26, 0.85);
    pandaGroup.add(wRR);

    scene.add(pandaGroup);
  }

  function buildRoad(THREE) {
    roadGroup = new THREE.Group();

    // Carreggiata in pietra / asfalto antico
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x333b4d, roughness: 0.85 });
    const road = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 120), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -35);
    roadGroup.add(road);

    // Muretto in pietra lato mare (sinistra)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x7c7365, roughness: 0.9 });
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 120), wallMat);
    wallL.position.set(-3.7, 0.35, -35);
    roadGroup.add(wallL);

    // Case liguri colorate lato monte (destra)
    const houseColors = [0xe76f51, 0xf4a261, 0xe9c46a, 0x2a9d8f, 0xef476f];
    for (let z = -80; z <= 20; z += 12) {
      const col = houseColors[Math.abs(Math.floor(z / 12)) % houseColors.length];
      const houseMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.8 });
      const house = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.5 + Math.random() * 2, 8.5), houseMat);
      house.position.set(6.2, 2.7, z);
      roadGroup.add(house);
    }

    // Mare ligure
    const seaMat = new THREE.MeshBasicMaterial({ color: 0x103055, transparent: true, opacity: 0.85 });
    seaMesh = new THREE.Mesh(new THREE.PlaneGeometry(80, 140), seaMat);
    seaMesh.rotation.x = -Math.PI / 2;
    seaMesh.position.set(-45, -0.3, -35);
    roadGroup.add(seaMesh);

    scene.add(roadGroup);
  }

  function spawnObstacle() {
    if (!window.THREE || !isPlaying) return;
    const THREE = window.THREE;
    const laneX = [-2.1, 0, 2.1][Math.floor(Math.random() * 3)];
    const types = ["crate", "vespa", "cone"];
    const type = types[Math.floor(Math.random() * types.length)];

    let mesh;
    if (type === "crate") {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.85), new THREE.MeshStandardMaterial({ color: 0x8b5a2b }));
      mesh.position.set(laneX, 0.32, -60);
    } else if (type === "vespa") {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 1.4), new THREE.MeshStandardMaterial({ color: 0x3fa7ff }));
      mesh.position.set(laneX, 0.45, -60);
    } else {
      mesh = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0xff5500 }));
      mesh.position.set(laneX, 0.35, -60);
    }

    scene.add(mesh);
    obstacles.push({ mesh, x: laneX, z: -60, type });
  }

  function spawnPickup() {
    if (!window.THREE || !isPlaying) return;
    const THREE = window.THREE;
    const laneX = [-2.1, 0, 2.1][Math.floor(Math.random() * 3)];

    // Teglia di focaccia dorata fumante
    const mesh = new THREE.Group();
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.5), new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.4 }));
    mesh.add(tray);
    mesh.position.set(laneX, 0.5, -65);

    scene.add(mesh);
    pickups.push({ mesh, x: laneX, z: -65 });
  }

  function updateGameLoop() {
    animFrame = requestAnimationFrame(updateGameLoop);
    if (!renderer || !scene || !camera) return;

    if (isPlaying) {
      distance += carSpeed * 0.4;
      score += Math.round(carSpeed * 3);

      // Accelerazione graduale
      if (carSpeed < 0.85) carSpeed += 0.00015;

      // Movimento fluido laterale della Panda
      if (pandaGroup) {
        pandaGroup.position.x += (carTargetX - pandaGroup.position.x) * 0.14;
        pandaGroup.rotation.y = -(carTargetX - pandaGroup.position.x) * 0.18; // Derapata
        pandaGroup.rotation.z = -(carTargetX - pandaGroup.position.x) * 0.12; // Rollio
      }

      // Spawna ostacoli e focacce
      if (Math.random() < 0.024) spawnObstacle();
      if (Math.random() < 0.022) spawnPickup();

      // Muovi e controlla ostacoli
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.z += carSpeed;
        o.mesh.position.z = o.z;

        // Collisione con la Panda
        if (Math.abs(o.z - 3.6) < 1.3 && Math.abs(o.x - pandaGroup.position.x) < 0.95) {
          triggerCrash();
          return;
        }

        if (o.z > 12) {
          scene.remove(o.mesh);
          obstacles.splice(i, 1);
        }
      }

      // Muovi e controlla focacce
      for (let i = pickups.length - 1; i >= 0; i--) {
        const p = pickups[i];
        p.z += carSpeed;
        p.mesh.position.z = p.z;
        p.mesh.rotation.y += 0.04;

        if (Math.abs(p.z - 3.6) < 1.4 && Math.abs(p.x - pandaGroup.position.x) < 1.1) {
          // Raccolta focaccia!
          focacce++;
          score += 150;
          if (window.sfx) window.sfx("goal");
          showPandaToast("🥖 Focaccia raccolta! +150 Punti");
          scene.remove(p.mesh);
          pickups.splice(i, 1);
        } else if (p.z > 12) {
          scene.remove(p.mesh);
          pickups.splice(i, 1);
        }
      }

      // Aggiorna HUD
      const hudDist = document.getElementById("pandaHudDist");
      const hudScore = document.getElementById("pandaHudScore");
      const hudFoc = document.getElementById("pandaHudFoc");
      if (hudDist) hudDist.textContent = `${Math.floor(distance)} m`;
      if (hudScore) hudScore.textContent = `${score}`;
      if (hudFoc) hudFoc.textContent = `${focacce}`;
    }

    renderer.render(scene, camera);
  }

  function triggerCrash() {
    isPlaying = false;
    playCarHorn();
    if (score > bestScore) {
      bestScore = score;
      saveHighScore(bestScore);
    }
    const quotes = [
      "«Leo! Ho tirato il freno a mano sul marciapiede!»",
      "«Chi tocca la Panda lava le teglie per un mese!»",
      "«Mannaggia ai gozzi in mezzo alla strada! Riparti subito!»"
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];

    const overEl = document.getElementById("pandaGameOver");
    if (overEl) {
      overEl.innerHTML = `
        <div style="font-size:26px; font-family:var(--display, sans-serif); color:#ff4d5a; margin-bottom:6px;">💥 FRENATA COL FRENO A MANO!</div>
        <div style="font-size:13px; color:#ffd23f; font-weight:bold; margin-bottom:12px;">${q}</div>
        <div style="font-size:14px; color:#fff; margin-bottom:16px;">
          Punteggio: <b>${score}</b> · Focacce consegnate: <b>${focacce}</b><br>
          Record: <b>${bestScore}</b>
        </div>
        <div style="display:flex; gap:10px; justify-content:center;">
          <button type="button" id="pandaRetryBtn" style="background:#b3202c; color:#fff; border:1.5px solid #ff4d5a; border-radius:8px; padding:10px 18px; font-weight:bold; cursor:pointer;">🔄 Rigioca subito</button>
          <button type="button" id="pandaExitBtn" style="background:#1b2e4b; color:#fff; border:1.5px solid #3fa7ff; border-radius:8px; padding:10px 18px; font-weight:bold; cursor:pointer;">✕ Esci</button>
        </div>
      `;
      overEl.style.display = "flex";
      overEl.querySelector("#pandaRetryBtn").onclick = () => {
        overEl.style.display = "none";
        const wrap = document.getElementById("pandaCanvasWrapper");
        initPandaScene(wrap);
      };
      overEl.querySelector("#pandaExitBtn").onclick = closePanda3D;
    }
  }

  function showPandaToast(msg) {
    const t = document.getElementById("pandaToast");
    if (!t) return;
    t.textContent = msg;
    t.style.opacity = "1";
    setTimeout(() => { t.style.opacity = "0"; }, 1200);
  }

  function openPanda3D(onBack) {
    returnCallback = onBack;
    let modal = document.getElementById("panda3dModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "panda3dModal";
      modal.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        background: #060b14; display: none; flex-direction: column;
        color: #fff; font-family: var(--body, sans-serif); user-select: none;
      `;
      modal.innerHTML = `
        <!-- Top bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#0f1c30; border-bottom:2px solid var(--gold); flex-shrink:0;">
          <div style="font-family:var(--display, sans-serif); color:var(--gold); font-size:15px; display:flex; align-items:center; gap:6px;">
            <span>🚗 LA CORSA DELLA PANDA 30</span>
            <span style="font-size:11px; color:var(--dim); font-weight:normal;">(Nonna al volante)</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" id="pandaHornBtn" style="background:#f4a261; color:#1b1b1b; border:1.5px solid #ffd23f; border-radius:6px; padding:4px 10px; font-weight:bold; font-size:12px; cursor:pointer;">📯 Clacson</button>
            <button type="button" id="pandaCloseBtn" style="background:#b3202c; color:#fff; border:1.5px solid #ff4d5a; border-radius:6px; padding:4px 10px; font-weight:bold; font-size:12px; cursor:pointer;">✕ Esci</button>
          </div>
        </div>

        <!-- HUD -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 14px; background:#091322; border-bottom:1px solid rgba(255,255,255,0.12); font-size:12px;">
          <div>Distanza: <b id="pandaHudDist" style="color:#70b5ff;">0 m</b></div>
          <div>Focacce: <b id="pandaHudFoc" style="color:var(--gold);">0</b></div>
          <div>Punti: <b id="pandaHudScore" style="color:#2f9e55;">0</b></div>
        </div>

        <!-- Canvas 3D -->
        <div id="pandaCanvasWrapper" style="flex:1; width:100%; position:relative; overflow:hidden;">
          <div id="pandaToast" style="position:absolute; top:12px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.75); color:#ffd23f; padding:4px 12px; border-radius:12px; font-size:12px; font-weight:bold; pointer-events:none; opacity:0; transition:opacity 0.2s ease;"></div>
          
          <div id="pandaGameOver" style="position:absolute; inset:0; background:rgba(10,15,25,0.92); display:none; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:20px; z-index:15;"></div>
        </div>

        <!-- Controlli Tattili Slalom -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; padding:10px 14px calc(10px + env(safe-area-inset-bottom, 0px)); background:#0b1526; border-top:1.5px solid rgba(255,255,255,0.15);">
          <button type="button" id="pandaLeftBtn" style="background:#14243d; color:#fff; border:1.5px solid rgba(255,255,255,0.25); border-radius:10px; padding:12px; font-size:22px; cursor:pointer; font-weight:bold;">◂ SX</button>
          <button type="button" id="pandaCenterBtn" style="background:#14243d; color:#fff; border:1.5px solid rgba(255,255,255,0.25); border-radius:10px; padding:12px; font-size:14px; cursor:pointer; font-weight:bold;">▲ Centro</button>
          <button type="button" id="pandaRightBtn" style="background:#14243d; color:#fff; border:1.5px solid rgba(255,255,255,0.25); border-radius:10px; padding:12px; font-size:22px; cursor:pointer; font-weight:bold;">DX ▸</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#pandaLeftBtn").onclick = () => { carTargetX = -2.1; };
      modal.querySelector("#pandaCenterBtn").onclick = () => { carTargetX = 0; };
      modal.querySelector("#pandaRightBtn").onclick = () => { carTargetX = 2.1; };
      modal.querySelector("#pandaHornBtn").onclick = playCarHorn;
      modal.querySelector("#pandaCloseBtn").onclick = closePanda3D;

      window.addEventListener("keydown", (e) => {
        if (!modal || modal.style.display !== "flex") return;
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") carTargetX = Math.max(-2.1, carTargetX - 2.1);
        else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") carTargetX = Math.min(2.1, carTargetX + 2.1);
        else if (e.key === " " || e.key === "h" || e.key === "H") playCarHorn();
      });
    }

    modal.style.display = "flex";
    const wrapper = document.getElementById("pandaCanvasWrapper");
    initPandaScene(wrapper);
    updateGameLoop();
  }

  function closePanda3D() {
    isPlaying = false;
    const modal = document.getElementById("panda3dModal");
    if (modal) modal.style.display = "none";
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    if (returnCallback && typeof returnCallback === "function") {
      returnCallback();
    }
  }

  window.openPanda3D = openPanda3D;
  window.closePanda3D = closePanda3D;
})();
