// ================= v17 · STADIO DELLA RONDINE 3D (PRO ANIME ARENA) =================
// Arena 3D tridimensionale con Three.js:
// - Leo Moretti posizionato LATERALMENTE (porta e portiere 100% liberi e visibili)
// - Corsa e animazione di calcio atletico stile Captain Tsubasa / Inazuma Eleven
// - 3 Modalità di telecamera: Dinamica Anime, Mirino Diretto, Visuale Portiere
// - Cut-in manga drammatici, aure di energia, speedlines, traiettorie balistiche con scia
// - Barra di potenza con Sweet-Spot per tiri critici ad effetto
(function () {
  const K_SAVE = "ali-di-rondine.stadium3d";
  const GK_LIST = [
    { id: "nico", name: "Nico Ferri", team: "Rondine FC", skill: "Gatto Volante", diff: 1, color: 0x2f9e55, gloves: 0xffd23f, cap: true, power: 14, quote: "«Tira dove vuoi Leo, tanto arrivo dappertutto!»", move: "GATTO VOLANTEEE!" },
    { id: "sandro", name: "Sandro", team: "Gabbiani del Porto", skill: "Presa del Gabbiano", diff: 2, color: 0x3fa7ff, gloves: 0xffffff, cap: false, power: 19, quote: "«Il molo insegna a non avere paura dei palloni forti.»", move: "PRESA DEL GABBIANO!" },
    { id: "wagner", name: "Wagner", team: "Aquile di Milano", skill: "Muro d'Acciaio", diff: 3, color: 0x1d3fa3, gloves: 0xff4d5a, cap: false, power: 26, quote: "«La porta delle Aquile è sbarrata a chiave.»", move: "MURO D'ACCIAIO!" },
    { id: "ishikawa", name: "Ishikawa", team: "Giappone U19", skill: "Riflesso Zen", diff: 4, color: 0xf4f4f4, gloves: 0xb3202c, cap: false, power: 34, quote: "«Leggo la traiettoria prima ancora che il tuo piede tocchi la palla.»", move: "RIFLESSO ZEN!" },
    { id: "garnier", name: "Antoine Garnier", team: "Olympique Lumière", skill: "Guanto d'Oro", diff: 5, color: 0xffd23f, gloves: 0x14243d, cap: false, power: 45, quote: "«Benvenuto al livello dei campioni d'Europa, Moretti.»", move: "GUANTO D'ORO!" }
  ];

  function loadStats() {
    try {
      const d = JSON.parse(localStorage.getItem(K_SAVE));
      if (d && typeof d === "object") return d;
    } catch (e) {}
    return { goals: 0, shots: 0, streak: 0, maxStreak: 0, beaten: [] };
  }
  function saveStats(st) {
    try { localStorage.setItem(K_SAVE, JSON.stringify(st)); } catch (e) {}
  }

  let stats = loadStats();
  let activeGKIdx = 0;
  let scene, camera, renderer, animFrame = null;
  let ballMesh, ballShadow, keeperGroup, leoMesh, lighthouseBeam;
  let flagClothL, flagClothR, netMesh;
  let particles = [];
  let isShooting = false;
  let ballVel = { x: 0, y: 0, z: 0 };
  let ballCurve = 0;
  let keeperTargetX = 0, keeperTargetY = 1.3;
  let keeperState = "idle";
  let returnCallback = null;
  let isSpecialActive = false;
  let shakeIntensity = 0;
  let activeShooter = "leo"; // "leo" | "hero"

  function getCustomHero() {
    try {
      if (typeof window.heroLoad === "function") return window.heroLoad();
      const raw = localStorage.getItem("ali-di-rondine.eroe");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  // Telecamere
  let cameraMode = "anime"; // "anime" | "precision" | "keeper"
  let cameraPos = { x: 0, y: 1.85, z: 6.9 };
  let cameraTarget = { x: 0, y: 1.25, z: -2.8 };

  // Barra oscillante di potenza (Sweet Spot Anime)
  let powerOsc = 50;
  let powerDir = 1;
  let powerTimer = null;

  // Modalità Portiere (I Guantoni di Nico)
  let activeRole = "striker"; // "striker" | "keeper"
  let keeperIncomingTimer = null;
  let keeperTargetShot = null;
  const RIVALS = [
    { name: "Bruno Sabatini", move: "TIRO DI GRANITO!", color: "#ffd23f" },
    { name: "Kenji Arata", move: "VOLO DELL'AQUILA!", color: "#3fa7ff" },
    { name: "Jonas Keller", move: "BLITZ DI STURMWALD!", color: "#ff4d5a" },
    { name: "Toro Galli", move: "CARICA DEL TORO!", color: "#e84118" },
  ];
  let rivalIdx = 0;

  function playSound(type) {
    if (window.sfx) {
      try {
        if (type === "kick") window.sfx("kick");
        else if (type === "goal") window.sfx("goal");
        else if (type === "post") window.sfx("crowd");
      } catch (e) {}
    }
  }

  function startPowerLoop() {
    if (powerTimer) clearInterval(powerTimer);
    powerTimer = setInterval(() => {
      powerOsc += powerDir * 3.5;
      if (powerOsc >= 100) { powerOsc = 100; powerDir = -1; }
      else if (powerOsc <= 0) { powerOsc = 0; powerDir = 1; }
      const bar = document.getElementById("s3dPowerCursor");
      if (bar) bar.style.left = `${powerOsc}%`;
    }, 28);
  }

  function stopPowerLoop() {
    if (powerTimer) { clearInterval(powerTimer); powerTimer = null; }
  }

  // Texture procedurali per pallone ed erba
  function createSoccerBallTexture(THREE) {
    const cv = document.createElement("canvas");
    cv.width = 512; cv.height = 256;
    const c = cv.getContext("2d");
    c.fillStyle = "#fdfdfd";
    c.fillRect(0, 0, 512, 256);
    c.fillStyle = "#162032";

    const pentagons = [
      [128, 64], [384, 64], [256, 128], [128, 192], [384, 192], [64, 128], [448, 128]
    ];
    pentagons.forEach(([x, y]) => {
      c.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(a) * 28;
        const py = y + Math.sin(a) * 28;
        if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
    });

    c.strokeStyle = "rgba(0,0,0,0.18)";
    c.lineWidth = 2.5;
    c.stroke();

    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  function createGrassTexture(THREE) {
    const cv = document.createElement("canvas");
    cv.width = 256; cv.height = 256;
    const c = cv.getContext("2d");
    c.fillStyle = "#1e7534";
    c.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 1800; i++) {
      c.fillStyle = Math.random() > 0.5 ? "rgba(42, 155, 72, 0.35)" : "rgba(18, 92, 40, 0.35)";
      c.fillRect(Math.random() * 256, Math.random() * 256, 2, 4);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 12);
    return tex;
  }

  function disposeThreeScene() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    if (scene) {
      scene.traverse((obj) => {
        if (obj.geometry) {
          try { obj.geometry.dispose(); } catch (e) {}
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => {
              if (m.map) { try { m.map.dispose(); } catch (e) {} }
              try { m.dispose(); } catch (e) {}
            });
          } else {
            if (obj.material.map) { try { obj.material.map.dispose(); } catch (e) {} }
            try { obj.material.dispose(); } catch (e) {}
          }
        }
      });
      scene.clear();
    }
    if (renderer) {
      try { renderer.dispose(); } catch (e) {}
      renderer = null;
    }
  }

  function initThreeScene(wrapper) {
    if (!window.THREE) {
      wrapper.innerHTML = "<div style='color:#fff;padding:24px;text-align:center;'>Caricamento modulo 3D in corso...</div>";
      return false;
    }
    disposeThreeScene();
    const THREE = window.THREE;

    const rect = wrapper.getBoundingClientRect();
    const w = Math.max(300, Math.round(rect.width || wrapper.clientWidth || window.innerWidth || 320));
    const h = Math.max(200, Math.round(rect.height || wrapper.clientHeight || 280));
    const aspect = w / h;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060f1e);
    scene.fog = new THREE.FogExp2(0x060f1e, 0.024);

    const fov = aspect < 1.0 ? 64 : 50;
    camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 140);
    applyCameraMode();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    wrapper.innerHTML = "";
    wrapper.appendChild(renderer.domElement);

    // Luci stadio & riflettori serali della scogliera
    const amb = new THREE.AmbientLight(0xd4e5ff, 0.72);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.25);
    dirLight.position.set(6, 16, 9);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const floodL = new THREE.PointLight(0x70b5ff, 0.9, 38);
    floodL.position.set(-10, 10, 0);
    scene.add(floodL);

    const floodR = new THREE.PointLight(0xffa544, 0.85, 38);
    floodR.position.set(10, 10, 0);
    scene.add(floodR);

    buildPitch(THREE);
    buildGoal(THREE);
    buildStadiumSurroundings(THREE);
    buildKeeper(THREE, GK_LIST[activeGKIdx]);
    buildLeoShooter(THREE);
    buildBall(THREE);

    setupSwipeControls(wrapper);
    startPowerLoop();
    return true;
  }

  function applyCameraMode() {
    if (!camera) return;
    if (cameraMode === "anime") {
      // Prospettiva angolata stile Captain Tsubasa: Leo a sinistra e porta spalancata
      cameraPos = { x: 0, y: 1.85, z: 6.9 };
      cameraTarget = { x: 0, y: 1.25, z: -2.8 };
    } else if (cameraMode === "precision") {
      // Telecamera elevata centrata sul dischetto per mira millimetrica agli angoli
      cameraPos = { x: 0, y: 2.65, z: 6.2 };
      cameraTarget = { x: 0, y: 1.22, z: -2.8 };
    } else if (cameraMode === "keeper") {
      // Prospettiva in prima persona dal portiere tra i pali
      cameraPos = { x: 0, y: 1.5, z: -2.7 };
      cameraTarget = { x: 0, y: 0.8, z: 4.8 };
    }
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);
  }

  function buildPitch(THREE) {
    const grassTex = createGrassTexture(THREE);
    const pitchMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.85,
      metalness: 0.05
    });
    const pitch = new THREE.Mesh(new THREE.PlaneGeometry(34, 42), pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.receiveShadow = true;
    scene.add(pitch);

    // Strisce erba bicolore
    for (let z = -18; z <= 18; z += 3) {
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0x228b3f, transparent: true, opacity: 0.25 });
      const str = new THREE.Mesh(new THREE.PlaneGeometry(34, 1.5), stripeMat);
      str.rotation.x = -Math.PI / 2;
      str.position.set(0, 0.005, z);
      scene.add(str);
    }

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });

    // Linea di porta
    const goalLine = new THREE.Mesh(new THREE.PlaneGeometry(16, 0.12), lineMat);
    goalLine.rotation.x = -Math.PI / 2;
    goalLine.position.set(0, 0.01, -3.0);
    scene.add(goalLine);

    // Area di rigore
    const boxDepth = 8.5, boxWidth = 14;
    const boxF = new THREE.Mesh(new THREE.PlaneGeometry(boxWidth, 0.12), lineMat);
    boxF.rotation.x = -Math.PI / 2;
    boxF.position.set(0, 0.01, -3.0 + boxDepth);
    scene.add(boxF);

    const boxL = new THREE.Mesh(new THREE.PlaneGeometry(0.12, boxDepth), lineMat);
    boxL.rotation.x = -Math.PI / 2;
    boxL.position.set(-boxWidth / 2, 0.01, -3.0 + boxDepth / 2);
    scene.add(boxL);

    const boxR = new THREE.Mesh(new THREE.PlaneGeometry(0.12, boxDepth), lineMat);
    boxR.rotation.x = -Math.PI / 2;
    boxR.position.set(boxWidth / 2, 0.01, -3.0 + boxDepth / 2);
    scene.add(boxR);

    // Dischetto del rigore
    const spot = new THREE.Mesh(new THREE.CircleGeometry(0.22, 16), lineMat);
    spot.rotation.x = -Math.PI / 2;
    spot.position.set(0, 0.012, 4.2);
    scene.add(spot);
  }

  function buildGoal(THREE) {
    const goalGroup = new THREE.Group();
    goalGroup.position.set(0, 0, -3.0);

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.5 });
    const postR = 0.09;
    const gw = 5.2, gh = 2.44, gd = 1.8;

    // Pali laterali
    const pL = new THREE.Mesh(new THREE.CylinderGeometry(postR, postR, gh, 16), postMat);
    pL.position.set(-gw / 2, gh / 2, 0);
    pL.castShadow = true;
    goalGroup.add(pL);

    const pR = new THREE.Mesh(new THREE.CylinderGeometry(postR, postR, gh, 16), postMat);
    pR.position.set(gw / 2, gh / 2, 0);
    pR.castShadow = true;
    goalGroup.add(pR);

    // Traversa
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(postR, postR, gw + postR * 2, 16), postMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, gh, 0);
    bar.castShadow = true;
    goalGroup.add(bar);

    // Rete 3D
    const netMat = new THREE.MeshBasicMaterial({
      color: 0xe0e8f5,
      wireframe: true,
      transparent: true,
      opacity: 0.42
    });
    const backNet = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh, 14, 8), netMat);
    backNet.position.set(0, gh / 2, -gd);
    goalGroup.add(backNet);

    const topNet = new THREE.Mesh(new THREE.PlaneGeometry(gw, gd, 14, 5), netMat);
    topNet.rotation.x = Math.PI / 2;
    topNet.position.set(0, gh, -gd / 2);
    goalGroup.add(topNet);

    scene.add(goalGroup);
  }

  function buildStadiumSurroundings(THREE) {
    // Spalti e cartelloni
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x142035, roughness: 0.8 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(32, 2.8, 1.2), wallMat);
    wall.position.set(0, 1.4, -6.5);
    scene.add(wall);

    // Faro di Punta Rondine sullo sfondo a picco sul mare
    const faroGroup = new THREE.Group();
    faroGroup.position.set(13, 0, -18);

    const towerMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.4 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xb3202c, roughness: 0.4 });

    const tower1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 5, 16), towerMat);
    tower1.position.y = 2.5;
    faroGroup.add(tower1);

    const tower2 = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.6, 4, 16), stripeMat);
    tower2.position.y = 7;
    faroGroup.add(tower2);

    const tower3 = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.3, 4, 16), towerMat);
    tower3.position.y = 11;
    faroGroup.add(tower3);

    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.2, 12), new THREE.MeshBasicMaterial({ color: 0xfff6bd }));
    lantern.position.y = 14;
    faroGroup.add(lantern);

    // Fascio di luce rotante del faro
    const beamGeo = new THREE.ConeGeometry(3.5, 30, 16, 1, true);
    beamGeo.translate(0, 15, 0);
    beamGeo.rotateX(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xfffae0, transparent: true, opacity: 0.22, side: THREE.DoubleSide });
    lighthouseBeam = new THREE.Mesh(beamGeo, beamMat);
    lighthouseBeam.position.set(0, 14, 0);
    faroGroup.add(lighthouseBeam);

    scene.add(faroGroup);
  }

  function buildKeeper(THREE, gkData) {
    if (keeperGroup) scene.remove(keeperGroup);
    keeperGroup = new THREE.Group();
    keeperGroup.position.set(0, 0, -2.8);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf2c9a0, roughness: 0.6 });
    const jerseyMat = new THREE.MeshStandardMaterial({ color: gkData.color, roughness: 0.5 });
    const gloveMat = new THREE.MeshStandardMaterial({ color: gkData.gloves, roughness: 0.35 });
    const shortsMat = new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.7 });
    const sockMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    // Torso portiere
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.32), jerseyMat);
    body.position.set(0, 1.25, 0);
    body.castShadow = true;
    keeperGroup.add(body);

    // Testa
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), skinMat);
    head.position.set(0, 1.82, 0);
    head.castShadow = true;
    keeperGroup.add(head);

    // Cappellino leggendario di Nico Ferri
    if (gkData.cap) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.22, 0.1, 16), jerseyMat);
      cap.position.set(0, 1.94, 0.02);
      keeperGroup.add(cap);
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.2), jerseyMat);
      visor.position.set(0, 1.9, 0.18);
      keeperGroup.add(visor);
    }

    // Pantaloncini & Gambe
    const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.36, 0.3), shortsMat);
    shorts.position.set(0, 0.75, 0);
    keeperGroup.add(shorts);

    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.62, 12), sockMat);
    legL.position.set(-0.16, 0.32, 0);
    keeperGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.62, 12), sockMat);
    legR.position.set(0.16, 0.32, 0);
    keeperGroup.add(legR);

    // Guantoni e braccia aperte stile parata
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.52, 12), jerseyMat);
    armL.position.set(-0.4, 1.25, 0);
    armL.rotation.z = 0.45;
    keeperGroup.add(armL);
    keeperGroup.armL = armL;

    const gloveL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.14), gloveMat);
    gloveL.position.set(-0.55, 1.15, 0.12);
    keeperGroup.add(gloveL);
    keeperGroup.gloveL = gloveL;

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.52, 12), jerseyMat);
    armR.position.set(0.4, 1.25, 0);
    armR.rotation.z = -0.45;
    keeperGroup.add(armR);
    keeperGroup.armR = armR;

    const gloveR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.14), gloveMat);
    gloveR.position.set(0.55, 1.15, 0.12);
    keeperGroup.add(gloveR);
    keeperGroup.gloveR = gloveR;

    scene.add(keeperGroup);
  }

  // ================= COSTRUZIONE LEO MORETTI (NON COPRE LA PORTA!) =================
  // Posizionato a SINISTRA del dischetto di tiro: porta e portiere sono 100% visibili!
  function buildLeoShooter(THREE) {
    if (leoMesh) scene.remove(leoMesh);
    leoMesh = new THREE.Group();
    // Posizione iniziale di attesa: x = -1.25, z = 4.45 (visibile in 3/4, non blocca MAI la porta)
    leoMesh.position.set(-1.25, 0, 4.45);
    leoMesh.rotation.y = 0.38;

    let heroColor = 0xb3202c; // Default Rosso Rondine
    let hairColor = 0x241812;
    let skinColor = 0xf2c9a0;
    try {
      const h = getCustomHero();
      if (activeShooter === "hero" && h) {
        if (h.shirt && h.shirt.startsWith("#")) heroColor = parseInt(h.shirt.slice(1), 16);
        if (h.hair && h.hair.startsWith("#")) hairColor = parseInt(h.hair.slice(1), 16);
        if (h.skin && h.skin.startsWith("#")) skinColor = parseInt(h.skin.slice(1), 16);
      }
    } catch (e) {}

    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor });
    const shirtMat = new THREE.MeshStandardMaterial({ color: heroColor });
    const shortsMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Bianco
    const hairMat = new THREE.MeshStandardMaterial({ color: hairColor });

    // Torso con maglia #10 della Rondine
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.62, 0.26), shirtMat);
    body.position.set(0, 1.12, 0);
    leoMesh.add(body);
    leoMesh.body = body;

    // Banda diagonale bianca sulla maglia
    const sash = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.28), shortsMat);
    sash.position.set(0, 1.12, 0);
    sash.rotation.z = 0.42;
    leoMesh.add(sash);

    // Testa e capelli a ciuffo manga
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
    head.position.set(0, 1.64, 0);
    leoMesh.add(head);

    const hair = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.32, 6), hairMat);
    hair.position.set(0, 1.82, 0.02);
    hair.rotation.x = -0.3;
    hair.rotation.z = -0.15;
    leoMesh.add(hair);

    // Pantaloncini
    const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.26), shortsMat);
    shorts.position.set(0, 0.72, 0);
    leoMesh.add(shorts);

    // Gamba destra (calciante)
    const legR = new THREE.Group();
    legR.position.set(0.14, 0.62, 0);
    const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.58, 12), shirtMat);
    legRMesh.position.set(0, -0.28, 0);
    legR.add(legRMesh);
    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.22), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    bootR.position.set(0, -0.55, 0.06);
    legR.add(bootR);
    leoMesh.add(legR);
    leoMesh.legR = legR;

    // Gamba sinistra (d'appoggio)
    const legL = new THREE.Group();
    legL.position.set(-0.14, 0.62, 0);
    const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.58, 12), shirtMat);
    legLMesh.position.set(0, -0.28, 0);
    legL.add(legLMesh);
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.22), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    bootL.position.set(0, -0.55, 0.06);
    legL.add(bootL);
    leoMesh.add(legL);
    leoMesh.legL = legL;

    // Braccia in posizione dinamica atletica
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.45, 12), skinMat);
    armR.position.set(0.32, 1.15, -0.1);
    armR.rotation.z = -0.5;
    armR.rotation.x = 0.4;
    leoMesh.add(armR);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.45, 12), skinMat);
    armL.position.set(-0.32, 1.15, 0.1);
    armL.rotation.z = 0.5;
    armL.rotation.x = -0.4;
    leoMesh.add(armL);

    scene.add(leoMesh);
  }

  function buildBall(THREE) {
    if (ballMesh) scene.remove(ballMesh);
    const ballTex = createSoccerBallTexture(THREE);
    const ballMat = new THREE.MeshStandardMaterial({
      map: ballTex,
      roughness: 0.35,
      metalness: 0.1
    });
    ballMesh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), ballMat);
    ballMesh.position.set(0, 0.22, 4.2);
    ballMesh.castShadow = true;
    scene.add(ballMesh);

    // Ombra circolare a terra
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
    ballShadow = new THREE.Mesh(new THREE.CircleGeometry(0.25, 16), shadowMat);
    ballShadow.rotation.x = -Math.PI / 2;
    ballShadow.position.set(0, 0.012, 4.2);
    scene.add(ballShadow);
  }

  let trailCanvas = null;
  let trailCtx = null;

  function initTrailCanvas(wrapper) {
    trailCanvas = document.getElementById("s3dSwipeTrail");
    if (!trailCanvas) {
      trailCanvas = document.createElement("canvas");
      trailCanvas.id = "s3dSwipeTrail";
      trailCanvas.className = "s3d-swipe-trail";
      wrapper.appendChild(trailCanvas);
    }
    const rect = wrapper.getBoundingClientRect();
    trailCanvas.width = Math.max(300, Math.round(rect.width || wrapper.clientWidth || 320));
    trailCanvas.height = Math.max(200, Math.round(rect.height || wrapper.clientHeight || 280));
    trailCtx = trailCanvas.getContext("2d");
  }

  function clearTrail() {
    if (trailCtx && trailCanvas) {
      trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    }
  }

  function drawSwipeTrail(pts) {
    if (!trailCtx || !trailCanvas || pts.length < 2) return;
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    trailCtx.save();
    trailCtx.lineCap = "round";
    trailCtx.lineJoin = "round";

    const p0 = pts[0], pLast = pts[pts.length - 1];
    const grad = trailCtx.createLinearGradient(p0.x, p0.y, pLast.x, pLast.y);
    if (isSpecialActive) {
      grad.addColorStop(0, "rgba(255, 77, 90, 0.3)");
      grad.addColorStop(1, "rgba(255, 210, 63, 0.95)");
    } else {
      grad.addColorStop(0, "rgba(63, 167, 255, 0.3)");
      grad.addColorStop(1, "rgba(255, 210, 63, 0.95)");
    }

    // Bagliore esterno
    trailCtx.strokeStyle = isSpecialActive ? "rgba(255, 210, 63, 0.45)" : "rgba(63, 167, 255, 0.4)";
    trailCtx.lineWidth = 14;
    trailCtx.beginPath();
    trailCtx.moveTo(p0.x, p0.y);
    for (let i = 1; i < pts.length; i++) {
      trailCtx.lineTo(pts[i].x, pts[i].y);
    }
    trailCtx.stroke();

    // Nucleo luminoso
    trailCtx.strokeStyle = grad;
    trailCtx.lineWidth = 5;
    trailCtx.stroke();

    // Cursore luminoso alla punta del dito
    trailCtx.fillStyle = "#ffffff";
    trailCtx.beginPath();
    trailCtx.arc(pLast.x, pLast.y, 6, 0, Math.PI * 2);
    trailCtx.fill();

    trailCtx.restore();
  }

  function setupSwipeControls(wrapper) {
    initTrailCanvas(wrapper);
    let down = false;
    let pts = [];
    let startTime = 0;

    const getPos = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const cx = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : (e.changedTouches ? e.changedTouches[0].clientX : 0));
      const cy = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : (e.changedTouches ? e.changedTouches[0].clientY : 0));
      return { x: cx - rect.left, y: cy - rect.top };
    };

    const onStart = (e) => {
      if (isShooting) return;
      if (e.cancelable) e.preventDefault();
      down = true;
      pts = [];
      const pos = getPos(e);
      pts.push({ x: pos.x, y: pos.y, t: Date.now() });
      startTime = Date.now();
      clearTrail();
      if (window.haptic) window.haptic(15);
    };

    const onMove = (e) => {
      if (!down || isShooting) return;
      if (e.cancelable) e.preventDefault();
      const pos = getPos(e);
      const prev = pts[pts.length - 1];
      if (!prev || Math.hypot(pos.x - prev.x, pos.y - prev.y) > 4) {
        pts.push({ x: pos.x, y: pos.y, t: Date.now() });
        drawSwipeTrail(pts);
      }
    };

    const onEnd = (e) => {
      if (!down || isShooting) return;
      if (e.cancelable) e.preventDefault();
      down = false;
      const pos = getPos(e);
      pts.push({ x: pos.x, y: pos.y, t: Date.now() });
      drawSwipeTrail(pts);

      if (pts.length < 2) {
        clearTrail();
        return;
      }

      const pStart = pts[0];
      const pEnd = pts[pts.length - 1];
      const dx = pEnd.x - pStart.x;
      const dy = pStart.y - pEnd.y; // swipe verso l'alto = valore positivo
      const dt = Math.max(30, Date.now() - startTime);

      // Calcolo curvatura reale (deviazione massima dalla retta start-end per effetto a giro)
      let maxDev = 0;
      const lineLen = Math.hypot(dx, dy);
      if (lineLen > 30) {
        for (let i = 1; i < pts.length - 1; i++) {
          const pt = pts[i];
          const cross = (dx * (pt.y - pStart.y) - (-dy) * (pt.x - pStart.x)) / lineLen;
          if (Math.abs(cross) > Math.abs(maxDev)) {
            maxDev = cross;
          }
        }
      }

      if (dy > 25 && lineLen > 35) {
        if (window.haptic) window.haptic([30, 45]);
        const force = Math.min(1.4, Math.max(0.72, (dy / dt) * 1.85));
        const targetX = Math.max(-2.35, Math.min(2.35, (dx / 42) * 1.35));
        const targetY = Math.min(2.35, Math.max(0.35, (dy / 75) * 1.85));

        const arcCurve = (maxDev / 32) * 0.45;
        const dirCurve = (dx / 95) * 0.35;
        const curve = Math.max(-0.85, Math.min(0.85, arcCurve + dirCurve));

        if (activeRole === "keeper") {
          if (dy > 15 && dx < -15) diveKeeper("TL");
          else if (dy > 15 && dx > 15) diveKeeper("TR");
          else if (dy <= 15 && dx < -15) diveKeeper("BL");
          else if (dy <= 15 && dx > 15) diveKeeper("BR");
          else if (dy > 20) diveKeeper("TC");
          else diveKeeper("BC");
        } else {
          executeShot({ targetX, targetY, curve, force, type: isSpecialActive ? "special" : "swipe" });
        }
      } else if (activeRole === "keeper") {
        diveKeeper("TC");
      }

      setTimeout(clearTrail, 320);
    };

    wrapper.onmousedown = onStart;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    wrapper.ontouchstart = onStart;
    wrapper.ontouchmove = onMove;
    wrapper.ontouchend = onEnd;
    wrapper.ontouchcancel = () => { down = false; clearTrail(); };
  }

  function executeShot(cfg) {
    if (isShooting) return;
    isShooting = true;

    // Calcolo bonus Sweet Spot da barra di potenza
    const isSweetSpot = Math.abs(powerOsc - 50) <= 14;
    const powerMultiplier = isSweetSpot ? 1.25 : 1.0;
    if (isSweetSpot) {
      triggerImpactMsg("COLPO PERFETTO!", "Tempismo anime ideale! +25% Potenza ed Effetto", "#ffd23f");
    }

    playSound("kick");

    // Animazione atletica di Leo: scatto verso il pallone e tiro ad effetto
    if (leoMesh) {
      // Scatto in avanti verso il pallone da x: -1.25 a -0.32
      leoMesh.position.set(-0.35, 0, 4.22);
      leoMesh.rotation.y = 0.15;
      if (leoMesh.body) leoMesh.body.rotation.x = 0.25;
      if (leoMesh.legR) leoMesh.legR.rotation.x = -1.15; // Caricamento del tiro

      setTimeout(() => {
        if (leoMesh && leoMesh.legR) {
          leoMesh.legR.rotation.x = 0.85; // Impatto sul pallone!
          spawnKickAura();
        }
      }, 90);

      setTimeout(() => {
        // Ritorno morbido alla posizione di attesa laterale
        if (leoMesh) {
          leoMesh.position.set(-1.25, 0, 4.45);
          leoMesh.rotation.y = 0.38;
          if (leoMesh.body) leoMesh.body.rotation.x = 0;
          if (leoMesh.legR) leoMesh.legR.rotation.x = 0;
        }
      }, 420);
    }

    const speed = (cfg.force || 1.0) * powerMultiplier * (isSpecialActive ? 0.36 : 0.31);
    const startZ = 4.2;
    const destZ = -3.0;
    const steps = (startZ - destZ) / speed;

    ballVel.z = -speed;
    ballVel.x = (cfg.targetX) / steps;
    ballVel.y = (cfg.targetY - 0.22) / steps + (0.5 * 0.009 * steps);
    ballCurve = (cfg.curve || 0) * (isSweetSpot ? 1.3 : 1.0);

    const sl = document.getElementById("s3dSpeedlines");
    if (sl && (isSpecialActive || isSweetSpot)) sl.classList.add("active");

    const gk = GK_LIST[activeGKIdx];
    const playerShotStat = (window.S && window.S.st && window.S.st.tiro) ? window.S.st.tiro : 16;
    const diffMargin = (playerShotStat + (isSpecialActive ? 18 : 0) + (isSweetSpot ? 10 : 0)) - gk.power;
    const saveProb = Math.max(0.10, Math.min(0.82, 0.48 - (diffMargin * 0.035)));
    const willSave = Math.random() < saveProb;

    keeperState = "diving";
    if (willSave) {
      keeperTargetX = cfg.targetX * 0.94;
      keeperTargetY = Math.max(0.6, Math.min(2.1, cfg.targetY));
      setTimeout(() => {
        triggerImpactMsg(`${gk.name.toUpperCase()}!`, gk.move, "#ff4d5a");
      }, 140);
    } else {
      // Il portiere si tuffa ma non ci arriva o sbaglia angolo
      keeperTargetX = (cfg.targetX > 0 ? -1 : 1) * (1.2 + Math.random() * 0.8);
      keeperTargetY = Math.max(0.7, cfg.targetY * 0.7);
    }

    animateBallFlight(cfg, willSave);
  }

  function spawnKickAura() {
    // Esplosione di piume dorate della Rondine al momento del tiro
    for (let i = 0; i < 18; i++) {
      spawnParticle(
        -0.2 + (Math.random() - 0.5) * 0.4,
        0.25 + Math.random() * 0.4,
        4.1 + Math.random() * 0.3,
        isSpecialActive ? 0xffd23f : 0x70b5ff
      );
    }
  }

  function animateBallFlight(cfg, willSave) {
    let frame = 0;
    const maxFrames = 75;

    function step() {
      if (!isShooting) return;
      frame++;

      // Balistica
      ballVel.x += ballCurve * 0.0035;
      ballVel.y -= 0.009; // Gravità
      ballMesh.position.x += ballVel.x;
      ballMesh.position.y += ballVel.y;
      ballMesh.position.z += ballVel.z;

      // Rotazione realistica del pallone
      ballMesh.rotation.x += 0.28;
      ballMesh.rotation.y += ballCurve * 0.4;

      // Ombra coerente
      ballShadow.position.x = ballMesh.position.x;
      ballShadow.position.z = ballMesh.position.z;
      const h = Math.max(0.01, ballMesh.position.y);
      ballShadow.scale.setScalar(Math.max(0.2, 1.0 - h * 0.25));

      // Scia di particelle dorate / azzurre stile anime
      if (frame % 2 === 0) {
        spawnParticle(
          ballMesh.position.x,
          ballMesh.position.y,
          ballMesh.position.z,
          isSpecialActive ? 0xffd23f : 0x70b5ff
        );
      }

      // Animazione del portiere verso il bersaglio
      if (keeperGroup && keeperState === "diving") {
        keeperGroup.position.x += (keeperTargetX - keeperGroup.position.x) * 0.14;
        keeperGroup.position.y += (keeperTargetY - keeperGroup.position.y) * 0.12;
        keeperGroup.rotation.z = -keeperGroup.position.x * 0.28; // Tuffo dinamico
      }

      // Controllo esito all'altezza della linea di porta (z = -3.0)
      if (ballMesh.position.z <= -2.9 || frame >= maxFrames) {
        resolveShotOutcome(cfg, willSave);
        return;
      }

      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function resolveShotOutcome(cfg, willSave) {
    const bx = ballMesh.position.x;
    const by = ballMesh.position.y;
    const goalW = 2.6; // Metà larghezza porta (totale 5.2m)
    const goalH = 2.44; // Altezza traversa

    const isInside = Math.abs(bx) <= goalW && by > 0.15 && by <= goalH;
    const hitPost = (Math.abs(Math.abs(bx) - goalW) < 0.25 && by <= goalH + 0.15) || (Math.abs(by - goalH) < 0.22 && Math.abs(bx) <= goalW + 0.2);

    stats.shots++;

    if (willSave && isInside) {
      playSound("post");
      triggerImpactMsg("PARATA!", `${GK_LIST[activeGKIdx].name} blocca il tiro!`, "#ff4d5a");
      stats.streak = 0;
      ballVel.z = 0.18; // Rimbalzo sul portiere
      ballVel.x *= -0.5;
      if (window.haptic) window.haptic(60);
    } else if (isInside) {
      playSound("goal");
      shakeIntensity = 22;
      stats.goals++;
      stats.streak++;
      if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;

      const gk = GK_LIST[activeGKIdx];
      if (!stats.beaten.includes(gk.id)) stats.beaten.push(gk.id);

      const comboText = stats.streak >= 3 ? `🔥 COMBO x${stats.streak}! INARRESTABILE!` : (isSpecialActive ? "TIRO DELLA RONDINE IMPARABILE!" : "Palla all'incrocio dei pali!");
      triggerImpactMsg("GOOOOL!", comboText, "#ffd23f");
      if (window.toast) window.toast(`GOL! Serie: ${stats.streak}`, "success", "⚽");
      if (window.haptic) window.haptic([40, 60, 90]);

      // Ricompensa per la partita della storia
      if (window.S && window.S.st) {
        window.S.st.tiro = Math.min(99, (window.S.st.tiro || 16) + 1);
      }
    } else if (hitPost) {
      playSound("post");
      shakeIntensity = 15;
      triggerImpactMsg("PALO CLAMOROSO!", "La traversa trema ancora!", "#ff9800");
      stats.streak = 0;
      ballVel.z = 0.25; // Rimbalzo dal palo
      if (window.haptic) window.haptic([80, 50]);
    } else {
      playSound("kick");
      triggerImpactMsg("FUORI!", "Il pallone sfila sul fondo tra gli scogli.", "#90a4ae");
      stats.streak = 0;
      if (window.haptic) window.haptic(25);
    }

    saveStats(stats);
    updateHUD();

    setTimeout(resetForNextShot, 1600);
  }

  function resetForNextShot() {
    isShooting = false;
    isSpecialActive = false;

    // Reset pallone
    ballMesh.position.set(0, 0.22, 4.2);
    ballMesh.rotation.set(0, 0, 0);
    ballVel = { x: 0, y: 0, z: 0 };
    ballCurve = 0;

    ballShadow.position.set(0, 0.012, 4.2);
    ballShadow.scale.setScalar(1);

    // Reset portiere
    if (keeperGroup) {
      keeperGroup.position.set(0, 0, -2.8);
      keeperGroup.rotation.set(0, 0, 0);
    }
    keeperState = "idle";

    // Reset Leo Moretti: torna al suo posto a sinistra (non copre la porta)
    if (leoMesh) {
      leoMesh.position.set(-1.25, 0, 4.45);
      leoMesh.rotation.set(0, 0.38, 0);
      if (leoMesh.body) leoMesh.body.rotation.set(0, 0, 0);
      if (leoMesh.legR) leoMesh.legR.rotation.set(0, 0, 0);
    }

    applyCameraMode();

    const sl = document.getElementById("s3dSpeedlines");
    if (sl) sl.classList.remove("active");
  }

  function spawnParticle(x, y, z, colorHex) {
    if (!scene || particles.length > 55) return;
    const geo = new window.THREE.SphereGeometry(0.08, 6, 6);
    const mat = new window.THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.85 });
    const p = new window.THREE.Mesh(geo, mat);
    p.position.set(x, y, z);
    p.life = 1.0;
    p.decay = 0.045;
    scene.add(p);
    particles.push(p);
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= p.decay;
      p.scale.setScalar(p.life);
      p.material.opacity = p.life;
      if (p.life <= 0) {
        scene.remove(p);
        p.geometry.dispose();
        p.material.dispose();
        particles.splice(i, 1);
      }
    }
  }

  function renderLoop() {
    animFrame = requestAnimationFrame(renderLoop);
    if (!renderer || !scene || !camera) return;

    // Rotazione fascio del faro
    if (lighthouseBeam) {
      lighthouseBeam.rotation.y += 0.02;
    }

    // Effetto scuotimento telecamera se gol o palo
    if (shakeIntensity > 0.5) {
      camera.position.x = cameraPos.x + (Math.random() - 0.5) * (shakeIntensity * 0.02);
      camera.position.y = cameraPos.y + (Math.random() - 0.5) * (shakeIntensity * 0.02);
      shakeIntensity *= 0.88;
    } else {
      camera.position.x = cameraPos.x;
      camera.position.y = cameraPos.y;
    }

    // Animazione d'attesa (idle bounce) del portiere
    if (keeperGroup && keeperState === "idle") {
      const t = Date.now() * 0.004;
      keeperGroup.position.y = Math.sin(t) * 0.035;
      if (keeperGroup.armL) keeperGroup.armL.rotation.z = 0.45 + Math.cos(t) * 0.08;
      if (keeperGroup.armR) keeperGroup.armR.rotation.z = -0.45 - Math.cos(t) * 0.08;
    }

    updateParticles();
    renderer.render(scene, camera);
  }

  function triggerImpactMsg(title, sub, color) {
    const ov = document.getElementById("s3dOverlay");
    if (!ov) return;
    ov.innerHTML = `
      <div class="s3d-impact-title" style="color:${color || '#ffd23f'};">${title}</div>
      <div class="s3d-impact-sub">${sub || ''}</div>
    `;
    ov.style.opacity = "1";
    ov.style.transform = "scale(1.08)";
    setTimeout(() => {
      ov.style.opacity = "0";
      ov.style.transform = "scale(0.85)";
    }, 1400);
  }

  function toggleRole() {
    activeRole = activeRole === "striker" ? "keeper" : "striker";
    const btn = document.getElementById("s3dRoleBtn");
    if (btn) {
      btn.textContent = activeRole === "keeper" ? "⚽ Tira" : "🧤 Para";
      btn.style.background = activeRole === "keeper" ? "#2f9e55" : "#1f3a63";
    }

    if (activeRole === "keeper") {
      cameraMode = "keeper";
      applyCameraMode();
      triggerImpactMsg("I GUANTONI DI NICO!", "Difendi la porta del Rondine nei panni di Nico Ferri!", "#2f9e55");
      if (window.toast) window.toast("Modalità Portiere: Tuffati con swipe o tocca gli angoli per parare!", "success", "🧤");
      updateControlsUI();
      scheduleRivalShot();
    } else {
      if (keeperIncomingTimer) { clearTimeout(keeperIncomingTimer); keeperIncomingTimer = null; }
      cameraMode = "anime";
      applyCameraMode();
      triggerImpactMsg("LEO MORETTI!", "Torna al dischetto per calciare a effetto!", "#ffd23f");
      updateControlsUI();
      resetForNextShot();
    }
    updateHUD();
  }

  function updateControlsUI() {
    const specialBtn = document.getElementById("s3dSpecial");
    const lobBtn = document.getElementById("s3dLob");
    if (!specialBtn || !lobBtn) return;
    if (activeRole === "keeper") {
      specialBtn.textContent = "🐱 GATTO VOLANTEEE!";
      specialBtn.style.background = "linear-gradient(135deg, #1b7a40, #2f9e55)";
      lobBtn.textContent = "🧤 Presa Sicura";
    } else {
      specialBtn.textContent = "🔥 TIRO DELLA RONDINE 3D";
      specialBtn.style.background = "";
      lobBtn.textContent = "🥄 Pallonetto";
    }
  }

  function diveKeeper(targetCorner) {
    if (activeRole !== "keeper") return;
    if (window.haptic) window.haptic(25);

    const cornerMap = {
      TL: { x: -2.0, y: 2.1 },
      TC: { x: 0, y: 2.3 },
      TR: { x: 2.0, y: 2.1 },
      BL: { x: -2.1, y: 0.4 },
      BC: { x: 0, y: 0.35 },
      BR: { x: 2.1, y: 0.4 },
    };
    const divePos = cornerMap[targetCorner] || { x: 0, y: 1.2 };

    if (keeperGroup) {
      keeperGroup.position.x = divePos.x * 0.85;
      keeperGroup.position.y = divePos.y;
      keeperGroup.rotation.z = -divePos.x * 0.3;
    }

    if (keeperTargetShot && !keeperTargetShot.resolved) {
      const dist = Math.hypot(divePos.x - keeperTargetShot.x, divePos.y - keeperTargetShot.y);
      if (dist < 1.45) {
        keeperTargetShot.resolved = true;
        playSound("post");
        shakeIntensity = 20;
        stats.saves = (stats.saves || 0) + 1;
        stats.keeperStreak = (stats.keeperStreak || 0) + 1;
        const streakBonus = stats.keeperStreak >= 3 ? `🔥 MURO ASSOLUTO x${stats.keeperStreak}!` : "Nico blocca con il GATTO VOLANTE!";
        triggerImpactMsg("PARATA DA CAMPIONE!", streakBonus, "#ffd23f");
        if (window.haptic) window.haptic([50, 70, 90]);
        spawnKickAura();
        saveStats(stats);
        updateHUD();
        setTimeout(scheduleRivalShot, 1800);
      }
    }
  }

  function scheduleRivalShot() {
    if (activeRole !== "keeper") return;
    if (keeperIncomingTimer) clearTimeout(keeperIncomingTimer);

    ballMesh.position.set(0, 0.22, 4.2);
    ballVel = { x: 0, y: 0, z: 0 };
    if (keeperGroup) {
      keeperGroup.position.set(0, 0, -2.8);
      keeperGroup.rotation.set(0, 0, 0);
    }

    const rival = RIVALS[rivalIdx % RIVALS.length];
    triggerImpactMsg("ATTENZIONE AL TIRO!", `${rival.name} prepara il ${rival.move}`, rival.color);

    keeperIncomingTimer = setTimeout(() => {
      if (activeRole !== "keeper") return;
      executeRivalShot();
    }, 1300);
  }

  function executeRivalShot() {
    playSound("kick");
    if (window.haptic) window.haptic(30);

    const corners = [
      { id: "TL", x: -2.0, y: 2.1 },
      { id: "TR", x: 2.0, y: 2.1 },
      { id: "BL", x: -2.1, y: 0.4 },
      { id: "BR", x: 2.1, y: 0.4 },
      { id: "TC", x: 0, y: 2.3 }
    ];
    const picked = corners[Math.floor(Math.random() * corners.length)];
    keeperTargetShot = { ...picked, resolved: false };

    stats.keeperShots = (stats.keeperShots || 0) + 1;
    saveStats(stats);
    updateHUD();

    const speed = 0.29;
    const steps = (4.2 - (-2.8)) / speed;
    ballVel.z = -speed;
    ballVel.x = picked.x / steps;
    ballVel.y = (picked.y - 0.22) / steps + (0.5 * 0.009 * steps);

    let frames = 0;
    function ballInFlight() {
      if (activeRole !== "keeper") return;
      frames++;
      ballMesh.position.x += ballVel.x;
      ballMesh.position.y += ballVel.y;
      ballMesh.position.z += ballVel.z;
      ballMesh.rotation.x += 0.3;

      if (ballMesh.position.z <= -2.6) {
        if (!keeperTargetShot.resolved) {
          keeperTargetShot.resolved = true;
          playSound("goal");
          shakeIntensity = 24;
          stats.keeperStreak = 0;
          const rival = RIVALS[rivalIdx % RIVALS.length];
          triggerImpactMsg("GOL RIVALE!", `${rival.name} insacca all'angolo!`, "#ff4d5a");
          if (window.haptic) window.haptic(80);
          rivalIdx++;
          saveStats(stats);
          updateHUD();
          setTimeout(scheduleRivalShot, 2000);
        }
        return;
      }
      requestAnimationFrame(ballInFlight);
    }
    requestAnimationFrame(ballInFlight);
  }

  function updateHUD() {
    const gk = GK_LIST[activeGKIdx];
    const gkEl = document.getElementById("s3dGkInfo");
    const scEl = document.getElementById("s3dScoreInfo");
    if (gkEl) {
      if (activeRole === "keeper") {
        gkEl.innerHTML = `
          <span style="font-weight:bold; color:#2f9e55;">🧤 Nico Ferri</span>
          <span style="color:var(--dim); font-size:11px;">(Rondine FC)</span>
          <span style="margin-left:6px; font-size:10px; background:#1b3d2b; padding:2px 6px; border-radius:4px; color:#57d68d;">★ Il Gatto Volante</span>
        `;
      } else {
        gkEl.innerHTML = `
          <span style="font-weight:bold; color:var(--gold);">${gk.name}</span>
          <span style="color:var(--dim); font-size:11px;">(${gk.team})</span>
          <span style="margin-left:6px; font-size:10px; background:#1b2e4b; padding:2px 6px; border-radius:4px;">★ ${gk.skill}</span>
        `;
      }
    }
    if (scEl) {
      if (activeRole === "keeper") {
        scEl.innerHTML = `
          <span>Parate: <b>${stats.saves || 0}/${stats.keeperShots || 0}</b></span>
          <span style="margin-left:8px; color:#57d68d;">Imbattuto: <b>${stats.keeperStreak || 0}</b></span>
        `;
      } else {
        scEl.innerHTML = `
          <span>Gol: <b>${stats.goals}/${stats.shots}</b></span>
          <span style="margin-left:8px; color:var(--gold);">Serie: <b>${stats.streak}</b></span>
        `;
      }
    }
    const shooterBtn = document.getElementById("s3dShooterBtn");
    const hero = getCustomHero();
    if (shooterBtn) {
      if (hero && activeRole !== "keeper") {
        shooterBtn.style.display = "";
        shooterBtn.textContent = activeShooter === "hero" ? `⭐ ${hero.name}` : "⚽ Leo";
        shooterBtn.style.background = activeShooter === "hero" ? "linear-gradient(135deg, #ffd23f, #ff9e2e)" : "#1f3a63";
        shooterBtn.style.color = activeShooter === "hero" ? "#111" : "#fff";
      } else {
        shooterBtn.style.display = "none";
      }
    }
    updateControlsUI();
  }

  function openStadium3D(onBack) {
    returnCallback = onBack;
    let modal = document.getElementById("stadium3dModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "stadium3dModal";
      modal.innerHTML = `
        <!-- Top Bar senza sovrapposizioni -->
        <div class="s3d-topbar">
          <div class="s3d-title">
            <span>⚽ STADIO 3D</span>
            <span style="font-size:11px; color:var(--dim); font-weight:normal; font-family:sans-serif;">(Arena Anime)</span>
          </div>
          <div class="s3d-top-actions">
            <button type="button" class="s3d-btn" id="s3dShooterBtn" style="display:none;" title="Passa tra Leo Moretti e il Tuo Campione">⚽ Tiratore</button>
            <button type="button" class="s3d-btn" id="s3dRoleBtn" title="Passa tra Tiratore (Leo) e Portiere (Nico)">🧤 Parate</button>
            <button type="button" class="s3d-btn" id="s3dCamBtn" title="Cambia inquadratura (Anime / Mirino / Portiere)">🎥 Visuale</button>
            <button type="button" class="s3d-btn" id="s3dChangeGk" title="Scegli il portiere da sfidare">Portiere</button>
            <button type="button" class="s3d-btn s3d-btn-close" id="s3dClose">✕ Esci</button>
          </div>
        </div>

        <!-- HUD compatto -->
        <div class="s3d-hud">
          <div id="s3dGkInfo"></div>
          <div id="s3dScoreInfo"></div>
        </div>

        <!-- Canvas 3D -->
        <div class="s3d-canvas-wrap" id="s3dCanvasWrapper">
          <div class="s3d-speedlines" id="s3dSpeedlines"></div>
          <div class="s3d-overlay-impact" id="s3dOverlay"></div>

          <!-- Barra di Potenza Oscillante (Sweet Spot Anime) -->
          <div class="s3d-power-bar-wrap" title="Tira quando il cursore è nel centro dorato per colpo perfetto!">
            <div class="s3d-power-track">
              <div class="s3d-sweet-spot"></div>
              <div class="s3d-power-cursor" id="s3dPowerCursor"></div>
            </div>
            <div class="s3d-power-label">⚡ BARRA TEMPO: Colpisci nella zona dorata per il Tiro Perfetto!</div>
          </div>
        </div>

        <!-- Pannello Controlli Tattici Pulito (3x2 Grid) -->
        <div class="s3d-controls">
          <div class="s3d-target-grid">
            <button type="button" class="s3d-target-btn" id="s3dTL"><span class="icon">↖</span><span class="label">Incrocio SX</span></button>
            <button type="button" class="s3d-target-btn" id="s3dTC"><span class="icon">⬆</span><span class="label">Traversa</span></button>
            <button type="button" class="s3d-target-btn" id="s3dTR"><span class="icon">↗</span><span class="label">Incrocio DX</span></button>
            <button type="button" class="s3d-target-btn" id="s3dBL"><span class="icon">↙</span><span class="label">Basso SX</span></button>
            <button type="button" class="s3d-target-btn" id="s3dBC"><span class="icon">⬇</span><span class="label">Rasoterra</span></button>
            <button type="button" class="s3d-target-btn" id="s3dBR"><span class="icon">↘</span><span class="label">Basso DX</span></button>
          </div>
          <div class="s3d-actions-row">
            <button type="button" class="s3d-lob-btn" id="s3dLob">🥄 Pallonetto</button>
            <button type="button" class="s3d-special-btn" id="s3dSpecial">🔥 TIRO DELLA RONDINE 3D</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#s3dRoleBtn").onclick = toggleRole;

      modal.querySelector("#s3dTL").onclick = () => {
        if (activeRole === "keeper") diveKeeper("TL");
        else executeShot({ targetX: -2.1, targetY: 2.15, curve: -0.4, force: 1.15 });
      };
      modal.querySelector("#s3dTC").onclick = () => {
        if (activeRole === "keeper") diveKeeper("TC");
        else executeShot({ targetX: 0, targetY: 2.3, curve: 0, force: 1.1 });
      };
      modal.querySelector("#s3dTR").onclick = () => {
        if (activeRole === "keeper") diveKeeper("TR");
        else executeShot({ targetX: 2.1, targetY: 2.15, curve: 0.4, force: 1.15 });
      };
      modal.querySelector("#s3dBL").onclick = () => {
        if (activeRole === "keeper") diveKeeper("BL");
        else executeShot({ targetX: -2.2, targetY: 0.35, curve: -0.1, force: 1.25 });
      };
      modal.querySelector("#s3dBC").onclick = () => {
        if (activeRole === "keeper") diveKeeper("BC");
        else executeShot({ targetX: 0, targetY: 0.32, curve: 0, force: 1.2 });
      };
      modal.querySelector("#s3dBR").onclick = () => {
        if (activeRole === "keeper") diveKeeper("BR");
        else executeShot({ targetX: 2.2, targetY: 0.35, curve: 0.1, force: 1.25 });
      };

      modal.querySelector("#s3dLob").onclick = () => {
        if (activeRole === "keeper") diveKeeper("BC");
        else executeShot({ targetX: 0.1, targetY: 2.35, curve: 0, force: 0.72 });
      };
      modal.querySelector("#s3dSpecial").onclick = () => {
        if (activeRole === "keeper") {
          // Gatto Volante garantito!
          if (window.haptic) window.haptic([40, 60, 90]);
          triggerImpactMsg("GATTO VOLANTEEE!", "Nico spicca il volo e blocca qualsiasi tiro!", "#57d68d");
          if (keeperTargetShot) diveKeeper(keeperTargetShot.id || "TC");
          return;
        }
        if (window.S && window.S.st && window.S.st.grinta < 25) {
          if (window.toast) window.toast("Grinta insufficiente (servono 25 punti)!", "info", "⚡");
          return;
        }
        if (window.S && window.S.st) window.S.st.grinta -= 25;
        isSpecialActive = true;
        const h = getCustomHero();
        if (activeShooter === "hero" && h) {
          triggerImpactMsg((h.shotName || "TIRO SPECIALE!").toUpperCase(), `${h.name} calcia con l'effetto della scogliera!`, h.shirt || "#ffd23f");
        } else {
          triggerImpactMsg("TIRO DELLA RONDINE!", "Leo calcia con l'effetto della scogliera!", "#ffd23f");
        }
        updateHUD();
        executeShot({ targetX: (Math.random() > 0.5 ? 2.15 : -2.15), targetY: 2.2, curve: 0.65, force: 1.35 });
      };

      // Toggle tiratore: Leo Moretti o il Tuo Campione
      const shooterBtn = modal.querySelector("#s3dShooterBtn");
      if (shooterBtn) {
        shooterBtn.onclick = () => {
          const h = getCustomHero();
          if (!h) return;
          activeShooter = activeShooter === "leo" ? "hero" : "leo";
          const THREE = window.THREE;
          if (THREE) buildLeoShooter(THREE);
          updateControlsUI();
          updateHUD();
          triggerImpactMsg(
            activeShooter === "hero" ? h.name.toUpperCase() : "LEO MORETTI!",
            activeShooter === "hero" ? `Pronto a calciare ${h.shotName}!` : "Torna al dischetto per calciare a effetto!",
            activeShooter === "hero" ? (h.shirt || "#ffd23f") : "#ffd23f"
          );
          if (window.toast) window.toast(`Tiratore attivo: ${activeShooter === "hero" ? h.name : "Leo Moretti"}`, "info", "⚽");
        };
      }

      // Switch visuale telecamera
      modal.querySelector("#s3dCamBtn").onclick = () => {
        if (cameraMode === "anime") cameraMode = "precision";
        else if (cameraMode === "precision") cameraMode = "keeper";
        else cameraMode = "anime";

        const label = cameraMode === "anime" ? "Visuale Anime" : cameraMode === "precision" ? "Visuale Mirino" : "Visuale Portiere";
        triggerImpactMsg(label, "Inquadratura 3D aggiornata", "#70b5ff");
        applyCameraMode();
      };

      // Cambio portiere
      modal.querySelector("#s3dChangeGk").onclick = () => {
        activeGKIdx = (activeGKIdx + 1) % GK_LIST.length;
        const cur = GK_LIST[activeGKIdx];
        buildKeeper(window.THREE, cur);
        updateHUD();
        triggerImpactMsg(`SFIDA: ${cur.name.toUpperCase()}!`, cur.quote, "#ffd23f");
      };

      modal.querySelector("#s3dClose").onclick = closeStadium3D;
    }

    modal.style.display = "flex";
    const wrapper = document.getElementById("s3dCanvasWrapper");
    initThreeScene(wrapper);
    updateHUD();
    renderLoop();
    setTimeout(handleResize, 60);

    window.addEventListener("resize", handleResize);
  }

  function handleResize() {
    const wrapper = document.getElementById("s3dCanvasWrapper");
    if (!wrapper || !renderer || !camera) return;
    const rect = wrapper.getBoundingClientRect();
    const w = Math.max(300, Math.round(rect.width || wrapper.clientWidth || window.innerWidth || 320));
    const h = Math.max(200, Math.round(rect.height || wrapper.clientHeight || 280));
    const aspect = w / h;
    camera.fov = aspect < 1.0 ? 64 : 50;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (trailCanvas) {
      trailCanvas.width = w;
      trailCanvas.height = h;
    }
  }

  function closeStadium3D() {
    stopPowerLoop();
    if (keeperIncomingTimer) { clearTimeout(keeperIncomingTimer); keeperIncomingTimer = null; }
    const modal = document.getElementById("stadium3dModal");
    if (modal) modal.style.display = "none";
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    window.removeEventListener("resize", handleResize);
    disposeThreeScene();
    if (returnCallback && typeof returnCallback === "function") {
      returnCallback();
    }
  }

  window.openStadium3D = openStadium3D;
  window.closeStadium3D = closeStadium3D;
})();
