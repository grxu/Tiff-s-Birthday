"""Swap what stands on the left and right of a mirror-symmetric frame (no Higgsfield credits).

Inside the given box and its mirror twin, the frame is replaced by its own reflection about
the vertical axis, so whatever sits in the left box appears flipped on the right and vice
versa (both still face the centre). Everything outside the two boxes is untouched. Use it
only where the set itself is symmetric (thrones, doorframes, carpet).

usage: python3 -I mirror_swap.py IN.png OUT.png --box x0,y0,x1,y1 [--box ...] [--axis X]
       each box is a LEFT box in full-resolution pixels; axis defaults to a best-fit search.
"""
import argparse
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--box", action="append", required=True); ap.add_argument("--axis", type=float)
a = ap.parse_args()
img = np.asarray(Image.open(a.inp).convert("RGB")).astype(np.float32)
H, W, _ = img.shape
if a.axis is None:  # best mirror axis from the top third (walls, frames)
    band = img[int(.05 * H):int(.33 * H)]
    ks = np.arange(int(.08 * W), int(.45 * W))
    best = min((np.abs(band[:, a2 // 2 - ks] - band[:, a2 - (a2 // 2 - ks)]).mean(), a2) for a2 in range(W - 80, W + 81) if (a2 - (a2 // 2 - ks)).max() < W)
    a.axis = best[1] / 2
two = int(round(2 * a.axis))
mir = img[:, ::-1][:, (W - 1 - two) % W:][:, :W] if two == W - 1 else img[:, np.clip(two - np.arange(W), 0, W - 1)]
m = np.zeros((H, W), np.float32)
for b in a.box:  # several left boxes can trace the subject and stay clear of asymmetric light
    x0, y0, x1, y1 = map(int, b.split(","))
    m[y0:y1, x0:x1] = 1
    m[y0:y1, two - x1 + 1:two - x0 + 1] = 1
m = ndi.gaussian_filter(m, 3)[..., None]
out = img * (1 - m) + mir * m
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(a.out)
print(f"{W}x{H} axis {a.axis}, {len(a.box)} box(es) swapped")
