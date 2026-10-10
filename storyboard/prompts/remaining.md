# Remaining shots: plan and prompts (10 October)

Every shot without a render after the priority pass and the timing pass, now that V2-11 is cut (74 shots). Claude renders these in Higgsfield batch by batch, after a quote and a yes.

Model: **Nano Banana 2.1, 16:9, 2K, high thinking, batch 1** (2 credits per image).

## The plan at a glance

**Choruses reuse Chorus 1 (decided 10 October).** C2-01 to C2-06 and FC-01 to FC-05 play the C1-01 to C1-06 images and Kling clips, retimed to each chorus; only FC-06 to FC-08 (their own lyrics) get new images, plus two final-chorus exceptions (user, 10 October): FC-03 is the couple cosplay (Adrian as Yugi, Tiff as Dark Magician Girl) and FC-04 shows the real trips. The C2 prompts and FC-01, FC-02 and FC-05 below are kept for reference only and are not rendered.

| Batch | Shots | Images | Credits | Status |
|---|---|---|---|---|
| 1 · Intro + pre-chorus | GPS plate (PR-01 and IN-01), IN-02, PC-03, PC-06 | 4 | 8 | **Done 10 October** (job IDs in `renders-manifest.md`) |
| 2 · Chorus 1 (used in all three choruses) | C1-01, C1-02, C1-03 start + end, C1-04, C1-05 A + B, C1-06 | 8 | 16 | **Done 10 October** |
| 3 · Verse 2 | V2-03, V2-06, V2-07 | 3 | 6 | **Done 10 October** |
| 4 · Dance break 2, Verse 3, Bridge | DB2-01, V3-01, V3-02, V3-03, V3-04 start + end, V3-08, BR-01, BR-02 | 9 | 18 | **Done 10 October** |
| 5 · Final chorus, own shots | FC-03 start + end (couple cosplay), FC-04 A to C (real trips), FC-06, FC-07, FC-08 A + B | 9 | 18 | |
| 6 · Outro + fixes | OU-03, OU-08, PC-04 (seven cats), V1-10 (white sofa) | 4 | 8 | V1-10 and an edit-based PC-04 need their job IDs |
| **Still to render** | | **13** | **26** | |

Allow about 20 more credits for redos, plus the fixes you still want on the WIP frames (DB1-01, DB1-02, OU-01, OU-02, V3-06 d).

**No generation needed:** PR-01 and IN-01 are motion graphics over the GPS plate, PC-02a is a crop, the Chorus 2 and final-chorus repeats reuse Chorus 1, OU-04 re-cuts V1-04, PC-02 and V1-10, and OU-07 is the end card.

## Credits

Balance about 297.5 after batch 1 − 66 images − about 20 redos = **about 211 for animation**.

| Animation (Kling 3.0 std, sound off, 1.5 credits/s) | Seconds | Credits |
|---|---|---|
| Priority shots (24 clips; DB1-02 and OU-06 are 10s each) | 100 | 150 |
| Chorus clips C1-01 to C1-06, cut to the longest of their three uses (4, 4, 3, 3, 3 + 3, 4) | 24 | 36 |
| FC-03 couple-cosplay transformation (start + end, FC-04 stays stills) | 3 | 4.5 |
| Every other shot of 3s or more | about 87 | about 130 |

Priority, the chorus clips (each used three times) and FC-03 come to about 190, leaving about 20 for a hero shot or two (V1-11, DB2-01, FC-08 are the best candidates). The rest play as stills with an editor push-in unless you top up or some of the Kling clips you made on 7 to 9 October are usable.

The final chorus was planned in heart mode (golden light). Reusing the Chorus 1 clips there, give them a warm golden grade in the edit so the last chorus still feels different.

## How the prompts are written

Each prompt starts with `EXACTLY ...`, the count guard that stopped duplicate characters, then expands the shared blocks from `priority.md` (STYLE gag / heart / epic, TIFF, TIFF (evening), ADRIAN, HOME, CATS, END) where the tags appear. Attach only what is listed: character sheets, cat sheet, Spinda sheet, charm image. Never a finished shot, except an image edit of the same shot or of the shot it reuses (the C2 frames reuse the C1 framing on purpose).

Looks: Tiff wears her day look everywhere here except OU-03 and OU-08, which are evening (braided). Verse 3, the bridge and the final chorus use the heart style.

---

## Batch 1 · Intro + pre-chorus (4 images, 8 credits) · DONE

### GPS plate · PR-01 + IN-01 (one plate for both)
**Attach:** [Spinda]
```
EXACTLY ONE SPINDA KEYCHAIN AND NO PEOPLE IN THE IMAGE.
[STYLE gag]
Close-up of a car dashboard in the same light mauve-shaded car interior: a large blank GPS navigation screen in the centre with a simple flat map, a blue route line and a blue arrow icon, an empty white destination field across the top of the screen. At the right edge of the frame a small cream-and-red Spinda plush keychain, exactly as the Spinda sheet, hangs from a phone resting on the dashboard. Calm, parked, daylight.
[END]
```
Editor: type HOME into the field, the "Starting route" voice, the RECALCULATING title, the snap-zooms.

### IN-02 · intro car (keyframe for I2V, replaces text-to-video so the style holds)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE CAR WITH TWO PEOPLE INSIDE.
[STYLE gag]
High wide shot of a small rounded white hatchback with dusty mauve shading driving left to right down a sunny suburban street: little white houses, round trees, blue sky, fluffy clouds. Through the side windows: Adrian driving on the far side (black hair, slate-teal polo) and Tiff in the passenger seat (long brown hair, mustard cardigan) holding her phone up high. Tiny figures, readable silhouettes.
[END]
```

### PC-03 · "One sunny afternoon and I'm navigating you" (3.6s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE gag], hand-drawn heat-wave lines.
Side-on wide shot on a sun-baked street with patches of tree shade. Adrian [ADRIAN] wears a khaki pith helmet over his hair and holds a brass compass out in front, striding confidently from left to right like an explorer. Right behind him Tiff [TIFF] walks under a small parasol, a tiny handheld fan in one hand and an iced drink in the other, her drink hand also pinching the tail of his polo shirt. She looks half-melted but trusting; he looks smug. Wavy heat lines rise from the pavement.
[END]
```
Editor: the map insert with a dotted route from shade to shade.

### PC-06 · the text arrives (2.8s)
**Attach:** [Adrian] [Adrian-X]
```
EXACTLY ONE ADRIAN IN THE IMAGE.
[STYLE gag]
Medium shot, Adrian [ADRIAN] alone at a white dining table in the [HOME] living room, an empty plate in front of him. He holds his phone, which has just lit up with a soft glow, screen blank. His face turns from gloomy suspicion to surprised hope. A small grey cartoon rain cloud above his head is shrinking, with a couple of last drips. A closed white door in the background on the right.
[END]
```
Editor: the text "come to the living room 🎉" on the phone.

---

## Batch 2 · Chorus 1 (8 images, 16 credits) · DONE

The role-card titles (WARDROBE EXPERT and the rest) and every ✗ / ✓ are added in the edit.

### C1-01 · party (3.2s)
**Attach:** [Tiff] [Adrian] [Cats]
```
EXACTLY ONE TIFF, ONE ADRIAN AND TWO CATS IN THE IMAGE.
[STYLE gag], confetti and burst lines.
Wide shot of the [HOME] living room turned into a birthday party: paper bunting with no letters, pastel balloons, a confetti cannon firing toward the camera, a cake on a small table. Adrian [ADRIAN] bursts in through the door holding a wrapped gift and bear-hugs Tiff [TIFF], both overjoyed. In the foreground Miso and Tofu [CATS] sit in tiny party hats, completely unimpressed.
[END]
```

### C1-02 · wardrobe expert (3.7s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE gag]
Medium shot in a bedroom with a tall mirror behind and clothes piled on the bed. Adrian [ADRIAN] stands stiff like a shop mannequin, arms slightly out. Tiff [TIFF], a decisive stylist, holds a smart patterned shirt on a hanger up against his chest, judging it with one eye closed. Two rejected outfits lie on the floor beside them.
[END]
```

### C1-03 START · cosplay pit crew (2.1s)
**Attach:** [Tiff] [Adrian]
```
FOUR IDENTICAL COPIES OF TIFF AND EXACTLY ONE ADRIAN IN THE IMAGE.
[STYLE gag], speed lines.
Medium shot framed like a Formula 1 pit stop. Adrian [ADRIAN] sits stunned in a swivel chair in the centre. Four identical copies of Tiff [TIFF] swarm him like a pit crew: one with a makeup brush at his face, one lowering a spiky tri-colour wig (black, red-magenta tips, blond fringe), one wrapping a dark costume jacket around him, one holding a gold card-game duel disk. Fast, focused, professional.
[END]
```

### C1-03 END · edit of the start (same shot)
**Attach:** the C1-03 START job.
```
Edit this image. Keep the four Tiffs, the room and the framing exactly. Adrian now stands up from the chair fully transformed into a Yugi Muto (Yu-Gi-Oh!) cosplay: spiky tri-colour hair (black with red-magenta tips and blond bangs), dark school jacket over a black top, a leather choker, a gold duel disk on his left arm, confident pose. The four Tiffs pose proudly around him with thumbs up. Same doodle style, no text.
```

### C1-04 · travel planner (1.9s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE gag]
Medium-wide shot on a clean train platform with a simple rounded train pulling in. Tiff [TIFF] strides toward the camera in front, holding a clipboard and a fat binder with colourful tabs, perfectly confident. Behind her Adrian [ADRIAN] happily carries four stacked suitcases, a backpack with a round plush poking out of the top.
[END]
```

### C1-05 A · photographer (first half of 4.2s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE gag], camera-flash burst lines.
Low-angle shot in a park. Tiff [TIFF] lies flat on her stomach on the grass, aiming a camera up at Adrian for the perfect angle, the flash firing with a star-shaped burst. Adrian [ADRIAN] stands above her posing, a little awkward.
[END]
```

### C1-05 B · chef (second half)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE gag]
Medium shot in a cosy white kitchen. Tiff [TIFF], sleeves pushed up, tosses food in a wok over a big burst of flat orange cartoon flames, perfectly in control. Beside the stove, Adrian [ADRIAN] watches with sparkling star eyes and clasped hands. A beautifully plated dish waits on the counter.
[END]
```

### C1-06 · the tableau (3.8s; Chorus 2 and the final chorus reuse this framing)
**Attach:** [Tiff] [Adrian] [Cats]
```
EXACTLY ONE TIFF, ONE ADRIAN AND TWO CATS IN THE IMAGE.
[STYLE heart]
Locked frontal wide shot of the [HOME] living room, everything in it: Tiff [TIFF] and Adrian [ADRIAN] laughing together on the white sofa in the centre; Miso and Tofu [CATS] on the sofa arm and the rug; a few round plushies; two suitcases by the wall; a spiky tri-colour cosplay wig hanging on a floor lamp; phones and snacks on the round white coffee table. Happy chaos, warm light, room to add more clutter later.
[END]
```

---

## Batch 3 · Verse 2 (3 images, 6 credits) · DONE

The C2 prompts in this section are reference only: Chorus 2 reuses Chorus 1.

### V2-03 · Spinda hero (3.5s)
**Attach:** [Tiff] [Tiff-X] [Spinda]
```
EXACTLY ONE TIFF AND ONE SPINDA PLUSH IN THE IMAGE.
[STYLE epic]
A Spinda plush, exactly as the Spinda sheet (cream body, red spiral-spot pattern, spiral eyes), sits on a white table in a dramatic spotlight cone. Tiff [TIFF] leans in and hugs it with sparkling eyes and a huge smile, one hand pointing at it as if to say "he gets me". Dark mauve background, sparkles.
[END]
```

### V2-06 · the collector (3.5s)
**Attach:** [Tiff]
```
EXACTLY ONE TIFF IN THE IMAGE.
[STYLE gag]
Close-up at a tidy desk under a warm desk lamp. Tiff [TIFF] wears white cotton gloves and a jeweller's loupe over one eye, holding a single trading card up to the light and inspecting it like a diamond, serious and reverent. Around her: neat binders, card sleeves, top-loaders in perfect rows. The card face is blank, with a single glint.
[END]
```

### V2-07 · "Practice?" (3.5s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE gag]
Two-shot across a table with a card-game play mat. Adrian [ADRIAN], excited like a hopeful puppy, slaps a deck of cards down and holds it out to her. Tiff [TIFF], calm and polite, slides a card back into its protective sleeve without looking up. A small cartoon tumbleweed rolls across the play mat between them.
[END]
```
Editor: the "Practice?" / "No thanks." bubbles.

### C2-01 · party again (edit of C1-01)
**Attach:** the C1-01 job, plus [Spinda].
```
Edit this image. Keep the people, cats, room and framing exactly. Add more round plushies around the room, every one wearing a tiny party hat, and three Spinda plushies (exactly as the Spinda sheet, each with a different spot pattern) sitting in a row on the cake table. Same doodle style, no text.
```

### C2-03 START · Tiff's pit stop (1.8s)
**Attach:** [Tiff] [Adrian]
```
FOUR IDENTICAL COPIES OF ADRIAN AND EXACTLY ONE TIFF IN THE IMAGE.
[STYLE gag], speed lines.
The same F1 pit-stop framing as before, roles reversed: Tiff [TIFF] sits in the swivel chair in the centre, surprised, while four identical copies of Adrian [ADRIAN] swarm her like a pit crew: one with a makeup brush, one lowering a long blonde wig, one holding a blue-and-pink magical-girl outfit, one holding a pointed blue wizard hat and a staff.
[END]
```

### C2-03 END · edit of the start
**Attach:** the C2-03 START job.
```
Edit this image. Keep the four Adrians, the room and the framing exactly. Tiff now springs up from the chair fully transformed into a Dark Magician Girl cosplay: long blonde wig, tall pointed blue-and-pink wizard hat, blue-and-pink magical-girl outfit, holding a staff, winking with a peace sign. The four Adrians cheer around her. Same doodle style, no text.
```

### C2-04 · luggage tower (edit of C1-04)
**Attach:** the C1-04 job, plus [Spinda].
```
Edit this image. Keep Tiff, the platform and the framing exactly. Adrian now carries a wobbling tower of six stacked suitcases, with three Spinda plushies (exactly as the Spinda sheet, different spot patterns) strapped to the top, sweat drops flying. Same doodle style, no text.
```

### C2-06 · tableau, doubled (edit of C1-06)
**Attach:** the C1-06 job, plus [Spinda].
```
Edit this image. Keep the couple, the cats, the room and the framing exactly. Double the number of round plushies on the sofa, shelves and floor, and add a big pile of Spinda plushies (exactly as the Spinda sheet) in the corner on the right. Spot-the-difference: everything else unchanged. Same doodle style, no text.
```

---

## Batch 4 · Dance break 2, Verse 3, Bridge (9 images, 18 credits) · DONE

### DB2-01 · slow dance (6.1s)
**Attach:** [Tiff] [Adrian] [Cats]
```
EXACTLY ONE TIFF, ONE ADRIAN AND TWO CATS IN THE IMAGE.
[STYLE heart], warm golden lamp light.
Medium shot in the [HOME] living room after the party: Tiff [TIFF] and Adrian [ADRIAN] slow-dance, her arms around his neck and his hands at her waist, eyes half closed, tired and happy. Confetti drifts down. Round plushies sit around the room. Miso and Tofu [CATS] nap curled up on a pile of crumpled wrapping paper in the corner.
[END]
```

### V3-01 · the collar (3.7s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN, SEEN ONLY AS A REFLECTION IN ONE MIRROR.
[STYLE heart], warm afternoon light.
Close-up into a tall bedroom mirror: in the reflection Tiff [TIFF] stands in front of Adrian [ADRIAN] and straightens his polo collar with both hands, careful and proud. He lets her, smiling softly. A hat and a pair of glasses lie on the dresser below the mirror.
[END]
```

### V3-02 · the good angle (3.2s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE heart], golden-hour light.
Medium shot outdoors at golden hour. Tiff [TIFF] crouches low with a camera to her eye, photographing Adrian [ADRIAN], who stands a little shy, then glowing. A literal bright four-point sparkle shines in his eyes. Soft lens flare.
[END]
```

### V3-03 · the itinerary (4.2s)
**Attach:** [Adrian]
```
EXACTLY ONE ADRIAN IN THE IMAGE.
[STYLE heart]
Wide shot of a hallway with a wooden floor. A very long hand-written travel itinerary scroll unrolls from Adrian's hands across the floor and right out of the open front door: little maps, colour tabs, tiny pins and stickers along it, the writing shown as squiggles. Adrian [ADRIAN] holds the top end, jaw dropped in awe.
[END]
```

### V3-04 START · the cloud (3.8s)
**Attach:** [Tiff] [Adrian] [Adrian-X]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE heart]
Medium shot at a white dining table. Adrian [ADRIAN] sits slumped and tired, a small grey cartoon rain cloud drizzling above his head. Tiff [TIFF] stands beside him lifting a silver cloche off a big dish, a soft glow and the first wisps of steam escaping from under it.
[END]
```

### V3-04 END · edit of the start
**Attach:** the V3-04 START job.
```
Edit this image. Keep both characters, the table and the framing exactly. The cloche is now lifted away, revealing a huge steaming bowl of Xi'an paomo (torn flatbread pieces in a rich clear broth with slices of meat, green onion and glass noodles) with small side dishes of pickled garlic and chilli sauce. Big curls of steam rise and blow the rain cloud apart. Adrian beams with pure joy. Same doodle style, no text.
```

### V3-08 · biggest fan (3.6s)
**Attach:** [Tiff] [Adrian] [Cats]
```
EXACTLY ONE TIFF, ONE ADRIAN AND TWO CATS IN THE IMAGE.
[STYLE heart]
Wide shot of a small community stage. Adrian [ADRIAN] stands on the stage covering his blushing face with both hands, embarrassed and touched. In the front row, Tiff [TIFF] cheers wildly with a big glittery handmade sign (hearts only, no letters) and a giant foam finger. Beside her Miso and Tofu [CATS] shake tiny pom-poms.
[END]
```
Editor: the sign text GO ADRIAN!!! ❤️.

### BR-01 · asleep in the car (5.3s)
**Attach:** [Tiff] [Adrian] [Spinda]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE heart], dusk light with warm streetlights.
Inside the same light mauve-shaded car as Verse 1, at dusk. Tiff [TIFF] sleeps in the passenger seat on the left, head tilted against the seat, her phone resting on her chest with a small Spinda keychain dangling from it. Adrian [ADRIAN] drives on the right, glancing over at her with a soft smile. A bank-card-with-dollar-coin charm hangs from the rear-view mirror. Warm streetlights through the windows.
[END]
```
Editor: the Polaroids drifting past.

### BR-02 · floor with the cats (3.9s)
**Attach:** [Tiff] [Adrian] [Cats]
```
EXACTLY ONE TIFF, ONE ADRIAN AND SEVEN CATS IN THE IMAGE.
[STYLE heart], lamp light.
Low, floor-level wide shot in the [HOME] living room. Adrian [ADRIAN] lies on his back on the rug surrounded by cats; Miso [CATS] climbs onto his chest and Tofu curls up by his feet. Tiff [TIFF] lies beside him with her head on his shoulder, scrolling her phone held up above them, and he watches the screen with her. Five more ordinary cats of different colours sleep around them; empty food bowls nearby.
[END]
```

---

## Batch 5 · Final chorus (9 images, 18 credits: FC-03 start + end, FC-04 A to C, FC-06, FC-07, FC-08 A + B)

FC-01, FC-02 and FC-05 are reference only: they reuse Chorus 1.

### FC-01 · the full party (3.5s)
**Attach:** [Tiff] [Adrian] [Cats]
```
EXACTLY ONE TIFF, ONE ADRIAN, FOUR FRIENDS AND TWO CATS IN THE IMAGE.
[STYLE heart], golden party light, slow-motion confetti.
Wide shot of the [HOME] living room at a big birthday party. Tiff [TIFF] in the centre, Adrian [ADRIAN] beside her with his arm around her. Four generic cartoon girlfriends cheer around them, matching the group-chat avatars: one with a dark bob and a pink top, one with a long wavy brown ponytail and a mustard-and-red striped hoodie, one with big dark curly hair and a green top, and one with straight shoulder-length hair and a headband. Presents, a cake, Miso and Tofu [CATS] in party hats, confetti hanging in the air.
[END]
```

### FC-02 · runway (3.5s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE heart], camera-flash bursts.
Head-on shot down a fashion runway. Tiff and Adrian strut toward the camera side by side in coordinated outfits: matching mustard-and-slate-teal colour-blocked jackets over white, same faces and hair as their sheets. Photographers' flashes burst on both sides.
[END]
```

### FC-03 START · couple, everyday (2.7s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE heart], sparkles starting to swirl.
Medium shot of Tiff [TIFF] and Adrian [ADRIAN] standing side by side in everyday clothes, holding hands, looking at each other with excited grins as a ring of magical sparkles starts swirling around their feet.
[END]
```

### FC-03 END · edit of the start
**Attach:** the FC-03 START job.
```
Edit this image. Keep the framing and their faces exactly. Both are now transformed in a burst of sparkles: Adrian as Yugi Muto (spiky tri-colour hair, dark jacket, gold duel disk) and Tiff as Dark Magician Girl (long blonde wig, tall pointed blue-and-pink hat, staff), striking a dramatic duel pose together back to back. Same doodle style, no text.
```

### FC-04 A to C · the real trips (2.4s, three cuts of about 0.8s, stills)
**Attach:** [Tiff] [Adrian] for each. Places described in words; the client's travel photos in Render Drop stay out of the attachments (they pull toward realism).
```
A) EXACTLY ONE TIFF AND ONE ADRIAN. [STYLE heart] In the grandstand at Tokyo Racecourse, horses galloping past on the green turf below: Tiff points the way with total confidence; Adrian, beside her, does a double-take. [END]
B) EXACTLY ONE TIFF, ONE ADRIAN AND ONE KOALA. [STYLE heart] At Cleland Wildlife Sanctuary among eucalyptus trees: Tiff gently meets a sleepy koala on a low branch, while Adrian holds the map, surprised she found it first. [END]
C) EXACTLY ONE TIFF, ONE ADRIAN AND TWO PENGUINS. [STYLE heart] Inside the huge indoor snow slope of Ski Dubai, both in puffy winter jackets in their colours (mustard for her, slate teal for him), waving at two little penguins waddling past. [END]
```

### FC-05 A to C · slower montage (2.8s)
**Attach:** [Tiff] [Adrian] (C adds [Cats]).
```
A) EXACTLY ONE TIFF AND ONE ADRIAN. [STYLE heart] For once Adrian holds the camera and photographs Tiff, who laughs with her eyes closed. [END]
B) EXACTLY ONE TIFF AND ONE ADRIAN. [STYLE heart] Cooking together in the white kitchen, both with flour on their noses, laughing, dough on the counter. [END]
C) EXACTLY ONE TIFF, ONE ADRIAN AND TWO CATS. [STYLE heart] Cuddled up on the white sofa, Miso and Tofu asleep on their laps, lamp light. [END]
```

### FC-06 · every version, group photo (3.7s)
**Attach:** [Tiff] [Adrian] [Spinda]
```
EXACTLY ONE TIFF, SIX VERSIONS OF ADRIAN AND THREE SPINDA PLUSHIES IN THE IMAGE.
[STYLE heart], camera-flash burst.
A posed group photo in the living room, Tiff [TIFF] in the middle. Around her six versions of Adrian, all with his face: everyday (slate-teal polo), femboy (pastel sweater, pleated skirt, hair clip), geek (headset, hoodie, game controller), nerd (round glasses, cardigan, a book), Yugi cosplayer (spiky tri-colour hair, duel disk) and card collector (a binder, cards in his shoe). Three Spinda plushies with different spot patterns sit in front. Everyone leans in and smiles.
[END]
```

### FC-07 · the 41 candles (3.5s)
**Attach:** [Tiff] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE gag], warm party light.
Medium shot: Adrian [ADRIAN] proudly holds up a birthday cake with two lit number candles shaped "4" and "1", grinning at the camera. Tiff [TIFF] beside him, delighted.
[END]
```
Note: the 41 candles are the one place a number should appear; if the model garbles it, add the candles in the edit.

### FC-08 A · his eyes (first half of 6.6s)
**Attach:** [Adrian]
```
EXACTLY ONE ADRIAN.
[STYLE heart], warm candlelight.
Extreme close-up of Adrian's eyes under his heavy black fringe, reflecting two tiny warm candle flames, full of love. Dark warm background.
[END]
```

### FC-08 B · her wish
**Attach:** [Tiff]
```
EXACTLY ONE TIFF.
[STYLE heart], warm candlelight.
Close-up of Tiff's face lit from below by birthday candles, eyes closed, making a wish with a gentle smile, cheeks slightly puffed, about to blow. Dark warm background.
[END]
```

---

## Batch 6 · Outro + fixes (4 images, 8 credits)

### OU-03 · best and worst (4.0s)
**Attach:** [Tiff-B] [Adrian]
```
EXACTLY ONE TIFF AND ONE ADRIAN IN THE IMAGE.
[STYLE gag], lamp light.
Evening on the white sofa in the [HOME] living room. Adrian [ADRIAN] hugs Tiff [TIFF (evening)] from the side, both laughing hard, her eyes squeezed shut. Empty space above her head for labels.
[END]
```
Editor: the BEST ❤️ / WORST 😂 labels and the stats card.

### OU-08 · "Recalculating…" (3.0s, after the song)
**Attach:** [Tiff-B] [Tiff-X] [Spinda]
```
EXACTLY ONE TIFF IN THE IMAGE.
[STYLE gag], warm lamp light.
Medium close-up of Tiff [TIFF (evening)] on the white sofa, holding her phone with the Spinda keychain, its screen glowing. She looks sideways out of frame with a guilty, caught grin, one sweat drop.
[END]
```

### PC-04 · seven court cats
Either a masked edit of your PC-04 (send me its Higgsfield job ID; I mask the floor cats and redraw seven, and make the floor white), or a fresh render from the PC-04 prompt in `priority.md` with "EXACTLY SEVEN SMALL CATS ON THE FLOOR" in the count guard.

### V1-10 · white sofa
An image edit of your V1-10 (job ID needed): "Recolour the sofa to white with dusty mauve-pink shading, like the house sofa; change nothing else."
