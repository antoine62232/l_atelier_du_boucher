import connexion from '../config/bdd.js';

export const checkFavori = async (utilisateurId, ressourceId) => {
    const query = "SELECT * FROM favorisRessources WHERE utilisateurId = ? AND ressourceId = ?";
    const [result] = await connexion.query(query, [utilisateurId, ressourceId]);
    return result.length > 0;
};

export const addFavori = async (utilisateurId, ressourceId) => {
    const query = "INSERT INTO favorisRessources (utilisateurId, ressourceId) VALUES (?, ?)";
    const [result] = await connexion.query(query, [utilisateurId, ressourceId]);
    return result;
};

export const removeFavori = async (utilisateurId, ressourceId) => {
    const query = "DELETE FROM favorisRessources WHERE utilisateurId = ? AND ressourceId = ?";
    const [result] = await connexion.query(query, [utilisateurId, ressourceId]);
    return result;
};

export const getFavorisByUser = async (utilisateurId) => {
    const query = `
        SELECT res.idRessource, res.titre, res.typeTechnique, res.urlVideo, p.nomPiece, fres.dateAjout
        FROM favorisRessources fres
        JOIN ressources res ON fres.ressourceId = res.idRessource
        JOIN pieces p ON res.pieceId = p.idPiece
        WHERE fres.utilisateurId = ?
        ORDER BY fres.dateAjout DESC
    `;
    const [result] = await connexion.query(query, [utilisateurId]);
    return result;
};