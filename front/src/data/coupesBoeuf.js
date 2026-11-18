// Mises en quartiers de la demi-carcasse de bœuf.
// Sources : Interbev et Idele, « Recueil des connaissances sur la qualité des viandes bovines »
// (types de découpe des carcasses), et poster Interbev n° 1 « Découpe de la demi-carcasse ».
//
// Repères sur le modèle 3D : hauteur en mètres (0 = collier en bas, 2,5 = jarret arrière en haut).
// La largeur est donnée en fraction : 0 = côté rachis, 1 = côté ventre.
// Hauteur de chaque côte, comptée de la 1re (vers le collier, en bas) à la 13e,
// relevée en comptant les côtes le long du rachis sur la face de fente du modèle.
export const COTES = [0.345, 0.405, 0.47, 0.535, 0.59, 0.65, 0.71, 0.775, 0.835, 0.89, 0.955, 1.01, 1.06];

// Hauteur du trait de coupe entre la côte n et la côte n + 1
export const entreCotes = (n) => (COTES[n - 1] + COTES[n]) / 2;

const COUPE_5_6 = entreCotes(5);

export const COUPES_BOEUF = [
  {
    id: "pistolet",
    sigle: "Pistolet",
    sousTitre: "AVT5 / ART8",
    nom: "Coupe pistolet : avant traité 5 côtes, arrière traité 8 côtes",
    resume: "La principale mise en quartiers utilisée en France.",
    type: "pistolet",
    // Tracé du trait de coupe : du rachis vers le milieu des côtes, puis le long des côtes jusqu'au flanc.
    trace: [
      { hauteur: COUPE_5_6, largeur: 0 },
      { hauteur: COUPE_5_6, largeur: 0.43 },
      { hauteur: 1.12, largeur: 0.26 },
      { hauteur: 1.38, largeur: 1 },
    ],
    avant: {
      titre: "Avant CAPA (avant traité 5 côtes)",
      pieces:
        "Collier basses côtes, épaule et caparaçon (plat de côtes couvert et découvert, poitrine, flanchet, tendron).",
    },
    arriere: {
      titre: "ART8 (arrière traité 8 côtes)",
      pieces:
        "Cuisse hanche (BCUH), déhanché milieu de train de côtes 8 côtes (déhanché à 3 côtes et milieu de train de côtes à 5 côtes) et jeu de bavettes (bavette d'aloyau et bavette de flanchet).",
    },
  },
  {
    id: "droite-5",
    sigle: "Droite 5 côtes",
    sousTitre: "AV5 / AR8",
    nom: "Coupe droite à 5 côtes : avant droit 5 côtes, arrière droit 8 côtes",
    resume: "Coupe le long de la côte, perpendiculaire à la colonne vertébrale, jusqu'au caparaçon.",
    type: "droite",
    hauteur: COUPE_5_6,
    avant: {
      titre: "AVD5 (avant droit 5 côtes)",
      pieces: "Collier, basses côtes, épaule et gros bout de poitrine.",
    },
    arriere: {
      titre: "ARD8 (arrière droit 8 côtes)",
      pieces: "Cuisse et rumsteck (BCUH), déhanché (filet et faux-filet), entrecôtes, et le caparaçon de ces 8 côtes.",
    },
  },
  {
    id: "droite-10",
    sigle: "Droite 10 côtes",
    sousTitre: "AV10 / AR3",
    nom: "Coupe droite à 10 côtes : avant 10 côtes, arrière 3 côtes",
    resume: "Le milieu de train de côtes passe à l'avant.",
    type: "droite",
    hauteur: entreCotes(10),
    avant: {
      titre: "AV10 (avant 10 côtes)",
      pieces: "Collier basses côtes, épaule, milieu de train de côtes (5 côtes) et la partie ventrale correspondante.",
    },
    arriere: {
      titre: "AR3 (arrière 3 côtes)",
      pieces: "Cuisse (globe et jarret) et aloyau à 3 côtes : déhanché, aiguillette baronne et rumsteck.",
    },
  },
];

export const COULEUR_AVANT = "#B87333";
export const COULEUR_ARRIERE = "#2C5F8A";
