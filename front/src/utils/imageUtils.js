/**
 * Génère l'URL complète pour une image stockée sur le serveur
 * @param {string} path - Le chemin relatif (ex: 'recettes/ma-recette.jpg')
 * @returns {string} - L'URL complète pour la balise <img src={...} />
 */
export const getImageUrl = (path) => {
  // On récupère l'URL du backend depuis les variables d'environnement
  let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Si l'URL se termine par "/api", on la retire pour pointer vers les images
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace('/api', '');
  }

  if (!path) return "https://via.placeholder.com/400x200?text=Image+Indisponible";
  
  // On génère le bon lien propre
  return `${baseUrl}/uploads/${path}`;
};