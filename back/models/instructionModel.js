import connexion from "../config/bdd.js";

export const createInstruction = async (ordreEtape, descriptionEtape, recetteId) => {
    const query = `
    INSERT INTO instructions (ordreEtape, descriptionEtape, recetteId)
    VALUES (?, ?, ?)
    `;
    const [result] = await connexion.query(query, [ordreEtape, descriptionEtape, recetteId]);
    return result;
}

export const getInstructionsByRecette = async (recetteId) => {
    // On trie par ordre croissant pour avoir l'étape 1, puis 2, etc.
    const query = `
    SELECT ordreEtape, descriptionEtape FROM instructions 
    WHERE recetteId = ?
    ORDER BY ordreEtape ASC
    `;
    const [result] = await connexion.query(query, [recetteId]);
    return result;
}

export const updateInstruction = async (idInstruction, ordreEtape, descriptionEtape) => {
    const query = `
    UPDATE instructions 
    SET ordreEtape = ?, descriptionEtape = ?
    WHERE idInstruction = ?
    `;
    const [result] = await connexion.query(query, [ordreEtape, descriptionEtape, idInstruction]);
    return result;
}

export const deleteInstruction = async (id) => {
    const query = `
    DELETE FROM instructions 
    WHERE idInstruction = ?
    `;
    const [result] = await connexion.query(query, [id]);
    return result;
}