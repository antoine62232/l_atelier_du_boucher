# Modèle 3D de la demi-carcasse

## Version actuelle : v4 (à partir de deux vraies photos)

`front/public/models/demi_carcasse_boeuf_v28.glb` est construit à partir de deux photos détourées,
face de fente (`demi-carcasse-boeuf-interieur.png`) et face extérieure (`demi-carcasse-boeuf-exterieur.png`),
rangées dans le dossier « Projet ADB ».

1. Agrandissement x4 sans flou (Real-ESRGAN, sur le processeur avec ncnn) :
   `pip install ncnn`, télécharger `realesrgan-ncnn-vulkan-20220424-ubuntu.zip` (releases GitHub de Real-ESRGAN),
   le décompresser dans `rv/`, puis `python3 agrandir.py interieur.png interieur_x4.png` (idem pour l'extérieur).
2. `python3 construire_v4.py` : détourage, recalage de la face extérieure sur le contour de la face de fente,
   volume (plan de fente au rachis, cage thoracique et abdomen en creux, épaisseurs par région, bords arrondis,
   jarrets en tubes), normal maps tirées des photos. Sortie : `v4_brut.glb`.
3. Compression : `npx @gltf-transform/cli webp v4_brut.glb tmp.glb --quality 88`
   puis `npx @gltf-transform/cli meshopt tmp.glb demi_carcasse_boeuf_v28.glb --level medium`.

Les repères anatomiques (axe du rachis, creux, épaisseurs, jarrets) sont en haut des sections de
`construire_v4.py`. Les côtes, la coupe pistolet et les limites des morceaux sont dans
`front/src/data/coupesBoeuf.js` et `front/src/data/zonesBoeuf.js`.
Sur les flancs très inclinés, l application remplace la photo étirée par `couverture_dos_v2.webp`, un morceau de la photo extérieure rendu raccordable (voir Carcasse3D.jsx).

Changer de nom de fichier à chaque nouvelle version : `/models/*` est mis en cache un an (vercel.json).

## Ancienne version : v3

`bake.html`, `bake.py` et `reconstruire.py` reconstruisaient le modèle d'origine (commit 2fdcec9).
