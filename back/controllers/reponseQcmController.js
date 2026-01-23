import * as reponseQcmModel from "../models/reponseQcmModel.js";

export const createReponseQcm = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    const { texteReponse, resultatReponse, questionId } = req.body;

    if (!texteReponse || resultatReponse === undefined || !questionId) {
        return res.status(400).json({ error: "Texte, Résultat (vrai/faux) et ID question obligatoires." });
    }

    try {
        const result = await reponseQcmModel.createReponseQcm(texteReponse, resultatReponse, questionId);
        res.status(201).json({ message: "Réponse ajoutée avec succès", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const getAllReponsesQcm = async (req, res) => {
    try {
        const result = await reponseQcmModel.getAllReponsesQcm();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const getReponsesQcmByQuestion = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await reponseQcmModel.getReponsesQcmByQuestion(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const getReponseQcmById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await reponseQcmModel.getReponseQcmById(id);
        if (!result) {
            return res.status(404).json({ error: "Réponse non trouvée." });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const updateReponseQcm = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    const { texteReponse, resultatReponse, questionId } = req.body;
    const id = req.params.id;
    try {
        const result = await reponseQcmModel.updateReponseQcm(id, texteReponse, resultatReponse, questionId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Réponse non trouvée." });
        }
        res.status(200).json({ message: "Réponse mise à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const deleteReponseQcm = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    const id = req.params.id;
    try {
        const result = await reponseQcmModel.deleteReponseQcm(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Réponse non trouvée." });
        }
        res.status(200).json({ message: "Réponse supprimée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};