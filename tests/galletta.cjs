// tests/galletta.cjs - Test completo BFS e validazione per «S.O.S. Galletta: I Bucanieri del Biscotto»
const fs = require('fs');
const path = require('path');

// Mock browser environment
const window = {
  addEventListener: () => {},
  document: {
    addEventListener: () => {},
    createElement: () => ({ setHeader: () => {}, setAttribute: () => {}, textContent: "", appendChild: () => {}, style: {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} }, querySelector: () => null, querySelectorAll: () => [] }),
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

// Load saga-core first
const sagaCoreCode = fs.readFileSync(path.join(__dirname, '../js/saga-core.js'), 'utf8');
eval(sagaCoreCode);

// Load arrembaggio match engine
const arrembaggioCode = fs.readFileSync(path.join(__dirname, '../js/arrembaggio.js'), 'utf8');
eval(arrembaggioCode);

// Load galletta core
const gallettaCode = fs.readFileSync(path.join(__dirname, '../js/galletta.js'), 'utf8');
eval(gallettaCode);

// Load chapters 1, 2, 3
const c1Code = fs.readFileSync(path.join(__dirname, '../js/galletta-c1.js'), 'utf8');
eval(c1Code);
const c2Code = fs.readFileSync(path.join(__dirname, '../js/galletta-c2.js'), 'utf8');
eval(c2Code);
const c3Code = fs.readFileSync(path.join(__dirname, '../js/galletta-c3.js'), 'utf8');
eval(c3Code);

console.log("✓ Files loaded and evaluated successfully!");

const G = window.__galletta;
if (!G) {
  console.error("FAIL: window.__galletta not found!");
  process.exit(1);
}

const info = G.info();
console.log("Saga info:", { title: info.title, chapters: info.chN, key: info.key });

// Test arrembaggio engine
if (!window.__arrembaggio || typeof window.__arrembaggio.start !== "function") {
  console.error("FAIL: window.__arrembaggio.start is missing!");
  process.exit(1);
}
console.log("✓ window.__arrembaggio engine verified!");

const dbg = G._dbg;
if (!dbg) {
  console.error("FAIL: G._dbg is undefined!");
  process.exit(1);
}
const allZones = dbg.ZONES || {};
const zoneKeys = Object.keys(allZones);
console.log(`Found ${zoneKeys.length} zones in dbg.ZONES:`, zoneKeys);

let allPassed = true;

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
  const solidSet = new Set((spec.solid || "SPFTBA#wWCcKk").split(""));

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
        // Camminabile se non solido
        if (!solidSet.has(cell)) {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Verifica che gli NPC siano adiacenti o su caselle raggiungibili
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

if (allPassed) {
  console.log("ALL BFS CHECKS PASSED FOR GALLETTA SAGA!");
  process.exit(0);
} else {
  console.error("BFS CHECKS FAILED!");
  process.exit(1);
}
