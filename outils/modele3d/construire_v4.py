"""Demi-carcasse de bœuf v4, construite à partir de deux vraies photos (face de fente et face extérieure).

- Textures : les photos, agrandies x4 (Real-ESRGAN), sans flou ajouté.
- Contour : celui de la photo de la face de fente ; la photo extérieure est recalée dessus ligne par ligne.
- Volume : plan de fente au rachis (x = 0), cage thoracique et abdomen en creux côté fente,
  épaisseurs de la face extérieure par région (cuisse, hanche, dos, épaule, collier, poitrine, flanc),
  bords arrondis, jarrets en tubes.
- Relief fin : normal map tirée des photos.
Repère : y vers le haut (0 collier, 2,5 jarret arrière), z du dos (négatif) au ventre (positif),
x vers la face de fente.
"""
import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage as ndi
import trimesh
from masque import masque

H_TOTAL = 2.5
PAS = 0.004

# --- Photos et contour -----------------------------------------------------------------------
img_f, m_f = masque("interieur_x4.png", False)
img_e, m_e = masque("exterieur_x4.png", True)
HF, WF = m_f.shape
ys, xs = np.nonzero(m_f)
Y1 = ys.max()
S = H_TOTAL / (ys.max() - ys.min())  # mètres par pixel
XC = (xs.min() + xs.max()) / 2


def vers_px(y, z):
    return Y1 - y / S, XC + z / S  # ligne, colonne


def lire(carte, y, z, ordre=1):
    r, c = vers_px(np.asarray(y), np.asarray(z))
    return ndi.map_coordinates(carte, [r, c], order=ordre, mode="nearest")


# Contour de référence, lissé.
contour = ndi.gaussian_filter(m_f.astype(np.float32), 3) > 0.5
dedans = ndi.distance_transform_edt(contour) * S
dehors = ndi.distance_transform_edt(~contour) * S
sdf = ndi.gaussian_filter(np.where(contour, -dedans, dehors), 1.5)

# --- Photo extérieure recalée ligne par ligne sur le contour de la fente --------------------
ye, xe_ = np.nonzero(m_e)
re0, re1 = ye.min(), ye.max()


def segments(ligne):
    idx = np.nonzero(ligne)[0]
    if len(idx) == 0:
        return []
    coupures = np.nonzero(np.diff(idx) > 3)[0]
    debuts = np.concatenate([[idx[0]], idx[coupures + 1]])
    fins = np.concatenate([idx[coupures], [idx[-1]]])
    return [(a, b) for a, b in zip(debuts, fins) if b - a > 6]


ext = np.zeros((HF, WF, 3), np.float32)
cols = np.arange(img_e.shape[1])
for r in range(HF):
    cible = segments(contour[r])
    if not cible:
        continue
    y = (Y1 - r) * S
    rs = int(round(re1 - y / H_TOTAL * (re1 - re0)))
    rs = min(max(rs, re0), re1)
    src = segments(m_e[rs])
    while not src and rs < re1:
        rs += 1
        src = segments(m_e[rs])
    if not src:
        continue
    if len(src) != len(cible):
        src = [(src[0][0], src[-1][1])]
        cible_l = [(cible[0][0], cible[-1][1])]
    else:
        cible_l = cible
    for (a0, a1), (b0, b1) in zip(src, cible_l):
        t = (np.arange(b0, b1 + 1) - b0) / max(b1 - b0, 1)
        # On reste à 2 px du bord de la photo source pour ne pas lire le fond.
        pos = (a0 + 2) + t * max(a1 - a0 - 4, 1)
        for k in range(3):
            ext[r, b0:b1 + 1, k] = np.interp(pos, cols, img_e[rs, :, k].astype(np.float32))

# Couleurs prolongées hors du contour (évite un liseré blanc au bord des textures).
def prolonger(img, m):
    _, (iy, ix) = ndi.distance_transform_edt(~m, return_indices=True)
    return img[iy, ix]

m_int = ndi.binary_erosion(contour, iterations=3)
tex_f = prolonger(img_f.astype(np.float32), m_int & m_f)
tex_e = prolonger(ext, m_int & (ext.sum(2) > 0))
Image.fromarray(np.clip(tex_f, 0, 255).astype(np.uint8)).save("v4_fente.png")
Image.fromarray(np.clip(tex_e, 0, 255).astype(np.uint8)).save("v4_ext.png")


def normal_map(tex, nom, force=2.2):
    L = (0.3 * tex[..., 0] + 0.55 * tex[..., 1] + 0.15 * tex[..., 2]) / 255
    h = L - ndi.gaussian_filter(L, 10)
    h = ndi.gaussian_filter(h, 0.8)
    gy, gx = np.gradient(h)
    n = np.dstack([-gx * force * 10, gy * force * 10, np.ones_like(h)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    img = ((n * 0.5 + 0.5) * 255).astype(np.uint8)
    Image.fromarray(img).resize((WF // 2, HF // 2), Image.LANCZOS).save(nom)


normal_map(tex_f, "v4_fente_normal.png")
normal_map(tex_e, "v4_ext_normal.png")

# --- Champs de forme, sur une grille en mètres ---------------------------------------------
NY = int(round(H_TOTAL / PAS)) + 1
z_min, z_max = (xs.min() - XC) * S - 0.02, (xs.max() - XC) * S + 0.02
NZ = int(round((z_max - z_min) / PAS)) + 1
gy = np.arange(NY) * PAS
gz = z_min + np.arange(NZ) * PAS
GZ, GY = np.meshgrid(gz, gy)

dist = np.clip(-lire(sdf, GY, GZ), 0, None)  # distance au contour, en mètres (0 dehors)


def interp(points, x):
    p = np.array(points, float)
    return np.interp(x, p[:, 0], p[:, 1])


# Axe du rachis (centre de la bande des vertèbres fendues), relevé sur la photo de la face de fente.
RACHIS = [(0.0, -0.30), (0.30, -0.30), (0.45, -0.34), (0.70, -0.36), (1.00, -0.37), (1.20, -0.40), (1.50, -0.42), (1.75, -0.42), (2.0, -0.40)]
z_rachis = interp(RACHIS, GY)

# Bord ventral de chaque ligne (bord droit du contour).
masque_g = dist > 0
bord_ventral = np.where(masque_g.any(1), gz[np.clip(NZ - 1 - np.argmax(masque_g[:, ::-1], axis=1), 0, NZ - 1)], 0)
bord_ventral = ndi.uniform_filter1d(bord_ventral, 9)[:, None] * np.ones((1, NZ))

# Creux de la cage thoracique et de l'abdomen (côté fente).
PROF_CREUX = [(0.40, 0.0), (0.52, 0.15), (0.75, 0.20), (1.00, 0.20), (1.15, 0.17), (1.35, 0.14), (1.55, 0.08), (1.72, 0.0)]
za = z_rachis + 0.07
zb = bord_ventral - 0.04
t = np.clip((GZ - za) / np.maximum(zb - za, 0.05), 0, 1)
profil_creux = (t ** 0.55) * (1 - t) ** 0.9
profil_creux /= (0.55 ** 0.55 * 0.45 ** 0.9) / 1.0  # maximum ≈ 1 vers t ≈ 0.38
profil_creux = np.clip(profil_creux / profil_creux.max(), 0, 1)
creux = interp(PROF_CREUX, GY) * profil_creux * ((GZ > za) & (GZ < zb))
creux = ndi.gaussian_filter(creux, 4)


def bosse(yc, zc, val, sy, sz):
    return val * np.exp(-0.5 * (((GY - yc) / sy) ** 2 + ((GZ - zc) / sz) ** 2))


def max_doux(champs, k=30.0):
    return np.log(sum(np.exp(k * c) for c in champs)) / k


# Épaisseur de la face extérieure (distance du plan de fente à la peau), par région.
dos = lambda y0, y1, val: val * np.exp(-0.5 * ((GZ - (z_rachis + 0.10)) / 0.13) ** 2) * (
    1 / (1 + np.exp(-(GY - y0) / 0.04))) * (1 / (1 + np.exp((GY - y1) / 0.04)))
epaisseur = max_doux([
    bosse(1.98, -0.18, 0.34, 0.28, 0.24),   # cuisse
    bosse(1.72, -0.34, 0.28, 0.14, 0.12),   # hanche (rumsteck)
    dos(1.08, 1.70, 0.23),                  # déhanché, aloyau
    dos(0.60, 1.12, 0.25),                  # entrecôtes, milieu de train de côtes
    bosse(0.42, -0.08, 0.33, 0.20, 0.22),   # épaule
    bosse(0.16, -0.30, 0.20, 0.12, 0.15),   # collier
    bosse(0.36, 0.14, 0.17, 0.10, 0.12),    # poitrine
    creux + 0.05,                           # paroi : flanc, plat de côtes
    np.full_like(GY, 0.06),
])
epaisseur = np.maximum(ndi.gaussian_filter(epaisseur, 3), creux + 0.045)

# Jarrets : tubes ronds, décalés du plan de fente.
def masque_segment(p0, p1, rayon):
    (y0, z0), (y1, z1) = p0, p1
    d = np.array([y1 - y0, z1 - z0]); L = np.linalg.norm(d); d /= L
    u = np.clip((GY - y0) * d[0] + (GZ - z0) * d[1], 0, L)
    py, pz = y0 + u * d[0], z0 + u * d[1]
    return np.hypot(GY - py, GZ - pz) < rayon

membre = masque_segment((0.30, 0.17), (0.06, 0.50), 0.11) | masque_segment((2.20, -0.14), (2.50, -0.10), 0.12)
membre &= masque_g
poids_membre = np.clip(ndi.gaussian_filter(membre.astype(np.float32), 6) * 1.6, 0, 1)
rayon_local = ndi.grey_dilation(dist * membre, size=(25, 25))
rayon_local = np.maximum(ndi.gaussian_filter(rayon_local, 3), 0.02)
d_rel = np.clip(dist / rayon_local, 0, 1)
demi_tube = rayon_local * np.sqrt(np.clip(1 - (1 - d_rel) ** 2, 0, 1))
centre_membre = -rayon_local * 1.05

# Bords arrondis de la face extérieure : rayon proportionnel à l'épaisseur (dos, cuisse ronds),
# sauf au bas du collier, coupé net en travers.
r_arrondi = np.clip(epaisseur * 0.85, 0.03, 0.20)
coupe_collier = np.clip((0.16 - GY) / 0.06, 0, 1) * np.clip((0.12 - GZ) / 0.08, 0, 1)
r_arrondi = r_arrondi * (1 - coupe_collier) + 0.012 * coupe_collier
rho = np.sqrt(np.clip(1 - (1 - np.clip(dist / r_arrondi, 0, 1)) ** 2, 0, 1))

x_fente = (1 - poids_membre) * (-creux) + poids_membre * (centre_membre + demi_tube)
x_ext = (1 - poids_membre) * (-epaisseur * rho) + poids_membre * (centre_membre - demi_tube)
x_fente = np.minimum(x_fente, 0.0) if True else x_fente
x_ext = np.minimum(x_ext, x_fente - 0.004 * (dist > 0.003))
np.save("v4_x_fente.npy", x_fente); np.save("v4_x_ext.npy", x_ext)

# --- Maillage ----------------------------------------------------------------------------
cy = (gy[:-1] + gy[1:]) / 2
cz = (gz[:-1] + gz[1:]) / 2
CZ, CY = np.meshgrid(cz, cy)
cellules = lire(sdf, CY, CZ) < 0
utilise = np.zeros((NY, NZ), bool)
for dy in (0, 1):
    for dz in (0, 1):
        utilise[dy:NY - 1 + dy, dz:NZ - 1 + dz] |= cellules
index = -np.ones((NY, NZ), int)
index[utilise] = np.arange(utilise.sum())
py, pz = GY[utilise].copy(), GZ[utilise].copy()
interieur = np.zeros((NY, NZ), bool)
interieur[1:-1, 1:-1] = cellules[:-1, :-1] & cellules[1:, :-1] & cellules[:-1, 1:] & cellules[1:, 1:]
ib = index[utilise & ~interieur]

gs_r, gs_c = np.gradient(sdf)
for _ in range(5):
    d = lire(sdf, py[ib], pz[ib])
    gyv = -lire(gs_r, py[ib], pz[ib]) / S
    gzv = lire(gs_c, py[ib], pz[ib]) / S
    n2 = gyv ** 2 + gzv ** 2 + 1e-12
    py[ib] -= d * gyv / n2
    pz[ib] -= d * gzv / n2


def champ(c):
    # Lecture d'un champ de la grille en (py, pz) quelconques.
    fy = py / PAS
    fz = (pz - z_min) / PAS
    return ndi.map_coordinates(c, [fy, fz], order=1, mode="nearest")


xf = champ(x_fente)
xe = champ(x_ext)
# Au bord, les deux faces se rejoignent exactement.
jonction = champ(poids_membre * centre_membre)
xf[ib] = jonction[ib]
xe[ib] = jonction[ib]

iy, iz = np.nonzero(cellules)
quads = np.stack([index[iy, iz], index[iy, iz + 1], index[iy + 1, iz + 1], index[iy + 1, iz]], 1)
# Coordonnées de texture : projection de face. Sur les flancs très inclinés (dos, ventre), l'application
# remplace la photo étirée par un grain de gras projeté de côté (voir Carcasse3D.jsx).
r_px, c_px = vers_px(py, pz)
uv_f = uv_e = np.stack([c_px / WF, 1 - r_px / HF], 1)  # trimesh retourne v à l'export glTF
gr = -lire(gs_r, py[ib], pz[ib]) / S
gc = lire(gs_c, py[ib], pz[ib]) / S
n_bord = np.stack([np.zeros_like(gr), gr, gc], 1)
n_bord /= np.linalg.norm(n_bord, axis=1, keepdims=True) + 1e-12


def nappe(x, fente, nom, normal_bord, uv):
    v = np.stack([x, py, pz], 1)
    f = np.concatenate([quads[:, [0, 2, 1]], quads[:, [0, 3, 2]]]) if fente else np.concatenate([quads[:, [0, 1, 2]], quads[:, [0, 2, 3]]])
    tex = Image.open(f"v4_{nom}.png")
    nrm = Image.open(f"v4_{nom}_normal.png")
    mat = trimesh.visual.material.PBRMaterial(
        name=f"matiere_{nom}", baseColorTexture=tex, normalTexture=nrm, metallicFactor=0.0, roughnessFactor=0.62
    )
    m = trimesh.Trimesh(vertices=v, faces=f, process=False)
    m.visual = trimesh.visual.TextureVisuals(uv=uv, material=mat)
    n = m.vertex_normals.copy()
    if normal_bord:
        n[ib] = n_bord
    m.vertex_normals = n
    return m


# Carcasse centrée sur l'axe de rotation de la caméra (le plan de fente passe à x = +DECALAGE).
DECALAGE = round(float(-(xe.min() + 0.0) / 2), 3)
xf = xf + DECALAGE
xe = xe + DECALAGE
print("décalage x", DECALAGE)
fente = nappe(xf, True, "fente", False, uv_f)
exterieur = nappe(xe, False, "ext", True, uv_e)
print("sommets par face", len(py), "triangles", 2 * len(fente.faces), "bord", len(ib))
print("épaisseur max", float(-x_ext.min()), "creux max", float(creux.max()), "largeur", float(z_max - z_min))
scene = trimesh.Scene()
scene.add_geometry(fente, node_name="face_de_fente", geom_name="face_de_fente")
scene.add_geometry(exterieur, node_name="face_exterieure", geom_name="face_exterieure")
scene.export("v4_brut.glb")
print("ok")
