# Handoff: Tiff's birthday music video (20 October)

A commissioned birthday music video for Tiff (from Adrian), set to "My Whole Supply", drawn in a doodle comic style ("mauve ink + accent colours"). This file is for a new Claude session on Grady's computer, where After Effects is installed. Read `CLAUDE.md` next: it has every working rule and every locked decision. This file covers where things stand and what to do next.

## Where it stands

- **Storyboard:** all 74 shots have locked frames in `storyboard/animatic/renders/`. `storyboard/data.js` is the source of truth: shots, timing, lyrics, prompts and notes. Open `storyboard/index.html` to read it.
- **Clips:** 29 Kling 3.0 clips at 1080p cover the priority scenes and the final chorus. Their URLs are in `storyboard/animatic/clips.json`, and their job IDs are in `storyboard/renders-manifest.md`.
- **On-screen text:** every overlay is defined in `storyboard/overlays/spec.js`.
- **After Effects:** `storyboard/ae/build-animatic.jsx` builds the editable project, with one precomp per shot, time-remapped clips and live text layers. AE could not be run in the cloud session, so **the script has never run in real AE**. It was only dry-run against a mock, so expect small fixes on its first real run.
- **Animatic:** `node storyboard/animatic/section.js ALL` renders the film with ffmpeg at 1080p and takes about 25 minutes. Use `section.js <SECTION> 480` (e.g. `V1`, `PC`, `C1`, `FC`) for quick checks.
- **Higgsfield balance:** about 960 credits after the 20 October PC-04 re-render.

## Set up on this computer

1. **Repo:** the zip has the whole repo except the git history and two large reference sheets. For commits and pushes, clone the repo instead: `git clone https://github.com/grxu/Tiff-s-Birthday && git checkout claude/jolly-albattani-8yl539`. Then copy `fonts/` in from this zip.
2. **Tools:** Node 18 or later, ffmpeg (with ffprobe), and Python 3 with Pillow (`pip install pillow`; add `scipy` for mask work). Playwright with Chromium is used by `overlays/render.js` and `ae/export.js`: run `npm i -g playwright && npx playwright install chromium`.
3. **Clips (git-ignored, about 230 MB):** run `node storyboard/animatic/fetch-clips.js`. The AE script also downloads any missing or replaced clip when it runs.
4. **Song:** goes at `storyboard/song.mp3` (git-ignored). **A new song is coming** (see open item 1).
5. **Fonts:** install every `.ttf` in `fonts/` (Baloo 2, Nunito, Overpass, Patrick Hand), then restart AE.
6. **Connectors:** connect Higgsfield to the session (generation, media upload, job lookups). Render Drop is a claude.ai artifact at https://claude.ai/artifact/YSGYxLe5LgygmJZSR3xWNo, and the user drops locked frames there. Read its `renders` collection with the ArtifactData tool, and fetch files with the Artifact tool (`read` with `path` = asset ID).

## Running After Effects from the session

- **macOS:** `osascript -e 'tell application "Adobe After Effects 2025" to DoScriptFile "/full/path/storyboard/ae/build-animatic.jsx"'`. Change the year to the installed version.
- **Windows:** `"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\AfterFX.exe" -r "C:\full\path\storyboard\ae\build-animatic.jsx"`
- **AE preference:** turn on Preferences > Scripting & Expressions > *Allow Scripts to Write Files and Access Network* (needed for the clip download).
- **Saving:** the script saves `storyboard/ae/Tiff Animatic.aep`, or `… 2.aep` and so on; it never overwrites a project. It ends with an alert listing missing files and fonts.
- **Order:** after any change to data.js, the renders, the clips or spec.js, run `node storyboard/ae/export.js` first. It rewrites `animatic-data.jsxinc` and `graphics/`.

## Revisions done on 20 October (`storyboard/prompts/revisions-20oct.md`)

| Shot | Change |
|---|---|
| V1-02 | **New Final** from Render Drop (roadside scenery through the window) is used whole: its lines are redrawn a few pixels off the old frame, so a window-only composite would show seams. The old clip showed the road fork, so it's removed from clips.json and V1-02 plays the still for now (see open item 2). |
| V1-06 | A WhatsApp group chat ("🚗 LIVE UPDATES": Tiff's update, then replies from Neisa, Thei and Mel with their avatars) beside the V1-05 phone plate (`gen.of: "V1-05"`). Built from the overlay types `wahead` and `wa`; the avatars are in `overlays/img/`. In AE, slide each reply to its name in the lyric. |
| PC-04 | The new clip has a locked camera (job `ab6258e0…`); the old clip's tilt made the carpet crawl. The carpet still shimmered, so a still patch of the carpet and its surroundings, from the Higgsfield frame, is held over it: `animatic/patches/PC-04.png`, at the clip's own size (1928×1076), avoiding every cat. Both the animatic and AE apply it; in AE it's the layer "PC-04 patch (still)", parented to the clip. The tilt up to the thrones is an AE move (`gen.ae: "tilt-up"`: 112% scale, position keyframes). |
| Chorus cards | The top-left role cards (WARDROBE EXPERT, COSPLAY CREW, TRAVEL PLANNER, PHOTOGRAPHER, CHEF) are `hidden: true` in spec.js: they're left out of the animatic and built switched off in AE. The gold FC-05 **MY HOME** and FC-06 **EVERY VERSION · ACCEPTED** stay visible. |
| BR-02 | The user's edit without the "4) 5) 6) 7)" numbers. |

## Open items, in order

1. **Retime to the new song.** Grady will share it in the new session. Ask whether the lyrics or structure changed, or only the timing.
   - **Where timing lives:** `SB.song` in data.js (`length`, `end`, `bpm`, `bar`, the notes) and every shot's `t`, its start in song seconds. A shot ends where the next shot starts. PR-01 starts at `t: -3`, a silent pre-roll before the music. The last shot ends at `SB.song.end`.
   - **How the old times were made:** from an audio analysis (sections within about ±1 s, lines within about ±2 s). For the new song, get word timings (e.g. faster-whisper with word timestamps, or ask Grady for a lyric-timed version), set each shot's `t` to its line's start, and snap cuts to the beat (`bar` = one bar in seconds).
   - **Then:** move the old song aside, put the new one at `storyboard/song.mp3`, run `node storyboard/ae/export.js` and rebuild in AE. Check a few sections with `section.js <SEC> 480`.
   - **Clips:** they keep their own length. Real-speed clips are cut at the shot's end, and start+end clips (`S+E` in `gen.how`) are sped up to fit. If a shot gets longer than its clip, the clip holds its last frame; flag those shots.
2. **V1-02 clip.** Re-run Kling from the New Final frame: 3 s, pro (1080p), sound off = 5.25 credits. **Needs an explicit yes.** Upload the frame first (media_upload, PUT with `If-None-Match: *`, media_confirm), then use that media as `start_image`. Use the old V1-02 Kling motion (he turns to ask "Which turn?"; scenery slides past the window). Add the URL to clips.json and the job to renders-manifest.md.
3. **Optional animation the user hasn't approved:**
   - C1-03 (5.25) and DB2-01 (12.25), recommended.
   - C1-04 (5.25) and C1-06 (7), which would complete Chorus 1.
   - FC-08 A/B retries (7 each): A warps mid-blink, B drifts toward a more detailed anime face.
4. **AE finishing:**
   - Track the EXIT 41 sign (V1-04) and the V2-10 scorecards.
   - Pop the V1-06 replies on their names.
   - Sound effects (PINGs, wobble clicks, harp gliss: see each shot's `sfx` in data.js) and the GPS voice lines.
5. **Deadline:** 20 October (from CLAUDE.md). Check with Grady whether it has moved.

## Rules that matter most (all in CLAUDE.md)

- **Higgsfield credits:** never spend without stating what and how much, and getting an explicit yes. "Make" is not a yes.
- **Image settings:** Nano Banana 2.1, 16:9, 2k, thinking high, 1 image (2 credits).
- **References:** attach only the character, Spinda and cat sheets and the charm image. Never attach a finished shot, except as the base of an edit of that same shot.
- **Kling:** 3.0, pro (1080p, 1.75 credits per second), sound off, no text in the clips. If Higgsfield replies with a preset recommendation, retry with `declined_preset_id`.
- **Git:** the song, the clips and rendered MP4s stay out of git. Branch `claude/jolly-albattani-8yl539`; no pull requests unless asked.

## Map

| Path | What |
|---|---|
| `storyboard/data.js` | shots, timing, lyrics, prompts (`gen`), notes |
| `storyboard/animatic/plan.js` | what each shot plays (clip, stills, patch), shared by the animatic and AE |
| `storyboard/animatic/section.js` | ffmpeg animatic |
| `storyboard/animatic/clips.json`, `fetch-clips.js` | clip URLs and downloader |
| `storyboard/animatic/renders/` | locked frames |
| `storyboard/animatic/patches/` | still patches held over clips (PC-04) |
| `storyboard/overlays/spec.js`, `render.js`, `img/` | on-screen text and its renderer |
| `storyboard/ae/` | `export.js` → `animatic-data.jsxinc` + `graphics/`; `build-animatic.jsx`; README |
| `storyboard/prompts/` | prompts per batch, including `revisions-20oct.md` |
| `storyboard/renders-manifest.md` | every Higgsfield job and media ID |
| `storyboard/refs/` | reference sheets (the two large no-chibi sheets are only in git and in Higgsfield, media `16f06fa1…` and `edf7de02…`) |
