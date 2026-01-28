import * as partieModel from '../models/partieModel.js';

export const createPartie = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès réservé aux admins." });
    }
    const { nomPartie, descriptionPartie, imagePartie, animalId } = req.body;
    if (!nomPartie || !descriptionPartie || !imagePartie || !animalId) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    try {
        const result = await partieModel.createPartie(nomPartie, descriptionPartie, imagePartie, animalId);
        res.status(201).json({ message: "Partie créée avec succès", id: result.insertId });
    } catch (error) {
        console.error("Erreur lors de la création de la partie :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getAllParties = async (req, res) => {
    try {
        const result = await partieModel.getAllParties();
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération des parties :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getPartieById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await partieModel.getPartieById(id);
        if (!result) {
            return res.status(404).json({ message: "Partie non trouvée" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération de la partie :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getPartieByAnimal = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await partieModel.getPartieByAnimal(id);
        if (!result) {
            return res.status(404).json({ message: "Partie non trouvée" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération de la partie :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updatePartie = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès réservé aux admins." });
    }
    const id = req.params.id;
    const { nomPartie, descriptionPartie, imagePartie, animalId } = req.body;
    if (!nomPartie || !descriptionPartie || !imagePartie || !animalId) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    try {
        const result = await partieModel.updatePartie(id, nomPartie, descriptionPartie, imagePartie, animalId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Partie non trouvée" });
        }
        res.status(200).json({ message: "Partie modifiée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la modification de la partie :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const deletePartie = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès réservé aux admins." });
    }
    const id = req.params.id;
    try {
        const result = await partieModel.deletePartie(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Partie non trouvée" });
        }
        res.status(200).json({ message: "Partie supprimée avec succès" });
    } catch (error) {
        if (error.code === 1451) {
            return res.status(400).json({ error: "Impossible de supprimer : Des pièces de viande sont liées à cette partie." });
        }
        res.status(500).json({ message: "Erreur serveur" });
    }
};
