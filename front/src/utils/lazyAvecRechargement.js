import { lazy } from "react";

// Après une mise en ligne, un onglet resté ouvert (ou l'appli installée)
// garde l'ancienne page, qui réclame des fichiers JS qui n'existent plus.
// Le chargement échoue et React affiche une page blanche.
// On recharge alors la page une seule fois pour récupérer la nouvelle version.
const CLE = "rechargementApresMiseAJour";
const DELAI_MS = 10000;

const dejaRecharge = () => {
  try {
    return Date.now() - Number(sessionStorage.getItem(CLE) || 0) < DELAI_MS;
  } catch {
    return false;
  }
};

export const rechargerUneFois = () => {
  if (dejaRecharge()) return false;
  try {
    sessionStorage.setItem(CLE, String(Date.now()));
  } catch {
    // Stockage indisponible : on recharge quand même.
  }
  window.location.reload();
  return true;
};

export const lazyAvecRechargement = (importer) =>
  lazy(() =>
    importer().catch((erreur) => {
      if (rechargerUneFois()) {
        // La page se recharge : on laisse le chargement en attente.
        return new Promise(() => {});
      }
      throw erreur;
    })
  );
