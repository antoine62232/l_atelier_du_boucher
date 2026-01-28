import connexion from "../config/bdd.js";

export const createRecette = async (titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId) => {
    const query = `
    INSERT INTO recettes (titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connexion.query(query, [titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId]);
    return result;
};

export const getAllRecettes = async () => {
    const query = `
    SELECT recettes.idRecette, recettes.titre, recettes.tempsPreparation, recettes.tempsCuisson, recettes.difficulte, recettes.cout, recettes.nbPersonnes, recettes.pieceId, pieces.nomPiece
    FROM recettes
    JOIN pieces ON recettes.pieceId = pieces.idPiece
    `;
    const [result] = await connexion.query(query);
    return result;
};

export const getRecetteById = async (idRecette) => {
    const query = `
    SELECT recettes.idRecette, recettes.titre, recettes.tempsPreparation, recettes.tempsCuisson, recettes.difficulte, recettes.cout, recettes.nbPersonnes, recettes.pieceId, pieces.nomPiece
    FROM recettes
    JOIN pieces ON recettes.pieceId = pieces.idPiece
    WHERE recettes.idRecette = ?
    `;
    const [result] = await connexion.query(query, [idRecette]);
    return result[0];
};

export const updateRecette = async (idRecette, titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId) => {
    const query = `
    UPDATE recettes
    SET titre = ?, tempsPreparation = ?, tempsCuisson = ?, difficulte = ?, cout = ?, nbPersonnes = ?, pieceId = ?
    WHERE idRecette = ?
    `;
    const [result] = await connexion.query(query, [titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId, idRecette]);
    return result;
};

export const deleteRecette = async (idRecette) => {
    const query = `
    DELETE FROM recettes
    WHERE idRecette = ?
    `;
    const [result] = await connexion.query(query, [idRecette]);
    return result;
};