import * as resultatQuizModel from "../models/resultatQuizModel.js";

export const createScore = async (req, res) => {
    const utilisateurId = req.user.id;
    const { score, total } = req.body;

    if (score === undefined || !total) {
        return res.status(400).json({ error: "Score et total manquants" });
    }

    try {
        const result = await resultatQuizModel.saveScore(utilisateurId, score, total);
        res.status(201).json({ message: "Score enregistré !", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la sauvegarde du score" });
    }
};

export const getScores = async (req, res) => {
    const utilisateurId = req.user.id;
    try {
        const result = await resultatQuizModel.getScoresByUser(utilisateurId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des scores" });
    }
};