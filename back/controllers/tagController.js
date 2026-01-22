import * as tagModel from "../models/tagModel.js";

export const createTag = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(401).json({ message: "Vous n'avez pas accès à cette fonctionnalité" });
    }

    const { nomTag } = req.body;

    if (!nomTag) {
        return res.status(400).json({ message: "Le nom du tag est obligatoire" });
    }

    try {
        const result = await tagModel.createTag(nomTag);
        res.status(201).json({ message: "Tag créé avec succès", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la création du tag" });
    }
};

export const getAllTags = async (req, res) => {
    try {
        const result = await tagModel.getAllTags();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des tags" });
    }
};

export const getTagById = async (req, res) => {
    const idTag = req.params.id;
    try {
        const result = await tagModel.getTagById(idTag);
        if (!result) {
            return res.status(404).json({ message: "Tag non trouvé" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération du tag" });
    }
};

export const updateTag = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(401).json({ message: "Vous n'avez pas accès à cette fonctionnalité" });
    }

    const { nomTag } = req.body;
    const idTag = req.params.id;

    if (!nomTag) {
        return res.status(400).json({ message: "Le nom du tag est obligatoire" });
    }

    try {
        const result = await tagModel.updateTag(idTag, nomTag);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Tag non trouvé" });
        }
        res.status(200).json({ message: "Tag modifié avec succès", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la modification du tag" });
    }
};

export const deleteTag = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(401).json({ message: "Vous n'avez pas accès à cette fonctionnalité" });
    }

    const idTag = req.params.id;
    
    try {
        const result = await tagModel.deleteTag(idTag);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Tag non trouvé" });
        }
        res.status(200).json({ message: "Tag supprimé avec succès", id: result.insertId });
    } catch (error) {
        // Si le tag est utilisé par des pièces, SQL bloquera peut-être la suppression (Error 1451)
        if (error.errno === 1451) {
            return res.status(400).json({ message: "Impossible de supprimer ce tag car il est lié à des pièces de viande." });
        }
        console.error(error);
        res.status(500).json({ message: "Une erreur est survenue lors de la suppression du tag" });
    }
};

