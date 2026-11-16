import api from "../api/api";

// Récupérer toutes les actualités
export const getAllActualites = () => {
  return api.get("/actualites/all"); 
};

// Récupérer une actualité spécifique par son ID
export const getActualiteById = (id) => {
  return api.get(`/actualites/${id}`);
};

// Créer une actualité (FormData : titre, contenu, categorie, lienSource, image)
export const createActualite = (formData) => {
  return api.post("/actualites/create", formData);
};

// Modifier une actualité
export const updateActualite = (id, formData) => {
  return api.put(`/actualites/update/${id}`, formData);
};

// Supprimer une actualité et son image
export const deleteActualite = (id) => {
  return api.delete(`/actualites/delete/${id}`);
};
