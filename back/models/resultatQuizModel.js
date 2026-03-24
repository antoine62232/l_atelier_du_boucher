import connexion from "../config/bdd.js";

export const saveScore = async (utilisateurId, score, total) => {
    const query = "INSERT INTO resultatsQuiz (utilisateurId, score, total) VALUES (?, ?, ?)";
    const [result] = await connexion.query(query, [utilisateurId, score, total]);
    return result;
};

export const getScoresByUser = async (utilisateurId) => {
    const query = "SELECT * FROM resultatsQuiz WHERE utilisateurId = ? ORDER BY datePassage DESC";
    const [result] = await connexion.query(query, [utilisateurId]);
    return result;
};