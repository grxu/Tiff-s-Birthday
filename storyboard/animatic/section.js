// Builds a 480p animatic for one storyboard section from the locked renders, in song time.
// Usage: node section.js <shot-prefix> [out.mp4]   e.g. node section.js V1
// Each shot: renders/<SHOT-ID>.jpg with a slow push-in, plus a transparent overlay
// (shot ID, song time, lyric, editor note). Audio is the matching slice of ../song.mp3.
const fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync, execSync } = require("child_process");
const { chromium } = require(execSync("npm root -g").toString().trim() + "/playwright");
global.window = {};
require(path.join(__dirname, "..", "data.js"));
const SB = window.SB;
const SEC = (process.argv[2] || "V1").toUpperCase();
const W = 854, H = 480, FPS = 24;
const all = SB.sections.flatMap((s) => s.shots.map((sh) => ({ ...sh, sec: s })));
const shots = all.filter((sh) => sh.id.split("-")[0] === SEC);
if (!shots.length) throw new Error("no shots in section " + SEC);
const endOf = (sh) => { const n = all[all.indexOf(sh) + 1]; return n ? n.t : SB.song.end; };
const T0 = shots[0].t, T1 = endOf(shots[shots.length - 1]);
const OUT = process.argv[3] || path.join(__dirname, `animatic-${SEC.toLowerCase()}-only-480p.mp4`);
const BUILD = fs.mkdtempSync(path.join(os.tmpdir(), "section-"));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (t) => { const m = Math.floor(t / 60), s = t - m * 60; return m + ":" + (s < 10 ? "0" : "") + s.toFixed(1); };

const overlay = (sh, dur) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=IBM+Plex+Mono:wght@500&display=block">
<style>*{box-sizing:border-box;margin:0}body{width:${W}px;height:${H}px;background:transparent;position:relative;overflow:hidden}
.tag{position:absolute;top:12px;left:12px;font:500 11px "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#fff;background:rgba(40,20,40,.62);border-radius:999px;padding:3px 10px}
.ui{position:absolute;top:12px;right:12px;max-width:380px;font:500 11px/1.35 "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#3a2140;background:rgba(255,255,255,.9);border-radius:8px;padding:4px 9px}
.cap{position:absolute;left:0;right:0;bottom:0;padding:26px 20px 14px;background:linear-gradient(180deg,rgba(40,20,40,0),rgba(40,20,40,.78) 55%);color:#fff;font:800 19px/1.15 "Baloo 2","DejaVu Sans",sans-serif;text-align:center;text-wrap:balance}
</style></head><body><div class="tag">${esc(sh.id)} · ${fmt(sh.t)} · ${dur.toFixed(1)}s${sh.gen && /Editor/.test(sh.gen.how) ? " · EDITOR" : ""}</div>
${sh.ui ? `<div class="ui">EDIT ▸ ${esc(sh.ui)}</div>` : ""}
<div class="cap">${esc(sh.lyric === "(same line)" ? "" : sh.lyric)}</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  const parts = [];
  for (const [i, sh] of shots.entries()) {
    const img = ["jpg", "jpeg", "png"].map((e) => path.join(__dirname, "renders", `${sh.id}.${e}`)).find(fs.existsSync);
    if (!img) throw new Error("missing render for " + sh.id);
    const f0 = Math.round((sh.t - T0) * FPS), f1 = Math.round((endOf(sh) - T0) * FPS), n = f1 - f0;
    await p.setContent(overlay(sh, (f1 - f0) / FPS), { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const ov = path.join(BUILD, `ov-${i}.png`);
    await p.screenshot({ path: ov, omitBackground: true });
    const seg = path.join(BUILD, `seg-${String(i).padStart(2, "0")}.mp4`);
    // slow push-in (1.00 -> 1.06) on a 2x plate for smooth sub-pixel motion
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-loop", "1", "-i", img, "-i", ov, "-filter_complex",
      `[0]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},zoompan=z='1+0.06*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=${W}x${H}:fps=${FPS}[bg];[bg][1]overlay,format=yuv420p`,
      "-frames:v", String(n), "-c:v", "libx264", "-preset", "medium", "-crf", "22", seg]);
    parts.push(`file '${seg}'`);
    console.log(sh.id, fmt(sh.t), n + "f");
  }
  await b.close();
  fs.writeFileSync(path.join(BUILD, "list.txt"), parts.join("\n") + "\n");
  const dur = (T1 - T0).toFixed(3);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(BUILD, "list.txt"),
    "-ss", T0.toFixed(3), "-t", dur, "-i", path.join(__dirname, "..", "song.mp3"),
    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-af", "afade=t=in:d=0.15,afade=t=out:st=" + (T1 - T0 - 0.4).toFixed(3) + ":d=0.4",
    "-t", dur, "-movflags", "+faststart", OUT]);
  fs.rmSync(BUILD, { recursive: true, force: true });
  console.log(`${OUT}  song ${fmt(T0)} to ${fmt(T1)} (${dur}s)`);
})();
