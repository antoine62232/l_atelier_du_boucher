import connexion from "../config/bdd.js";

export const createFaq = async (question, reponse, ordre) => {
    const requete = `
    INSERT INTO faq (question, reponse, ordre) 
    VALUES (?, ?, ?)
    `;
    const result = await connexion.query(requete, [question, reponse, ordre]);
    return result;
};

export const getAllFaqs = async () => {
    const query = `
    SELECT idFaq, question, reponse, ordre
    FROM faq
    ORDER BY ordre ASC, idFaq ASC
    `;
    const [result] = await connexion.query(query);
    return result;
};

export const updateFaq = async (idFaq, question, reponse, ordre) => {
    const requete = `
    UPDATE faq
    SET question = ?, reponse = ?, ordre = ?
    WHERE idFaq = ?
    `;
    const result = await connexion.query(requete, [question, reponse, ordre, idFaq]);
    return result;
};

export const deleteFaq = async (idFaq) => {
    const requete = `
    DELETE FROM faq
    WHERE idFaq = ?
    `;
    const result = await connexion.query(requete, [idFaq]);
    return result;
};
