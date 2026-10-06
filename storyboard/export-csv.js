// Writes shotlist.csv from data.js: node export-csv.js
const fs = require("fs");
global.window = {};
require("./data.js");
const SB = window.SB;
const all = SB.sections.flatMap((s) => s.shots.map((sh) => ({ ...sh, section: s.name })));
const fmt = (t) => { const neg = t < 0; t = Math.abs(t); const m = Math.floor(t / 60), s = t - m * 60; return (neg ? "-" : "") + m + ":" + (s < 10 ? "0" : "") + s.toFixed(1); };
const castText = (k) => SB.cast.find((c) => c.key === k).prompt;
const expand = (s) => String(s).replace(/\{(WIFE|HUSBAND|CATS|SPINDA)\}/g, (_, k) => castText(k));
const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const cols = ["id", "section", "start", "duration_s", "priority", "mode", "lyric", "shot", "camera", "action", "acting", "on_screen", "sound", "transition", "gen_route", "keyframe_prompt", "motion_prompt", "note"];
const rows = all.map((sh, i) => {
  const end = all[i + 1] ? all[i + 1].t : SB.song.end;
  return [sh.id, sh.section, fmt(sh.t), (end - sh.t).toFixed(1), "P" + sh.p, sh.mode, sh.lyric, sh.size, sh.cam, sh.action, sh.act, sh.ui, sh.sfx, sh.trans, sh.gen.how,
    `${SB.style[sh.mode]}. ${expand(sh.gen.img)}. ${SB.style.suffix}.`, sh.gen.motion, sh.note].map(q).join(",");
});
fs.writeFileSync("shotlist.csv", "﻿" + cols.join(",") + "\n" + rows.join("\n") + "\n");
console.log(`shotlist.csv: ${rows.length} shots`);
