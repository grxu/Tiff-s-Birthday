// Builds an animatic from the locked renders, in song time.
// Usage: node section.js <shot-prefix|ALL> [height] [out.mp4]   e.g. node section.js V1, node section.js ALL (1080p default)
// plan.js picks each shot's picture: its Kling clip, its stills (each with a slow push-in; extra frames split the shot
// evenly) or its full-frame overlay. On top go the on-screen text (../overlays/png) and an info overlay (shot ID,
// song time, lyric, editor note). Clips run longer than their shots (min 3s): start+end clips are sped up to fit so
// the end frame lands; the rest play at real speed, cut at the shot's end. Shots with no picture fall back to their
// storyboard card (ALL only). IDs listed in renders/wip.txt are tagged WIP. Audio is the matching slice of ../song.mp3.
const fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync, execSync } = require("child_process");
const { chromium } = require(execSync("npm root -g").toString().trim() + "/playwright");
const cards = require("./cards.js");
const { all, SB, endOf, plan } = require("./plan.js");
const SEC = (process.argv[2] || "V1").toUpperCase();
const H = parseInt(process.argv[3] || "1080", 10), W = Math.round((H * 16) / 9 / 2) * 2, FPS = 24;
const BW = 854, BH = 480; // overlays and cards are laid out at 854x480 and scaled up
const shots = SEC === "ALL" ? all : all.filter((sh) => sh.id.split("-")[0] === SEC);
if (!shots.length) throw new Error("no shots in section " + SEC);
const T0 = shots[0].t, T1 = endOf(shots[shots.length - 1]);
const OUT = process.argv[4] || path.join(__dirname, SEC === "ALL" ? `animatic-all-${H}p.mp4` : `animatic-${SEC.toLowerCase()}-only-${H}p.mp4`);
const BUILD = fs.mkdtempSync(path.join(os.tmpdir(), "section-"));
const WIPFILE = path.join(__dirname, "renders", "wip.txt");
// on-screen text and graphics from ../overlays (node render.js there); NOTEXT=1 leaves them out
const TEXT = path.join(__dirname, "..", "overlays", "png");
const textFor = (name) => { const f = name && path.join(TEXT, `${name}.png`); return !process.env.NOTEXT && f && fs.existsSync(f) ? f : null; };
const WIP = new Set(fs.existsSync(WIPFILE) ? fs.readFileSync(WIPFILE, "utf8").split(/\s+/).filter((l) => l && !l.startsWith("#")) : []);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (t) => { const neg = t < 0; t = Math.abs(t); const m = Math.floor(t / 60), s = t - m * 60; return (neg ? "−" : "") + m + ":" + (s < 10 ? "0" : "") + s.toFixed(1); };

const overlay = (sh, dur, label, name, hasText) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=IBM+Plex+Mono:wght@500&display=block">
<style>*{box-sizing:border-box;margin:0}body{width:${BW}px;height:${BH}px;background:transparent;position:relative;overflow:hidden}
.tag{position:absolute;top:12px;left:12px;font:500 11px "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#fff;background:rgba(40,20,40,.62);border-radius:999px;padding:3px 10px}
.tag b{color:#ffd23f;font-weight:500}
.ui{position:absolute;top:12px;right:12px;max-width:380px;font:500 11px/1.35 "IBM Plex Mono","DejaVu Sans Mono",monospace;color:#3a2140;background:rgba(255,255,255,.9);border-radius:8px;padding:4px 9px}
.cap{position:absolute;left:0;right:0;bottom:0;padding:26px 20px 14px;background:linear-gradient(180deg,rgba(40,20,40,0),rgba(40,20,40,.78) 55%);color:#fff;font:800 19px/1.15 "Baloo 2","DejaVu Sans",sans-serif;text-align:center;text-wrap:balance}
</style></head><body><div class="tag">${esc(sh.id)}${label ? " " + esc(label) : ""} · ${fmt(sh.t)} · ${dur.toFixed(1)}s${sh.gen && /Editor/.test(sh.gen.how) ? " · EDITOR" : ""}${WIP.has(sh.id) || WIP.has(name) ? " · <b>WIP</b>" : ""}</div>
${sh.ui && !hasText ? `<div class="ui">EDIT ▸ ${esc(sh.ui)}</div>` : ""}
<div class="cap">${esc(sh.lyric === "(same line)" ? "" : sh.lyric)}</div></body></html>`;

const enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "22", "-pix_fmt", "yuv420p", "-r", String(FPS)];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: BW, height: BH }, deviceScaleFactor: H / BH });
  const parts = [];
  let k = 0, nRender = 0, nCard = 0, nClip = 0;
  // m frames of a clip: sped up to fit (start+end clips) or at real speed and cut; the clone pad covers rounding
  // at the cut; the text overlays sit on the clip as placeholders (AE tracks them later), each over its share of
  // the clip (a start+end clip shows the start frame's text, then the end frame's)
  const clipSeg = async (sh, c, m, texts, label, name) => {
    const T = m / FPS, fit = c.fit;
    texts = texts.filter((t) => t.file);
    await p.setContent(overlay(sh, T, `${label ? label + " " : ""}CLIP${fit ? ` ${(c.seconds / T).toFixed(1)}×` : ""}`, name, texts.length > 0), { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const ov = path.join(BUILD, `ov-${k}.png`);
    await p.screenshot({ path: ov, omitBackground: true });
    const seg = path.join(BUILD, `seg-${String(k++).padStart(3, "0")}.mp4`);
    // a patch (patches/<clip>.png, the clip's own size) is laid over the clip first: PC-04's carpet is held still
    const P = texts.length + 2;
    const v = `[0]${fit ? `setpts=PTS*${(T / c.seconds).toFixed(5)},` : ""}fps=${FPS}${c.patch ? `[raw];[${P}]format=rgba[pt];[raw][pt]overlay` : ""},scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},tpad=stop_mode=clone:stop_duration=5`;
    const graph = v + texts.map((t, i) => `[c${i}];[${i + 2}]scale=${W}:${H}[t${i}];[c${i}][t${i}]overlay=enable='between(n,${t.a},${t.b - 1})'`).join("")
      + `[v];[1]scale=${W}:${H}[ov];[v][ov]overlay,format=yuv420p`;
    execFileSync("ffmpeg", ["-y", "-nostdin", "-loglevel", "error", "-i", c.file, "-loop", "1", "-i", ov, ...texts.flatMap((t) => ["-loop", "1", "-i", t.file]), ...(c.patch ? ["-loop", "1", "-i", c.patch] : []),
      "-filter_complex", graph, "-an", "-frames:v", String(m), ...enc, seg]);
    parts.push(`file '${seg}'`);
    nClip++;
  };
  for (const sh of shots) {
    const f0 = Math.round((sh.t - T0) * FPS), f1 = Math.round((endOf(sh) - T0) * FPS), n = f1 - f0;
    if (n <= 0) { console.log(sh.id, fmt(sh.t), "skipped (no screen time)"); continue; }
    const pl = plan(sh);
    if (pl.clip) {
      const k = pl.frames.length;
      await clipSeg(sh, pl.clip, n, pl.frames.map((f, j) => ({ file: textFor(f.text), a: Math.round((n * j) / k), b: Math.round((n * (j + 1)) / k) })), "", sh.id);
      console.log(sh.id, fmt(sh.t), n + "f", `clip ${pl.clip.seconds.toFixed(1)}s ${pl.clip.fit ? "sped up" : "cut"}`);
      continue;
    }
    // a full-frame graphic with no render (the OU-07 end card) stands in as the picture
    const fr = pl.frames.map((f) => ({ ...f, img: f.img || textFor(f.text), text: f.img ? textFor(f.text) : null })).filter((f) => f.img);
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
      if (f.clip) { await clipSeg(sh, f.clip, m, [{ file: f.text, a: 0, b: m }], f.label, path.parse(f.img).name); continue; }
      await p.setContent(overlay(sh, (f1 - f0) / FPS, f.label, path.parse(f.img).name, !!f.text || f.img.startsWith(TEXT)), { waitUntil: "networkidle" });
      await p.evaluate(() => document.fonts.ready);
      const ov = path.join(BUILD, `ov-${k}.png`);
      await p.screenshot({ path: ov, omitBackground: true });
      const seg = path.join(BUILD, `seg-${String(k++).padStart(3, "0")}.mp4`);
      // slow push-in (1.00 -> 1.06) on a 2x plate for smooth sub-pixel motion
      // the shot's text overlay goes onto the plate before the push-in, so it stays locked to the picture
      const txt = f.text ? ["-loop", "1", "-i", f.text] : [];
      const plate = f.text ? `[0]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2}[p];[2]scale=${W * 2}:${H * 2}[t];[p][t]overlay` : `[0]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2}`;
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-loop", "1", "-i", f.img, "-i", ov, ...txt, "-filter_complex",
        `${plate},zoompan=z='1+0.06*on/${m}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${m}:s=${W}x${H}:fps=${FPS}[bg];[1]scale=${W}:${H}[ov];[bg][ov]overlay,format=yuv420p`,
        "-frames:v", String(m), ...enc, seg]);
      parts.push(`file '${seg}'`);
      nRender++;
    }
    console.log(sh.id, fmt(sh.t), n + "f", fr.length + " frame(s)" + (fr.some((f) => f.clip) ? `, ${fr.filter((f) => f.clip).length} as clips` : ""));
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
  console.log(`${OUT}  ${W}x${H}  song ${fmt(T0)} to ${fmt(T1)} (${dur.toFixed(1)}s)  ${nClip} clips, ${nRender} render frames, ${nCard} cards`);
})();
