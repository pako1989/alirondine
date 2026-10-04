// js/tactical-emblem.js - Tactical RPG Soccer (Fire Emblem Style)
(function () {
  let modal = null;
  let canvas = null;
  let ctx = null;
  let animId = null;
  let onExitCallback = null;

  // Grid dimensions
  const COLS = 13;
  const ROWS = 8;
  let tileSize = 54;
  let offsetX = 20;
  let offsetY = 50;

  // Triangles: Tecnica > Potenza > Velocità > Tecnica
  const TRIANGLE = {
    tecnica: "potenza",
    potenza: "velocita",
    velocita: "tecnica"
  };

  const STYLE_NAMES = {
    tecnica: "🎯 Tecnica",
    potenza: "💥 Potenza",
    velocita: "⚡ Velocità"
  };

  const STYLE_COLORS = {
    tecnica: "#3a86ff",
    potenza: "#e63946",
    velocita: "#ffbe0b"
  };

  // State
  let gameState = {
    chapter: 1,
    turn: "player", // 'player' or 'enemy'
    turnCount: 1,
    selectedUnit: null,
    targetUnit: null,
    moveRange: [],
    actionRange: [],
    ballCarrier: null, // unit id
    ballPos: { x: 6, y: 3 },
    phase: "select", // 'select', 'moving', 'action_menu', 'duel', 'game_over', 'victory', 'dialogue'
    dialogueStep: 0,
    duelData: null,
    score: { player: 0, enemy: 0 },
    message: "Tocca un tuo calciatore per muoverlo sul campo.",
    units: []
  };

  const CHAPTERS = [
    {
      title: "Capitolo 1: La Sfida del Molo Vecchio",
      intro: [
        { speaker: "Leo", text: "Il campo del molo è illuminato solo dalle lampare dei pescherecci. Vincere qui significa farsi rispettare da tutta la costa." },
        { speaker: "Nico", text: "Guarda chi c'è: i Pescatori del Molo! Sono duri nei contrasti, ma se sfruttiamo la velocità non ci prenderanno mai." },
        { speaker: "Baciccia", text: "Ragazzi, ricordate il triangolo tattico: la Tecnica aggira la Potenza, la Potenza schiaccia la Velocità, la Velocità anticipa la Tecnica! Giocate d'astuzia!" }
      ],
      enemies: [
        { id: "e1", name: "Gino il Mozzo", style: "potenza", hp: 28, maxHp: 28, atk: 12, def: 8, spd: 4, skl: 6, mov: 3, x: 9, y: 2, icon: "⚓", isGK: false },
        { id: "e2", name: "Rino Tirante", style: "potenza", hp: 32, maxHp: 32, atk: 14, def: 10, spd: 3, skl: 5, mov: 3, x: 9, y: 5, icon: "⚓", isGK: false },
        { id: "e3", name: "Baciccia Sr", style: "velocita", hp: 26, maxHp: 26, atk: 11, def: 6, spd: 8, skl: 7, mov: 4, x: 10, y: 3, icon: "🧔", isGK: false },
        { id: "egk", name: "Molo Portiere", style: "tecnica", hp: 35, maxHp: 35, atk: 10, def: 13, spd: 4, skl: 8, mov: 2, x: 12, y: 3, icon: "🧤", isGK: true }
      ]
    },
    {
      title: "Capitolo 2: I Falchi di Spezia",
      intro: [
        { speaker: "Nico", text: "I Falchi sono famosi per i contropiedi fulminei. Se sbagliamo un passaggio a centrocampo ci puniranno in porta!" },
        { speaker: "Chicco", text: "Tranquillo Nico, a centrocampo ci penso io. Metto il corpo tra loro e la palla: la potenza vince sulla loro velocità." },
        { speaker: "Leo", text: "Muoviamoci compatti. Chi ha la palla deve essere sempre supportato da un compagno vicino." }
      ],
      enemies: [
        { id: "e1", name: "Falco 1 (Ala)", style: "velocita", hp: 30, maxHp: 30, atk: 13, def: 7, spd: 9, skl: 8, mov: 4, x: 8, y: 1, icon: "🦅", isGK: false },
        { id: "e2", name: "Falco 2 (Ala)", style: "velocita", hp: 30, maxHp: 30, atk: 13, def: 7, spd: 9, skl: 8, mov: 4, x: 8, y: 6, icon: "🦅", isGK: false },
        { id: "e3", name: "Capitan Falco", style: "tecnica", hp: 38, maxHp: 38, atk: 16, def: 11, spd: 7, skl: 10, mov: 3, x: 10, y: 3, icon: "👑", isGK: false },
        { id: "egk", name: "Muraglia Falco", style: "potenza", hp: 42, maxHp: 42, atk: 12, def: 15, spd: 4, skl: 9, mov: 2, x: 12, y: 4, icon: "🧤", isGK: true }
      ]
    },
    {
      title: "Capitolo 3: I Corsari di Portofino (Final Boss)",
      intro: [
        { speaker: "Capitan Vanni", text: "Siete arrivati fin qui, ragazzi del Borgo? Bravi, ma il trofeo del Faro appartiene ai Corsari!" },
        { speaker: "Leo", text: "La Rondine non abbassa mai la cresta. Ognuno dia il massimo per la maglia!" },
        { speaker: "Don Aurelio", text: "Coraggio figlioli, ricordate la preghiera dei naviganti: testa alta, palla a terra e cuore fino al 90°!" }
      ],
      enemies: [
        { id: "e1", name: "Corsaro Bruno", style: "potenza", hp: 36, maxHp: 36, atk: 16, def: 12, spd: 5, skl: 8, mov: 3, x: 8, y: 2, icon: "🏴‍☠️", isGK: false },
        { id: "e2", name: "Corsaro Silvano", style: "velocita", hp: 34, maxHp: 34, atk: 15, def: 9, spd: 10, skl: 9, mov: 4, x: 9, y: 5, icon: "🏴‍☠️", isGK: false },
        { id: "e3", name: "Capitan Vanni", style: "tecnica", hp: 46, maxHp: 46, atk: 18, def: 14, spd: 8, skl: 12, mov: 4, x: 10, y: 3, icon: "⚔️", isGK: false },
        { id: "egk", name: "Il Faro di Pietra", style: "potenza", hp: 50, maxHp: 50, atk: 14, def: 18, spd: 4, skl: 10, mov: 2, x: 12, y: 3, icon: "🧤", isGK: true }
      ]
    }
  ];

  function createPlayerTeam() {
    return [
      {
        id: "p_leo",
        name: "Leo Ferri",
        title: "Regista della Rondine",
        style: "tecnica",
        hp: 36,
        maxHp: 36,
        atk: 15,
        def: 9,
        spd: 7,
        skl: 11,
        mov: 3,
        x: 3,
        y: 3,
        icon: "⚽",
        isPlayer: true,
        special: "Tiro della Rondine",
        hasActed: false
      },
      {
        id: "p_nico",
        name: "Nico",
        title: "Ala del Molo",
        style: "velocita",
        hp: 30,
        maxHp: 30,
        atk: 13,
        def: 7,
        spd: 11,
        skl: 9,
        mov: 4,
        x: 3,
        y: 1,
        icon: "⚡",
        isPlayer: true,
        special: "Scatto del Gabbiano",
        hasActed: false
      },
      {
        id: "p_chicco",
        name: "Chicco",
        title: "Mastino di Centrocampo",
        style: "potenza",
        hp: 40,
        maxHp: 40,
        atk: 16,
        def: 13,
        spd: 4,
        skl: 6,
        mov: 3,
        x: 2,
        y: 4,
        icon: "🛡️",
        isPlayer: true,
        special: "Muro dei Trabucchi",
        hasActed: false
      },
      {
        id: "p_dario",
        name: "Dario",
        title: "Centravanti d'Area",
        style: "potenza",
        hp: 38,
        maxHp: 38,
        atk: 18,
        def: 8,
        spd: 6,
        skl: 8,
        mov: 3,
        x: 4,
        y: 5,
        icon: "🔥",
        isPlayer: true,
        special: "Cannone del Borgo",
        hasActed: false
      },
      {
        id: "p_gk",
        name: "Sandro",
        title: "Portiere della Rondine",
        style: "tecnica",
        hp: 42,
        maxHp: 42,
        atk: 10,
        def: 15,
        spd: 5,
        skl: 9,
        mov: 2,
        x: 0,
        y: 3,
        icon: "🧤",
        isPlayer: true,
        isGK: true,
        special: "Presa d'Acciaio",
        hasActed: false
      }
    ];
  }

  function initChapter(chIndex) {
    const ch = CHAPTERS[chIndex];
    gameState.chapter = chIndex + 1;
    gameState.turn = "player";
    gameState.turnCount = 1;
    gameState.selectedUnit = null;
    gameState.targetUnit = null;
    gameState.phase = "dialogue";
    gameState.dialogueStep = 0;
    gameState.score = { player: 0, enemy: 0 };
    gameState.units = [
      ...createPlayerTeam(),
      ...ch.enemies.map(e => ({ ...e, isPlayer: false, hasActed: false }))
    ];
    // Leo starts with ball
    gameState.ballCarrier = "p_leo";
    const leo = gameState.units.find(u => u.id === "p_leo");
    if (leo) gameState.ballPos = { x: leo.x, y: leo.y };
    gameState.message = `Inizio ${ch.title}`;
  }

  function getUnitAt(x, y) {
    return gameState.units.find(u => u.x === x && u.y === y && u.hp > 0);
  }

  function getDistance(u1, u2) {
    return Math.abs(u1.x - u2.x) + Math.abs(u1.y - u2.y);
  }

  function computeMoveRange(unit) {
    const range = [];
    const maxMov = unit.mov;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const dist = Math.abs(unit.x - c) + Math.abs(unit.y - r);
        if (dist <= maxMov) {
          const occ = getUnitAt(c, r);
          // Can walk through allies or empty, but can only stop on empty or same spot
          if (!occ || occ === unit) {
            range.push({ x: c, y: r });
          }
        }
      }
    }
    return range;
  }

  function computeActionRange(unit) {
    // 1-tile adjacent targets for duel / tackle / pass
    const actions = [];
    const dirs = [
      { x: 0, y: -1 }, { x: 0, y: 1 },
      { x: -1, y: 0 }, { x: 1, y: 0 }
    ];
    dirs.forEach(d => {
      const tx = unit.x + d.x;
      const ty = unit.y + d.y;
      if (tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS) {
        actions.push({ x: tx, y: ty });
      }
    });

    // If unit has the ball, can shoot if in range of enemy goal (col 12, rows 3-4)
    if (gameState.ballCarrier === unit.id) {
      if (unit.isPlayer && unit.x >= 9) {
        // Can shoot at goal
        actions.push({ x: 12, y: 3, isGoalShot: true });
        actions.push({ x: 12, y: 4, isGoalShot: true });
      }
    }
    return actions;
  }

  function getTriangleAdvantage(atkStyle, defStyle) {
    if (TRIANGLE[atkStyle] === defStyle) return 1; // Advantage
    if (TRIANGLE[defStyle] === atkStyle) return -1; // Disadvantage
    return 0; // Neutral
  }

  function calculateDuel(attacker, defender, isShot = false) {
    const adv = getTriangleAdvantage(attacker.style, defender.style);

    // Hit Rate: Base 75 + (Skill * 3) - (Target Spd * 2) + (Advantage * 20)
    let hitRate = 75 + (attacker.skl * 3) - (defender.spd * 2) + (adv * 20);
    hitRate = Math.max(25, Math.min(98, hitRate));

    // Crit Rate: (Skill / 2) + (Advantage * 15)
    let critRate = Math.floor(attacker.skl * 1.2) + (adv > 0 ? 15 : 0);
    critRate = Math.max(5, Math.min(65, critRate));

    // Damage: Atk + (Advantage * 4) - Def
    let rawDmg = attacker.atk + (adv * 4) - Math.floor(defender.def * 0.7);
    rawDmg = Math.max(4, rawDmg);

    return {
      attacker,
      defender,
      adv,
      hitRate,
      critRate,
      rawDmg,
      isShot
    };
  }

  function startDuel(attacker, defender, isShot = false) {
    const calc = calculateDuel(attacker, defender, isShot);
    gameState.phase = "duel";
    gameState.duelData = {
      ...calc,
      step: 0,
      attackerDmgDone: 0,
      defenderDmgDone: 0,
      attackerCrit: false,
      defenderCrit: false,
      outcome: null,
      timer: 0
    };
    if (window.HD2DAudio) window.HD2DAudio.playSelect();
  }

  function resolveDuelStep() {
    const d = gameState.duelData;
    if (!d) return;

    if (d.step === 0) {
      // Attacker strikes
      const hit = Math.random() * 100 < d.hitRate;
      if (hit) {
        const crit = Math.random() * 100 < d.critRate;
        const dmg = crit ? Math.floor(d.rawDmg * 1.8) : d.rawDmg;
        d.attackerDmgDone = dmg;
        d.attackerCrit = crit;
        d.defender.hp = Math.max(0, d.defender.hp - dmg);
        if (crit && window.HD2DAudio) window.HD2DAudio.playEmblemCrit();
        else if (window.HD2DAudio) window.HD2DAudio.playEmblemClash();
      } else {
        d.attackerDmgDone = -1; // Miss / Parata
        if (window.HD2DAudio) window.HD2DAudio.playBounce();
      }
      d.step = 1;
      d.timer = 45;
    } else if (d.step === 1) {
      // Counter-attack if defender alive and not a goal shot
      if (d.defender.hp > 0 && !d.isShot) {
        const counterAdv = getTriangleAdvantage(d.defender.style, d.attacker.style);
        const counterHit = Math.random() * 100 < (70 + d.defender.skl * 2 - d.attacker.spd * 2 + counterAdv * 15);
        if (counterHit) {
          const counterCrit = Math.random() * 100 < Math.floor(d.defender.skl);
          const counterDmg = counterCrit ? Math.floor(d.defender.atk * 1.5) : Math.max(3, d.defender.atk - Math.floor(d.attacker.def * 0.7));
          d.defenderDmgDone = counterDmg;
          d.defenderCrit = counterCrit;
          d.attacker.hp = Math.max(0, d.attacker.hp - counterDmg);
          if (window.HD2DAudio) window.HD2DAudio.playEmblemClash();
        } else {
          d.defenderDmgDone = -1;
        }
      }
      d.step = 2;
      d.timer = 50;
    } else if (d.step === 2) {
      // Conclude duel
      if (d.isShot) {
        if (d.defender.hp <= 0 || d.attackerDmgDone > 10) {
          // GOAL!
          if (d.attacker.isPlayer) {
            gameState.score.player++;
            gameState.message = `⚽ GOOOOL! ${d.attacker.name} ha gonfiato la rete!`;
            if (window.HD2DAudio) window.HD2DAudio.playGoal();
            checkVictory();
          } else {
            gameState.score.enemy++;
            gameState.message = `⚽ GOL dell'avversario! ${d.attacker.name} ha segnato.`;
            if (window.HD2DAudio) window.HD2DAudio.playGoal();
          }
          // Reset ball to center
          gameState.ballCarrier = null;
          gameState.ballPos = { x: 6, y: 3 };
        } else {
          gameState.message = `🧤 PARATA! ${d.defender.name} respinge il tiro!`;
          gameState.ballCarrier = d.defender.id;
          gameState.ballPos = { x: d.defender.x, y: d.defender.y };
        }
      } else {
        // Normal clash (tackle / steal)
        if (d.defender.hp <= 0) {
          gameState.message = `💥 ${d.attacker.name} ha dominato il contrasto!`;
          // If defender had ball, steal it
          if (gameState.ballCarrier === d.defender.id) {
            gameState.ballCarrier = d.attacker.id;
            gameState.ballPos = { x: d.attacker.x, y: d.attacker.y };
          }
        } else if (d.attacker.hp <= 0) {
          gameState.message = `⚠️ ${d.attacker.name} ha avuto la peggio nel contrasto!`;
          if (gameState.ballCarrier === d.attacker.id) {
            gameState.ballCarrier = d.defender.id;
            gameState.ballPos = { x: d.defender.x, y: d.defender.y };
          }
        }
      }

      d.attacker.hasActed = true;
      gameState.phase = "select";
      gameState.selectedUnit = null;
      gameState.targetUnit = null;
      gameState.duelData = null;

      // Check if turn should end
      checkTurnEnd();
    }
  }

  function checkTurnEnd() {
    if (gameState.turn === "player") {
      const activeUnits = gameState.units.filter(u => u.isPlayer && u.hp > 0);
      const allActed = activeUnits.every(u => u.hasActed);
      if (allActed) {
        startEnemyTurn();
      }
    } else {
      const activeEnemies = gameState.units.filter(u => !u.isPlayer && u.hp > 0);
      const allActed = activeEnemies.every(u => u.hasActed);
      if (allActed) {
        startPlayerTurn();
      }
    }
  }

  function startPlayerTurn() {
    gameState.turn = "player";
    gameState.turnCount++;
    gameState.units.forEach(u => { u.hasActed = false; });
    gameState.message = `Turno ${gameState.turnCount} · Fase Rondine (Tocca ai tuoi campioni)`;
    if (window.HD2DAudio) window.HD2DAudio.playWhistle(false);
  }

  function startEnemyTurn() {
    gameState.turn = "enemy";
    gameState.units.forEach(u => { u.hasActed = false; });
    gameState.message = `Fase Avversaria in corso...`;
    setTimeout(executeEnemyTurn, 600);
  }

  function executeEnemyTurn() {
    const enemies = gameState.units.filter(u => !u.isPlayer && u.hp > 0 && !u.hasActed);
    if (enemies.length === 0) {
      startPlayerTurn();
      return;
    }

    const enemy = enemies[0];
    const players = gameState.units.filter(u => u.isPlayer && u.hp > 0);

    // AI Logic:
    // If has ball: advance towards player goal (x: 0, y: 3-4)
    // Else: advance towards ball or nearest player
    let targetX = 0;
    let targetY = 3;

    if (gameState.ballCarrier === enemy.id) {
      targetX = 0;
      targetY = 3;
    } else {
      const ballUnit = gameState.units.find(u => u.id === gameState.ballCarrier);
      if (ballUnit) {
        targetX = ballUnit.x;
        targetY = ballUnit.y;
      }
    }

    // Move closer to target
    const range = computeMoveRange(enemy);
    let bestTile = { x: enemy.x, y: enemy.y };
    let bestDist = 999;

    range.forEach(t => {
      const d = Math.abs(t.x - targetX) + Math.abs(t.y - targetY);
      if (d < bestDist) {
        bestDist = d;
        bestTile = t;
      }
    });

    enemy.x = bestTile.x;
    enemy.y = bestTile.y;
    if (gameState.ballCarrier === enemy.id) {
      gameState.ballPos = { x: enemy.x, y: enemy.y };
    }

    // Check if can attack adjacent player
    const adjPlayer = players.find(p => getDistance(enemy, p) === 1);
    if (adjPlayer) {
      startDuel(enemy, adjPlayer, false);
    } else if (gameState.ballCarrier === enemy.id && enemy.x <= 3) {
      // Shoot at player GK
      const playerGK = gameState.units.find(u => u.isGK && u.isPlayer);
      if (playerGK) {
        startDuel(enemy, playerGK, true);
      } else {
        enemy.hasActed = true;
        setTimeout(executeEnemyTurn, 500);
      }
    } else {
      enemy.hasActed = true;
      setTimeout(executeEnemyTurn, 400);
    }
  }

  function checkVictory() {
    if (gameState.score.player >= 2) {
      if (gameState.chapter < CHAPTERS.length) {
        gameState.message = `🏆 VITTORIA DEL CAPITOLO ${gameState.chapter}! Passaggio al capitolo successivo!`;
        if (window.toast) window.toast(`Capitolo ${gameState.chapter} completato!`, "success", "🏆");
        setTimeout(() => {
          initChapter(gameState.chapter);
        }, 2200);
      } else {
        gameState.phase = "victory";
        gameState.message = `👑 CAMPIONI DEL TORNEO DEL FARO! Avete conquistato la coppa leggendaria!`;
        if (window.fireConfetti) window.fireConfetti();
      }
    }
  }

  // Draw Functions
  function resizeCanvas() {
    if (!canvas || !modal) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    tileSize = Math.floor(Math.min((rect.width - 40) / COLS, (rect.height - 120) / ROWS));
    offsetX = Math.floor((rect.width - (COLS * tileSize)) / 2);
    offsetY = 70;
  }

  function drawPitch() {
    // Elegant Grass Stripes
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const isLight = (r + c) % 2 === 0;
        ctx.fillStyle = isLight ? "#2a9d4e" : "#238642";
        ctx.fillRect(offsetX + c * tileSize, offsetY + r * tileSize, tileSize, tileSize);

        // Thin grid border
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.strokeRect(offsetX + c * tileSize, offsetY + r * tileSize, tileSize, tileSize);
      }
    }

    // Pitch Lines
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, COLS * tileSize, ROWS * tileSize);

    // Halfway line
    const midX = offsetX + Math.floor(COLS / 2) * tileSize + tileSize / 2;
    ctx.beginPath();
    ctx.moveTo(midX, offsetY);
    ctx.lineTo(midX, offsetY + ROWS * tileSize);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(midX, offsetY + (ROWS * tileSize) / 2, tileSize * 1.4, 0, Math.PI * 2);
    ctx.stroke();

    // Goal Boxes
    // Left (Player Goal)
    ctx.strokeRect(offsetX, offsetY + 2 * tileSize, 2 * tileSize, 4 * tileSize);
    // Right (Enemy Goal)
    ctx.strokeRect(offsetX + (COLS - 2) * tileSize, offsetY + 2 * tileSize, 2 * tileSize, 4 * tileSize);

    // Goals (Nets)
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(offsetX - 10, offsetY + 2.5 * tileSize, 10, 3 * tileSize);
    ctx.fillRect(offsetX + COLS * tileSize, offsetY + 2.5 * tileSize, 10, 3 * tileSize);
  }

  function drawRanges() {
    // Movement range (Blue glow)
    if (gameState.selectedUnit && gameState.turn === "player" && !gameState.selectedUnit.hasActed) {
      ctx.fillStyle = "rgba(58, 134, 255, 0.35)";
      gameState.moveRange.forEach(t => {
        ctx.fillRect(offsetX + t.x * tileSize + 2, offsetY + t.y * tileSize + 2, tileSize - 4, tileSize - 4);
        ctx.strokeStyle = "#3a86ff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(offsetX + t.x * tileSize + 2, offsetY + t.y * tileSize + 2, tileSize - 4, tileSize - 4);
      });

      // Action range (Red glow)
      ctx.fillStyle = "rgba(230, 57, 70, 0.4)";
      gameState.actionRange.forEach(t => {
        ctx.fillRect(offsetX + t.x * tileSize + 2, offsetY + t.y * tileSize + 2, tileSize - 4, tileSize - 4);
        ctx.strokeStyle = "#e63946";
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX + t.x * tileSize + 2, offsetY + t.y * tileSize + 2, tileSize - 4, tileSize - 4);
      });
    }
  }

  function drawUnits() {
    gameState.units.forEach(u => {
      if (u.hp <= 0) return;
      const ux = offsetX + u.x * tileSize + tileSize / 2;
      const uy = offsetY + u.y * tileSize + tileSize / 2;
      const rad = tileSize * 0.38;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(ux, uy + rad * 0.85, rad * 0.9, rad * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring based on Style
      ctx.strokeStyle = STYLE_COLORS[u.style] || "#fff";
      ctx.lineWidth = 3;
      ctx.fillStyle = u.isPlayer ? (u.hasActed ? "#555" : "#1d3557") : (u.hasActed ? "#666" : "#6a040f");
      ctx.beginPath();
      ctx.arc(ux, uy, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Icon / Number
      ctx.font = `${Math.floor(rad * 0.95)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(u.icon || "⚽", ux, uy);

      // Mini HP bar
      const barW = tileSize * 0.7;
      const barH = 4;
      const hpPct = Math.max(0, u.hp / u.maxHp);
      ctx.fillStyle = "#222";
      ctx.fillRect(ux - barW / 2, uy - rad - 8, barW, barH);
      ctx.fillStyle = hpPct > 0.5 ? "#06d6a0" : (hpPct > 0.25 ? "#ffd166" : "#ef476f");
      ctx.fillRect(ux - barW / 2, uy - rad - 8, barW * hpPct, barH);

      // Style badge in corner
      ctx.fillStyle = STYLE_COLORS[u.style];
      ctx.beginPath();
      ctx.arc(ux + rad * 0.7, uy + rad * 0.7, 5, 0, Math.PI * 2);
      ctx.fill();

      // Ball indicator if unit has the ball
      if (gameState.ballCarrier === u.id) {
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ux - rad * 0.6, uy + rad * 0.6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    // Free Ball if not carried
    if (!gameState.ballCarrier) {
      const bx = offsetX + gameState.ballPos.x * tileSize + tileSize / 2;
      const by = offsetY + gameState.ballPos.y * tileSize + tileSize / 2;
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  function drawDuelScreen() {
    const d = gameState.duelData;
    if (!d) return;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Dim Background
    ctx.fillStyle = "rgba(10, 15, 25, 0.88)";
    ctx.fillRect(0, 0, w, h);

    // Duel Banner Header
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(w * 0.1, h * 0.08, w * 0.8, 48);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.1, h * 0.08, w * 0.8, 48);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.isShot ? "⚽ TIRO IN PORTA · DUELLO DECISIVO" : "⚔️ CONTRASTO TATTICO DIRETTO", w * 0.5, h * 0.08 + 30);

    // Attacker Box (Left)
    const boxW = w * 0.36;
    const boxH = h * 0.55;
    const boxY = h * 0.2;

    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = STYLE_COLORS[d.attacker.style];
    ctx.lineWidth = 3;
    ctx.fillRect(w * 0.1, boxY, boxW, boxH);
    ctx.strokeRect(w * 0.1, boxY, boxW, boxH);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(d.attacker.name, w * 0.12, boxY + 32);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = STYLE_COLORS[d.attacker.style];
    ctx.fillText(STYLE_NAMES[d.attacker.style], w * 0.12, boxY + 54);

    ctx.font = "52px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.attacker.icon, w * 0.1 + boxW / 2, boxY + 120);

    // Attacker Stats
    ctx.font = "15px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "left";
    ctx.fillText(`HP: ${d.attacker.hp}/${d.attacker.maxHp}`, w * 0.13, boxY + 180);
    ctx.fillText(`ATK: ${d.attacker.atk}`, w * 0.13, boxY + 205);
    ctx.fillText(`HIT: ${d.hitRate}%`, w * 0.13, boxY + 230);
    ctx.fillText(`CRIT: ${d.critRate}%`, w * 0.13, boxY + 255);

    // VS Circle (Center)
    ctx.fillStyle = "#e63946";
    ctx.beginPath();
    ctx.arc(w * 0.5, boxY + boxH * 0.45, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VS", w * 0.5, boxY + boxH * 0.45);

    // Triangle Advantage note
    if (d.adv > 0) {
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("VANTAGGIO STILE (+HIT, +CRIT)", w * 0.5, boxY + boxH * 0.65);
    } else if (d.adv < 0) {
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("SVANTAGGIO STILE", w * 0.5, boxY + boxH * 0.65);
    }

    // Defender Box (Right)
    const rightX = w * 0.54;
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = STYLE_COLORS[d.defender.style];
    ctx.lineWidth = 3;
    ctx.fillRect(rightX, boxY, boxW, boxH);
    ctx.strokeRect(rightX, boxY, boxW, boxH);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(d.defender.name, rightX + 20, boxY + 32);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = STYLE_COLORS[d.defender.style];
    ctx.fillText(STYLE_NAMES[d.defender.style], rightX + 20, boxY + 54);

    ctx.font = "52px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.defender.icon, rightX + boxW / 2, boxY + 120);

    ctx.font = "15px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "left";
    ctx.fillText(`HP: ${d.defender.hp}/${d.defender.maxHp}`, rightX + 25, boxY + 180);
    ctx.fillText(`DEF: ${d.defender.def}`, rightX + 25, boxY + 205);
    ctx.fillText(`SPD: ${d.defender.spd}`, rightX + 25, boxY + 230);
    ctx.fillText(`SKL: ${d.defender.skl}`, rightX + 25, boxY + 255);

    // Duel Action Log
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(w * 0.1, h * 0.8, w * 0.8, 54);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";

    if (d.step === 0) {
      ctx.fillText("⚔️ Premere per sferrare l'azione!", w * 0.5, h * 0.8 + 32);
    } else if (d.step === 1) {
      if (d.attackerDmgDone > 0) {
        ctx.fillStyle = d.attackerCrit ? "#f59e0b" : "#22c55e";
        ctx.fillText(`${d.attackerCrit ? "💥 CRITICO! " : ""}${d.attacker.name} infligge ${d.attackerDmgDone} danni!`, w * 0.5, h * 0.8 + 32);
      } else {
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`${d.attacker.name} ha mancato l'impatto!`, w * 0.5, h * 0.8 + 32);
      }
    } else if (d.step === 2) {
      if (d.defenderDmgDone > 0) {
        ctx.fillStyle = "#ef4444";
        ctx.fillText(`Contrattacco! ${d.defender.name} risponde con ${d.defenderDmgDone} danni!`, w * 0.5, h * 0.8 + 32);
      } else {
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("Azione conclusa. Tocca per tornare al campo.", w * 0.5, h * 0.8 + 32);
      }
    }

    if (d.timer > 0) {
      d.timer--;
      if (d.timer === 0) resolveDuelStep();
    }
  }

  function drawDialogue() {
    const ch = CHAPTERS[gameState.chapter - 1];
    if (!ch || !ch.intro[gameState.dialogueStep]) {
      gameState.phase = "select";
      return;
    }
    const cur = ch.intro[gameState.dialogueStep];
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Dialogue Overlay
    ctx.fillStyle = "rgba(10, 15, 30, 0.75)";
    ctx.fillRect(0, 0, w, h);

    const boxH = 150;
    const boxY = h - boxH - 20;
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.fillRect(w * 0.05, boxY, w * 0.9, boxH);
    ctx.strokeRect(w * 0.05, boxY, w * 0.9, boxH);

    // Speaker Name
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`🗣️ ${cur.speaker}`, w * 0.08, boxY + 34);

    // Text Wrap
    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";
    wrapText(ctx, cur.text, w * 0.08, boxY + 70, w * 0.84, 24);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("Tocca per continuare ▸", w * 0.92, boxY + boxH - 15);
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  function drawHUD() {
    const w = canvas.width / (window.devicePixelRatio || 1);

    // Top Bar
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, 56);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 56);
    ctx.lineTo(w, 56);
    ctx.stroke();

    // Chapter Title
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Cap. ${gameState.chapter}: ${CHAPTERS[gameState.chapter - 1].title}`, 16, 24);

    // Score & Turn
    ctx.fillStyle = "#fff";
    ctx.font = "14px monospace";
    ctx.fillText(`Rondine ${gameState.score.player} - ${gameState.score.enemy} Rivals  |  Turno: ${gameState.turnCount} (${gameState.turn.toUpperCase()})`, 16, 44);

    // End Turn Button
    if (gameState.turn === "player" && gameState.phase === "select") {
      ctx.fillStyle = "#e63946";
      ctx.fillRect(w - 130, 10, 115, 36);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Passa Turno ⏩", w - 72, 33);
    }

    // Message bar at bottom
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(0, (canvas.height / (window.devicePixelRatio || 1)) - 36, w, 36);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(gameState.message, w / 2, (canvas.height / (window.devicePixelRatio || 1)) - 14);
  }

  function render() {
    if (!ctx) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);
    drawPitch();
    drawRanges();
    drawUnits();
    drawHUD();

    if (gameState.phase === "duel") {
      drawDuelScreen();
    } else if (gameState.phase === "dialogue") {
      drawDialogue();
    }

    animId = requestAnimationFrame(render);
  }

  // Pointer / Click Handler
  function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // In Dialogue phase
    if (gameState.phase === "dialogue") {
      gameState.dialogueStep++;
      const ch = CHAPTERS[gameState.chapter - 1];
      if (gameState.dialogueStep >= ch.intro.length) {
        gameState.phase = "select";
      }
      return;
    }

    // In Duel phase
    if (gameState.phase === "duel") {
      resolveDuelStep();
      return;
    }

    // Check End Turn button
    const w = rect.width;
    if (gameState.turn === "player" && px >= w - 130 && px <= w - 15 && py >= 10 && py <= 46) {
      if (window.HD2DAudio) window.HD2DAudio.playSelect();
      startEnemyTurn();
      return;
    }

    // Grid coordinates
    const gx = Math.floor((px - offsetX) / tileSize);
    const gy = Math.floor((py - offsetY) / tileSize);

    if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return;

    const clickedUnit = getUnitAt(gx, gy);

    if (gameState.phase === "select") {
      if (clickedUnit && clickedUnit.isPlayer && !clickedUnit.hasActed) {
        // Select player unit
        gameState.selectedUnit = clickedUnit;
        gameState.moveRange = computeMoveRange(clickedUnit);
        gameState.actionRange = computeActionRange(clickedUnit);
        gameState.message = `${clickedUnit.name} selezionato. Scegli una casella blu per muoverlo.`;
        if (window.HD2DAudio) window.HD2DAudio.playSelect();
      } else if (gameState.selectedUnit) {
        // Moving to tile
        const canMove = gameState.moveRange.some(t => t.x === gx && t.y === gy);
        if (canMove) {
          gameState.selectedUnit.x = gx;
          gameState.selectedUnit.y = gy;
          if (gameState.ballCarrier === gameState.selectedUnit.id) {
            gameState.ballPos = { x: gx, y: gy };
          }
          if (window.HD2DAudio) window.HD2DAudio.playBounce();

          // Recompute action range from new pos
          gameState.actionRange = computeActionRange(gameState.selectedUnit);
          gameState.moveRange = [];
          gameState.message = "Scegli un'azione: attacca un rivale rosso, passa o tocca il giocatore per confermare.";
        } else if (clickedUnit && !clickedUnit.isPlayer) {
          // If clicked directly on enemy in action range
          const canAction = gameState.actionRange.some(t => t.x === gx && t.y === gy);
          if (canAction) {
            startDuel(gameState.selectedUnit, clickedUnit, false);
          }
        } else {
          // Deselect
          gameState.selectedUnit = null;
          gameState.moveRange = [];
          gameState.actionRange = [];
        }
      }
    }
  }

  // Open Modal
  window.openTacticalEmblemMode = function (onExit) {
    onExitCallback = onExit;
    if (modal) {
      modal.remove();
      modal = null;
    }

    modal = document.createElement("div");
    modal.id = "tacticalEmblemModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "#050b14";
    modal.style.zIndex = "999999";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";

    modal.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 16px; background:#0b1320; border-bottom:1px solid #1e293b; color:#fff;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:22px;">🛡️</span>
          <div>
            <h2 style="margin:0; font-size:16px; font-weight:bold; color:#38bdf8;">Rondine Emblem · Il Torneo Tattico 2D HD</h2>
            <span style="font-size:11px; color:#94a3b8;">Tactical RPG Soccer · Triangolo Stile (Tecnica > Potenza > Velocità)</span>
          </div>
        </div>
        <button id="emblemCloseBtn" style="background:#e63946; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-weight:bold;">Chiudi ✕</button>
      </div>
      <div style="flex:1; position:relative; overflow:hidden;">
        <canvas id="emblemCanvas" style="width:100%; height:100%; display:block;"></canvas>
      </div>
    `;

    document.body.appendChild(modal);

    canvas = document.getElementById("emblemCanvas");
    ctx = canvas.getContext("2d");

    document.getElementById("emblemCloseBtn").onclick = function () {
      if (animId) cancelAnimationFrame(animId);
      modal.remove();
      modal = null;
      if (typeof onExitCallback === "function") onExitCallback();
    };

    canvas.addEventListener("click", handleCanvasClick);
    window.addEventListener("resize", resizeCanvas);

    initChapter(0);
    resizeCanvas();
    render();
  };
})();
