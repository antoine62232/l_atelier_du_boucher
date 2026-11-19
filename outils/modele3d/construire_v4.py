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
contour = ndi.gaussian_filter(m_f.astype(np.float32), 10) > 0.5
# Encoche de la queue (attache coupée) sur le dos, au niveau du bassin : on la comble en partie,
# sinon l'arrondi du dos y fait une marche.
_r = 0.06 / S
_dil = ndi.distance_transform_edt(~contour) <= _r
_clo = ndi.distance_transform_edt(_dil) > _r
_lig, _col = np.mgrid[0:HF, 0:WF]
_yw, _zw = (Y1 - _lig) * S, (_col - XC) * S
contour = contour | (_clo & (_yw > 1.55) & (_yw < 2.05) & (_zw < -0.15))
# Pointe de la hanche et attache de la queue : sur la photo, le bord du dos y fait une pointe et un creux
# nets, qui donnent une arête en 3D. On adoucit fortement le contour du dos à cet endroit.
_zone = ndi.gaussian_filter(((_yw > 1.5) & (_yw < 2.0) & (_zw < -0.2)).astype(np.float32), 0.04 / S)
_lisse = ndi.gaussian_filter(contour.astype(np.float32), 0.035 / S)
contour = (contour.astype(np.float32) * (1 - _zone) + _lisse * _zone) > 0.5
dedans = ndi.distance_transform_edt(contour) * S
dehors = ndi.distance_transform_edt(~contour) * S
sdf = ndi.gaussian_filter(np.where(contour, -dedans, dehors), 12)

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

# La photo extérieure porte des ombres de prise de vue (bande sombre entre cuisse et dos, etc.)
# qui font croire à des creux. On atténue l'éclairage à grande échelle (au-delà de 8 cm) de moitié.
_Le = ext.mean(2)
_poids = (_Le > 1).astype(np.float32)
_Lb = ndi.gaussian_filter(_Le, 0.08 / S) / np.maximum(ndi.gaussian_filter(_poids, 0.08 / S), 1e-3)
_moy = _Le[_poids > 0].mean()
ext = ext * np.clip((_moy / np.maximum(_Lb, 1)) ** 0.5, 0.75, 1.35)[..., None] * _poids[..., None]
m_int = ndi.binary_erosion(contour, iterations=3)
tex_f = prolonger(img_f.astype(np.float32), m_int & m_f)
tex_e = prolonger(ext, m_int & (ext.sum(2) > 0))
# Raccord des deux faces au bord : la face extérieure prend, sur ses 3 derniers centimètres,
# la couleur (floutée) du bord de la face de fente ; sur les jarrets, ronds des deux côtés,
# les deux faces convergent vers leur moyenne. Sinon la jonction se voit comme une couture.
_d = ndi.distance_transform_edt(contour) * S
_flou = lambda t, s_: np.stack([ndi.gaussian_filter(t[..., k], s_) for k in range(3)], -1)
_bf, _be = _flou(tex_f, 20), _flou(tex_e, 20)


def _segment_px(p0, p1, rayon):
    (y0, z0), (y1, z1) = p0, p1
    d_ = np.array([y1 - y0, z1 - z0]); L_ = np.linalg.norm(d_); d_ /= L_
    u_ = np.clip((_yw - y0) * d_[0] + (_zw - z0) * d_[1], 0, L_)
    return np.hypot(_yw - (y0 + u_ * d_[0]), _zw - (z0 + u_ * d_[1])) < rayon


_membre_px = ndi.gaussian_filter((_segment_px((0.30, 0.17), (0.06, 0.50), 0.11) | _segment_px((2.18, -0.14), (2.50, -0.10), 0.12)).astype(np.float32), 25)
_w_bord = np.clip(1 - _d / 0.03, 0, 1)[..., None]
# Bord de la photo de la face de fente : liseré clair (détourage) et pixels étirés en stries.
# On le remplace par la couleur prise 2 cm à l'intérieur, adoucie.
_interieur = _d > 0.02
_coul_int = _flou(prolonger(tex_f, _interieur), 12)
_w_bord_f = (np.clip(1 - _d / 0.022, 0, 1) ** 0.7)[..., None]
tex_f = tex_f * (1 - _w_bord_f) + _coul_int * _w_bord_f
_bf = _flou(tex_f, 20)
_w_membre = (np.clip(1 - _d / 0.05, 0, 1) * np.clip(_membre_px * 1.5, 0, 1))[..., None]
_moy = (_bf + _be) / 2
tex_e = tex_e * (1 - _w_bord) + _bf * _w_bord
tex_e = tex_e * (1 - _w_membre) + _moy * _w_membre
tex_f = tex_f * (1 - _w_membre) + _moy * _w_membre
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
PROF_CREUX = [(0.40, 0.0), (0.52, 0.15), (0.75, 0.20), (1.00, 0.20), (1.15, 0.17), (1.35, 0.13), (1.55, 0.07), (1.80, 0.0)]
# Bord ventral des corps vertébraux (la colonne remonte vers le ventre en allant vers le cou), relevé sur la photo de la face de fente (bande striée des vertèbres sciées).
# Tout ce qui est côté dos (vertèbres, apophyses, long dorsal) est scié à plat : la fente reste plane et droite.
# La cavité et le filet ne commencent qu'après ce bord.
CORPS = [(0.0, -0.10), (0.20, -0.12), (0.35, -0.13), (0.45, -0.155), (0.55, -0.18), (0.65, -0.20), (0.75, -0.215), (0.85, -0.235), (0.95, -0.25), (1.05, -0.255), (1.15, -0.25), (1.30, -0.245), (1.50, -0.245), (1.75, -0.24), (2.0, -0.24)]
z_corps = ndi.gaussian_filter1d(interp(CORPS, GY), 10, axis=0)
plat = np.clip((GZ - z_corps) / 0.035, 0, 1)
plat = plat * plat * (3 - 2 * plat)  # 0 sur la colonne, 1 à 3,5 cm au-delà
# Départ de la cavité plus progressif (les côtes s'écartent des vertèbres en s'arrondissant) : pas de marche.
plat_creux = np.clip((GZ - z_corps) / 0.08, 0, 1)
plat_creux = plat_creux * plat_creux * (3 - 2 * plat_creux)
za = z_corps
zb = bord_ventral - 0.04
t = np.clip((GZ - za) / np.maximum(zb - za, 0.05), 0, 1)
profil_creux = (t ** 0.55) * (1 - t) ** 0.9
profil_creux /= (0.55 ** 0.55 * 0.45 ** 0.9) / 1.0  # maximum ≈ 1 vers t ≈ 0.38
profil_creux = np.clip(profil_creux / profil_creux.max(), 0, 1)
creux = interp(PROF_CREUX, GY) * profil_creux * ((GZ > za) & (GZ < zb))
creux = ndi.gaussian_filter(creux, 14) * plat_creux
# Poitrine (sternum scié avec la fente) : de la pointe de poitrine jusqu'aux dernières côtes sternales,
# la bande le long du bord ventral est sciée à plat, comme la colonne. Pas de creux entre les côtes et le bord.
_d_ventral = bord_ventral - GZ
_sternum = np.clip((0.22 - _d_ventral) / 0.14, 0, 1)
_sternum = _sternum * _sternum * (3 - 2 * _sternum)
_zone_sternum = np.clip((1.05 - GY) / 0.15, 0, 1)
creux = creux * (1 - _sternum * _zone_sternum)
# Filet (psoas) sous les vertèbres lombaires, côté fente : masse ronde et pleine, pas un creux
# (vu sur les vidéos de découpe). Entre la dernière côte et le bassin, on comble la cavité près du rachis
# et on bombe légèrement le filet au-dessus du plan de fente.
_lomb = np.clip((GY - 1.12) / 0.12, 0, 1) * np.clip((1.86 - GY) / 0.1, 0, 1)
_lomb = _lomb * _lomb * (3 - 2 * _lomb)
_dz = GZ - (z_corps + 0.06)
filet = 0.022 * _lomb * np.exp(-0.5 * (_dz / 0.045) ** 2)
creux = creux * (1 - _lomb * np.exp(-0.5 * (_dz / 0.09) ** 2))


def bosse(yc, zc, val, sy, sz):
    return val * np.exp(-0.5 * (((GY - yc) / sy) ** 2 + ((GZ - zc) / sz) ** 2))


def max_doux(champs, k=30.0):
    return np.log(sum(np.exp(k * c) for c in champs)) / k


# Épaisseur de la face extérieure (distance du plan de fente à la peau).
# Profil en hauteur relevé sur la vue de dos (Normabev) : cuisse large et ronde, dos plus étroit,
# épaule de nouveau large, collier qui s'affine. Puis profil en travers, du dos (f = 0) au ventre (f = 1).
bord_dorsal = np.where(masque_g.any(1), gz[np.argmax(masque_g, axis=1)], 0)
bord_dorsal = ndi.gaussian_filter1d(ndi.median_filter(bord_dorsal, 31), 12)[:, None] * np.ones((1, NZ))
bord_ventral_lisse = ndi.gaussian_filter1d(ndi.median_filter(bord_ventral[:, 0], 31), 12)[:, None] * np.ones((1, NZ))
f_larg = np.clip((GZ - bord_dorsal) / np.maximum(bord_ventral_lisse - bord_dorsal, 0.05), 0, 1)

EPAISSEUR_HAUTEUR = [
    (0.00, 0.22), (0.15, 0.29), (0.35, 0.36), (0.55, 0.37), (0.75, 0.345), (1.00, 0.33),
    (1.25, 0.33), (1.50, 0.345), (1.70, 0.365), (1.90, 0.38), (2.05, 0.37), (2.20, 0.30), (2.35, 0.19), (2.50, 0.09),
]
A = ndi.gaussian_filter1d(interp(EPAISSEUR_HAUTEUR, GY), 12, axis=0)  # courbe lisse, sans cassure
courbe = lambda points, x: np.interp(x, np.array(points, float)[:, 0], np.array(points, float)[:, 1])

# Coupes en travers, mélangées selon la hauteur.
coupe_avant = courbe([(0, 0.74), (0.22, 0.95), (0.4, 1.0), (0.6, 0.93), (0.8, 0.74), (1.0, 0.5)], f_larg)                 # épaule, poitrine
coupe_cotes = courbe([(0, 0.76), (0.2, 0.96), (0.33, 1.0), (0.5, 0.88), (0.7, 0.6), (0.85, 0.4), (1.0, 0.24)], f_larg)   # côtes
coupe_flanc = courbe([(0, 0.78), (0.18, 0.97), (0.3, 1.0), (0.5, 0.8), (0.7, 0.45), (0.85, 0.24), (1.0, 0.11)], f_larg)  # flanc
coupe_cuisse = courbe([(0, 0.8), (0.25, 0.96), (0.45, 1.0), (0.7, 0.9), (1.0, 0.66)], f_larg)               # cuisse ronde
poids = lambda y0, y1: np.clip((GY - y0) / (y1 - y0), 0, 1)
_ss_p = lambda y0, y1: poids(y0, y1) ** 2 * (3 - 2 * poids(y0, y1))
travers = coupe_avant
travers = travers + (coupe_cotes - travers) * poids(0.62, 0.80)
travers = travers + (coupe_flanc - travers) * poids(1.02, 1.15)
travers = travers + (coupe_cuisse - travers) * _ss_p(1.45, 1.90)
epaisseur = ndi.gaussian_filter(A * travers, 8)
_c = creux + 0.05
epaisseur = np.log(np.exp(40 * epaisseur) + np.exp(40 * _c)) / 40  # maximum doux : pas d'arête
epaisseur = ndi.gaussian_filter(epaisseur, 6)
# Relief musculaire de la face extérieure, vu sur les carcasses filmées : masse de l'épaule (triceps),
# bord de l'omoplate, long dorsal le long du dos, rumsteck et rond de la cuisse. Bosses larges et basses
# (2 à 3 cm), pour suivre les muscles sous la fine couche de gras, sans effet de boule.
_b = lambda yc, fc, a_, sy, sf: a_ * np.exp(-0.5 * (((GY - yc) / sy) ** 2 + ((f_larg - fc) / sf) ** 2))
relief = (_b(0.42, 0.55, 0.028, 0.14, 0.20) + _b(0.62, 0.30, 0.018, 0.12, 0.16)
          + 0.03 * np.exp(-0.5 * ((f_larg - 0.18) / 0.1) ** 2) * _ss_p(0.55, 0.75) * (1 - _ss_p(1.7, 1.9))
          + _b(1.80, 0.22, 0.022, 0.12, 0.16) + _b(2.02, 0.55, 0.026, 0.14, 0.22))
epaisseur = epaisseur + ndi.gaussian_filter(relief, 4)

# Du dos à la cuisse, la face extérieure monte sans creux : l'épaisseur ne redescend jamais en remontant
# vers la cuisse (sinon un creux apparaît sous le globe, côté extérieur).
_i0, _i1 = int(0.95 / PAS), int(1.97 / PAS)
_bloc = np.maximum.accumulate(epaisseur[_i0:_i1], axis=0)
_ep2 = epaisseur.copy(); _ep2[_i0:_i1] = _bloc
_w = (_ss_p(0.9, 1.05) * (1 - _ss_p(1.9, 2.15)))
epaisseur = ndi.gaussian_filter(epaisseur * (1 - _w) + _ep2 * _w, 5)

# Le globe (intérieur de la cuisse) n'est pas coupé par la fente : au-dessus du bassin scié, toute la face
# interne de la cuisse forme une surface large et légèrement bombée, recouverte de gras (photo, y 2,0 à 2,25).
_ss = lambda a_, b_, v: np.clip((v - a_) / (b_ - a_), 0, 1) ** 2 * (3 - 2 * np.clip((v - a_) / (b_ - a_), 0, 1))
rho_globe = np.sqrt(np.clip(1 - (1 - np.clip(ndi.gaussian_filter(dist, 7) / 0.16, 0, 1)) ** 2, 0, 1))
globe = 0.065 * _ss(1.86, 2.10, GY) * (1 - _ss(2.20, 2.42, GY)) * rho_globe
globe = ndi.gaussian_filter(globe, 6)

# Jarrets : tubes ronds, décalés du plan de fente.
def masque_segment(p0, p1, rayon):
    (y0, z0), (y1, z1) = p0, p1
    d = np.array([y1 - y0, z1 - z0]); L = np.linalg.norm(d); d /= L
    u = np.clip((GY - y0) * d[0] + (GZ - z0) * d[1], 0, L)
    py, pz = y0 + u * d[0], z0 + u * d[1]
    return np.hypot(GY - py, GZ - pz) < rayon

jarret_avant = masque_segment((0.30, 0.17), (0.06, 0.50), 0.11) & masque_g
jarret_arriere = masque_segment((2.18, -0.14), (2.50, -0.10), 0.12) & masque_g
membre = jarret_avant | jarret_arriere
# Fondu large entre le corps et le jarret : pas de marche à la jonction.
poids_membre = np.clip(ndi.gaussian_filter(membre.astype(np.float32), 10) * 1.5, 0, 1)
# Rayon du jarret : demi-largeur locale du membre, lissée le long du membre.
rayon_local = ndi.grey_dilation(dist * membre, size=(31, 31))
rayon_local = np.maximum(ndi.gaussian_filter(rayon_local, 6), 0.025)
d_rel = np.clip(dist / rayon_local, 0, 1)
demi_tube = rayon_local * np.sqrt(np.clip(1 - (1 - d_rel) ** 2, 0, 1))
# Axe du membre : le jarret avant pend côté extérieur, le jarret arrière est presque dans l'axe.
decalage_membre = ndi.gaussian_filter(np.where(jarret_avant, -0.11, np.where(jarret_arriere, -0.05, 0.0)), 10)
centre_membre = decalage_membre / np.maximum(ndi.gaussian_filter(membre.astype(np.float32), 10), 1e-3) * (membre | (poids_membre > 0))

# Bords arrondis de la face extérieure : rayon proportionnel à l'épaisseur (dos, cuisse ronds),
# sauf au bas du collier, coupé net en travers.
# Arrondi large (ellipse plutôt que quart de cercle) : pas d'arête entre le dos et la face extérieure.
r_arrondi = np.clip(ndi.gaussian_filter(epaisseur, 12) * 1.6, 0.05, 0.45)
coupe_collier = np.clip((0.16 - GY) / 0.06, 0, 1) * np.clip((0.12 - GZ) / 0.08, 0, 1)
r_arrondi = r_arrondi * (1 - coupe_collier) + 0.012 * coupe_collier
# Bord ventral (poitrine, flanchet, bavettes) : paroi fine, coupée net au couteau, pas un ventre arrondi
# (vu sur toutes les carcasses filmées).
coupe_ventre = np.clip((f_larg - 0.72) / 0.12, 0, 1) * np.clip((GY - 0.42) / 0.1, 0, 1) * np.clip((1.85 - GY) / 0.12, 0, 1)
coupe_ventre = ndi.gaussian_filter(coupe_ventre, 6)
r_arrondi = r_arrondi * (1 - coupe_ventre) + 0.02 * coupe_ventre
# Distance au bord adoucie : la distance brute forme des arêtes (squelette du contour) qui se voient en stries.
dist_l = ndi.gaussian_filter(dist, 7) * np.clip(dist / 0.012, 0, 1)
rho = np.sqrt(np.clip(1 - (1 - np.clip(dist_l / r_arrondi, 0, 1)) ** 2, 0, 1))

filet = ndi.gaussian_filter(filet, 5) * np.sqrt(np.clip(ndi.gaussian_filter(dist, 7) / 0.08, 0, 1))
x_fente = (1 - poids_membre) * (globe + (filet - creux) * plat) + poids_membre * (centre_membre + demi_tube)
x_ext = (1 - poids_membre) * (-epaisseur * rho) + poids_membre * (centre_membre - demi_tube)
_h = -x_ext
_h2 = _h.copy(); _h2[_i0:_i1] = np.maximum.accumulate(_h[_i0:_i1], axis=0)
_wf = np.clip(dist_l / 0.06, 0, 1) * (1 - poids_membre)
_h = _h + (_h2 - _h) * _w * _wf
# Lissage final de la face extérieure (épaisseur nulle hors du contour) : supprime les arêtes et les
# plateaux, donne un dos et des flancs bombés. Les jarrets, déjà ronds, ne sont pas touchés.
_hz = np.where(dist > 0, _h, 0.0)
_hl = ndi.gaussian_filter(_hz, 0.05 / PAS)
_hl = _hl * np.sqrt(np.clip(dist_l / 0.03, 0, 1))
_hl = np.maximum(_hl, ndi.gaussian_filter(_hz, 3) * 0.0)
_wm = np.clip(poids_membre * 1.5, 0, 1)
_h = _hl * (1 - _wm) + ndi.gaussian_filter(_h, 3) * _wm
x_ext = -_h * (dist > 0) + x_ext * (dist <= 0)
x_ext = np.minimum(x_ext, x_fente - 0.004 * (dist > 0.003))


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
    # Près du bord, la grille est recalée sur le contour : les normales y ondulent (stries fines).
    # On les lisse par moyennes successives avec les voisins, sans toucher au bord lui-même.
    pres = np.nonzero(champ(dist) < 0.035)[0]
    pres = pres[~np.isin(pres, ib)]
    import scipy.sparse as sp
    e = m.edges_unique
    A_ = sp.coo_matrix((np.ones(len(e) * 2), (np.r_[e[:, 0], e[:, 1]], np.r_[e[:, 1], e[:, 0]])), shape=(len(v), len(v))).tocsr()
    deg = np.asarray(A_.sum(1)).ravel()[:, None] + 1e-9
    for _ in range(8):
        moy = (A_ @ n) / deg
        n[pres] = moy[pres]
        n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-12
    m.vertex_normals = n
    return m


# Carcasse centrée sur l'axe de rotation de la caméra (le plan de fente passe à x = +DECALAGE).
DECALAGE = round(float(-(xe.min() + xf.max()) / 2), 3)
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
