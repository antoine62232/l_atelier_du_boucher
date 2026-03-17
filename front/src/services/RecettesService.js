import api from "../api/api";

// 1. Récupérer toutes les recettes (L'erreur 404 venait d'ici !)
export const getAllRecettes = () => {
  return api.get("/recettes/all"); 
};

// 2. Récupérer une recette spécifique par son ID
export const getRecetteById = (id) => {
  return api.get(`/recettes/${id}`);
};

// 3. Récupérer les ingrédients (Il fallait un tiret "recettes-ingredients" au lieu de "recettesIngredients")
export const getIngredientsByRecette = (id) => {
  return api.get(`/recettes-ingredients/${id}`); 
};

// 4. Récupérer les instructions (étapes) de la recette
export const getInstructionsByRecette = (id) => {
  return api.get(`/instructions/${id}`);
};