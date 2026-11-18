import * as THREE from "three";
import { classerPoint } from "../../data/zonesBoeuf";

// Largeur de la carcasse (z) par tranche de hauteur : côté rachis en z négatif, côté ventre en z positif.
export const TRANCHES = 250;
const HAUTEUR_MAX = 2.5;

export const tranche = (y) => Math.min(TRANCHES - 1, Math.max(0, Math.floor((y / HAUTEUR_MAX) * TRANCHES)));

// Le modèle est fait de deux faces : la face de fente (x ≥ 0) et la face extérieure (x ≤ 0).
// Reconnue à son nom dans le fichier (« face_exterieure »).
export const estFaceExterieure = (objet) => /exterieure/i.test(objet.name) || /exterieure/i.test(objet.parent?.name ?? "");

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

// Largeur interpolée entre deux tranches voisines (comme dans le shader) : pas de marches sur les limites.
const bornesInterpolees = (largeurs, y) => {
  const ft = (y / HAUTEUR_MAX) * TRANCHES - 0.5;
  const t0 = Math.min(TRANCHES - 1, Math.max(0, Math.floor(ft)));
  const t1 = Math.min(TRANCHES - 1, t0 + 1);
  const a = THREE.MathUtils.clamp(ft - t0, 0, 1);
  const lire = (t, cle) => (Number.isFinite(largeurs[cle][t]) ? largeurs[cle][t] : 0);
  return [
    THREE.MathUtils.lerp(lire(t0, "zMin"), lire(t1, "zMin"), a),
    THREE.MathUtils.lerp(lire(t0, "zMax"), lire(t1, "zMax"), a),
  ];
};

export const fractionLargeur = (largeurs, y, z) => {
  const [zMin, zMax] = bornesInterpolees(largeurs, y);
  if (zMax - zMin < 1e-6) return 0;
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

// Boîte de chaque gros morceau, pour cadrer le zoom. On écarte 1 % des sommets de chaque côté :
// quelques îlots isolés ne doivent pas élargir le cadrage.
const quantile = (valeurs, q) => {
  const tri = Float64Array.from(valeurs).sort();
  return tri[Math.min(tri.length - 1, Math.max(0, Math.round(q * (tri.length - 1))))];
};

export const mesurerMorceaux = (racine, largeurs, estAvant) => {
  const points = {};
  parcourirSommets(racine, (v, exterieur) => {
    const code = morceauDuPoint(largeurs, estAvant, v, exterieur);
    if (!points[code]) points[code] = { x: [], y: [], z: [] };
    points[code].x.push(v.x);
    points[code].y.push(v.y);
    points[code].z.push(v.z);
  });
  const boites = {};
  Object.entries(points).forEach(([code, p]) => {
    boites[code] = new THREE.Box3(
      new THREE.Vector3(quantile(p.x, 0.01), quantile(p.y, 0.01), quantile(p.z, 0.01)),
      new THREE.Vector3(quantile(p.x, 0.99), quantile(p.y, 0.99), quantile(p.z, 0.99))
    );
  });
  return boites;
};
