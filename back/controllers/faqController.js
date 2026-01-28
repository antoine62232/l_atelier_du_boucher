import * as faqModel from "../models/faqModel.js";

export const createFaq = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const { question, reponse, ordre } = req.body;

    if (!question || !reponse) {
        return res.status(400).json({ error: "La question et la réponse sont obligatoires" });
    }

    try {
        const result = await faqModel.createFaq(question, reponse, ordre);
        res.status(201).json({ message: "FAQ créée avec succès", id: result.insertId });
    } catch (error) {
        console.error("Erreur lors de la création de la FAQ :", error);
        res.status(500).json({ error: "Erreur lors de la création de la FAQ" });
    }
};

export const getAllFaqs = async (req, res) => {

    try {
        const faq = await faqModel.getAllFaqs();
        res.status(200).json(faq);
    } catch (error) {
        console.error("Erreur lors de la récupération des FAQs :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des FAQs" });
    }
};

export const updateFaq = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const { id } = req.params;
    const { question, reponse, ordre } = req.body;
    try {
        const result = await faqModel.updateFaq(id, question, reponse, ordre);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "FAQ non trouvée" });
        }
        res.status(200).json({ message: "FAQ mise à jour avec succès" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la FAQ :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de la FAQ" });
    }
};

export const deleteFaq = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const { id } = req.params;
    try {
        const result = await faqModel.deleteFaq(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "FAQ non trouvée" });
        }
        res.status(200).json({ message: "FAQ supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de la FAQ :", error);
        res.status(500).json({ error: "Erreur lors de la suppression de la FAQ" });
    }
};


