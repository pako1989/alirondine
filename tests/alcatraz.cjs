// tests/alcatraz.cjs - Test completo BFS, grafica e validazione per «Fuga da Alcatraz FC»
const fs = require('fs');
const path = require('path');

// Mock browser environment
const window = {
  addEventListener: () => {},
  document: {
    addEventListener: () => {},
    createElement: () => ({
      setHeader: () => {},
      setAttribute: () => {},
      textContent: "",
      appendChild: () => {},
      style: {},
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      querySelector: () => null,
      querySelectorAll: () => []
    }),
    head: { appendChild: () => {} },
    body: { appendChild: () => {} },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  },
  location: { search: "?debug=1" },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  AudioContext: class {
    constructor() { this.currentTime = 0; this.sampleRate = 44100; this.state = "running"; }
    createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
    createOscillator() { return { frequency: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
    createBuffer() { return { getChannelData: () => new Float32Array(1024) }; }
    createBufferSource() { return { connect: () => {}, start: () => {} }; }
    createBiquadFilter() { return { frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
    resume() {}
  },
  __borgoApi: {
    TRZ: () => {}, trGo: () => {}, play: () => {}, scene: () => {}, match: () => {}, matchPick: () => {}, trZone: () => "", COSM: {}
  }
};
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.location = window.location;

// 1. Load saga-core
const sagaCoreCode = fs.readFileSync(path.join(__dirname, '../js/saga-core.js'), 'utf8');
eval(sagaCoreCode);

// 2. Load alcatraz match engine
const matchCode = fs.readFileSync(path.join(__dirname, '../js/alcatraz-partita.js'), 'utf8');
eval(matchCode);

// 3. Load alcatraz core
const alcatrazCode = fs.readFileSync(path.join(__dirname, '../js/alcatraz.js'), 'utf8');
eval(alcatrazCode);

// 4. Load chapter 1
const c1Code = fs.readFileSync(path.join(__dirname, '../js/alcatraz-c1.js'), 'utf8');
eval(c1Code);

console.log("✓ Files loaded and evaluated successfully!");

const G = window.__alcatraz;
if (!G) {
  console.error("FAIL: window.__alcatraz not found!");
  process.exit(1);
}

// Verifica engine partita
if (!window.__alcatrazMatch || typeof window.__alcatrazMatch.start !== "function") {
  console.error("FAIL: window.__alcatrazMatch.start is missing!");
  process.exit(1);
}
console.log("✓ window.__alcatrazMatch engine verified!");

const dbg = G._dbg;
if (!dbg) {
  console.error("FAIL: G._dbg is undefined!");
  process.exit(1);
}
const allZones = dbg.ZONES || {};
const zoneKeys = Object.keys(allZones);
console.log(`Found ${zoneKeys.length} zones in dbg.ZONES:`, zoneKeys);

let allPassed = true;

// BFS Reachability test
zoneKeys.forEach((zid) => {
  const entry = allZones[zid];
  const spec = (entry && entry.spec) || entry;
  if (!spec) return;

  const w = spec.w, h = spec.h;
  const grid = Array.from({ length: h }, () => Array(w).fill("."));

  const builder = {
    lay(x1, y1, x2, y2, ch) {
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          if (x >= 0 && x < w && y >= 0 && y < h) grid[y][x] = ch;
        }
      }
    },
    put(x, y, ch) {
      if (x >= 0 && x < w && y >= 0 && y < h) grid[y][x] = ch;
    },
    house(x, y, hw, hh, cfg) {
      builder.lay(x, y, x + hw - 1, y + hh - 1, "#");
      if (cfg && cfg.door) {
        builder.put(cfg.door[0], cfg.door[1], cfg.enter ? "q" : "+");
      }
    }
  };

  if (typeof spec.build === "function") {
    spec.build(builder);
  }

  const start = spec.start || [2, 2];
  const [sx, sy] = start;

  // Solid tiles definition
  const solidSet = new Set((spec.solid || "WRFPB#~T").split(""));

  if (solidSet.has(grid[sy][sx])) {
    console.error(`FAIL: Start position [${sx}, ${sy}] in zone ${zid} is on solid tile '${grid[sy][sx]}'!`);
    allPassed = false;
  }

  // BFS
  const visited = Array.from({ length: h }, () => Array(w).fill(false));
  const queue = [[sx, sy]];
  visited[sy][sx] = true;

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[ny][nx]) {
        const cell = grid[ny][nx];
        if (!solidSet.has(cell)) {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Verifica che gli NPC siano raggiungibili
  for (let step = 0; step <= 3; step++) {
    const npcs = typeof spec.npcs === "function" ? spec.npcs(step) : (Array.isArray(spec.npcs) ? spec.npcs : []);
    npcs.forEach((npc) => {
      const [nx, ny] = npc.at;
      const reachable = visited[ny][nx] ||
        (nx > 0 && visited[ny][nx - 1]) ||
        (nx < w - 1 && visited[ny][nx + 1]) ||
        (ny > 0 && visited[ny - 1][nx]) ||
        (ny < h - 1 && visited[ny + 1][nx]);
      if (!reachable) {
        console.error(`FAIL: NPC ${npc.id} in zone ${zid} at [${nx}, ${ny}] is unreachable!`);
        allPassed = false;
      }
    });
  }

  // Verifica che gli items siano raggiungibili
  (spec.items || []).forEach(([ix, iy]) => {
    const reachable = visited[iy][ix] ||
      (ix > 0 && visited[iy][ix - 1]) ||
      (ix < w - 1 && visited[iy][ix + 1]) ||
      (iy > 0 && visited[iy - 1][ix]) ||
      (iy < h - 1 && visited[iy + 1][ix]);
    if (!reachable) {
      console.error(`FAIL: Item in zone ${zid} at [${ix}, ${iy}] is unreachable!`);
      allPassed = false;
    }
  });

  console.log(`✓ Zone ${zid} BFS passed (${w}x${h}) from [${sx}, ${sy}]`);
});

// Test bg scenarios
const bgCode = fs.readFileSync(path.join(__dirname, '../js/bg-scenarios.js'), 'utf8');
eval(bgCode);

const LB = window.__lbBg && window.__lbBg.LB;
if (!LB) {
  console.error("FAIL: window.__lbBg.LB not found!");
  process.exit(1);
}

["alc_titolo", "alc_cortile", "alc_celle"].forEach((k) => {
  const def = LB[k];
  if (!def) {
    console.error(`FAIL: Scenario key '${k}' missing in LB!`);
    allPassed = false;
  } else {
    if (!def.hot || def.hot.length < 3) {
      console.error(`FAIL: Scenario '${k}' has fewer than 3 clickable hotspots!`);
      allPassed = false;
    } else {
      console.log(`✓ Scenario ${k} has ${def.hot.length} clickable hotspots.`);
    }

    // Prova di disegno
    if (typeof def.draw === "function") {
      const mockG = {
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 1,
        fillRect: () => {},
        strokeRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        arc: () => {},
        ellipse: () => {},
        fill: () => {},
        stroke: () => {},
        quadraticCurveTo: () => {},
        bezierCurveTo: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        globalAlpha: 1,
        globalCompositeOperation: "source-over"
      };
      try {
        def.draw(mockG, 360, 210, 0);
        console.log(`✓ Scenario ${k} drawn without errors.`);
      } catch (err) {
        console.error(`FAIL: Error drawing scenario ${k}:`, err);
        allPassed = false;
      }
    }
  }
});

// Test match engine state
try {
  const match = window.__alcatrazMatch.start({
    teamA: "Braccio Ovest",
    opp: "Braccio Est",
    onDone: (res) => {}
  });
  if (!window.__alcatrazMatch.state || typeof window.__alcatrazMatch.state.finish !== "function") {
    console.error("FAIL: window.__alcatrazMatch.state or finish() missing!");
    allPassed = false;
  } else {
    console.log("✓ window.__alcatrazMatch.state.finish() successfully verified.");
  }
} catch (err) {
  console.error("FAIL: Error testing match engine:", err);
  allPassed = false;
}

if (allPassed) {
  console.log("=========================================");
  console.log("✓ ALL CHECKS PASSED FOR FUGA DA ALCATRAZ FC!");
  console.log("=========================================");
  process.exit(0);
} else {
  console.error("VALIDATION FAILED!");
  process.exit(1);
}
