# Tiff's birthday music video

Commissioned birthday music video for Tiff (from Adrian), set to "My Whole Supply". The storyboard lives in `storyboard/` (`data.js` is the source of truth; `index.html` renders it). The animatic is rebuilt with `storyboard/animatic/build.sh`.

## Working rules

- **Confirm before spending Higgsfield credits.** Before any generation that costs credits, state what will be generated and the credit cost, and wait for an explicit yes. A request to "make" something is not approval to spend.
- **Style (locked 2026-10-07): simple doodle comic, "mauve ink + accent colours".** Black line, white fills, dusty mauve-pink shading, small flat accents: **mustard for Tiff, teal / dark cyan for Adrian** (changed 8 October), cream and red for Spinda. **The approved car shot still shows the old colours (Tiff lavender, Adrian mustard): recolour it (2 credits, ask first) before the next generation batch that uses it as a reference.** Higgsfield references: style source media `a4261d5e-9bb4-4b57-8754-b8f1f8686c80`; approved car shot job `8ed96cfe-b7cc-4c77-8c3c-de41381c0065`; Spinda media `3fa66b42-4fec-41c2-8eba-e76e4ef81ea8` and `9dea2be4-af59-431a-9b5c-e16568bf0043`.
- Do not use the earlier anime-style test renders (V1-01, V2-05 and BR-04 from 2026-10-06, and the doodle swatches derived from V1-01) as image references.
- **Deadline: 20 October.** Adrian (client) approved the doodle style on 7 October.
- **Animate only shots of 3 seconds or more, plus every priority-scene shot** (exception approved 7 October; short ones become 3-second clips trimmed to the beat). Other short shots stay as stills (editor moves only). When time is short, do the 11 priority scenes in `SB.production.priorities` (data.js) first.
- Video default: Kling 3.0, `mode: std`, `sound: off` (the song is the soundtrack), duration = shot length rounded up (min 3s). About 1.5 credits per second. The car-shot test (job `948a5d67-4a07-4102-ac49-15bc645a39d3`) held the doodle style.
- **Spinda sheet locked:** job `202ed396-287f-4bc2-b075-1bcf394cc1a8`. Use it as the Spinda reference in every Spinda shot.
- **Tiff and Adrian character sheets wait for the client's photos.** Don't design them from the car shot.
- Client facts (8 October): names on screen are Tiff and Adrian; no glasses; about the same height; nothing off-limits for gags; femboy look is cute and playful; nine cats, stars are Miso (black tabby) and Tofu (white), and Tofu sends the final text; cosplay is Adrian as Yugi and Tiff as Dark Magician Girl; travel is Tokyo Racecourse, Cleland Wildlife Sanctuary and Ski Dubai; signature dish is paomo; real tournament is the 2025–26 Pokémon Asia Championship Series, Indonesia, Master Ball League (TCG). The reason for three Spindas is being kept back: no labels until it's shared.
- Client photos and references go into Render Drop (https://claude.ai/artifact/YSGYxLe5LgygmJZSR3xWNo) under the "Ref:" folders.
- `storyboard/song.mp3` and rendered animatic MP4s stay out of git.
