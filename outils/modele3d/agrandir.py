"""Agrandit une image x4 avec Real-ESRGAN (ncnn, sur le processeur), par tuiles."""
import sys
import numpy as np
import ncnn
from PIL import Image

entree, sortie = sys.argv[1], sys.argv[2]
TUILE, MARGE, F = 128, 12, 4

net = ncnn.Net()
net.opt.use_vulkan_compute = False
net.opt.num_threads = 2
net.load_param("rv/models/realesrgan-x4plus.param")
net.load_model("rv/models/realesrgan-x4plus.bin")

im = Image.open(entree).convert("RGBA")
rgb = np.asarray(im)[..., :3].astype(np.float32) / 255.0
alpha = np.asarray(im)[..., 3]
H, W, _ = rgb.shape
out = np.zeros((H * F, W * F, 3), np.float32)
for y0 in range(0, H, TUILE):
    for x0 in range(0, W, TUILE):
        ya, xa = max(0, y0 - MARGE), max(0, x0 - MARGE)
        yb, xb = min(H, y0 + TUILE + MARGE), min(W, x0 + TUILE + MARGE)
        bloc = np.ascontiguousarray(rgb[ya:yb, xa:xb].transpose(2, 0, 1))
        ex = net.create_extractor()
        ex.input("data", ncnn.Mat(bloc))
        _, res = ex.extract("output")
        res = np.array(res).transpose(1, 2, 0)
        cy, cx = (y0 - ya) * F, (x0 - xa) * F
        hh, ww = (min(y0 + TUILE, H) - y0) * F, (min(x0 + TUILE, W) - x0) * F
        out[y0 * F:y0 * F + hh, x0 * F:x0 * F + ww] = res[cy:cy + hh, cx:cx + ww]
    print("ligne", y0, flush=True)
out = (np.clip(out, 0, 1) * 255).round().astype(np.uint8)
a = np.asarray(Image.fromarray(alpha).resize((W * F, H * F), Image.LANCZOS))
Image.fromarray(np.dstack([out, a])).save(sortie)
print("ok", out.shape)
