// Downloads the Kling clips listed in clips.json (shot ID -> Higgsfield result URL) into clips/<ID>.mp4,
// skipping ones already there. The clips are git-ignored; add new ones to clips.json when a clip is locked.
// Usage: node fetch-clips.js
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const LIST = require("./clips.json"), DIR = path.join(__dirname, "clips");
fs.mkdirSync(DIR, { recursive: true });
for (const [id, url] of Object.entries(LIST)) {
  const out = path.join(DIR, `${id}.mp4`);
  if (fs.existsSync(out)) continue;
  execFileSync("curl", ["-sSfL", "-o", out, url]);
  console.log(id);
}
