import connexion from '../config/bdd.js';

export const searchGlobal = async (recherche) => {
    const likeRecherche = `%${recherche}%`;

    // 1. On fouille dans le Lexique (termes)
    const queryTermes = `
        SELECT idTerme as id, nomTerme as titre, definition as description, 'terme' as type
        FROM termes
        WHERE nomTerme LIKE ? OR definition LIKE ?
        LIMIT 5;
    `;

    // 2. On fouille dans les Pièces de viande
    // Dans searchModel.js
    const queryPieces = `
        SELECT 
            pieces.idPiece AS id, 
            pieces.nomPiece AS titre, 
            'piece' AS type,
            pieces.partieId AS partieId
        FROM pieces
        -- JOIN parties ON pieces.partieId = parties.idPartie
        WHERE pieces.nomPiece LIKE ?
        LIMIT 5
    `;

    // On lance les deux recherches en parallèle
    const [termes] = await connexion.query(queryTermes, [likeRecherche, likeRecherche]);
    const [pieces] = await connexion.query(queryPieces, [likeRecherche]);

    // On renvoie un objet propre avec les deux listes
    return {
        termes: termes,
        pieces: pieces
    };
};