// tools/bump.cjs - aggiorna le versioni prima di pubblicare, così i telefoni non tengono file vecchi in cache
//  - in index.html alza il ?v= dei file js/css cambiati (rispetto all'ultimo commit, o quelli passati per nome)
//  - in sw.js alza il numero della cache (alirondine-vN) e aggiunge alla lista i file js nuovi
// Uso: npm run bump            ·  node tools/bump.cjs js/vento.js js/vento-c1.js
const fs = require("fs"), path = require("path"), { execSync } = require("child_process");
const ROOT = path.join(__dirname, "..");
const sh = (c) => { try { return execSync(c, { cwd: ROOT, encoding: "utf8" }); } catch (e) { return ""; } };
let files = process.argv.slice(2);
if (!files.length) files = [...sh("git diff --name-only HEAD"), ...[]].join("").split("\n").concat(sh("git ls-files --others --exclude-standard").split("\n"));
files = [...new Set(files.map((f) => f.trim()).filter((f) => /^(js|css)\/.+\.(js|css)$/.test(f)))];
let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
const out = [];
files.forEach((f) => {
  const re = new RegExp(`(["'])${f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\?v=(\\d+))?(["'])`);
  const m = html.match(re);
  if (m) { const v = m[3] ? +m[3] + 1 : 1; html = html.replace(re, `$1${f}?v=${v}$4`); out.push(`${f} → v${v}`); }
  if (f.endsWith(".js") && !sw.includes(`"./${f}"`) && m) { sw = sw.replace(/("\.\/js\/salone\.js",)/, `$1"./${f}",`); out.push(`${f} aggiunto alla cache`); }
});
const cv = sw.match(/alirondine-v(\d+)/); if (cv) { sw = sw.replace(cv[0], `alirondine-v${+cv[1] + 1}`); out.push(`cache → alirondine-v${+cv[1] + 1}`); }
fs.writeFileSync(path.join(ROOT, "index.html"), html); fs.writeFileSync(path.join(ROOT, "sw.js"), sw);
console.log(out.length ? out.join("\n") : "Niente da aggiornare.");
