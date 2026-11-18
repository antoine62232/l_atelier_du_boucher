"""Reconstruit la demi-carcasse en un volume fermé et propre.

Le modèle d'origine est fait de deux nappes (face de fente, face extérieure) qui ne
coïncident pas : contours différents (deux pattes), trous, dos en lame.
On part des deux faces vues de profil (couleur et profondeur, rendues à plat),
on prend le contour de la face de fente comme référence, on y recale la face
extérieure ligne par ligne, on bouche les trous, puis on reconstruit deux surfaces
régulières qui se rejoignent sur un bord arrondi.
"""
import numpy as np
from PIL import Image, ImageOps, ImageFilter
from scipy import ndimage as ndi
import trimesh

W, H = 1152, 3072
E = W / 768  # les flous sont réglés pour 768 px de large
Z0, Z1, Y0, Y1 = -0.45, 0.45, 0.0, 2.5
PX = (Z1 - Z0) / W  # taille d'un pixel en mètres (identique en y : 2.5/2048 ≈ 0.00122)
PAS = 0.004          # pas de la grille du maillage
ARRONDI = 0.035      # largeur du bord arrondi
LISSAGE_RELIEF = 2.5 * E # flou du relief, en pixels de texture


def charger(cote):
    c = Image.open(f"bake_{cote}_couleur.png").convert("RGBA")
    p = Image.open(f"bake_{cote}_profondeur.png").convert("RGBA")
    if cote == "fente":
        c, p = ImageOps.mirror(c), ImageOps.mirror(p)
    c = np.asarray(c).astype(np.float32)
    p = np.asarray(p).astype(np.float32)
    masque = p[..., 3] > 0
    x = (p[..., 0] + p[..., 1] / 255) / 255 - 0.5
    return c[..., :3], x, masque


def nettoyer_masque(m):
    m = ndi.binary_closing(m, structure=np.ones((5, 5)), iterations=2)
    m = ndi.binary_fill_holes(m)
    m = ndi.binary_opening(m, structure=np.ones((5, 5)), iterations=2)
    # Garder la plus grande pièce.
    lab, n = ndi.label(m)
    if n > 1:
        tailles = ndi.sum(m, lab, range(1, n + 1))
        m = lab == (1 + int(np.argmax(tailles)))
    # Contour lissé.
    flou = ndi.gaussian_filter(m.astype(np.float32), 4 * E)
    return flou > 0.5


def boucher(valeurs, connu):
    """Remplit les pixels inconnus par le pixel connu le plus proche, puis adoucit la jonction."""
    _, (iy, ix) = ndi.distance_transform_edt(~connu, return_indices=True)
    rempli = valeurs[iy, ix]
    if rempli.ndim == 3:
        flou = np.stack([ndi.gaussian_filter(rempli[..., k], 2) for k in range(rempli.shape[2])], -1)
        poids = np.clip(ndi.distance_transform_edt(~connu) / 3, 0, 1)[..., None]
    else:
        flou = ndi.gaussian_filter(rempli, 2)
        poids = np.clip(ndi.distance_transform_edt(~connu) / 3, 0, 1)
    return rempli * (1 - poids) + flou * poids


def recaler(valeurs, masque_src, masque_cible):
    """Étire chaque ligne de la face extérieure pour qu'elle couvre la même largeur que la face de fente."""
    out = np.zeros(masque_cible.shape + valeurs.shape[2:], np.float32)
    cols = np.arange(W)
    for r in range(H):
        cible = np.nonzero(masque_cible[r])[0]
        if len(cible) == 0:
            continue
        # Ligne source : la plus proche qui ait du contenu.
        rs = r
        while rs < H and not masque_src[rs].any():
            rs += 1
        if rs >= H:
            rs = r
            while rs > 0 and not masque_src[rs].any():
                rs -= 1
        src = np.nonzero(masque_src[rs])[0]
        a0, a1 = src[0], src[-1]
        b0, b1 = cible[0], cible[-1]
        t = (cols - b0) / max(b1 - b0, 1)
        pos = a0 + t * (a1 - a0)
        pos = np.clip(pos, 0, W - 1)
        if valeurs.ndim == 3:
            for k in range(valeurs.shape[2]):
                out[r, :, k] = np.interp(pos, cols, valeurs[rs, :, k])
        else:
            out[r] = np.interp(pos, cols, valeurs[rs])
    return out


coul_f, x_f, m_f = charger("fente")
coul_e, x_e, m_e = charger("ext")

# Contour de référence : la face de fente, nettoyée.
contour = nettoyer_masque(m_f)

# Trous de chaque face, comblés avant recalage.
coul_f = boucher(coul_f, m_f)
x_f = boucher(x_f, m_f)
m_e_net = nettoyer_masque(m_e)
coul_e = boucher(coul_e, m_e)
x_e = boucher(x_e, m_e)
coul_e = recaler(coul_e, m_e_net, contour)
x_e = recaler(x_e, m_e_net, contour)

# Relief adouci (le bruit du modèle d'origine donne un éclairage grumeleux).
x_f = ndi.gaussian_filter(x_f, LISSAGE_RELIEF)
x_e = ndi.gaussian_filter(x_e, LISSAGE_RELIEF)

# Distance signée au contour, en mètres (négative dedans).
dedans = ndi.distance_transform_edt(contour) * PX
dehors = ndi.distance_transform_edt(~contour) * PX
sdf = np.where(contour, -dedans, dehors)
sdf = ndi.gaussian_filter(sdf, 1.5 * E)

# Textures. Près du bord, la texture est étirée sur la tranche arrondie et fait des stries :
# on la remplace progressivement par une version très floue, identique sur les deux faces au bord,
# pour que la jonction des deux faces ne se voie pas.
BANDE = 0.07
dist_px = ndi.distance_transform_edt(contour) * PX
poids_bord = np.clip(1 - dist_px / BANDE, 0, 1) ** 1.5
plein_f = boucher(coul_f, contour)
plein_e = boucher(coul_e, contour)
def flou(img, s):
    return np.stack([ndi.gaussian_filter(img[..., k], s) for k in range(3)], -1)
flou_f, flou_e = flou(plein_f, 18 * E), flou(plein_e, 18 * E)
commun = (flou_f + flou_e) / 2
for nom, plein, fl in [("fente", plein_f, flou_f), ("ext", plein_e, flou_e)]:
    poids_commun = np.clip(1 - dist_px / (BANDE / 3), 0, 1)[..., None]
    lisse = fl * (1 - poids_commun) + commun * poids_commun
    final = plein * (1 - poids_bord[..., None]) + lisse * poids_bord[..., None]
    final = boucher(final, contour)
    Image.fromarray(np.clip(final, 0, 255).astype(np.uint8)).save(f"texture_{nom}.png")


def echantillon(img, y, z):
    """Lecture bilinéaire d'une carte (lignes = y décroissant, colonnes = z croissant)."""
    col = (z - Z0) / PX - 0.5
    lig = (Y1 - y) / ((Y1 - Y0) / H) - 0.5
    return ndi.map_coordinates(img, [lig, col], order=1, mode="nearest")


# Grille : on garde les cellules dont le centre est dans le contour.
ny = int(round((Y1 - Y0) / PAS)) + 1
nz = int(round((Z1 - Z0) / PAS)) + 1
gy = Y0 + np.arange(ny) * PAS
gz = Z0 + np.arange(nz) * PAS
cy = (gy[:-1] + gy[1:]) / 2
cz = (gz[:-1] + gz[1:]) / 2
CZ, CY = np.meshgrid(cz, cy)
cellules = echantillon(sdf, CY.ravel(), CZ.ravel()).reshape(CY.shape) < 0

utilise = np.zeros((ny, nz), bool)
utilise[:-1, :-1] |= cellules
utilise[1:, :-1] |= cellules
utilise[:-1, 1:] |= cellules
utilise[1:, 1:] |= cellules
index = -np.ones((ny, nz), int)
index[utilise] = np.arange(utilise.sum())
GZ, GY = np.meshgrid(gz, gy)
py, pz = GY[utilise].copy(), GZ[utilise].copy()

# Sommets du bord : posés exactement sur le contour lissé.
interieur = np.zeros((ny, nz), bool)
interieur[1:-1, 1:-1] = (
    cellules[:-1, :-1] & cellules[1:, :-1] & cellules[:-1, 1:] & cellules[1:, 1:]
)
bord = utilise & ~interieur
ib = index[bord]
gsdf_y, gsdf_z = np.gradient(sdf)
for _ in range(4):
    d = echantillon(sdf, py[ib], pz[ib])
    # gradient en mètres par mètre : lignes vers le bas = y décroissant
    gy_ = -echantillon(gsdf_y, py[ib], pz[ib]) / ((Y1 - Y0) / H)
    gz_ = echantillon(gsdf_z, py[ib], pz[ib]) / PX
    n2 = gy_ ** 2 + gz_ ** 2 + 1e-12
    py[ib] -= d * gy_ / n2
    pz[ib] -= d * gz_ / n2

# Profil arrondi près du bord : plus la carcasse est épaisse à cet endroit, plus l'arrondi est large.
dist = np.clip(-echantillon(sdf, py, pz), 0, None)
dist[ib] = 0
def profil_pour(xcarte):
    epaisseur = np.abs(ndi.gaussian_filter(xcarte, 25 * E))
    r = np.clip(echantillon(epaisseur, py, pz) * 0.9, ARRONDI, 0.12)
    return np.sqrt(np.clip(1 - (1 - np.clip(dist / r, 0, 1)) ** 2, 0, 1))

iy, iz = np.nonzero(cellules)
a = index[iy, iz]
b = index[iy, iz + 1]
c = index[iy + 1, iz + 1]
d = index[iy + 1, iz]
quads = np.stack([a, b, c, d], 1)


def nappe(xcarte, signe, nom):
    x = echantillon(xcarte, py, pz) * profil_pour(xcarte)
    # Jamais du mauvais côté du plan de fente.
    x = np.maximum(x, 0) if signe > 0 else np.minimum(x, 0)
    v = np.stack([x, py, pz], 1)
    # Orientation : normales vers +x pour la fente, vers -x pour l'extérieur.
    if signe > 0:
        f = np.concatenate([quads[:, [0, 2, 1]], quads[:, [0, 3, 2]]])
    else:
        f = np.concatenate([quads[:, [0, 1, 2]], quads[:, [0, 2, 3]]])
    uv = np.stack([(pz - Z0) / (Z1 - Z0), (py - Y0) / (Y1 - Y0)], 1)
    tex = Image.open(f"texture_{nom}.png")
    mat = trimesh.visual.material.PBRMaterial(
        name=f"matiere_{nom}", baseColorTexture=tex, metallicFactor=0.0, roughnessFactor=0.78
    )
    m = trimesh.Trimesh(vertices=v, faces=f, process=False)
    m.visual = trimesh.visual.TextureVisuals(uv=uv, material=mat)
    # Normales lisses, et au bord : la normale du contour (les deux nappes s'y raccordent sans couture).
    n = m.vertex_normals.copy()
    gy_ = -echantillon(gsdf_y, py[ib], pz[ib]) / ((Y1 - Y0) / H)
    gz_ = echantillon(gsdf_z, py[ib], pz[ib]) / PX
    nb = np.stack([np.zeros_like(gy_), gy_, gz_], 1)
    nb /= np.linalg.norm(nb, axis=1, keepdims=True) + 1e-12
    n[ib] = nb
    m.vertex_normals = n
    return m


fente = nappe(x_f, +1, "fente")
ext = nappe(x_e, -1, "ext")
print("sommets par nappe", len(py), "faces", len(fente.faces), "bord", len(ib))
scene = trimesh.Scene()
scene.add_geometry(fente, node_name="face_de_fente", geom_name="face_de_fente")
scene.add_geometry(ext, node_name="face_exterieure", geom_name="face_exterieure")
scene.export("reconstruit.glb")
print("ok")
