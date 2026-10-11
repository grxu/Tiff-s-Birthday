// Exports the animatic for After Effects: writes animatic-data.jsxinc (every shot in song time, its clip or
// stills, and its on-screen text) and graphics/*.png, which build-animatic.jsx turns into an editable project.
// Each overlay item (bubble, card, sign…) is laid out exactly as ../overlays/render.js does it; its box/shape is
// saved as a PNG with the lettering hidden, and every piece of lettering becomes a live AE text layer
// (font, size, colour, stroke, shadow, position and rotation measured from the browser layout).
// Usage: node export.js   (after ../overlays/spec.js or the renders/clips change)
const fs = require("fs"), path = require("path");
const { execFileSync, execSync } = require("child_process");
const { chromium } = require(execSync("npm root -g").toString().trim() + "/playwright");
const { all, SB, SPEC, plan } = require("../animatic/plan.js");
const { page, W, H } = require("../overlays/render.js");
const GFX = path.join(__dirname, "graphics");
const rel = (f) => path.relative(__dirname, f).split(path.sep).join("/");
const FPS = 24;

// Google Fonts used by the overlays -> the PostScript names AE looks up
const PS = {
  "Nunito": { 400: "Nunito-Regular", 700: "Nunito-Bold", 800: "Nunito-ExtraBold", 900: "Nunito-Black" },
  "Baloo 2": { 700: "Baloo2-Bold", 800: "Baloo2-ExtraBold" },
  "Overpass": { 800: "Overpass-ExtraBold", 900: "Overpass-Black" },
  "Patrick Hand": { 400: "PatrickHand-Regular" },
};
const psName = (family, weight) => {
  const fam = family.split(",")[0].trim().replace(/^["']|["']$/g, ""), w = PS[fam] || PS.Nunito;
  const ws = Object.keys(w).map(Number), best = ws.reduce((a, b) => (Math.abs(b - weight) < Math.abs(a - weight) ? b : a));
  return w[best];
};

// Runs in the page: wraps every text node of item i in a span, measures it, and returns the lettering.
const measure = (i) => {
  const root = document.body.children[i];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim() && !n.parentElement.closest("svg")) nodes.push(n);
  const spans = nodes.map((n) => { const s = document.createElement("span"); s.className = "__t"; n.replaceWith(s); s.appendChild(n); return s; });
  // line breaks are read with every transform off, so rotated items still split by line top
  const flat = document.createElement("style");
  flat.textContent = "* { transform: none !important; }";
  document.head.appendChild(flat);
  const lines = spans.map((s) => {
    const t = s.firstChild, str = t.nodeValue, r = document.createRange();
    const lh = parseFloat(getComputedStyle(s).fontSize);
    const out = [""];
    let top = null;
    for (let k = 0; k < str.length; ) {
      const len = str.codePointAt(k) > 0xffff ? 2 : 1, ch = str.slice(k, k + len);
      if (ch === "\n") { out.push(""); top = null; k += len; continue; }
      r.setStart(t, k); r.setEnd(t, k + len);
      const rects = r.getClientRects();
      if (rects.length && /\S/.test(ch)) {
        const y = rects[rects.length - 1].top;
        if (top !== null && y > top + lh * 0.5) out.push("");
        top = y;
      }
      out[out.length - 1] += ch;
      k += len;
    }
    return out.map((l) => l.replace(/\s+/g, " ").trim()).filter((l, j, a) => l || (j > 0 && j < a.length - 1));
  });
  flat.remove();
  const angle = (el) => {
    let a = 0;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const tf = getComputedStyle(e).transform;
      if (tf && tf !== "none") { const m = new DOMMatrix(tf); a += (Math.atan2(m.b, m.a) * 180) / Math.PI; }
    }
    return Math.round(a * 100) / 100;
  };
  const rgb = (c) => { const m = c.match(/[\d.]+/g); return m ? m.slice(0, 3).map((v) => Math.round((v / 255) * 1000) / 1000) : null; };
  const texts = spans.map((s, j) => {
    const cs = getComputedStyle(s), b = s.getBoundingClientRect(), size = parseFloat(cs.fontSize);
    const sw = parseFloat(cs.webkitTextStrokeWidth) || 0, ls = parseFloat(cs.letterSpacing) || 0;
    const sh = cs.textShadow && cs.textShadow !== "none" ? cs.textShadow.match(/^(rgba?\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px/) : null;
    const align = cs.textAlign === "center" ? "C" : cs.textAlign === "right" || cs.textAlign === "end" ? "R" : "L";
    return {
      s: lines[j].join("\r"), family: cs.fontFamily, weight: parseInt(cs.fontWeight, 10), size: Math.round(size * 10) / 10,
      fill: rgb(cs.color), stroke: sw ? rgb(cs.webkitTextStrokeColor) : null, sw,
      tracking: Math.round((ls / size) * 1000), leading: cs.lineHeight === "normal" ? null : parseFloat(cs.lineHeight),
      just: align, cx: Math.round((b.left + b.width / 2) * 10) / 10, cy: Math.round((b.top + b.height / 2) * 10) / 10,
      rot: angle(s), shadow: sh ? { c: rgb(sh[1]), dx: parseFloat(sh[2]), dy: parseFloat(sh[3]) } : null,
    };
  }).filter((t) => t.s);
  // the graphic: this item alone, lettering hidden, cropped to everything it draws (plus room for shadows/outlines)
  [...document.body.children].forEach((el, k) => (el.style.visibility = k === i ? "" : "hidden"));
  spans.forEach((s) => (s.style.visibility = "hidden"));
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const el of [root, ...root.querySelectorAll("*")]) {
    const b = el.getBoundingClientRect();
    if (!b.width && !b.height) continue;
    x0 = Math.min(x0, b.left); y0 = Math.min(y0, b.top); x1 = Math.max(x1, b.right); y1 = Math.max(y1, b.bottom);
  }
  const pad = 40, clip = { x: Math.max(0, Math.floor(x0 - pad)), y: Math.max(0, Math.floor(y0 - pad)) };
  clip.width = Math.min(innerWidth, Math.ceil(x1 + pad)) - clip.x; clip.height = Math.min(innerHeight, Math.ceil(y1 + pad)) - clip.y;
  return { texts, clip };
};

(async () => {
  fs.rmSync(GFX, { recursive: true, force: true });
  fs.mkdirSync(GFX, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  const overlays = {}, crops = [];
  for (const [key, items] of Object.entries(SPEC)) {
    overlays[key] = [];
    for (let i = 0; i < items.length; i++) {
      await p.setContent(page(items), { waitUntil: "networkidle" });
      await p.evaluate(() => document.fonts.ready);
      const { texts, clip } = await p.evaluate(measure, i);
      const file = path.join(GFX, `${key}__${i + 1}-${items[i].type}.png`);
      if (clip.width > 0 && clip.height > 0) {
        await p.screenshot({ path: file, clip, omitBackground: true });
        crops.push({ file, x: clip.x, y: clip.y });
      }
      overlays[key].push({
        type: items[i].type, graphic: clip.width > 0 ? { file: rel(file), x: clip.x, y: clip.y } : null,
        texts: texts.map(({ family, weight, ...t }) => ({ ...t, font: psName(family, weight) })),
      });
    }
    console.log(key, items.length);
  }
  await b.close();
  // trim each graphic to its visible pixels (or drop it when the item is lettering only)
  const trimmed = JSON.parse(execFileSync("python3", ["-I", "-c", `
import json, sys
from PIL import Image
out = {}
for c in json.load(sys.stdin):
    im = Image.open(c["file"]).convert("RGBA"); bb = im.getchannel("A").getbbox()
    if bb is None: out[c["file"]] = None; continue
    im.crop(bb).save(c["file"]); out[c["file"]] = [c["x"] + bb[0], c["y"] + bb[1], bb[2] - bb[0], bb[3] - bb[1]]
print(json.dumps(out))`], { input: JSON.stringify(crops) }).toString());
  for (const items of Object.values(overlays)) for (const it of items) {
    if (!it.graphic) continue;
    const t = trimmed[path.join(__dirname, it.graphic.file)];
    if (!t) { fs.rmSync(path.join(__dirname, it.graphic.file), { force: true }); it.graphic = null; continue; }
    Object.assign(it.graphic, { x: t[0], y: t[1], w: t[2], h: t[3] });
  }

  // shots in song time; comp time 0 is the first shot (PR-01 starts 3s before the song)
  const T0 = all[0].t, T1 = SB.song.end;
  const shots = all.map((sh, n) => {
    const pl = plan(sh);
    return {
      id: sh.id, sec: sh.sec.name || sh.id.split("-")[0], start: Math.round((sh.t - T0) * 1000) / 1000, dur: Math.round(pl.dur * 1000) / 1000,
      lyric: sh.lyric === "(same line)" ? "" : sh.lyric || "", ui: sh.ui || "", how: (sh.gen && sh.gen.how) || "",
      clip: pl.clip ? { file: rel(pl.clip.file), seconds: pl.clip.seconds, fit: pl.clip.fit } : null, text: pl.text,
      frames: pl.frames.map((f) => ({ img: f.img ? rel(f.img) : null, label: f.label, text: f.text, clip: f.clip ? { file: rel(f.clip.file), seconds: f.clip.seconds } : null })),
    };
  }).filter((s) => s.dur > 0);
  const data = { fps: FPS, w: W, h: H, t0: T0, duration: Math.round((T1 - T0) * 1000) / 1000, song: "../song.mp3", shots, overlays };
  // ExtendScript reads the file as plain JS: escape everything outside ASCII
  const js = JSON.stringify(data).replace(/[\u007f-￿]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
  fs.writeFileSync(path.join(__dirname, "animatic-data.jsxinc"), `// Generated by export.js from data.js, the renders, the clips and overlays/spec.js. Do not edit by hand.\nvar DATA = ${js};\n`);

  // clip download scripts for the editing machine (the clips are git-ignored)
  const clips = require("../animatic/clips.json");
  fs.writeFileSync(path.join(__dirname, "fetch-clips.command"), "#!/bin/bash\n# Downloads the Kling clips into storyboard/animatic/clips (double-click on a Mac).\ncd \"$(dirname \"$0\")/../animatic\" && mkdir -p clips\n" +
    Object.entries(clips).map(([id, u]) => `[ -f clips/${id}.mp4 ] || curl -sSfL -o clips/${id}.mp4 "${u}" && echo ${id}`).join("\n") + "\n");
  fs.chmodSync(path.join(__dirname, "fetch-clips.command"), 0o755);
  fs.writeFileSync(path.join(__dirname, "fetch-clips.bat"), "@echo off\r\nrem Downloads the Kling clips into storyboard\\animatic\\clips (double-click on Windows).\r\ncd /d \"%~dp0..\\animatic\"\r\nif not exist clips mkdir clips\r\n" +
    Object.entries(clips).map(([id, u]) => `if not exist clips\\${id}.mp4 curl.exe -sSfL -o clips\\${id}.mp4 "${u}" && echo ${id}`).join("\r\n") + "\r\npause\r\n");
  const nText = Object.values(overlays).flat().reduce((a, it) => a + it.texts.length, 0), nGfx = Object.values(overlays).flat().filter((it) => it.graphic).length;
  console.log(`${shots.length} shots, ${shots.filter((s) => s.clip).length} clips, ${Object.keys(overlays).length} overlay frames, ${nGfx} graphics, ${nText} text layers`);
})();
