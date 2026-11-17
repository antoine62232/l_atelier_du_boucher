// Coupes de gros de la demi-carcasse de bœuf (arrêté du 27 août 1971).
// Les hauteurs sont en mètres sur le modèle 3D (0 = collier en bas, 2,5 = jarret arrière en haut).
// Elles sont estimées à partir du modèle : la 1re côte vers 0,20 m, la 13e vers 1,05 m.
// À faire valider par un professionnel avant de présenter le module à une CMA.

const PREMIERE_COTE = 0.2;
const TREIZIEME_COTE = 1.05;
const ECART_COTES = (TREIZIEME_COTE - PREMIERE_COTE) / 12;

// Hauteur du trait de coupe entre la côte n et la côte n + 1
export const hauteurEntreCotes = (n) => PREMIERE_COTE + (n - 0.5) * ECART_COTES;

export const COUPES_BOEUF = [
  {
    id: "av5-ar8",
    sigle: "AV5 / AR8",
    nom: "Avant 5 côtes, arrière 8 côtes",
    type: "droite",
    hauteur: hauteurEntreCotes(5),
    avant: {
      titre: "Quartier avant, 5 côtes",
      pieces: "Collier et basses côtes, gros bout de caparaçon, épaule levée en raquette (AV5 = COL BC + GB + RAQ).",
    },
    arriere: {
      titre: "Quartier arrière, 8 côtes",
      pieces: "Cuisse, aloyau et les 8 dernières côtes, avec leur plat de côtes et le flanchet.",
    },
  },
  {
    id: "av10-ar3",
    sigle: "AV10 / AR3",
    nom: "Avant 10 côtes, arrière 3 côtes",
    type: "droite",
    hauteur: hauteurEntreCotes(10),
    avant: {
      titre: "Quartier avant, 10 côtes",
      pieces: "Tout l'avant, plus les côtes 6 à 10 : le train de côtes passe presque entièrement à l'avant.",
    },
    arriere: {
      titre: "Quartier arrière, 3 côtes",
      pieces: "Cuisse, aloyau et les 3 dernières côtes seulement.",
    },
  },
  {
    id: "avt5-art8",
    sigle: "AVT5 / ART8",
    nom: "Avant traité 5 côtes, arrière traité 8 côtes",
    type: "traitee",
    hauteur: hauteurEntreCotes(5),
    // Trait qui sépare le caparaçon (côté ventre, part à l'avant) du dessus de l'arrière.
    // Points (hauteur, position sur la largeur) : z négatif = côté rachis, z positif = côté ventre.
    ligneVentrale: { depart: [hauteurEntreCotes(5), 0.0], arrivee: [1.45, 0.06] },
    avant: {
      titre: "Avant traité, 5 côtes",
      pieces: "Train de côtes découvert, épaule, collier et caparaçon (le caparaçon remonte le long du ventre jusqu'à la cuisse).",
    },
    arriere: {
      titre: "Arrière traité, 8 côtes",
      pieces: "Boule de cuisse et aloyau milieu de train (ART8 = BCU + ALMT).",
    },
  },
];

export const COULEUR_AVANT = "#B87333";
export const COULEUR_ARRIERE = "#2C5F8A";
