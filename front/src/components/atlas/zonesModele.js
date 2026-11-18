import * as THREE from "three";
import { classerPoint } from "../../data/zonesBoeuf";

// Grille de mesure de la carcasse : par tranche de hauteur, la largeur (z) ;
// par tranche et par bande de largeur, l'épaisseur (x) entre la face extérieure et la face de fente.
export const TRANCHES = 125;
const BANDES = 24;
const HAUTEUR_MAX = 2.5;

export const tranche = (y) => Math.min(TRANCHES - 1, Math.max(0, Math.floor((y / HAUTEUR_MAX) * TRANCHES)));
const bande = (f) => Math.min(BANDES - 1, Math.max(0, Math.floor(f * BANDES)));

const parcourirSommets = (racine, rappel) => {
  racine.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  racine.traverse((objet) => {
    if (!objet.isMesh) return;
    const positions = objet.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      v.fromBufferAttribute(positions, i).applyMatrix4(objet.matrixWorld);
      rappel(v, objet, i);
    }
  });
};

export const mesurerCarcasse = (racine) => {
  const zMin = new Array(TRANCHES).fill(Infinity);
  const zMax = new Array(TRANCHES).fill(-Infinity);
  parcourirSommets(racine, (v) => {
    const t = tranche(v.y);
    zMin[t] = Math.min(zMin[t], v.z);
    zMax[t] = Math.max(zMax[t], v.z);
  });
  const largeurs = { zMin, zMax };

  const xMin = new Array(TRANCHES * BANDES).fill(Infinity);
  const xMax = new Array(TRANCHES * BANDES).fill(-Infinity);
  parcourirSommets(racine, (v) => {
    const k = tranche(v.y) * BANDES + bande(fractionLargeur(largeurs, v.y, v.z));
    xMin[k] = Math.min(xMin[k], v.x);
    xMax[k] = Math.max(xMax[k], v.x);
  });
  return { largeurs, xMin, xMax };
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

// Le point est-il du côté extérieur de l'épaisseur (côté peau, opposé à la fente) ?
// Seuil un peu avant la moitié, pour ne pas déborder sur la face de fente là où la carcasse est mince.
const PART_EXTERIEURE = 0.42;
const estExterieur = (mesures, y, f, x) => {
  const k = tranche(y) * BANDES + bande(f);
  const seuil = mesures.xMin[k] + PART_EXTERIEURE * (mesures.xMax[k] - mesures.xMin[k]);
  return Number.isFinite(seuil) ? x < seuil : false;
};

// normaleX : composante x de la normale. Une face tournée vers la fente (x > 0) n'est jamais
// côté extérieur, même dans un creux de la cage thoracique.
export const morceauDuPoint = (mesures, estAvant, point, normaleX = 0) => {
  const f = fractionLargeur(mesures.largeurs, point.y, point.z);
  const exterieur = normaleX < 0.2 && estExterieur(mesures, point.y, f, point.x);
  return classerPoint(estAvant(point.y, point.z), point.y, f, exterieur);
};

// Ajoute à chaque sommet un attribut aMorceau (code du gros morceau), lu par le shader.
export const marquerMorceaux = (racine, mesures, estAvant) => {
  racine.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  const matriceNormale = new THREE.Matrix3();
  racine.traverse((objet) => {
    if (!objet.isMesh) return;
    const positions = objet.geometry.attributes.position;
    const normales = objet.geometry.attributes.normal;
    matriceNormale.getNormalMatrix(objet.matrixWorld);
    const codes = new Float32Array(positions.count);
    for (let i = 0; i < positions.count; i += 1) {
      v.fromBufferAttribute(positions, i).applyMatrix4(objet.matrixWorld);
      const normaleX = normales ? n.fromBufferAttribute(normales, i).applyMatrix3(matriceNormale).normalize().x : 0;
      codes[i] = morceauDuPoint(mesures, estAvant, v, normaleX);
    }
    objet.geometry.setAttribute("aMorceau", new THREE.BufferAttribute(codes, 1));
  });
};

// Boîte englobante de chaque gros morceau, pour cadrer le zoom.
export const mesurerMorceaux = (racine) => {
  const boites = {};
  parcourirSommets(racine, (v, objet, i) => {
    const code = objet.geometry.attributes.aMorceau?.getX(i);
    if (!code) return;
    if (!boites[code]) boites[code] = new THREE.Box3();
    boites[code].expandByPoint(v);
  });
  return boites;
};
