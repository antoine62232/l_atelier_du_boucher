import connexion from '../config/bdd.js';

export const checkFavori = async (utilisateurId, recetteId) => {
    const query = "SELECT * FROM favorisRecettes WHERE utilisateurId = ? AND recetteId = ?";
    const [result] = await connexion.query(query, [utilisateurId, recetteId]);
    return result.length > 0;
};

export const addFavori = async (utilisateurId, recetteId) => {
    const query = "INSERT INTO favorisRecettes (utilisateurId, recetteId) VALUES (?, ?)";
    const [result] = await connexion.query(query, [utilisateurId, recetteId]);
    return result;
};

export const removeFavori = async (utilisateurId, recetteId) => {
    const query = "DELETE FROM favorisRecettes WHERE utilisateurId = ? AND recetteId = ?";
    const [result] = await connexion.query(query, [utilisateurId, recetteId]);
    return result;
};

export const getFavorisByUser = async (utilisateurId) => {
    const query = `
        SELECT r.idRecette, r.titre, r.imageRecette, r.tempsPreparation, r.difficulte, p.nomPiece, fr.dateAjout
        FROM favorisRecettes fr
        JOIN recettes r ON fr.recetteId = r.idRecette
        JOIN pieces p ON r.pieceId = p.idPiece
        WHERE fr.utilisateurId = ?
        ORDER BY fr.dateAjout DESC
    `;
    const [result] = await connexion.query(query, [utilisateurId]);
    return result;
};