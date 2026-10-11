// What each shot plays in the animatic, shared by section.js (ffmpeg) and ../ae/export.js (After Effects).
// A shot plays its Kling clip (clips/<ID>.mp4, git-ignored; a gen.of shot uses its source's clip), else its
// stills from renders/ (<ID>, <ID>b/c/d…, <ID>-end), else a gen.frames re-cut, else its full-frame overlay (OU-07).
// Every picture carries the overlay key (a frame name in ../overlays/spec.js) for its on-screen text, or null.
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const cards = require("./cards.js");
const SPEC = require("../overlays/spec.js");
const SB = window.SB;
const all = cards.all;
const RENDERS = path.join(__dirname, "renders"), CLIPS = path.join(__dirname, "clips");
const endOf = (sh) => { const n = all[all.indexOf(sh) + 1]; return n ? n.t : SB.song.end; };
const find = (name) => ["jpg", "jpeg", "png"].map((e) => path.join(RENDERS, `${name}.${e}`)).find(fs.existsSync);
const textKey = (name) => (name && SPEC[name] ? name : null);
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
const clipFor = (id) => { const f = id && path.join(CLIPS, `${id}.mp4`); return f && fs.existsSync(f) ? f : null; };
const seconds = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

// clip: { file, seconds, fit } (fit = start+end clip sped up so its end frame lands) or null; text: its overlay key
// frames: [{ img, label, text, clip }], the stills (also the fallback when a clip is missing); img is null for a
// full-frame overlay (the text is the picture). A single frame or a start+end pair is one picture, so the shot's
// clip (<ID>.mp4) plays the whole shot; a shot cut from several frames (b/c/d, or a gen.frames re-cut) plays each
// frame's own clip (<frame>.mp4, real speed, cut at its share) where there is one, e.g. C1-05b.mp4, FC-08b.mp4.
const plan = (sh) => {
  const dur = endOf(sh) - sh.t, src = sh.gen && sh.gen.of;
  const own = frames(sh.id), name = (f) => path.parse(f).name;
  // gen.frames re-cuts a list of other shots' frames in order (OU-04)
  const list = sh.gen && sh.gen.frames ? sh.gen.frames.map((n) => ({ img: find(n), label: `= ${n}`, text: null })).filter((f) => f.img) : [];
  let fr = own.length ? own.map((f) => ({ ...f, text: textKey(name(f.img)) }))
    : list.length ? list
    : !src ? own
    // a reused frame takes the reusing shot's own text (C2-03 has its own timer): C1-03-end -> C2-03-end
    : frames(src).map((f) => ({ ...f, label: `= ${src}${f.label ? " " + f.label : ""}`, text: textKey(sh.id + name(f.img).slice(src.length)) }));
  if (!fr.length && textKey(sh.id)) fr = [{ img: null, label: "", text: sh.id }];
  const cuts = fr.length > 1 && !/END$/.test(fr[fr.length - 1].label);
  const file = !cuts && (clipFor(sh.id) || clipFor(src)), D = file && seconds(file);
  const clip = file ? { file, seconds: D, fit: /S\+E/.test((sh.gen && sh.gen.how) || "") && D > dur } : null;
  if (cuts) fr = fr.map((f) => { const c = f.img && clipFor(name(f.img)); return c ? { ...f, clip: { file: c, seconds: seconds(c), fit: false } } : f; });
  return { sh, dur, clip, text: textKey(sh.id), frames: fr };
};

module.exports = { all, SB, SPEC, endOf, plan };
