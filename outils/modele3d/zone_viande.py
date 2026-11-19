"""Zone de viande apparente sur la face extérieure de l'épaule (poitrine, côté ventre).
Le shader n'affiche la viande du ventre que sur les flancs très inclinés. Sur l'épaule, la face est
presque plate : on donne la zone par un masque dans le repère des photos (mêmes UV que les textures).
Sortie : zone_viande.png (niveaux de gris, 1 = viande)."""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from masque import masque

H_TOTAL = 2.5
img_f, m_f = masque("interieur_x4.png", False)
HF, WF = m_f.shape
ys, xs = np.nonzero(m_f)
Y1 = ys.max()
S = H_TOTAL / (ys.max() - ys.min())
contour = ndi.gaussian_filter(m_f.astype(np.float32), 10) > 0.5
lig, col = np.mgrid[0:HF, 0:WF]
Y, Z = (Y1 - lig) * S, (col - (xs.min() + xs.max()) / 2) * S

# Le muscle à nu de la photo (bande rouge du flanc) s'arrête vers y = 0,78. On le prolonge sur l'épaule
# jusqu'au jarret, en s'élargissant côté dos (tracé d'Antoine sur la capture du 19/11/2026).
yl = Y[:, 0]
GAUCHE = [(0.36, 0.06), (0.42, -0.03), (0.50, -0.11), (0.60, -0.15), (0.70, -0.13), (0.80, -0.08), (0.90, -0.07)]
DROITE = [(0.36, 0.15), (0.45, 0.20), (0.55, 0.20), (0.70, 0.17), (0.80, 0.13), (0.90, 0.12)]
zg = np.interp(yl, *map(np.array, zip(*GAUCHE)))[:, None]
zd = np.interp(yl, *map(np.array, zip(*DROITE)))[:, None]
rng = np.random.default_rng(3)
bruit = ndi.gaussian_filter(rng.standard_normal((HF // 8 + 1, WF // 8 + 1)), 4)
bruit = ndi.zoom(bruit / bruit.std(), 8, order=1)[:HF, :WF]
lisse = lambda v: np.clip(v, 0, 1) ** 2 * (3 - 2 * np.clip(v, 0, 1))
largeur = lisse((Z - zg + 0.012 * bruit) / 0.03) * lisse((zd - Z + 0.012 * bruit) / 0.03)
hauteur = lisse((yl - 0.36) / 0.06) * lisse((0.88 - yl) / 0.08)
zone = largeur * hauteur[:, None] * contour
zone = ndi.gaussian_filter(zone, 0.008 / S)
Image.fromarray((zone * 255).astype(np.uint8)).resize((WF // 4, HF // 4), Image.LANCZOS).save("zone_viande.png")
print("ok", WF // 4, HF // 4)
