"""Move the characters in a frame without regenerating it (no Higgsfield credits).

Builds a matte of everything that differs from the frame's smooth background (figures,
sparkles, the floor shadow) inside a zone, paints the old spot with the estimated
background, and pastes the subject back shifted by (dx, dy), optionally scaled about the
shadow's centre. Zone rects avoid balloons and streamers that must not move.

usage: python3 -I shift_subject.py IN.png OUT.png --dx 86 [--dy 0] [--scale 1.0]
       [--zone x0,y0,x1,y1 ...]   (full-resolution pixels; several rects allowed)
"""
import argparse
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--dx", type=float, default=0); ap.add_argument("--dy", type=float, default=0)
ap.add_argument("--scale", type=float, default=1.0)
ap.add_argument("--zone", action="append", default=[])
ap.add_argument("--thresh", type=float, default=14)
a = ap.parse_args()

img = np.asarray(Image.open(a.inp).convert("RGB")).astype(np.float32)
H, W, _ = img.shape
zone = np.zeros((H, W), bool)
for z in a.zone:
    x0, y0, x1, y1 = map(int, z.split(","))
    zone[y0:y1, x0:x1] = True

# smooth background estimate: light pixels connected to the frame edge, blurred and normalised
k = 4
sm = np.asarray(Image.fromarray(img.astype(np.uint8)).resize((W // k, H // k), Image.BILINEAR)).astype(np.float32)
light = sm.mean(2) > 205
lab, n = ndi.label(light)  # the background is the biggest light region; figure insides are cut off by outlines
big = np.bincount(lab.ravel())[1:].argmax() + 1
valid = ndi.binary_erosion(lab == big, iterations=2).astype(np.float32)
sig = 30
num = np.stack([ndi.gaussian_filter(sm[..., c] * valid, sig) for c in range(3)], -1)
den = ndi.gaussian_filter(valid, sig)[..., None] + 1e-6
bg_sm = num / den
bg = np.asarray(Image.fromarray(np.clip(bg_sm, 0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)).astype(np.float32)

# subject matte inside the zone
diff = np.abs(img - bg).max(2)
m = (diff > a.thresh) & zone
m = ndi.binary_closing(m, iterations=4)
m = ndi.binary_fill_holes(m)
m = ndi.binary_opening(m, iterations=1) | (diff > 60) & zone  # drop speckle, keep real lines
m = ndi.binary_dilation(m, iterations=5) & zone
alpha = ndi.gaussian_filter(m.astype(np.float32), 2.0)[..., None]

# 1) erase the subject from its old spot
out = img * (1 - alpha) + bg * alpha

# 2) paste it back moved (and scaled about the matte's bottom centre)
ys, xs = np.where(m)
cx, cy = (xs.min() + xs.max()) / 2, ys.max()
s = a.scale
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
srcx = (xx - a.dx - cx) / s + cx
srcy = (yy - a.dy - cy) / s + cy
moved = np.stack([ndi.map_coordinates(img[..., c], [srcy, srcx], order=1, mode="nearest") for c in range(3)], -1)
amov = ndi.map_coordinates(alpha[..., 0], [srcy, srcx], order=1, mode="constant", cval=0)[..., None]
out = out * (1 - amov) + moved * amov
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(a.out)
print(f"{W}x{H} matte {m.mean()*100:.1f}% of frame, bottom-centre ({cx:.0f},{cy:.0f}), moved dx={a.dx} dy={a.dy} scale={s}")
