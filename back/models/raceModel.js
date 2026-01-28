import connexion from "../config/bdd.js";

export const createRace = async (nomRace, classification, animalId) => {
    const query = `
    INSERT INTO races (nomRace, classification, animalId)
    VALUES (?, ?, ?)
    `;
    const [result] = await connexion.query(query, [nomRace, classification, animalId]);
    return result;
};

export const getAllRaces = async () => {
    const query = `
    SELECT races.idRace, races.nomRace, races.classification, races.animalId, animaux.nomAnimal
    FROM races
    JOIN animaux ON races.animalId = animaux.idAnimal
    ORDER BY races.nomRace ASC
    `;
    const [result] = await connexion.query(query);
    return result;
};

export const getRaceById = async (idRace) => {
    const query = `
    SELECT races.idRace, races.nomRace, races.classification, races.animalId, animaux.nomAnimal
    FROM races
    JOIN animaux ON races.animalId = animaux.idAnimal
    WHERE races.idRace = ?
    `;
    const [result] = await connexion.query(query, [idRace]);
    return result[0];
};

// Afficher les races d'un animal spécifique
export const getRaceByAnimal = async (animalId) => {
    const query = `
    SELECT races.idRace, races.nomRace, races.classification, races.animalId, animaux.nomAnimal
    FROM races
    JOIN animaux ON races.animalId = animaux.idAnimal
    WHERE races.animalId = ?
    ORDER BY races.nomRace ASC
    `;
    const [result] = await connexion.query(query, [animalId]);
    return result;
};

export const updateRace = async (idRace, nomRace, classification, animalId) => {
    const query = `
    UPDATE races
    SET nomRace = ?, classification = ?, animalId = ?
    WHERE idRace = ?
    `;
    const [result] = await connexion.query(query, [nomRace, classification, animalId, idRace]);
    return result;
};
 export const deleteRace = async (idRace) => {
    const query = `
    DELETE FROM races
    WHERE idRace = ?
    `;
    const [result] = await connexion.query(query, [idRace]);
    return result;
};