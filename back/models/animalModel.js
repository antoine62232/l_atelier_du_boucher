import connexion from '../config/bdd.js';

export const createAnimal = async (nomAnimal) => {
    const query = `
        INSERT INTO animaux (nomAnimal) 
        VALUES (?)
        `;
    const [result] = await connexion.query(query, [nomAnimal]);
    return result;
};

export const getAllAnimaux = async () => {
    const query = `
        SELECT animaux.idAnimal, animaux.nomAnimal FROM animaux`;
    const [result] = await connexion.query(query);
    return result;
};

export const getAnimalById = async (idAnimal) => {
    const query = `
        SELECT animaux.idAnimal, animaux.nomAnimal FROM animaux 
        WHERE animaux.idAnimal = ?
        `;
    const [result] = await connexion.query(query, [idAnimal]);
    return result[0];
};

export const updateAnimal = async (idAnimal, nomAnimal) => {
    const query = `
        UPDATE animaux 
        SET nomAnimal = ? 
        WHERE idAnimal = ?
        `;
    const [result] = await connexion.query(query, [nomAnimal, idAnimal]);
    return result;
};

export const deleteAnimal = async (idAnimal) => {
    const query = `
        DELETE FROM animaux 
        WHERE idAnimal = ?
        `;
    const [result] = await connexion.query(query, [idAnimal]);
    return result;
};