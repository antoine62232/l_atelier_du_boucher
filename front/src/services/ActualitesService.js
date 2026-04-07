import api from "../api/api";

// Récupérer toutes les actualités
export const getAllActualites = () => {
  return api.get("/actualites/all"); 
};

// Récupérer une actualité spécifique par son ID
export const getActualiteById = (id) => {
  return api.get(`/actualites/${id}`);
};
