import * as THREE from "three";
import { classerPoint } from "../../data/zonesBoeuf";

// Largeur de la carcasse (z) par tranche de hauteur : côté rachis en z négatif, côté ventre en z positif.
export const TRANCHES = 125;
const HAUTEUR_MAX = 2.5;

export const tranche = (y) => Math.min(TRANCHES - 1, Math.max(0, Math.floor((y / HAUTEUR_MAX) * TRANCHES)));

// Le modèle est fait de deux faces : la face de fente (x ≥ 0) et la face extérieure (x ≤ 0).
// Boîte en coordonnées du monde : les positions du fichier sont compressées, donc mises à l'échelle par le nœud.
export const estFaceExterieure = (objet) => {
  objet.updateWorldMatrix(true, false);
  return new THREE.Box3().setFromObject(objet).max.x <= 0.002;
};

const parcourirSommets = (racine, rappel) => {
  racine.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  racine.traverse((objet) => {
    if (!objet.isMesh) return;
    const exterieur = estFaceExterieure(objet);
    const positions = objet.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      v.fromBufferAttribute(positions, i).applyMatrix4(objet.matrixWorld);
      rappel(v, exterieur);
    }
  });
};

export const mesurerLargeurs = (racine) => {
  const zMin = new Array(TRANCHES).fill(Infinity);
  const zMax = new Array(TRANCHES).fill(-Infinity);
  parcourirSommets(racine, (v) => {
    const t = tranche(v.y);
    zMin[t] = Math.min(zMin[t], v.z);
    zMax[t] = Math.max(zMax[t], v.z);
  });
  return { zMin, zMax };
};

// Les largeurs dans une petite texture, lue par le shader pour classer chaque pixel.
export const texturerLargeurs = (largeurs) => {
  const donnees = new Float32Array(TRANCHES * 4);
  for (let t = 0; t < TRANCHES; t += 1) {
    donnees[t * 4] = Number.isFinite(largeurs.zMin[t]) ? largeurs.zMin[t] : 0;
    donnees[t * 4 + 1] = Number.isFinite(largeurs.zMax[t]) ? largeurs.zMax[t] : 0;
  }
  const texture = new THREE.DataTexture(donnees, TRANCHES, 1, THREE.RGBAFormat, THREE.FloatType);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
};

export const fractionLargeur = (largeurs, y, z) => {
  const t = tranche(y);
  const zMin = largeurs.zMin[t];
  const zMax = largeurs.zMax[t];
  if (!Number.isFinite(zMin) || zMax - zMin < 1e-6) return 0;
  return THREE.MathUtils.clamp((z - zMin) / (zMax - zMin), 0, 1);
};

export const versPositionZ = (largeurs, hauteur, fraction) => {
  const t = tranche(hauteur);
  const zMin = largeurs.zMin[t];
  const zMax = largeurs.zMax[t];
  if (!Number.isFinite(zMin)) return 0;
  return zMin + fraction * (zMax - zMin);
};

export const morceauDuPoint = (largeurs, estAvant, point, exterieur) =>
  classerPoint(estAvant(point.y, point.z), point.y, fractionLargeur(largeurs, point.y, point.z), exterieur);

// Boîte englobante de chaque gros morceau, pour cadrer le zoom.
export const mesurerMorceaux = (racine, largeurs, estAvant) => {
  const boites = {};
  parcourirSommets(racine, (v, exterieur) => {
    const code = morceauDuPoint(largeurs, estAvant, v, exterieur);
    if (!boites[code]) boites[code] = new THREE.Box3();
    boites[code].expandByPoint(v);
  });
  return boites;
};
