// Builds an animatic from the locked renders, in song time.
// Usage: node section.js <shot-prefix|ALL> [height] [out.mp4]   e.g. node section.js V1, node section.js ALL 560
// Each shot: renders/<SHOT-ID>.jpg with a slow push-in, plus a transparent overlay
// (shot ID, song time, lyric, editor note). Extra frames split the shot evenly:
// <ID>b/c/d… are further cuts or push-in steps, <ID>-end is the end frame of a start+end shot.
// Shots without a render fall back to their storyboard card (ALL only). IDs listed in
// renders/wip.txt are tagged WIP. Audio is the matching slice of ../song.mp3.
const fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync, execSync } = require("child_process");
const { chromium } = require(execSync("npm root -g").toString().trim() + "/playwright");
const cards = require("./cards.js");
const SB = window.SB;
const SEC = (process.argv[2] || "V1").toUpperCase();
const H = parseInt(process.argv[3] || "480", 10), W = Math.round((H * 16) / 9 / 2) * 2, FPS = 24;
const BW = 854, BH = 480; // overlays and cards are laid out at 854x480 and scaled up
const all = cards.all;
const shots = SEC === "ALL" ? all : all.filter((sh) => sh.id.split("-")[0] === SEC);
if (!shots.length) throw new Error("no shots in section " + SEC);
const endOf = (sh) => { const n = all[all.indexOf(sh) + 1]; return n ? n.t : SB.song.end; };
const T0 = shots[0].t, T1 = endOf(shots[shots.length - 1]);
const OUT = process.argv[4] || path.join(__dirname, SEC === "ALL" ? `animatic-all-${H}p.mp4` : `animatic-${SEC.toLowerCase()}-only-${H}p.mp4`);
const BUILD = fs.mkdtempSync(path.join(os.tmpdir(), "section-"));
const RENDERS = path.join(__dirname, "renders");
const WIPFILE = path.join(RENDERS, "wip.txt");
const WIP = new Set(fs.existsSync(WIPFILE) ? fs.readFileSync(WIPFILE, "utf8").split(/\s+/).filter((l) => l && !l.startsWith("#")) : []);
const find = (name) => ["jpg", "jpeg", "png"].map((e) => path.join(RENDERS, `${name}.${e}`)).find(fs.existsSync);
const frames = (id) => {
  const base = find(id);
  if (!base) return [];
  const out = [{ img: base, label: "" }];
  for (const s of "bcdef") { const f = find(id + s); if (f) out.push({ img: f, label: "" }); }
  const end = find(id + "-end");
  if (end) { out[0].label = "START"; out.push({ img: end, label: "END" }); }
  else if (out.length > 1) out.forEach((f, j) => (f.label = `${j + 1}/${out.length}`));
  return out;
};
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (t) => { const neg = t < 0; t = Math.abs(t); const m = Math.floor(t / 60), s = t - m * 60; return (neg ? "−" : "") + m + ":" + (s < 10 ? "0" : "") + s.toFixed(1); };

const overlay = (sh, dur, label, name) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=IBM+Plex+Mono:wght@500&display=block">
<style>*{box-sizing:border-box;margin:0}body{width:${BW}px;height:${BH}px;background:transparent;position:relative;overflow:hidden}
.tag{position:absolute;top:12px;left:12px;font:500 11px "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#fff;background:rgba(40,20,40,.62);border-radius:999px;padding:3px 10px}
.tag b{color:#ffd23f;font-weight:500}
.ui{position:absolute;top:12px;right:12px;max-width:380px;font:500 11px/1.35 "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#3a2140;background:rgba(255,255,255,.9);border-radius:8px;padding:4px 9px}
.cap{position:absolute;left:0;right:0;bottom:0;padding:26px 20px 14px;background:linear-gradient(180deg,rgba(40,20,40,0),rgba(40,20,40,.78) 55%);color:#fff;font:800 19px/1.15 "Baloo 2","DejaVu Sans",sans-serif;text-align:center;text-wrap:balance}
</style></head><body><div class="tag">${esc(sh.id)}${label ? " " + esc(label) : ""} · ${fmt(sh.t)} · ${dur.toFixed(1)}s${sh.gen && /Editor/.test(sh.gen.how) ? " · EDITOR" : ""}${WIP.has(sh.id) || WIP.has(name) ? " · <b>WIP</b>" : ""}</div>
${sh.ui ? `<div class="ui">EDIT ▸ ${esc(sh.ui)}</div>` : ""}
<div class="cap">${esc(sh.lyric === "(same line)" ? "" : sh.lyric)}</div></body></html>`;

const enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "22", "-pix_fmt", "yuv420p", "-r", String(FPS)];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: BW, height: BH }, deviceScaleFactor: H / BH });
  const parts = [];
  let k = 0, nRender = 0, nCard = 0;
  for (const sh of shots) {
    const f0 = Math.round((sh.t - T0) * FPS), f1 = Math.round((endOf(sh) - T0) * FPS), n = f1 - f0;
    const fr = frames(sh.id);
    if (!fr.length) {
      if (SEC !== "ALL") throw new Error("missing render for " + sh.id);
      await p.setContent(cards.html(sh, all.indexOf(sh)), { waitUntil: "networkidle" });
      await p.evaluate(() => document.fonts.ready);
      const png = path.join(BUILD, `card-${k}.png`);
      await p.screenshot({ path: png });
      const seg = path.join(BUILD, `seg-${String(k++).padStart(3, "0")}.mp4`);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-loop", "1", "-i", png, "-vf", `scale=${W}:${H},format=yuv420p`, "-frames:v", String(n), ...enc, seg]);
      parts.push(`file '${seg}'`);
      nCard++;
      console.log(sh.id, fmt(sh.t), n + "f", "card");
      continue;
    }
    for (const [j, f] of fr.entries()) {
      const a = Math.round((n * j) / fr.length), m = Math.round((n * (j + 1)) / fr.length) - a;
      await p.setContent(overlay(sh, (f1 - f0) / FPS, f.label, path.parse(f.img).name), { waitUntil: "networkidle" });
      await p.evaluate(() => document.fonts.ready);
      const ov = path.join(BUILD, `ov-${k}.png`);
      await p.screenshot({ path: ov, omitBackground: true });
      const seg = path.join(BUILD, `seg-${String(k++).padStart(3, "0")}.mp4`);
      // slow push-in (1.00 -> 1.06) on a 2x plate for smooth sub-pixel motion
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-loop", "1", "-i", f.img, "-i", ov, "-filter_complex",
        `[0]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},zoompan=z='1+0.06*on/${m}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${m}:s=${W}x${H}:fps=${FPS}[bg];[1]scale=${W}:${H}[ov];[bg][ov]overlay,format=yuv420p`,
        "-frames:v", String(m), ...enc, seg]);
      parts.push(`file '${seg}'`);
      nRender++;
    }
    console.log(sh.id, fmt(sh.t), n + "f", fr.length + " frame(s)");
  }
  await b.close();
  fs.writeFileSync(path.join(BUILD, "list.txt"), parts.join("\n") + "\n");
  const dur = T1 - T0, delay = Math.max(0, -T0) * 1000;
  // song time 0 is the start of song.mp3; a negative T0 is silent pre-roll
  const audio = T0 < 0
    ? ["-i", path.join(__dirname, "..", "song.mp3")]
    : ["-ss", T0.toFixed(3), "-i", path.join(__dirname, "..", "song.mp3")];
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(BUILD, "list.txt"), ...audio,
    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
    "-af", `adelay=${delay}:all=1,apad,afade=t=in:d=0.15,afade=t=out:st=${(dur - 0.4).toFixed(3)}:d=0.4`,
    "-t", dur.toFixed(3), "-movflags", "+faststart", OUT]);
  fs.rmSync(BUILD, { recursive: true, force: true });
  console.log(`${OUT}  ${W}x${H}  song ${fmt(T0)} to ${fmt(T1)} (${dur.toFixed(1)}s)  ${nRender} render frames, ${nCard} cards`);
})();
