// Pièces de la cuisse hanche (BCUH), placées sur le modèle 3D de la demi-carcasse.
// Repères : hauteur en mètres (la cuisse va d'environ 1,65 m au jarret, en haut à 2,5 m),
// largeur en fraction de 0 (côté rachis, le dos) à 1 (côté ventre).
// Sources : poster Interbev n° 3 « Découpe de l'arrière », nomenclature Normabev des muscles de la cuisse,
// photos de globes et vidéos de désossage de la cuisse (19/11/2026). Limites indicatives, à valider.

export const PIECES_CUISSE = [
  {
    code: 1,
    id: "jarret-arriere",
    nom: "Le Jarret arrière",
    description: "Muscles du bas de la cuisse autour du tibia. Riche en collagène : pot-au-feu, osso-buco.",
  },
  {
    code: 2,
    id: "araignee",
    nom: "L'Araignée",
    description: "Petit muscle logé dans le creux de l'os du bassin, veiné comme une toile. Pièce de boucher, à griller.",
  },
  {
    code: 3,
    id: "poire",
    nom: "La Poire",
    description: "Petit muscle tendre en forme de poire, contre la tende de tranche. Steak ou rôti.",
  },
  {
    code: 4,
    id: "merlan",
    nom: "Le Merlan",
    description: "Muscle plat et fin à l'intérieur de la cuisse, entre la tende et le gîte. Steak très tendre.",
  },
  {
    code: 5,
    id: "aiguillette-baronne",
    nom: "L'Aiguillette baronne",
    description: "Pointe du rumsteck, vers la bavette. Rôti ou pièce à griller.",
  },
  {
    code: 6,
    id: "rumsteck",
    nom: "Le Rumsteck",
    description: "Au-dessus de la hanche, dans le prolongement du faux-filet. Steaks, pavés, rôtis.",
  },
  {
    code: 7,
    id: "tranche-grasse",
    nom: "La Tranche grasse",
    description: "Avant de la cuisse, côté ventre, posée sur le fémur. Steaks, rôtis, carpaccio.",
  },
  {
    code: 8,
    id: "tende-de-tranche",
    nom: "La Tende de tranche",
    description: "Grosse masse de l'intérieur de la cuisse, côté fente. Steaks, rôtis, fondue.",
  },
  {
    code: 9,
    id: "rond-de-gite",
    nom: "Le Rond de gîte",
    description: "Muscle long et rond à l'arrière de la cuisse. Rôti, carpaccio, viande séchée.",
  },
  {
    code: 10,
    id: "gite-a-la-noix",
    nom: "Le Gîte à la noix",
    description: "Arrière et extérieur de la cuisse, sous le gras de couverture. Rôti, braisé, steak haché.",
  },
];

export const pieceParCode = (code) => PIECES_CUISSE.find((p) => p.code === code) || null;

// Règles évaluées dans l'ordre : la première qui correspond donne la pièce.
// face : "fente", "exterieur" ou null (les deux faces).
// Zone rectangulaire { hMin, hMax, lMin, lMax } ou ellipse { h, l, rh, rl }.
const REGLES = [
  { code: 1, face: null, hMin: 2.28, hMax: 9, lMin: -1, lMax: 2 },
  { code: 2, face: "fente", h: 1.885, l: 0.45, rh: 0.055, rl: 0.1 },
  { code: 3, face: "fente", h: 1.99, l: 0.64, rh: 0.05, rl: 0.08 },
  { code: 4, face: "fente", h: 2.06, l: 0.3, rh: 0.06, rl: 0.08 },
  { code: 5, face: null, hMin: 0, hMax: 1.8, lMin: 0.45, lMax: 0.75 },
  { code: 6, face: null, hMin: 0, hMax: 1.86, lMin: -1, lMax: 0.45 },
  { code: 7, face: null, hMin: 0, hMax: 2.28, lMin: 0.66, lMax: 2 },
  { code: 8, face: "fente", hMin: 0, hMax: 2.28, lMin: 0.2, lMax: 0.66 },
  { code: 9, face: null, hMin: 1.95, hMax: 2.28, lMin: -1, lMax: 0.2 },
];
const PIECE_PAR_DEFAUT = 10;

const correspond = (r, hauteur, largeur, exterieur) => {
  if (r.face === "fente" && exterieur) return false;
  if (r.face === "exterieur" && !exterieur) return false;
  if (r.rh) return ((hauteur - r.h) / r.rh) ** 2 + ((largeur - r.l) / r.rl) ** 2 <= 1;
  return hauteur >= r.hMin && hauteur < r.hMax && largeur >= r.lMin && largeur < r.lMax;
};

/** Pièce de la cuisse d'un point (à n'appeler que pour un point de la cuisse hanche). */
export const classerPieceCuisse = (hauteur, largeur, exterieur) =>
  REGLES.find((r) => correspond(r, hauteur, largeur, exterieur))?.code ?? PIECE_PAR_DEFAUT;

// Même règle en GLSL, pour classer chaque pixel dans le shader.
const n = (v) => (Number.isInteger(v) ? `${v}.0` : `${v}`);
const conditionGlsl = (r) => {
  const face = r.face === "fente" ? "!exterieur && " : r.face === "exterieur" ? "exterieur && " : "";
  if (r.rh) {
    return `${face}pow((hauteur - ${n(r.h)}) / ${n(r.rh)}, 2.0) + pow((largeur - ${n(r.l)}) / ${n(r.rl)}, 2.0) <= 1.0`;
  }
  return `${face}hauteur >= ${n(r.hMin)} && hauteur < ${n(r.hMax)} && largeur >= ${n(r.lMin)} && largeur < ${n(r.lMax)}`;
};

export const GLSL_CLASSER_PIECE = `int classerPieceCuisse(float hauteur, float largeur, bool exterieur) {
${REGLES.map((r) => `  if (${conditionGlsl(r)}) return ${r.code};`).join("\n")}
  return ${PIECE_PAR_DEFAUT};
}
`;
