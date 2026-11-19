// Gros morceaux de chaque quartier (coupe pistolet), d'après les posters Interbev n° 1, 2 et 3
// et les définitions FranceAgriMer et Normabev de l'AVT5 et de l'ART8.
// Le jeu de bavettes (bavette d'aloyau et bavette de flanchet) part avec l'ART8.
//
// Repères sur le modèle 3D, comme pour les coupes (voir coupesBoeuf.js) :
// hauteur en mètres (0 = collier en bas, 2,5 = jarret arrière en haut),
// largeur en fraction (0 = côté rachis, 1 = côté ventre),
// et côté : la face de fente (x élevé) ou la face extérieure (x faible).
// Tracés indicatifs, à valider par un professionnel.

import { entreCotes } from "./coupesBoeuf";

export const MORCEAUX = [
  {
    id: "epaule",
    code: 1,
    quartier: "avant",
    nom: "L'Épaule",
    idPartie: 1,
    chemin: "/atlas/boeuf/avant/epaule",
    // Face montrée au zoom : l'épaule et la cuisse se voient mieux de l'extérieur.
    vue: "exterieur",
    description: "Posée sur les côtes, côté extérieur. Paleron, macreuse, jumeau, dessus de palette et jarret avant.",
  },
  {
    id: "collier",
    code: 2,
    quartier: "avant",
    nom: "Le Collier basses côtes",
    idPartie: 2,
    chemin: "/atlas/boeuf/avant/collier",
    vue: "fente",
    description: "Le long du rachis, des premières vertèbres du cou à la 5e côte. Collier et basses côtes, à braiser ou à griller.",
  },
  {
    id: "caparacon",
    code: 3,
    quartier: "avant",
    nom: "Le Caparaçon",
    idPartie: 3,
    chemin: "/atlas/boeuf/avant/caparacon",
    vue: "fente",
    description: "La partie ventrale des côtes : plat de côtes, poitrine, tendron, flanchet, avec la hampe et l'onglet.",
  },
  {
    id: "dehanche",
    code: 4,
    quartier: "arriere",
    nom: "Le Déhanché milieu de train de côtes",
    idPartie: 4,
    chemin: "/atlas/boeuf/arriere/dehanche",
    vue: "fente",
    description: "Le dos, de la 6e côte à la hanche : entrecôtes et côtes de bœuf, faux-filet et filet.",
  },
  {
    id: "bavettes",
    code: 5,
    quartier: "arriere",
    nom: "Le Jeu de bavettes",
    idPartie: 5,
    chemin: "/atlas/boeuf/arriere/bavettes",
    vue: "fente",
    description: "La paroi du ventre sous l'aloyau : bavette d'aloyau et bavette de flanchet.",
  },
  {
    id: "cuisse",
    code: 6,
    quartier: "arriere",
    nom: "La Cuisse hanche (BCUH)",
    idPartie: 6,
    chemin: "/atlas/boeuf/arriere/cuisse",
    vue: "exterieur",
    description: "La cuisse avec la hanche : rumsteck, tende de tranche, tranche, gîte, araignée et jarret arrière.",
  },
];

export const morceauParCode = (code) => MORCEAUX.find((m) => m.code === code) || null;
export const morceauParId = (id) => MORCEAUX.find((m) => m.id === id) || null;
export const morceauxDuQuartier = (quartier) => MORCEAUX.filter((m) => m.quartier === quartier);

const interpoler = (points, x) => {
  if (x <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    if (x <= x1) {
      const [x0, y0] = points[i - 1];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return points[points.length - 1][1];
};

// Limites, en [largeur, hauteur] ou [hauteur, largeur].
// Haut de l'épaule sur la face extérieure, selon la largeur.
const HAUT_EPAULE = [
  [0, 0.55],
  [0.12, 0.66],
  [0.35, 0.72],
  [0.6, 0.7],
  [0.85, 0.6],
  [1, 0.5],
];
// Côté rachis, la bande des basses côtes reste visible au-dessus de l'épaule.
const RACHIS_EPAULE = 0.1;
// Le collier basses côtes s'arrête à la coupe entre la 5e et la 6e côte.
const COUPE_5_6 = entreCotes(5);
// Séparation collier basses côtes / caparaçon, selon la hauteur.
const LIMITE_COLLIER = [
  [0, 0.72],
  [0.34, 0.66],
  [0.45, 0.52],
  [0.665, 0.46],
];
// Bas de la cuisse hanche, selon la largeur.
const BAS_CUISSE = [
  [0, 1.62],
  [0.4, 1.66],
  [1, 1.72],
];
// Séparation déhanché / jeu de bavettes, selon la hauteur. Sous la dernière côte,
// la partie ventrale des côtes part avec le caparaçon (avant) : pas de bavettes.
const DEBUT_BAVETTES = 1.05;
const LIMITE_BAVETTES = [
  [1.05, 0.3],
  [1.6, 0.4],
];

/**
 * Gros morceau d'un point de la carcasse.
 * @param {boolean} avant le point est dans l'avant de la coupe pistolet
 * @param {number} hauteur en mètres
 * @param {number} largeur fraction de 0 (rachis) à 1 (ventre)
 * @param {boolean} exterieur le point est sur la face extérieure (et non sur la face de fente)
 * @returns {number} code du morceau
 */
export const classerPoint = (avant, hauteur, largeur, exterieur) => {
  if (avant) {
    const jarretAvant = hauteur < 0.34 && largeur > 0.7 && (hauteur > 0.07 || largeur > 0.9);
    const surLEpaule = exterieur && largeur > RACHIS_EPAULE && hauteur < interpoler(HAUT_EPAULE, largeur);
    if (jarretAvant || surLEpaule) return 1;
    if (hauteur < COUPE_5_6 && largeur < interpoler(LIMITE_COLLIER, hauteur)) return 2;
    return 3;
  }
  if (hauteur > interpoler(BAS_CUISSE, largeur)) return 6;
  if (hauteur > DEBUT_BAVETTES && largeur > interpoler(LIMITE_BAVETTES, hauteur)) return 5;
  return 4;
};

// Même règle, écrite en GLSL pour classer chaque pixel dans le shader (bords nets).
const nombre = (v) => (Number.isInteger(v) ? `${v}.0` : `${v}`);
const glslInterpoler = (nom, points) => {
  let corps = `  if (x <= ${nombre(points[0][0])}) return ${nombre(points[0][1])};\n`;
  for (let i = 1; i < points.length; i += 1) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    corps += `  if (x <= ${nombre(x1)}) return mix(${nombre(y0)}, ${nombre(y1)}, (x - ${nombre(x0)}) / ${nombre(x1 - x0)});\n`;
  }
  corps += `  return ${nombre(points[points.length - 1][1])};\n`;
  return `float ${nom}(float x) {\n${corps}}\n`;
};

export const GLSL_CLASSER_POINT = `${glslInterpoler("hautEpaule", HAUT_EPAULE)}${glslInterpoler("limiteCollier", LIMITE_COLLIER)}${glslInterpoler("basCuisse", BAS_CUISSE)}${glslInterpoler("limiteBavettes", LIMITE_BAVETTES)}
int classerPoint(bool avant, float hauteur, float largeur, bool exterieur) {
  if (avant) {
    bool jarretAvant = hauteur < 0.34 && largeur > 0.7 && (hauteur > 0.07 || largeur > 0.9);
    bool surLEpaule = exterieur && largeur > ${nombre(RACHIS_EPAULE)} && hauteur < hautEpaule(largeur);
    if (jarretAvant || surLEpaule) return 1;
    if (hauteur < ${nombre(COUPE_5_6)} && largeur < limiteCollier(hauteur)) return 2;
    return 3;
  }
  if (hauteur > basCuisse(largeur)) return 6;
  if (hauteur > ${nombre(DEBUT_BAVETTES)} && largeur > limiteBavettes(hauteur)) return 5;
  return 4;
}
`;
