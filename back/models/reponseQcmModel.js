import connexion from "../config/bdd.js";

export const createReponseQcm = async (texteReponse, resultatReponse, questionId) => {
    const query = `
    INSERT INTO reponsesQcm (texteReponse, resultatReponse, questionId)
    VALUES (?, ?, ?)
    `;
    const [result] = await connexion.query(query, [texteReponse, resultatReponse, questionId]);
    return result;
};

export const getAllReponsesQcm = async () => {
    const query = `
    SELECT idReponse, texteReponse, resultatReponse, questionId, questions.texteQuestion 
    FROM reponsesQcm
    JOIN questions ON reponsesQcm.questionId = questions.idQuestion
    `;
    const [result] = await connexion.query(query);
    return result;
};

// Récupère toutes les réponses QCM d'une question
export const getReponsesQcmByQuestion = async (questionId) => {
    const query = `
    SELECT idReponse, texteReponse, resultatReponse, questionId 
    FROM reponsesQcm
    WHERE questionId = ?
    `;
    const [result] = await connexion.query(query, [questionId]);
    return result;
};

export const getReponseQcmById = async (id) => {
    const query = `
    SELECT idReponse, texteReponse, resultatReponse, questionId 
    FROM reponsesQcm
    WHERE idReponse = ?
    `;
    const [result] = await connexion.query(query, [id]);
    return result[0];
};

export const updateReponseQcm = async (id, texteReponse, resultatReponse, questionId) => {
    const query = `
    UPDATE reponsesQcm
    SET texteReponse = ?, resultatReponse = ?, questionId = ?
    WHERE idReponse= ?
    `;
    const [result] = await connexion.query(query, [texteReponse, resultatReponse, questionId, id]);
    return result;
};

export const deleteReponseQcm = async (id) => {
    const query = `
    DELETE FROM reponsesQcm
    WHERE idReponse = ?
    `;
    const [result] = await connexion.query(query, [id]);
    return result;
};

