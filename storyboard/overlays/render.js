// Renders spec.js into transparent 1920x1080 PNGs in overlays/png/<frame>.png, and a preview of
// each over its render (overlays/preview/<frame>.jpg, git-ignored) for checking placement.
// Usage: node render.js [frame ...]   (no args = all)
const fs = require("fs"), path = require("path");
const { execFileSync, execSync } = require("child_process");
const { chromium } = require(execSync("npm root -g").toString().trim() + "/playwright");
const SPEC = require("./spec.js");
const W = 1920, H = 1080;
const OUT = path.join(__dirname, "png"), PREV = path.join(__dirname, "preview");
const RENDERS = path.join(__dirname, "..", "animatic", "renders");
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(PREV, { recursive: true });

const C = { ink: "#1d1a1c", mauve: "#b27a92", mauveL: "#ecd5df", mustard: "#d9a521", teal: "#3f6f73", red: "#d94848", cream: "#fff8ec", green: "#3f8f5a" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const at = (o, extra = "") => `position:absolute;left:${o.x}px;top:${o.y}px;${o.w ? `width:${o.w}px;` : ""}${o.h ? `height:${o.h}px;` : ""}${o.rot ? `transform:rotate(${o.rot}deg);` : ""}${extra}`;
const star = (n, r1, r2) => Array.from({ length: n * 2 }, (_, i) => { const a = (Math.PI * i) / n - Math.PI / 2, r = i % 2 ? r2 : r1; return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`; }).join(" ");

const R = {
  field: (o) => `<div style="${at(o)}display:flex;align-items:center;gap:18px;padding:0 24px;font:800 30px Nunito;color:${C.teal}">${esc(o.label)} <b style="font:900 46px Nunito;color:${C.ink};letter-spacing:.06em">${esc(o.text)}</b></div>`,
  title: (o) => `<div style="${at(o)}text-align:center;font:900 92px Nunito;letter-spacing:.14em;color:#fff;-webkit-text-stroke:7px ${C.ink};paint-order:stroke;text-shadow:8px 8px 0 ${C.mauve}">${esc(o.text)}</div>`,
  text: (o) => `<div style="${at(o)}text-align:center;font:400 ${o.size || 60}px 'Patrick Hand';color:${C.ink}">${esc(o.text)}</div>`,
  bubble: (o) => `<div style="${at(o)}"><div class="bub">${esc(o.text)}<i class="tail ${o.tail || "left"}"></i></div></div>`,
  chat: (o) => `<div style="${at(o)}display:flex;justify-content:${o.side === "out" ? "flex-end" : "flex-start"}"><div class="chat ${o.side}">${o.name ? `<small>${esc(o.name)}</small>` : ""}${esc(o.text)}</div></div>`,
  notif: (o) => `<div style="${at(o)}" class="notif${o.dim ? " dim" : ""}"><small>${esc(o.app)}</small><div>${esc(o.text)}</div></div>`,
  tag: (o) => `<div style="${at(o)}${o.size ? `font-size:${o.size}px;` : ""}" class="tag">${esc(o.text)}</div>`,
  pill: (o) => `<div style="${at(o)}" class="pill ${o.style}">${esc(o.text)}</div>`,
  card: (o) => `<div style="${at(o, `transform:rotate(${o.rot ?? -3}deg);`)}" class="card${o.gold ? " gold" : ""}"><span class="star">★</span>${esc(o.title)}${o.marks ? `<em>${esc(o.marks)}</em>` : ""}</div>`,
  burst: (o) => `<div style="${at(o, `height:${o.w * 0.62}px;`)}"><svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"><polygon points="${star(14, 50, 34)}" fill="${C.mustard}" stroke="${C.ink}" stroke-width="1.6" transform="translate(3,3)" opacity=".0"/><polygon points="${star(14, 50, 34)}" fill="#fff" stroke="${C.ink}" stroke-width="1.6" vector-effect="non-scaling-stroke" style="stroke-width:6px"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:900 ${o.w * 0.17}px 'Baloo 2';color:${C.red};-webkit-text-stroke:4px ${C.ink};paint-order:stroke;transform:rotate(-6deg)">${esc(o.text)}</div></div>`,
  roadsign: (o) => `<div style="${at(o)}display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:'Overpass',Nunito;line-height:.95"><div style="font:800 64px Overpass;letter-spacing:.08em">${esc(o.top)}</div><div style="font:900 128px Overpass">${esc(o.text)}</div></div>`,
  plusbutton: (o) => `<div style="${at(o, `width:${o.size}px;height:${o.size}px;`)}" class="plus"><span>+</span><i class="eyes">• •</i></div>`,
  plussign: (o) => `<div style="${at(o)}display:flex;flex-direction:column;align-items:center;gap:8px"><div class="signboard">${esc(o.text)}</div><div class="plus" style="position:relative;width:${o.size}px;height:${o.size}px"><span>+</span><i class="eyes sad">; ;</i></div></div>`,
  masthead: (o) => `<div style="${at(o)}font:800 110px 'Baloo 2';line-height:.9;color:${C.mustard};-webkit-text-stroke:5px ${C.ink};paint-order:stroke;text-shadow:7px 7px 0 ${C.mauve};letter-spacing:.02em">${esc(o.text)}</div>`,
  mapinsert: (o) => `<div style="${at(o)}" class="map"><svg viewBox="0 0 440 400" width="100%" height="100%"><rect x="0" y="0" width="440" height="400" fill="${C.cream}"/><g fill="#9cc9a1" stroke="${C.ink}" stroke-width="4"><circle cx="70" cy="320" r="44"/><circle cx="200" cy="210" r="40"/><circle cx="330" cy="120" r="44"/></g><path d="M40 370 Q 70 320 120 300 T 200 210 T 330 120 T 410 40" fill="none" stroke="${C.red}" stroke-width="7" stroke-dasharray="4 18" stroke-linecap="round"/><text x="402" y="44" font-size="46">☀️</text><text x="40" y="384" font-size="40">📍</text></svg></div>`,
  banner: (o) => `<div style="${at(o)}" class="banner"><b>${esc(o.text)}</b><small>${esc(o.sub)}</small></div>`,
  jumbotron: (o) => `<div style="${at(o)}" class="jumbo">${esc(o.text)}</div>`,
  quiz: (o) => `<div style="${at(o)}" class="quiz"><small>QUESTION</small>${esc(o.q)}</div>`,
  bigx: (o) => `<div style="${at(o, `width:${o.size}px;height:${o.size}px;transform:rotate(-4deg);`)}"><svg viewBox="0 0 100 100" width="100%" height="100%"><g stroke-linecap="round"><path d="M18 18 L82 82 M82 18 L18 82" stroke="${C.ink}" stroke-width="26"/><path d="M18 18 L82 82 M82 18 L18 82" stroke="${C.red}" stroke-width="16"/></g></svg></div>`,
  score: (o) => `<div style="position:absolute;left:${o.x - o.size}px;top:${o.y - o.size * 0.7}px;width:${o.size * 2}px;text-align:center;transform:rotate(${o.rot || 0}deg);font:800 ${o.size}px 'Baloo 2';color:${C.ink};line-height:1">${esc(o.text)}</div>`,
  note: (o) => `<div style="${at(o)}" class="note">${o.lines.map((l) => `<div>${esc(l)}</div>`).join("")}</div>`,
  signtext: (o) => `<div style="${at(o)}text-align:center;white-space:pre-line;font:400 ${o.size || 64}px/1 'Patrick Hand';color:${C.red};-webkit-text-stroke:2px ${C.ink};paint-order:stroke">${esc(o.text)}</div>`,
  pin: (o) => `<div style="${at(o, "transform:translateX(-50%);")}display:flex;flex-direction:column;align-items:center"><div class="pinhead">${esc(o.text)}</div><div class="pintip"></div></div>`,
  sticker: (o) => `<div style="${at(o)}" class="sticker">${esc(o.text)}</div>`,
  endcard: (o) => `<div style="position:absolute;inset:0;background:${C.cream};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px"><div style="position:absolute;inset:28px;border:6px solid ${C.mauve};border-radius:28px"></div><div style="font:800 140px 'Baloo 2';color:${C.ink};text-align:center;line-height:1.05;max-width:1500px">${esc(o.text).replace(", ", ",<br>")} <span style="color:${C.red}">${esc(o.heart)}</span></div></div>`,
};

const page = (items) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@800;900&family=Overpass:wght@800;900&family=Patrick+Hand&family=Noto+Color+Emoji&display=block">
<style>
*{box-sizing:border-box;margin:0}body{width:${W}px;height:${H}px;background:transparent;position:relative;overflow:hidden;font-family:Nunito,'Noto Color Emoji',sans-serif}
.bub{position:relative;background:#fff;border:5px solid ${C.ink};border-radius:46px;padding:18px 36px;font:400 58px/1.1 'Patrick Hand','Noto Color Emoji';color:${C.ink};text-align:center;box-shadow:7px 7px 0 ${C.mauve}}
.tail{position:absolute;bottom:-26px;width:44px;height:44px;background:#fff;border-right:5px solid ${C.ink};border-bottom:5px solid ${C.ink};transform:rotate(45deg) skew(12deg,12deg)}
.tail.left{left:60px}.tail.right{right:60px}
.chat{max-width:100%;background:#fff;border:5px solid ${C.ink};border-radius:34px;padding:16px 30px;font:800 46px/1.2 Nunito,'Noto Color Emoji';color:${C.ink};box-shadow:7px 7px 0 ${C.mauve}}
.chat.out{background:${C.teal};color:#fff}.chat small{display:block;font:900 28px Nunito;color:${C.mauve};margin-bottom:2px}
.notif{background:rgba(255,255,255,.97);border:5px solid ${C.ink};border-radius:30px;padding:16px 28px;box-shadow:7px 7px 0 ${C.mauve};font:800 44px/1.2 Nunito,'Noto Color Emoji';color:${C.ink}}
.notif small{display:block;font:900 28px Nunito,'Noto Color Emoji';color:${C.teal};margin-bottom:4px}.notif.dim{color:#8a7f86}
.tag{display:inline-block;width:auto;background:#fff;border:5px solid ${C.ink};border-radius:999px;padding:6px 28px;text-align:center;font:800 46px 'Baloo 2';color:${C.ink};box-shadow:6px 6px 0 ${C.mauve}}
.pill{text-align:center;border:5px solid ${C.ink};border-radius:999px;padding:12px 26px;font:900 44px Nunito,'Noto Color Emoji';box-shadow:6px 6px 0 ${C.mauve}}
.pill.gps{background:#2f5f9e;color:#fff}.pill.timer{background:${C.ink};color:${C.mustard};font-family:Overpass,Nunito}.pill.like{background:#fff;color:${C.red}}
.card{position:absolute;display:inline-flex;align-items:center;gap:18px;background:#fff;border:6px solid ${C.ink};outline:10px solid ${C.mustard};border-radius:18px;padding:14px 34px;font:800 64px/1 'Baloo 2';color:${C.ink};box-shadow:14px 14px 0 ${C.mauve};white-space:nowrap}
.card .star{color:${C.mustard};-webkit-text-stroke:3px ${C.ink};font-size:60px}.card em{font-style:normal;margin-left:14px;color:${C.red};letter-spacing:.06em}
.card.gold{outline-color:#e9c45a;background:${C.cream}}
.plus{position:absolute;border-radius:50%;background:${C.mauve};border:6px solid ${C.ink};display:flex;align-items:center;justify-content:center;box-shadow:6px 6px 0 ${C.mauveL}}
.plus span{font:800 90px/1 'Baloo 2';color:#fff;margin-top:-10px}.plus .eyes{position:absolute;top:-34px;font:900 40px Nunito;font-style:normal;color:${C.ink};letter-spacing:6px}
.signboard{background:${C.cream};border:5px solid ${C.ink};border-radius:10px;padding:8px 22px;font:400 56px 'Patrick Hand';color:${C.ink}}
.map{border:6px solid ${C.ink};border-radius:24px;overflow:hidden;box-shadow:10px 10px 0 ${C.mauve}}
.banner{text-align:center;background:${C.red};color:#fff;border:6px solid ${C.ink};border-radius:12px;padding:10px 24px;box-shadow:8px 8px 0 rgba(0,0,0,.35)}
.banner b{display:block;font:800 52px/1.05 'Baloo 2'}.banner small{display:block;font:900 30px Nunito;color:${C.cream};letter-spacing:.08em}
.jumbo{display:flex;align-items:center;justify-content:center;background:#141018;border:8px solid ${C.ink};outline:6px solid #6d6470;border-radius:10px;font:900 110px Overpass;color:${C.mustard};text-shadow:0 0 18px rgba(217,165,33,.8)}
.quiz{background:${C.cream};border:7px solid ${C.ink};border-radius:24px;padding:28px 40px 34px;font:800 60px/1.15 'Baloo 2';color:${C.ink};box-shadow:14px 14px 0 ${C.mustard};transform:rotate(2deg)}
.quiz small{display:block;font:900 30px Nunito;letter-spacing:.2em;color:${C.teal};margin-bottom:8px}
.note{background:#fff7c9;border:4px solid ${C.ink};padding:22px 28px;font:400 46px/1.25 'Patrick Hand','Noto Color Emoji';color:${C.ink};box-shadow:8px 8px 0 ${C.mauve}}
.pinhead{background:${C.red};color:#fff;border:6px solid ${C.ink};border-radius:999px;padding:8px 34px;font:800 56px 'Baloo 2';box-shadow:6px 6px 0 rgba(0,0,0,.3)}
.pintip{width:0;height:0;border-left:26px solid transparent;border-right:26px solid transparent;border-top:44px solid ${C.ink};margin-top:-4px}
.sticker{background:#fff;border:6px solid ${C.ink};border-radius:20px;padding:10px 32px;font:800 76px 'Baloo 2','Noto Color Emoji';color:${C.ink};box-shadow:10px 10px 0 ${C.mauve}}
</style></head><body>${items.map((o) => R[o.type](o)).join("\n")}</body></html>`;

(async () => {
  const want = process.argv.slice(2);
  const keys = Object.keys(SPEC).filter((k) => !want.length || want.includes(k));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  for (const k of keys) {
    await p.setContent(page(SPEC[k]), { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const png = path.join(OUT, `${k}.png`);
    await p.screenshot({ path: png, omitBackground: true });
    // preview over the frame it belongs to (reused chorus keys borrow the C1 frame)
    const base = k.replace(/^C2-/, "C1-").replace(/^FC-0([25])/, "C1-0$1");
    const img = ["jpg", "png"].map((e) => path.join(RENDERS, `${base}.${e}`)).find(fs.existsSync);
    if (img) execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", img, "-i", png, "-filter_complex", `[0]scale=${W}:${H}[a];[a][1]overlay,scale=960:540`, "-q:v", "4", path.join(PREV, `${k}.jpg`)]);
    console.log(k);
  }
  await b.close();
})();
