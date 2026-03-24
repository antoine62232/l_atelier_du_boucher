import api from "../api/api";

export const getAllRessources = () => {
  return api.get("/ressources/all");
};

export const getRessourceById = (id) => {
  return api.get(`/ressources/${id}`);
};

/**
 * Récupère les ressources (vidéos) favorites de l'utilisateur connecté
 * @returns {Promise<Array>} Tableau de ressources
 */
export const getFavoris = async () => {
    try {
        const response = await api.get('/favoris-ressources');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des vidéos favorites", error);
        throw error;
    }
};

/**
 * Ajoute ou retire une ressource des favoris (Toggle)
 * @param {number} idRessource L'ID de la ressource
 * @returns {Promise<object>} Résultat avec message et nouvel état (isFavori)
 */
export const toggleFavori = async (idRessource) => {
    try {
        const response = await api.post(`/favoris-ressources/${idRessource}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors du toggle favori ressource", error);
        throw error;
    }
};