# Tiff animatic in After Effects

`build-animatic.jsx` builds the whole animatic as an editable AE project: 1920×1080, 24 fps, on the song's timeline.

## Set up (once)

1. Keep this folder where it is: the script finds everything by relative path.
   - `storyboard/ae/`: this folder (script, data, `graphics/`)
   - `storyboard/animatic/renders/`: the stills
   - `storyboard/animatic/clips/`: the Kling clips
   - `storyboard/song.mp3`: the song
2. **Clips:** the full kit zip already has them in `animatic/clips/`. Otherwise double-click `fetch-clips.command` (Mac) or `fetch-clips.bat` (Windows) to download them. Shots whose clip is missing fall back to their stills.
3. **Song:** the kit zip has `song.mp3` in `storyboard/`; otherwise put it there.
4. **Fonts:** install every `.ttf` in the kit zip's `fonts/` folder, then restart AE. Without the zip, get them free from fonts.google.com (static weights):
   - Baloo 2 (Bold, ExtraBold)
   - Nunito (ExtraBold, Black)
   - Overpass (ExtraBold, Black)
   - Patrick Hand

   AE warns about any font it can't find. Install the font and re-run the script.

## Build

In After Effects, choose **File > Scripts > Run Script File…** and pick `build-animatic.jsx`. It takes a minute. An alert at the end lists anything missing.

A new project is saved as `Tiff Animatic.aep` in this folder. If that file exists, it's saved as `Tiff Animatic 2.aep` (then 3, and so on), so an older edit is never overwritten. After that, open the .aep directly.

## What you get (folder "Tiff Animatic")

- **Tiff Animatic 1080p** is the edit.
  - The song sits at the bottom of the timeline.
  - Above it is one layer per shot at its song time, coloured by section.
  - A comp marker on each shot shows its ID and lyric.
  - **To retime a shot**, slide or trim its layer. Every shot comp has 1 s of spare picture before and 2 s after.
- **Shots/** holds one comp per shot.
  - **Clips** are time-remapped. The second keyframe sets the speed:
    - Start→end clips (PC-02, DB1-02, V2-04, V3-07) are fitted so the end frame lands on the shot's last frame.
    - The rest play at real speed.
    - Drag the keyframe to speed a clip up or slow it down; the layer holds its first and last frame outside the keys.
  - **Stills** each get a 100→106% push-in. Extra frames (b/c/d, -end) split the shot evenly.
  - **On-screen text:** every bubble, card, sign or label is a null called `<ID> <type>`.
    - Its graphic (the box or shape, from `graphics/`) and its **live text layers** are parented to that null.
    - Animate the null to move, pop or scale the whole item; edit the text layers to change wording or fonts.
    - On stills, the nulls are parented to the still, so the text follows the push-in.
  - **GUIDE layer:** shows the shot ID, lyric and editor note. Guide layers never render.

## Rebuild after changes

When the storyboard, renders, clips or `overlays/spec.js` change:

1. Run `node export.js` in this folder (in the repo). It rewrites `animatic-data.jsxinc` and `graphics/`.
2. Run the script again in a new or empty project.

New clips go in `animatic/clips.json` (shot ID → Higgsfield URL). `node ../animatic/fetch-clips.js` downloads them, and `export.js` regenerates the two fetch scripts.
