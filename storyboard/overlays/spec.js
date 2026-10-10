// On-screen text and graphics, one transparent 1920x1080 PNG per frame (render.js).
// The key is the frame name: a shot ID, or a frame of it (C1-05b, FC-03-end). Reused chorus
// shots get their own keys (C2-03 = C1-03 frame with a different timer).
// Every item: type + x, y (top-left, px on 1920x1080) and its own options; rot in degrees.
// Text that comes from the storyboard `ui` notes is copied as written there.
module.exports = {
  // Intro: GPS
  "PR-01": [{ type: "field", x: 640, y: 428, w: 560, h: 64, label: "Destination:", text: "HOME" }],
  "IN-01": [
    { type: "title", x: 480, y: 60, w: 960, text: "RECALCULATING" },
    { type: "field", x: 640, y: 428, w: 560, h: 64, label: "Destination:", text: "HOME" },
  ],

  // Verse 1
  "V1-02": [{ type: "text", x: 660, y: 6, w: 600, size: 92, text: "Which turn?" }],
  "V1-03": [{ type: "burst", x: 690, y: 120, w: 520, text: "GOTCHA!" }],
  "V1-04": [{ type: "roadsign", x: 1368, y: 108, w: 420, h: 270, top: "EXIT", text: "41" }],
  "V1-05": [
    { type: "chat", x: 1060, y: 90, w: 760, side: "in", name: "Cindy", text: "omg where r u now" },
    { type: "chat", x: 1000, y: 290, w: 820, side: "out", text: "we missed the exit 😂😂 he’s doing the face" },
  ],
  "V1-06": [
    { type: "tag", x: 190, y: 860, w: 280, size: 60, text: "Neisa" },
    { type: "tag", x: 820, y: 860, w: 280, size: 60, text: "Thei" },
    { type: "tag", x: 1440, y: 860, w: 280, size: 60, text: "Mel" },
  ],
  "V1-07": [{ type: "pill", x: 680, y: 36, w: 560, style: "gps", text: "LAP 3 · ETA: ??" }],
  "V1-09": [{ type: "plusbutton", x: 980, y: 190, size: 120 }],
  "V1-10": [{ type: "plussign", x: 760, y: 360, size: 120, text: "PLEASE", rot: -18 }],
  "V1-11": [
    { type: "masthead", x: 50, y: 40, text: "PRETTIEST BOAST" },
    { type: "pill", x: 1250, y: 220, w: 300, style: "like", text: "♥ 1,204" },
    { type: "pill", x: 1360, y: 400, w: 300, style: "like", text: "♥ 8,931" },
    { type: "pill", x: 1220, y: 580, w: 320, style: "like", text: "♥ 41,000" },
  ],

  // Pre-chorus
  "PC-03": [{ type: "mapinsert", x: 1420, y: 600, w: 440, h: 400 }],
  "PC-05": [{ type: "notif", x: 1140, y: 300, w: 560, app: "Messages", text: "No new messages", dim: true }],
  "PC-06": [{ type: "chat", x: 1080, y: 150, w: 760, side: "in", name: "Tiff", text: "come to the living room 🎉" }],

  // Chorus 1 role cards (reused in Chorus 2 and the final chorus)
  "C1-02": [{ type: "card", x: 50, y: 60, title: "WARDROBE EXPERT", marks: "✗ ✗ ✓" }],
  "C1-03": [{ type: "card", x: 50, y: 60, title: "COSPLAY CREW" }, { type: "pill", x: 1560, y: 60, w: 300, style: "timer", text: "⏱ 2.0s" }],
  "C1-03-end": [{ type: "card", x: 50, y: 60, title: "COSPLAY CREW" }, { type: "pill", x: 1560, y: 60, w: 300, style: "timer", text: "⏱ 2.0s ✓" }],
  "C1-04": [{ type: "card", x: 50, y: 60, title: "TRAVEL PLANNER" }],
  "C1-05": [{ type: "card", x: 50, y: 60, title: "PHOTOGRAPHER" }],
  "C1-05b": [{ type: "card", x: 50, y: 60, title: "CHEF" }],
  "C2-02": [{ type: "card", x: 50, y: 60, title: "WARDROBE EXPERT", marks: "✗ ✗ ✗ ✗ ✗ ✓" }],
  "C2-03": [{ type: "card", x: 50, y: 60, title: "COSPLAY CREW" }, { type: "pill", x: 1560, y: 60, w: 300, style: "timer", text: "⏱ 1.0s" }],
  "C2-03-end": [{ type: "card", x: 50, y: 60, title: "COSPLAY CREW" }, { type: "pill", x: 1560, y: 60, w: 300, style: "timer", text: "⏱ 1.0s ✓" }],
  "C2-04": [{ type: "card", x: 50, y: 60, title: "TRAVEL PLANNER" }],
  "C2-05": [{ type: "card", x: 50, y: 60, title: "PHOTOGRAPHER" }],
  "C2-05b": [{ type: "card", x: 50, y: 60, title: "CHEF" }],

  // Verse 2
  "V2-03": [{ type: "bubble", x: 1300, y: 60, w: 520, tail: "left", text: "He gets me." }],
  "V2-07": [
    { type: "bubble", x: 560, y: 40, w: 420, tail: "left", text: "Practice?" },
    { type: "bubble", x: 980, y: 260, w: 460, tail: "right", text: "No thanks." },
  ],
  "V2-08": [
    { type: "banner", x: 360, y: 20, w: 1200, text: "POKÉMON ASIA CHAMPIONSHIP SERIES 2025–26", sub: "INDONESIA · MASTER BALL LEAGUE" },
    { type: "jumbotron", x: 70, y: 200, w: 360, h: 220, text: "TIFF" },
  ],
  "V2-09": [
    { type: "quiz", x: 900, y: 120, w: 900, q: "You go first. Can you play a Supporter on Turn 1?" },
    { type: "burst", x: 380, y: 110, w: 380, text: "YES!" },
  ],
  "V2-10": [
    { type: "bigx", x: 180, y: 70, size: 440 },
    { type: "score", x: 442, y: 735, size: 70, text: "0", rot: -6 },
    { type: "score", x: 778, y: 735, size: 70, text: "0", rot: 5 },
  ],

  // Verse 3
  "V3-03": [{ type: "note", x: 900, y: 320, w: 440, rot: 4, lines: ["Day 1 · 08:12 train", "lunch ★", "Day 2 · 07:40 ✈", "…"] }],
  "V3-06": [{ type: "tag", x: 60, y: 60, w: 300, text: "FEMBOY" }],
  "V3-06b": [{ type: "tag", x: 60, y: 60, w: 260, text: "GEEK" }],
  "V3-06c": [{ type: "tag", x: 60, y: 60, w: 260, text: "NERD" }],
  "V3-06d": [{ type: "tag", x: 60, y: 60, w: 420, text: "CARDS IN SHOE" }],
  "V3-08": [{ type: "signtext", x: 95, y: 195, w: 320, rot: -19, size: 76, text: "GO\nADRIAN!!!" }],

  // Bridge
  "BR-04": [{ type: "pin", x: 640, y: 40, text: "HOME" }],

  // Final chorus (FC-01, FC-02 and FC-05 reuse Chorus 1 frames)
  "FC-02": [{ type: "card", x: 50, y: 60, title: "WARDROBE EXPERT", marks: "✓" }],
  "FC-03": [{ type: "card", x: 50, y: 60, title: "COSPLAY CREW" }],
  "FC-03-end": [{ type: "card", x: 50, y: 60, title: "COSPLAY CREW", marks: "✓ ✓" }],
  "FC-04": [{ type: "card", x: 50, y: 60, title: "TRAVEL PLANNER" }],
  "FC-04b": [{ type: "card", x: 50, y: 60, title: "TRAVEL PLANNER" }],
  "FC-04c": [{ type: "card", x: 50, y: 60, title: "TRAVEL PLANNER" }],
  "FC-05": [{ type: "card", x: 50, y: 60, title: "MY HOME", gold: true }],
  "FC-05b": [{ type: "card", x: 50, y: 60, title: "MY HOME", gold: true }],
  "FC-06": [{ type: "card", x: 40, y: 24, title: "EVERY VERSION · ACCEPTED", gold: true }],

  // Outro
  "OU-01": [{ type: "bubble", x: 1360, y: 40, w: 520, tail: "left", text: "Put down the phone." }],
  "OU-02": [{ type: "notif", x: 1000, y: 40, w: 760, app: "Tofu 🐾", text: "where is my dinner" }],
  "OU-03": [
    { type: "sticker", x: 900, y: 60, text: "BEST ❤️", rot: -6 },
    { type: "sticker", x: 1290, y: 150, text: "WORST 😂", rot: 6 },
  ],
  "OU-05": [{ type: "pill", x: 1080, y: 880, w: 520, style: "gps", text: "📍 You have arrived" }],
  "OU-07": [{ type: "endcard", text: "Happy Birthday, My Love", heart: "❤️" }],
  "OU-08": [{ type: "pill", x: 1220, y: 50, w: 600, style: "gps", text: "↻ Recalculating…" }],
};
