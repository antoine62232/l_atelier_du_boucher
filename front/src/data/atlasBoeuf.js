// Emplacement de chaque partie de la base dans l'Atlas du bœuf (idPartie de la table parties).
// Les sous-parties de la cuisse (parentId = 6) ont une page commune paramétrée par leur id.
const PARTIES = {
  1: { quartier: "avant", chemin: "/atlas/boeuf/avant/epaule", schema: true },
  2: { quartier: "avant", chemin: "/atlas/boeuf/avant/collier", schema: true },
  3: { quartier: "avant", chemin: "/atlas/boeuf/avant/caparacon", schema: true },
  4: { quartier: "arriere", chemin: "/atlas/boeuf/arriere/dehanche", schema: true },
  5: { quartier: "arriere", chemin: "/atlas/boeuf/arriere/bavettes", schema: true },
  6: { quartier: "arriere", chemin: "/atlas/boeuf/arriere/cuisse", schema: false },
};

export const QUARTIERS = {
  avant: { label: "L'Avant", chemin: "/atlas/boeuf/avant" },
  arriere: { label: "L'Arrière", chemin: "/atlas/boeuf/arriere" },
};

/**
 * Situe une partie dans l'Atlas : quartier, page où la voir et parties parentes.
 * @param {number} idPartie
 * @param {Array} parties liste complète de /parties/all
 */
export const situerPartie = (idPartie, parties = []) => {
  const partie = parties.find((p) => p.idPartie === idPartie);
  if (!partie) return null;
  const parent = partie.parentId ? parties.find((p) => p.idPartie === partie.parentId) : null;
  const config = PARTIES[partie.idPartie] || (parent && PARTIES[parent.idPartie]);
  if (!config) return { partie, parent, quartier: null, chemin: "/atlas/boeuf", schema: false };
  const chemin = parent ? `${PARTIES[parent.idPartie].chemin}/${partie.idPartie}` : config.chemin;
  return { partie, parent, quartier: config.quartier, chemin, schema: !parent && config.schema };
};

export const cheminFichePiece = (idPiece) => `/pieces/${idPiece}`;
