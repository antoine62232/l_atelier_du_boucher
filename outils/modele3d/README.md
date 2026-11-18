# Reconstruction du modèle 3D de la demi-carcasse

Le modèle d'origine (commit 2fdcec9, `front/public/models/demi_carcasse_boeuf.glb`) est fait de deux
nappes qui ne coïncident pas : contours différents (deux pattes), trous, dos en lame.
Ces scripts en tirent `demi_carcasse_boeuf_v3.glb`, un volume fermé aux bords arrondis.

1. Extraire le modèle d'origine dans `front/public/models/__original.glb` :
   `git show 2fdcec9:front/public/models/demi_carcasse_boeuf.glb > front/public/models/__original.glb`
2. Copier `bake.html` dans `front/`, lancer `npx vite --port 5199` depuis `front/`.
3. `python3 bake.py` : rend chaque face à plat (couleur et profondeur), 1152 × 3072 px.
4. `python3 reconstruire.py` : contour de la face de fente comme référence, face extérieure recalée
   dessus, trous bouchés, relief adouci, bords arrondis, deux surfaces régulières (pas de 4 mm).
5. Compression : `npx @gltf-transform/cli webp reconstruit.glb tmp.glb --quality 86`
   puis `npx @gltf-transform/cli meshopt tmp.glb demi_carcasse_boeuf_v3.glb --level medium`.
6. Supprimer `__original.glb` et `bake.html` de `front/`.

Dépendances Python : numpy, scipy, pillow, trimesh, playwright (avec Chrome).
Changer de nom de fichier à chaque nouvelle version : `/models/*` est mis en cache un an (vercel.json).
