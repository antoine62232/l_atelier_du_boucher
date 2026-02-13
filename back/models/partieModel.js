import connexion from '../config/bdd.js';

export const createPartie = async (nomPartie, descriptionPartie, imagePartie, animalId) => {
    const query = `
        INSERT INTO parties (nomPartie, descriptionPartie, imagePartie, animalId) 
        VALUES (?,?,?,?)`;
    const [result] = await connexion.query(query, [nomPartie, descriptionPartie, imagePartie, animalId]);
    return result;
};

export const getAllParties = async () => {
    const query = `
        SELECT parties.idPartie, parties.nomPartie, parties.descriptionPartie, parties.imagePartie, parties.imagePartieInterieur, parties.animalId, animaux.nomAnimal 
        FROM parties 
        JOIN animaux ON parties.animalId = animaux.idAnimal 
        ORDER BY parties.nomPartie ASC`;
    const [result] = await connexion.query(query);
    return result;
};

export const getPartieById = async (idPartie) => {
    const query = `
        SELECT parties.idPartie, parties.nomPartie, parties.descriptionPartie, parties.imagePartie, parties.imagePartieInterieur, parties.animalId, animaux.nomAnimal 
        FROM parties 
        JOIN animaux ON parties.animalId = animaux.idAnimal 
        WHERE parties.idPartie = ?`;
    const [result] = await connexion.query(query, [idPartie]);
    return result[0];
};

export const getPartieByAnimal = async (animalId) => {
    const query = `
        SELECT parties.idPartie, parties.nomPartie, parties.descriptionPartie, parties.imagePartie, parties.animalId, animaux.nomAnimal 
        FROM parties 
        JOIN animaux ON parties.animalId = animaux.idAnimal 
        WHERE parties.animalId = ?
        ORDER BY parties.nomPartie ASC
        `;
    const [result] = await connexion.query(query, [animalId]);
    return result;
};

export const updatePartie = async (idPartie, nomPartie, descriptionPartie, imagePartie, animalId) => {
    const query = `
        UPDATE parties 
        SET nomPartie = ?, descriptionPartie = ?, imagePartie = ?, animalId = ? 
        WHERE idPartie = ?`;
    const [result] = await connexion.query(query, [nomPartie, descriptionPartie, imagePartie, animalId, idPartie]);
    return result;
};

export const deletePartie = async (idPartie) => {
    const query = `
        DELETE FROM parties 
        WHERE idPartie = ?`;
    const [result] = await connexion.query(query, [idPartie]);
    return result;
};

