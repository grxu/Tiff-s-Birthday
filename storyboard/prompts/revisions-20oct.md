# Revisions, 20 October

| # | Shot | Change | Status |
|---|---|---|---|
| 1 | V1-02 | Replace the road fork through the windshield with roadside scenery; mask only the window into the locked frame | Prompt below; user renders in Higgsfield, then Claude composites the window |
| 2 | V1-06 | WhatsApp group chat on the V1-05 phone plate, replacing the three avatar panels | Done in `overlays/spec.js` (`wahead` + `wa` items); AE layers ready |
| 3 | PC-04 | The red carpet crawls in the Kling clip | **Done:** re-rendered with a locked camera (job `ab6258e0…`, 7 credits); the tilt is an AE move (`gen.ae: "tilt-up"`) |
| 4 | C1 / C2 / FC | Hide the top-left role cards (WARDROBE EXPERT, COSPLAY CREW, TRAVEL PLANNER, PHOTOGRAPHER, CHEF) | Done: `hidden: true` in `spec.js`; left out of the animatic, built switched off in AE. The gold payoff cards MY HOME (FC-05) and EVERY VERSION · ACCEPTED (FC-06) stay (user) |
| 5 | BR-02 | User removed the "4) 5) 6) 7)" numbers | **Done:** the edit from Render Drop is in `renders/BR-02.jpg` |

## 1 · V1-02 window: image edit

**Base image:** the shot's own V1-02 (job `a20c45af-5d80-4c15-97b4-f012faedd5b8`). Nano Banana 2.1, 16:9, 2k, thinking high, 1 image (2 credits). No other references.

```
Edit this image. Keep EVERYTHING identical: Adrian, his pose, face, hair, polo and hands, the steering wheel, the dashboard, the seat, the rear-view mirror and the bank-card charm, the plain white space at the top, the line style and the colours. Change ONLY the view outside the car window behind Adrian.
Remove the road ahead, the fork and both green signs. Instead, the window shows ordinary scenery at the side of the road gliding past, as seen through a side window: a grass verge, a low wooden fence, a row of round green trees, a few small simple houses with white walls and mauve roofs, one lamppost, under a plain pale sky. Soft horizontal speed lines across the scenery show the car is moving.
Same simple doodle comic style: clean black ink outlines of even medium weight, white fills with flat dusty mauve-pink shading, small flat muted accent colours (soft green trees), no gradients.
16:9, no text, no letters except the "$" on the coin, no logos, no watermark.
```

**After the render:** drop it in Render Drop (shot V1-02, note "window"). Claude masks the window only (window shape minus Adrian, the mirror and the charm, with a soft edge) and puts the new scenery into the locked V1-02, so nothing else can drift.

**Clip:** the current V1-02 clip (`6ea9afd5…`) still shows the fork. Masking a window into the clip doesn't hold, because his head moves across it. Re-run Kling from the composited still: 3 s, pro, 1080p, sound off = 5.25 credits (needs a yes).

## 2 · V1-06 WhatsApp group (no generation)

- **Picture:** the V1-05 plate (`gen.of: "V1-05"` in data.js). The old triptych moved to `refs/v1-06-avatars.jpg`; the three faces are cut from it as `overlays/img/avatar-{neisa,thei,mel}.png`.
- **Chat**, beside the phone like V1-05's:
  1. Header (WhatsApp green): 🚗 **LIVE UPDATES** · Neisa, Thei, Mel, You
  2. Tiff (out, green bubble, blue ticks): "🚨 UPDATE: missed the exit 😂" · 8:41
  3. Neisa (avatar, pink name): "NOOOO 😱" · 8:41
  4. Thei (avatar, orange name): "🍿 keep them coming" · 8:41
  5. Mel (avatar, green name): "zoom in on his face 🔍" · 8:42
- **In AE:** each item is a null (`V1-06 wahead`, `V1-06 wa 2` … `wa 5`) with its bubble graphic and live text. Header and Tiff's message in on the cut, then slide each reply's in-point to its name ("Neisa", "Thei", "Mel"), with a scale pop of 0 → 105 → 100 % over 6 frames and one PING each.

## 3 · PC-04 red carpet

**Why it moves:** the clip asked Kling for a tilt up the carpet. The carpet is a big flat red area with no fixed details, so as the camera moves, Kling redraws it each frame and it slides and stretches against the floor.

**Fix (recommended):** re-render with the camera locked, so only the characters move. Then do the tilt in AE (a scale and position move on the shot), where it can't warp anything. If the carpet still creeps a little, freeze it in AE: duplicate the clip, freeze it on its first frame, and mask the carpet. With a locked camera, that patch fits the whole shot.

- Start image: PC-04 (media `df6186db-706c-4bfc-9adc-162247182ffc`)
- Kling 3.0, pro (1080p), 4 s, sound off = **7 credits**

```
Static locked-off camera: the camera does not move, tilt, pan or zoom at all. The room, the white floor, the red carpet, the thrones and the chandelier stay perfectly still; the red carpet lies flat, fixed to the floor, and never slides, stretches, ripples or changes shape. Only the characters move, gently: Tiff slowly fans Miso and Tofu with the palm leaf in two soft arcs and keeps offering the salmon tray; Tofu blinks and lifts his chin; Miso flicks his tail once, regally; the court cats along the carpet blink and twitch their ears and stay seated. Same simple doodle comic style, clean ink lines, flat colours, no text.
```

**Free alternative:** play the PC-04 still with the AE push-in and no clip. The cats and Tiff then don't move.

## 4 · Role cards

Every `card` item under C1-, C2- and FC- keys has `hidden: true`. render.js leaves them out of the overlay PNGs, so the animatic no longer shows them. export.js keeps them, and build-animatic.jsx builds them with their eyes switched off, named `<ID> card (hidden)`. Switch the eyes back on to show one, or delete `hidden: true` in spec.js and re-export.

## Follow-up (20 October, later)

- **V1-02:** the user's New Final from Render Drop (asset `cc096b9a30b8a6b833c4458d0ca519fd`) is now `renders/V1-02.jpg`, used whole. Its lines are redrawn a few pixels off the old frame, so a window-only mask would show seams around his head and the pillars. The old clip (road fork) is out of clips.json, so V1-02 plays the still until a Kling re-run (5.25 credits, needs a yes).
- **PC-04:** the locked-camera clip's carpet still shimmered, so the user asked to mask it with the Higgsfield frame. `animatic/patches/PC-04.png` is that frame scaled to the clip's 1928×1076 (it lines up with the first frame). Its alpha covers the carpet, the step and a 22 px margin, minus anything that moves (the cats), with a 4 px soft edge. Over the clip, the carpet's frame-to-frame change drops from about 9 to about 2 grey levels (compression noise).
