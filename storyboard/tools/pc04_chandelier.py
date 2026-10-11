"""Give PC-04 the same chandelier as PC-05 (no Higgsfield credits).

1. Cut PC-05's crystal chandelier out of its light cone: the cone behind it is rebuilt from a
   clean row below the chandelier (the cone is a symmetric triangle, so each row is the same
   profile scaled toward the apex), and the chandelier is whatever differs from that.
2. Paint PC-04's own chandelier out of its flat wall (normalised blur of the surrounding wall).
3. Paste the PC-05 chandelier there, scaled to the old one's width, chain to the ceiling.
Positions are fractions of the frame, so the same script runs on screenshots or full files.

usage: python3 -I pc04_chandelier.py PC-05.png PC-04.png OUT.png
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

p05, p04, outp = sys.argv[1:4]
A = np.asarray(Image.open(p05).convert("RGB")).astype(np.float32)
B = np.asarray(Image.open(p04).convert("RGB")).astype(np.float32)
HA, WA, _ = A.shape
HB, WB, _ = B.shape

# --- 1. PC-05 chandelier with its background rebuilt -------------------------------------
axis = 0.49991 * WA                          # mirror axis found for PC-05 (2751.5 / 5504)
yt, yr = int(0.009 * HA), int(0.222 * HA)    # top of cone (under the border) / clean row below
x0, x1 = int(0.448 * WA), int(0.552 * WA)    # chandelier box
y0, y1 = int(0.012 * HA), int(0.205 * HA)  # start under the frame border

def halfw(y):  # cone half-width grows linearly from the apex
    return 0.0131 * WA + (0.0818 - 0.0131) * WA * (y - yt) / (0.2686 * HA - yt)

ref = A[yr]
bg = A.copy()
xs = np.arange(WA, dtype=np.float32)
for y in range(yt, y1 + 1):
    src = axis + (xs - axis) * halfw(yr) / halfw(y)
    for c in range(3):
        bg[y, :, c] = np.interp(src, xs, ref[:, c])
diff = np.abs(A - bg).max(2)
L = A.mean(2)
r, g, b = A[..., 0], A[..., 1], A[..., 2]
ink = L < 45                                  # black outlines and chain
crystal = (b - r > -12) & (L > 100)           # lavender glass (cone peach and the dark wall fail this)
m = np.zeros((HA, WA), bool)
m[y0:y1, x0:x1] = ((diff > 28) & (ink | crystal))[y0:y1, x0:x1]
# candle flames are cream (g-b about 26-33, the cone about 18-20) and sit against the ink
flame = (L > 200) & (g - b > 24) & ndi.binary_dilation(ink, iterations=max(3, WA // 900))
m[y0:y1, x0:x1] |= flame[y0:y1, x0:x1]
m = ndi.binary_closing(m, iterations=2)
lab, n = ndi.label(m)  # drop stray specks; the bead garlands are tiny separate shapes, so keep small ones
sizes = ndi.sum(m, lab, range(1, n + 1))
m = np.isin(lab, 1 + np.where(sizes > 0.000002 * HA * WA)[0])
# keep only pieces within reach of the chandelier body (beads hang close; cone-edge crumbs don't)
grp, gn = ndi.label(ndi.binary_dilation(m, iterations=max(4, WA // 270)))
m &= grp == 1 + np.argmax(ndi.sum(m, grp, range(1, gn + 1)))
alpha = ndi.gaussian_filter(m.astype(np.float32), 0.8)
ys, xs_ = np.where(m)
cy0, cy1, cx0, cx1 = ys.min(), ys.max() + 1, xs_.min(), xs_.max() + 1
chand = np.dstack([A[cy0:cy1, cx0:cx1], alpha[cy0:cy1, cx0:cx1] * 255]).astype(np.uint8)

# --- 2. remove PC-04's chandelier from its flat wall -------------------------------------
bx0, bx1, by0, by1 = int(0.452 * WB), int(0.584 * WB), 0, int(0.222 * HB)  # old chandelier box
wall = np.median(B[int(0.25 * HB):int(0.30 * HB), int(0.44 * WB):int(0.56 * WB)].reshape(-1, 3), 0)
mb = np.zeros((HB, WB), bool)
mb[by0:by1, bx0:bx1] = np.abs(B[by0:by1, bx0:bx1] - wall).max(2) > 14
mb = ndi.binary_dilation(mb, iterations=max(2, WB // 700))
valid = np.ones((HB, WB), np.float32)
valid[mb] = 0
sig = WB / 120
num = np.stack([ndi.gaussian_filter(B[..., c] * valid, sig) for c in range(3)], -1)
den = ndi.gaussian_filter(valid, sig)[..., None] + 1e-6
fill = num / den
a2 = ndi.gaussian_filter(mb.astype(np.float32), 1.0)[..., None]
out = B * (1 - a2) + fill * a2

# --- 3. paste the PC-05 chandelier at the old one's size and place -----------------------
ys, xs_ = np.where(mb)
ox0, ox1, oy1 = xs_.min(), xs_.max(), ys.max()
target_w = (ox1 - ox0) * 1.0
scale = target_w / chand.shape[1]
cw, ch = int(round(chand.shape[1] * scale)), int(round(chand.shape[0] * scale))
im = Image.fromarray(chand, "RGBA").resize((cw, ch), Image.LANCZOS)
px = int(round((ox0 + ox1) / 2 - cw / 2))
py = 0  # chain hangs from the ceiling
o = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert("RGBA")
o.alpha_composite(im, (px, py))
o.convert("RGB").save(outp)
print(f"PC-05 chandelier {cx1-cx0}x{cy1-cy0} -> {cw}x{ch} at ({px},{py}) in PC-04 {WB}x{HB}")
