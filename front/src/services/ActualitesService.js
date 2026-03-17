import api from "../api/api";

// Récupérer toutes les actualités (du plus récent au plus ancien)
export const getAllActualites = () => {
  return api.get("/actualites/all"); 
  // Note: Vérifie dans ton fichier backend (actualiteRoute.js) si la route est "/actualites" ou "/actualites/all" et ajuste si besoin !
};

// Récupérer une actualité spécifique par son ID
export const getActualiteById = (id) => {
  return api.get(`/actualites/${id}`);
};
