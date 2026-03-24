import api from "../api/api";

// 1. Récupérer toutes les recettes
export const getAllRecettes = () => {
  return api.get("/recettes/all"); 
};

// 2. Récupérer une recette spécifique par son ID
export const getRecetteById = (id) => {
  return api.get(`/recettes/${id}`);
};

// 3. Récupérer les ingrédients
export const getIngredientsByRecette = (id) => {
  return api.get(`/recettes-ingredients/${id}`); 
};

// 4. Récupérer les instructions (étapes) de la recette
export const getInstructionsByRecette = (id) => {
  return api.get(`/instructions/${id}`);
};

/**
 * Récupère les recettes favorites de l'utilisateur connecté
 * @returns {Promise<Array>} Tableau de recettes
 */
export const getFavoris = async () => {
    try {
        const response = await api.get('/favoris-recettes');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes favorites", error);
        throw error;
    }
};

/**
 * Ajoute ou retire une recette des favoris (Toggle)
 * @param {number} idRecette L'ID de la recette
 * @returns {Promise<object>} Résultat avec message et nouvel état (isFavori)
 */
export const toggleFavori = async (idRecette) => {
    try {
        const response = await api.post(`/favoris-recettes/${idRecette}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors du toggle favori recette", error);
        throw error;
    }
};