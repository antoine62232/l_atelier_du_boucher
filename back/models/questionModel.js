import connexion from "../config/bdd.js";

export const createQuestion = async (texteQuestion, typeQuestion, explication, pieceId, partieId, animalId, raceId) => {
    const query = `
    INSERT INTO questions (texteQuestion, typeQuestion, explication, pieceId, partieId, animalId, raceId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await connexion.query(query, [texteQuestion, typeQuestion, explication, pieceId, partieId, animalId, raceId]);
    return result;
}

export const getAllQuestions = async () => {
    const query = `
    SELECT questions.idQuestion, questions.texteQuestion, questions.typeQuestion, questions.explication, questions.pieceId, questions.partieId, questions.animalId, questions.raceId, pieces.nomPiece, parties.nomPartie, animaux.nomAnimal, races.nomRace 
    FROM questions
    LEFT JOIN pieces ON questions.pieceId = pieces.idPiece
    LEFT JOIN parties ON questions.partieId = parties.idPartie
    LEFT JOIN animaux ON questions.animalId = animaux.idAnimal
    LEFT JOIN races ON questions.raceId = races.idRace
    `;
    const [result] = await connexion.query(query);
    return result;
}

export const getQuestionById = async (idQuestion) => {
    const query = `
    SELECT questions.idQuestion, questions.texteQuestion, questions.typeQuestion, questions.explication, questions.pieceId, questions.partieId, questions.animalId, questions.raceId, pieces.nomPiece, parties.nomPartie, animaux.nomAnimal, races.nomRace 
    FROM questions
    LEFT JOIN pieces ON questions.pieceId = pieces.idPiece
    LEFT JOIN parties ON questions.partieId = parties.idPartie
    LEFT JOIN animaux ON questions.animalId = animaux.idAnimal
    LEFT JOIN races ON questions.raceId = races.idRace
    WHERE questions.idQuestion = ?
    `;
    const [result] = await connexion.query(query, [idQuestion]);
    return result[0];
}

export const updateQuestion = async (idQuestion, texteQuestion, typeQuestion, explication, pieceId, partieId, animalId, raceId) => {
    const query = `
    UPDATE questions
    SET texteQuestion = ?, typeQuestion = ?, explication = ?, pieceId = ?, partieId = ?, animalId = ?, raceId = ?
    WHERE idQuestion = ?
    `;
    const [result] = await connexion.query(query, [texteQuestion, typeQuestion, explication, pieceId, partieId, animalId, raceId, idQuestion]);
    return result;
}

export const deleteQuestion = async (idQuestion) => {
    const query = `
    DELETE FROM questions
    WHERE idQuestion = ?
    `;
    const [result] = await connexion.query(query, [idQuestion]);
    return result;
}

