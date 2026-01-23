import *as questionModel from "../models/questionModel.js";

export const createQuestion = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }

    const { texteQuestion, typeQuestion, explication, pieceId, partieId, animalId, raceId } = req.body;

    if (!pieceId && !partieId && !animalId && !raceId) {
        return res.status(400).json({ error: "La question doit être liée à quelque chose (Pièce, Partie, Animal ou Race)." });
    }
    try {
        const result = await questionModel.createQuestion(texteQuestion, typeQuestion, explication, pieceId || null, partieId || null, animalId || null, raceId || null);
        res.status(201).json({ message: "Question créée avec succès", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création de la question" });
    }
};

export const getAllQuestions = async (req, res) => {
    try {
        const result = await questionModel.getAllQuestions();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des questions" });
    }
};

export const getQuestionById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await questionModel.getQuestionById(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la question" });
    }
};

export const updateQuestion = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const id = req.params.id;
    const { texteQuestion, typeQuestion, explication, pieceId, partieId, animalId, raceId } = req.body;
    try {
        const result = await questionModel.updateQuestion(id, texteQuestion, typeQuestion, explication, pieceId || null, partieId || null, animalId || null, raceId || null);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Question non trouvée" });
        }
        res.status(200).json({ message: "Question mise à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de la question" });
    }
};

export const deleteQuestion = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const id = req.params.id;
    try {
        const result = await questionModel.deleteQuestion(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Question non trouvée" });
        }
        res.status(200).json({ message: "Question supprimée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de la question" });
    }
};
