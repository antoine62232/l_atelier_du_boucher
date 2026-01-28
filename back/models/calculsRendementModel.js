import connexion from "../config/bdd.js";

/**
 * Ajoute un calcul en base de données
 * @param {Object} donnees - L'objet contenant toutes les valeurs
 */
export const addCalcul = async (donnees) => {
    // ON DÉSTRUCTURE L'OBJET REÇU DU CONTROLLER
    const { 
        titreCalcul, 
        poidsBrut, 
        prixAchatKg, 
        poidsNet, 
        poidsPerte, 
        resultatRendement, 
        margeVisee, 
        tauxTVA,
        prixRevientKg, 
        prixVenteConseilleKg, 
        commentaire, 
        utilisateurId, 
        pieceId 
    } = donnees;

    const query = `
    INSERT INTO calculsRendement 
    (titreCalcul, poidsBrut, prixAchatKg, poidsNet, poidsPerte, resultatRendement, margeVisee, tauxTVA, prixRevientKg, prixVenteConseilleKg, commentaire, utilisateurId, pieceId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // On passe les variables extraites dans le tableau
    const [result] = await connexion.query(query, [
        titreCalcul, 
        poidsBrut, 
        prixAchatKg, 
        poidsNet, 
        poidsPerte, 
        resultatRendement, 
        margeVisee, 
        tauxTVA, 
        prixRevientKg, 
        prixVenteConseilleKg, 
        commentaire, 
        utilisateurId, 
        pieceId
    ]);
    
    return result;
};

export const getHistoryByUser = async (utilisateurId) => {
    const query = `
    SELECT 
        c.idCalcul, c.titreCalcul, c.poidsBrut, c.prixAchatKg, c.poidsNet, 
        c.poidsPerte, c.resultatRendement, c.margeVisee, c.tauxTVA, 
        c.prixRevientKg, c.prixVenteConseilleKg, c.commentaire, c.dateCalcul,
        p.nomPiece, p.imagePiece
    FROM calculsRendement c
    JOIN pieces p ON c.pieceId = p.idPiece
    WHERE c.utilisateurId = ?
    ORDER BY c.dateCalcul DESC;
    `;
    const [result] = await connexion.query(query, [utilisateurId]);
    return result;
};

export const removeCalcul = async (idCalcul, utilisateurId) => {
    const query = "DELETE FROM calculsRendement WHERE idCalcul = ? AND utilisateurId = ?";
    const [result] = await connexion.query(query, [idCalcul, utilisateurId]);
    return result;
};