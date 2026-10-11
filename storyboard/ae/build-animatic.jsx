// Builds the Tiff birthday animatic as an editable After Effects project (1920x1080, 24 fps, song time).
// In AE: File > Scripts > Run Script File... and pick this file in storyboard/ae/ (it reads animatic-data.jsxinc,
// written by export.js, and the stills, clips, graphics and song by their paths relative to this folder).
//
// What it makes, all in the "Tiff Animatic" folder:
//   Tiff Animatic 1080p   the edit: the song, one layer per shot at its song time, a marker per shot (ID + lyric).
//                         Slide or trim a shot layer to retime it: every shot comp has spare frames on both sides.
//   Shots/<ID>            one comp per shot: its clip (time-remapped, so its speed is two keyframes you can move),
//                         one clip per frame for shots cut from several frames (C1-05, FC-04, FC-08), or its stills
//                         (each with a 100->106% push-in); then its on-screen text: every bubble, card or sign is a
//                         null "<ID> <type>" with its graphic and live text layers parented to it,
//                         so you can animate the whole item or edit the words. A guide layer shows the lyric and
//                         editor note; guide layers never render.
#include "animatic-data.jsxinc"

(function () {
  var HEAD = 1, TAIL = 2; // spare seconds before and after each shot, for retiming in the edit comp
  var D = DATA, FPS = D.fps, W = D.w, H = D.h;
  var base = new File($.fileName).parent;
  var missing = [], badFonts = {};

  function resolve(rel) {
    var parts = rel.split("/"), dir = base;
    for (var i = 0; i < parts.length - 1; i++) dir = parts[i] === ".." ? dir.parent : new Folder(dir.fsName + "/" + parts[i]);
    return new File(dir.fsName + "/" + parts[parts.length - 1]);
  }

  if (!app.project) app.newProject();
  var proj = app.project;
  app.beginUndoGroup("Build Tiff animatic");

  function folder(name, parent) { var f = proj.items.addFolder(name); if (parent) f.parentFolder = parent; return f; }
  var fRoot = folder("Tiff Animatic"), fShots = folder("Shots", fRoot), fStills = folder("Stills", fRoot),
    fClips = folder("Clips", fRoot), fGfx = folder("Graphics", fRoot), fAudio = folder("Audio", fRoot);

  var cache = {};
  function footage(rel, into) {
    if (cache.hasOwnProperty(rel)) return cache[rel];
    var file = resolve(rel), item = null;
    if (!file.exists) missing.push(rel);
    else {
      try { item = proj.importFile(new ImportOptions(file)); item.parentFolder = into; }
      catch (e) { missing.push(rel + " (" + e.message + ")"); }
    }
    cache[rel] = item;
    return item;
  }
  function cover(item) { var s = Math.max(W / item.width, H / item.height) * 100; return [s, s]; }
  function span(layer, tin, tout) { layer.inPoint = tin; layer.outPoint = tout; }

  function addText(comp, t, tin, tout) {
    var L = comp.layers.addText(t.s);
    var prop = L.property("ADBE Text Properties").property("ADBE Text Document");
    function style(withFont) {
      var td = prop.value;
      if (withFont) td.font = t.font;
      td.fontSize = t.size;
      td.applyFill = true; td.fillColor = t.fill || [0, 0, 0];
      if (t.stroke) { td.applyStroke = true; td.strokeColor = t.stroke; td.strokeWidth = t.sw; td.strokeOverFill = false; }
      else td.applyStroke = false;
      td.tracking = t.tracking;
      td.justification = t.just === "C" ? ParagraphJustification.CENTER_JUSTIFY
        : t.just === "R" ? ParagraphJustification.RIGHT_JUSTIFY : ParagraphJustification.LEFT_JUSTIFY;
      if (t.leading) { try { td.autoLeading = false; td.leading = t.leading; } catch (e) {} }
      prop.setValue(td);
    }
    try { style(true); } catch (e) { badFonts[t.font] = true; style(false); }
    span(L, tin, tout);
    // centre the text on where the browser laid it out, then turn it about that centre
    var r = L.sourceRectAtTime(tin, false);
    L.transform.anchorPoint.setValue([r.left + r.width / 2, r.top + r.height / 2]);
    L.transform.position.setValue([t.cx, t.cy]);
    if (t.rot) L.transform.rotation.setValue(t.rot);
    if (t.shadow) {
      var fx = L.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
      var op = fx.property("ADBE Drop Shadow-0002");
      fx.property("ADBE Drop Shadow-0001").setValue([t.shadow.c[0], t.shadow.c[1], t.shadow.c[2], 1]);
      op.setValue(op.hasMax ? op.maxValue : 100);
      fx.property("ADBE Drop Shadow-0003").setValue((Math.atan2(t.shadow.dx, -t.shadow.dy) * 180) / Math.PI);
      fx.property("ADBE Drop Shadow-0004").setValue(Math.sqrt(t.shadow.dx * t.shadow.dx + t.shadow.dy * t.shadow.dy));
      fx.property("ADBE Drop Shadow-0005").setValue(0);
    }
    L.name = t.s.replace(/\r/g, " ").substring(0, 40);
    return L;
  }

  // one overlay frame (spec.js key) as nulls with their graphic and text, between tin and tout;
  // parent (the still being pushed in) makes the text move with the picture
  function addOverlay(comp, key, tin, tout, parent) {
    var items = D.overlays[key];
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      var it = items[i], g = it.graphic, kids = [], c = null;
      if (g) {
        var src = footage(g.file, fGfx);
        if (src) {
          var G = comp.layers.add(src);
          span(G, tin, tout);
          G.transform.position.setValue([g.x + g.w / 2, g.y + g.h / 2]);
          kids.push(G);
          c = [g.x + g.w / 2, g.y + g.h / 2];
        }
      }
      for (var j = 0; j < it.texts.length; j++) {
        kids.push(addText(comp, it.texts[j], tin, tout));
        if (!c) c = [it.texts[j].cx, it.texts[j].cy];
      }
      if (!kids.length) continue;
      var N = comp.layers.addNull();
      N.name = key + " " + it.type + (items.length > 1 ? " " + (i + 1) : "");
      span(N, tin, tout);
      N.transform.anchorPoint.setValue([50, 50]);
      N.transform.position.setValue(c);
      for (var k = 0; k < kids.length; k++) kids[k].parent = N;
      if (parent) N.parent = parent;
    }
  }

  function addGuide(comp, sh) {
    var txt = sh.id + (sh.lyric ? "  ·  " + sh.lyric : "") + (sh.ui ? "\rEDIT ▸ " + sh.ui : "");
    var L = comp.layers.addText(txt);
    var prop = L.property("ADBE Text Properties").property("ADBE Text Document"), td = prop.value;
    td.fontSize = 30; td.applyFill = true; td.fillColor = [1, 1, 1]; td.applyStroke = true; td.strokeColor = [0, 0, 0];
    td.strokeWidth = 4; td.strokeOverFill = false; td.justification = ParagraphJustification.LEFT_JUSTIFY;
    prop.setValue(td);
    var r = L.sourceRectAtTime(0, false);
    L.transform.anchorPoint.setValue([r.left, r.top + r.height]);
    L.transform.position.setValue([40, H - 36]);
    L.guideLayer = true;
    L.name = "GUIDE " + sh.id;
  }

  // ---- one comp per shot --------------------------------------------------------------------------------------
  function buildShot(sh) {
    var len = HEAD + sh.dur + TAIL, clipItem = null;
    if (sh.clip) clipItem = footage(sh.clip.file, fClips);
    if (clipItem && !sh.clip.fit) len = Math.max(len, HEAD + sh.clip.seconds + TAIL);
    var comp = proj.items.addComp(sh.id, W, H, 1, len, FPS);
    comp.parentFolder = fShots;
    comp.comment = sh.how + (sh.lyric ? " | " + sh.lyric : "");

    if (clipItem) {
      var L = comp.layers.add(clipItem);
      L.transform.scale.setValue(cover(clipItem));
      // time remap: a start+end clip is fitted to the shot so its end frame lands; the rest play at real speed.
      // Move the second keyframe to change the speed; the layer holds its first/last frame outside the keys.
      L.timeRemapEnabled = true;
      var tr = L.property("ADBE Time Remapping"), last = sh.clip.seconds - 1 / FPS;
      while (tr.numKeys) tr.removeKey(1);
      L.startTime = 0;
      tr.setValueAtTime(HEAD, 0);
      tr.setValueAtTime(HEAD + (sh.clip.fit ? sh.dur : last), last);
      span(L, 0, len);
      L.name = sh.id + (sh.clip.fit ? " clip (fitted)" : " clip");
      addOverlay(comp, sh.text, 0, len, null);
    } else {
      // stills (also stand in for a clip that has not been downloaded yet)
      var n = sh.frames.length;
      for (var j = 0; j < n; j++) {
        var f = sh.frames[j];
        var a = HEAD + (sh.dur * j) / n, b = HEAD + (sh.dur * (j + 1)) / n;
        var tin = j === 0 ? 0 : a, tout = j === n - 1 ? len : b, pic = null;
        var fclip = f.clip ? footage(f.clip.file, fClips) : null;
        if (fclip) {
          // a frame with its own clip (C1-05b, FC-08b...) plays it at real speed from the start of its share
          var C = comp.layers.add(fclip), flast = f.clip.seconds - 1 / FPS;
          C.transform.scale.setValue(cover(fclip));
          C.timeRemapEnabled = true;
          var ftr = C.property("ADBE Time Remapping");
          while (ftr.numKeys) ftr.removeKey(1);
          C.startTime = 0;
          ftr.setValueAtTime(a, 0);
          ftr.setValueAtTime(a + flast, flast);
          span(C, tin, tout);
          C.name = (f.img ? f.img.split("/").pop().replace(/\.[^.]+$/, "") : sh.id) + " clip";
          if (f.text) addOverlay(comp, f.text, tin, tout, null);
          continue;
        }
        if (f.img) {
          var still = footage(f.img, fStills);
          if (still) {
            pic = comp.layers.add(still);
            span(pic, tin, tout);
            var s = cover(still), sc = pic.transform.scale;
            sc.setValueAtTime(a, s);
            sc.setValueAtTime(b, [s[0] * 1.06, s[1] * 1.06]);
            pic.name = sh.id + (f.label ? " " + f.label : "");
          }
        }
        if (f.text) addOverlay(comp, f.text, tin, tout, pic);
      }
    }
    addGuide(comp, sh);
    return comp;
  }

  // ---- the edit -----------------------------------------------------------------------------------------------
  var edit = proj.items.addComp("Tiff Animatic 1080p", W, H, 1, D.duration, FPS);
  edit.parentFolder = fRoot;
  var secs = {}, nSec = 0;
  for (var i = 0; i < D.shots.length; i++) {
    var sh = D.shots[i];
    var comp = buildShot(sh);
    var L = edit.layers.add(comp);
    L.startTime = sh.start - HEAD;
    span(L, sh.start, sh.start + sh.dur);
    L.moveToEnd(); // first shot on top
    if (!secs.hasOwnProperty(sh.sec)) secs[sh.sec] = (nSec++ % 15) + 1;
    L.label = secs[sh.sec];
    edit.markerProperty.setValueAtTime(sh.start, new MarkerValue(sh.id + (sh.lyric ? "  " + sh.lyric : "")));
  }
  var song = footage(D.song, fAudio);
  if (song) {
    var S = edit.layers.add(song);
    S.startTime = -D.t0; // song time 0 sits 3 s into the edit, after the GPS pre-roll
    S.moveToEnd();
  }
  edit.openInViewer();
  app.endUndoGroup();

  var msg = "Built " + D.shots.length + " shots into \"Tiff Animatic 1080p\".";
  if (missing.length) msg += "\n\nMissing files (placeholders left empty):\n" + missing.join("\n");
  var fonts = [];
  for (var k in badFonts) if (badFonts.hasOwnProperty(k)) fonts.push(k);
  if (fonts.length) msg += "\n\nFonts AE could not set (install them, then re-run): " + fonts.join(", ");
  alert(msg);
})();
