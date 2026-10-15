// tests/treno.cjs - Test completo BFS, grafica e validazione per «L'Espresso delle Ombre»
const fs = require('fs');
const path = require('path');

// Mock browser environment
const window = {
  addEventListener: () => {},
  removeEventListener: () => {},
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

// 2. Load corridoio match engine
const corridoioCode = fs.readFileSync(path.join(__dirname, '../js/corridoio.js'), 'utf8');
eval(corridoioCode);

// 3. Load treno core
const trenoCode = fs.readFileSync(path.join(__dirname, '../js/treno.js'), 'utf8');
eval(trenoCode);

// 4. Load chapters 1, 2, 3
const c1Code = fs.readFileSync(path.join(__dirname, '../js/treno-c1.js'), 'utf8');
eval(c1Code);
const c2Code = fs.readFileSync(path.join(__dirname, '../js/treno-c2.js'), 'utf8');
eval(c2Code);
const c3Code = fs.readFileSync(path.join(__dirname, '../js/treno-c3.js'), 'utf8');
eval(c3Code);

console.log("✓ Files loaded and evaluated successfully!");

const G = window.__treno;
if (!G) {
  console.error("FAIL: window.__treno not found!");
  process.exit(1);
}

// Verifica engine corridoio
if (!window.__corridoio || typeof window.__corridoio.start !== "function") {
  console.error("FAIL: window.__corridoio.start is missing!");
  process.exit(1);
}
console.log("✓ window.__corridoio engine verified!");

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
      builder.lay(x, y, x + hw - 1, y + hh - 1, "A");
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
  const solidSet = new Set((spec.solid || "SPFTBA#wWCcKkV").split(""));

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
console.log("✓ Motore Scenari e Sfondi 2D Dettagliati caricato con successo");

// Mock Canvas 2D context per testare il disegno
const mockContext = {
  fillRect: () => {},
  strokeRect: () => {},
  clearRect: () => {},
  beginPath: () => {},
  closePath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  arc: () => {},
  ellipse: () => {},
  fill: () => {},
  stroke: () => {},
  save: () => {},
  restore: () => {},
  createLinearGradient: () => ({ addColorStop: () => {} }),
  createRadialGradient: () => ({ addColorStop: () => {} }),
  fillText: () => {},
  strokeText: () => {},
  setLineDash: () => {},
  drawImage: () => {}
};

const teScenarios = [
  "te_titolo",
  "te_ristorante",
  "te_corridoio",
  "te_scompartimento",
  "te_bagagliaio",
  "te_cuccette",
  "te_caldaie",
  "te_tetto",
  "te_panoramico",
  "te_stazione"
];

teScenarios.forEach((sid) => {
  const sc = LB[sid];
  if (!sc) {
    console.error(`FAIL: Scenario ${sid} missing in LB!`);
    allPassed = false;
    return;
  }
  if (!Array.isArray(sc.hot) || sc.hot.length < 4) {
    console.error(`FAIL: Scenario ${sid} has less than 4 clickable hotspots (found ${sc.hot ? sc.hot.length : 0})!`);
    allPassed = false;
  } else {
    console.log(`✓ Scenario ${sid} has ${sc.hot.length} clickable hotspots.`);
  }

  // Prova a disegnare lo scenario senza errori
  try {
    if (typeof sc.draw === "function") {
      sc.draw(mockContext, 360, 210, 10);
      console.log(`✓ Scenario ${sid} drawn without errors.`);
    }
  } catch (err) {
    console.error(`FAIL: Error drawing scenario ${sid}:`, err);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error("✗ Some tests failed!");
  process.exit(1);
}

console.log("=========================================");
console.log("✓ ALL CHECKS PASSED FOR L'ESPRESSO DELLE OMBRE!");
console.log("=========================================");
process.exit(0);
