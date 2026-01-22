import * as termeModel from "../models/termeModel.js";

export const createTerme = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé. Seuls les admins peuvent ajouter des termes." });
    }

    const {nomTerme, definition, exemple} = req.body;

    if (!nomTerme || !definition || !exemple) {
        return res.status(400).json({ error: "Nom, définition et exemple sont requis" });
    }

    try {
        const result = await termeModel.createTerme(nomTerme, definition, exemple);
        res.status(201).json({ message: "Terme créé avec succès !", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la création du terme" });
    }
};

export const getAllTermes = async (req, res) => {
    try {
        const result = await termeModel.getAllTermes();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur lors de la récupération des termes" });
    }
};

export const getTermeById = async (res, req) => {
    const idTerme = req.params.id;
    try {
        const result = await termeModel.getTermeById(idTerme);
        if (!result) {
            return res.status(404).json({ error: "Terme non trouvé" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur lors de la récupération du terme" });
    }
};

// Fonction de recherche de termes
export const searchTerme = async (req, res) => {
    const {q} = req.query; // On récupère le paramètre ?q=mot
    if (!q) {
        return res.status(400).json({ error: "Veuillez fournir un mot à rechercher" });
    }
    try {
        const result = await termeModel.searchTerme(q); // On recherche les termes
        if (!result) {
            return res.status(404).json({ error: "Aucun terme trouvé" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur lors de la recherche des termes" });
    }
};

export const updateTerme = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé. Seuls les admins peuvent modifier des termes." });
    }

    const {nomTerme, definition, exemple} = req.body;
    const idTerme = req.params.id;

    try {
        const result = await termeModel.updateTerme(idTerme, nomTerme, definition, exemple);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Terme non trouvé" });
        }
        res.status(200).json({ message: "Terme modifié avec succès !", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la modification du terme" });
    }
};

export const deleteTerme = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé. Seuls les admins peuvent supprimer des termes." });
    }

    const idTerme = req.params.id;
    try {
        const result = await termeModel.deleteTerme(idTerme);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Terme non trouvé" });
        }
        res.status(200).json({ message: "Terme supprimé avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression du terme" });
    }
};
