import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage as ndi
def masque(path, miroir):
    im = Image.open(path).convert('RGB')
    if miroir: im = ImageOps.mirror(im)
    a = np.asarray(im).astype(np.int16)
    mn, mx = a.min(2), a.max(2)
    fond = (mx - mn < 16) & (mn > 165)
    lab, n = ndi.label(fond)
    bords = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:,0], lab[:,-1]]))) - {0}
    fond_ext = np.isin(lab, list(bords))
    m = ~fond_ext
    m = ndi.binary_opening(m, iterations=2)
    m = ndi.binary_fill_holes(m)
    lab, n = ndi.label(m)
    if n > 1:
        t = ndi.sum(m, lab, range(1, n+1)); m = lab == 1 + int(np.argmax(t))
    m = ndi.gaussian_filter(m.astype(np.float32), 2) > 0.5
    return np.asarray(im), m
if __name__ == '__main__':
    for nom, miroir in [('interieur', False), ('exterieur', True)]:
        img, m = masque(f'{nom}_x4.png', miroir)
        ys, xs = np.nonzero(m)
        print(nom, img.shape, 'bbox x', xs.min(), xs.max(), 'y', ys.min(), ys.max())
        np.save(f'masque_{nom}.npy', m)
        v = img.copy(); v[~m] = (v[~m]*0.3 + np.array([0,0,255])*0.7).astype(np.uint8)
        Image.fromarray(v).resize((img.shape[1]//4, img.shape[0]//4)).save(f'verif_masque_{nom}.png')
