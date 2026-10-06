// Renders one 854x480 PNG card per storyboard shot and writes concat.txt for ffmpeg.
const fs = require("fs"), path = require("path");
const { chromium } = require(require("child_process").execSync("npm root -g").toString().trim() + "/playwright");
global.window = {};
require(path.join(__dirname, "..", "data.js"));
const SB = window.SB;
const OUT = process.argv[2] || path.join(__dirname, "build");
fs.mkdirSync(OUT, { recursive: true });
const PRE = 3, FPS = 24;
const all = [];
SB.sections.forEach((sec) => sec.shots.forEach((sh) => all.push({ ...sh, sec })));
const END = SB.song.end; // 258.6 incl. 3s tag after the song
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (t) => { const neg = t < 0; t = Math.abs(t); const m = Math.floor(t / 60), s = t - m * 60; return (neg ? "−" : "") + m + ":" + (s < 10 ? "0" : "") + s.toFixed(1); };
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s);
const modeName = { gag: "GAG", heart: "HEART", epic: "EPIC" };
// Approved or test renders: renders/<SHOT-ID>.jpg|png replaces that shot's text card.
const RENDERS = path.join(__dirname, "renders");
function renderFor(id) {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const f = path.join(RENDERS, `${id}.${ext}`);
    if (fs.existsSync(f)) return `data:image/${ext === "jpg" ? "jpeg" : ext};base64,` + fs.readFileSync(f).toString("base64");
  }
  return null;
}
function renderHtml(sh, i, img) {
  const d = ((all[i + 1] ? all[i + 1].t : END) - sh.t).toFixed(1);
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=IBM+Plex+Mono:wght@500&display=block">
<style>
*{box-sizing:border-box;margin:0}
body{width:854px;height:480px;overflow:hidden;background:#000;position:relative}
img{position:absolute;inset:0;width:854px;height:480px;object-fit:cover}
.cap{position:absolute;left:0;right:0;bottom:0;height:96px;padding:14px 18px 40px;background:linear-gradient(180deg,rgba(10,12,30,0),rgba(10,12,30,.82) 40%);color:#fff;display:flex;align-items:flex-end;gap:12px}
.id{font:800 18px "Baloo 2","DejaVu Sans",sans-serif;white-space:nowrap}
.ly{font:700 17px/1.15 "Baloo 2","DejaVu Sans",sans-serif;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.tag{position:absolute;top:12px;right:12px;font:500 11px "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#fff;background:rgba(10,12,30,.6);border-radius:999px;padding:3px 10px}
</style></head><body><img src="${img}"><div class="tag">TEST RENDER · ${esc(sh.sec.name)} · ${fmt(sh.t)} · ${d}s</div>
<div class="cap"><span class="id">${esc(sh.id)}</span><span class="ly">${esc(sh.lyric)}</span></div></body></html>`;
}
function html(sh, i) {
  const [c0, c1] = sh.sec.palette;
  const d = ((all[i + 1] ? all[i + 1].t : END) - sh.t).toFixed(1);
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Figtree:wght@500;600&family=IBM+Plex+Mono:wght@500&display=block">
<style>
*{box-sizing:border-box;margin:0}
body{width:854px;height:480px;overflow:hidden;font-family:Figtree,"DejaVu Sans",sans-serif;background:linear-gradient(135deg,${c0},${c1});position:relative}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,18,40,.55),rgba(15,18,40,.78))}
.wrap{position:absolute;inset:0;padding:22px 30px 40px;display:flex;flex-direction:column;gap:10px;color:#fff}
.top{display:flex;justify-content:space-between;align-items:center;font:500 13px "IBM Plex Mono","DejaVu Sans Mono",monospace;letter-spacing:.03em}
.id{font:800 22px "Baloo 2","DejaVu Sans",sans-serif;letter-spacing:0;margin-right:10px}
.chips{display:flex;gap:6px}
.chip{background:rgba(255,255,255,.18);border-radius:999px;padding:2px 9px}
.chip.p1{background:#2F6BFF}
.chip.gag{background:rgba(255,210,63,.35)} .chip.heart{background:rgba(255,122,182,.4)} .chip.epic{background:rgba(120,130,255,.45)}
.lyric{font:800 ${sh.lyric.length > 52 ? 30 : 36}px/1.12 "Baloo 2","DejaVu Sans",sans-serif;margin-top:14px;text-wrap:balance}
.action{font:500 16px/1.4 Figtree,"DejaVu Sans",sans-serif;opacity:.92;max-width:760px}
.cam{font:500 12px "IBM Plex Mono","DejaVu Sans Mono",monospace;opacity:.75}
.ui{margin-top:auto;align-self:flex-start;background:#fff;color:#1B2140;border-radius:12px;padding:7px 12px;font:600 14px/1.3 Figtree,"DejaVu Sans",sans-serif;max-width:700px;box-shadow:0 3px 0 rgba(0,0,0,.25)}
.spacer{margin-top:auto}
</style></head><body><div class="shade"></div><div class="wrap">
<div class="top"><div><span class="id">${esc(sh.id)}</span>${esc(sh.sec.name)} · ${fmt(sh.t)} · ${d}s</div>
<div class="chips">${sh.p === 1 ? '<span class="chip p1">P1</span>' : `<span class="chip">P${sh.p}</span>`}<span class="chip ${sh.mode}">${modeName[sh.mode]}</span><span class="chip">${esc(sh.size)}</span></div></div>
<div class="lyric">${esc(sh.lyric)}</div>
<div class="action">${esc(clip(sh.action, 230))}</div>
<div class="cam">CAM · ${esc(clip(sh.cam, 90))}</div>
${sh.ui ? `<div class="ui">${esc(clip(sh.ui, 110))}</div>` : '<div class="spacer"></div>'}
</div></body></html>`;
}
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 854, height: 480 } });
  const lines = [];
  for (let i = 0; i < all.length; i++) {
    const sh = all[i];
    const img = renderFor(sh.id);
    await p.setContent(img ? renderHtml(sh, i, img) : html(sh, i), { waitUntil: "networkidle" });
    if (img) console.log("render:", sh.id);
    await p.evaluate(() => document.fonts.ready);
    const file = path.join(OUT, `${String(i).padStart(3, "0")}-${sh.id}.png`);
    await p.screenshot({ path: file });
    // frame-accurate durations on the video timeline (song time + PRE)
    const f0 = Math.round((sh.t + PRE) * FPS), f1 = Math.round(((all[i + 1] ? all[i + 1].t : END) + PRE) * FPS);
    lines.push(`file '${file}'`, `duration ${((f1 - f0) / FPS).toFixed(6)}`);
  }
  lines.push(`file '${path.join(OUT, `${String(all.length - 1).padStart(3, "0")}-${all[all.length - 1].id}.png`)}'`);
  fs.writeFileSync(path.join(OUT, "concat.txt"), lines.join("\n") + "\n");
  console.log("cards", all.length, "total", (END + PRE).toFixed(1) + "s");
  await b.close();
})();
