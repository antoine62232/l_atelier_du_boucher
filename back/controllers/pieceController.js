import * as pieceModel from "../models/pieceModel.js";

export const createPiece = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé. Seuls les admins peuvent ajouter des pièces." });
    }

    const {nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId} = req.body;

    if (!nomPiece || !partieId) {
        return res.status(400).json({ error: "Le nom de la pièce et l'ID de la partie sont requis" });
    }

    try {
        const result = await pieceModel.createPiece(nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId);
        res.status(201).json({ message: "Pièce créée avec succès !", id: result.insertId });
    } catch (error) {
        console.error(error);
        if (error.code === ER_NO_REFERENCED_ROW_2) {
            return res.status(400).json({ error: "L'ID de la partie n'existe pas" });
        }
        res.status(500).json({ error: "Erreur serveur lors de la création de la pièce" });
    }
};

export const getAllPieces = async (req, res) => {
    try {
        const result = await pieceModel.getAllPieces();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des pièces" });
    }
};

export const getPieceById = async (req, res) => {
    const idPiece = req.params.idPiece;
    try {
        const result = await pieceModel.getPieceById(idPiece);
        if (!result) {
            return res.status(404).json({ error: "Pièce non trouvée" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de la pièce" });
    }
};

export const getPiecesByPartie = async (req, res) => {
    const partieId = req.params.partieId;
    try {
        const result = await pieceModel.getPiecesByPartie(partieId);
        if (!result) {
            return res.status(404).json({ error: "Pièces non trouvées" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des pièces" });
    }
};

export const updatePiece = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé. Seuls les admins peuvent modifier des pièces." });
    }
    const idPiece = req.params.idPiece;
    const {nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId} = req.body;
    try {
        const result = await pieceModel.updatePiece(idPiece, nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pièce non trouvée" });
        }
        res.status(200).json({ message: "Pièce modifiée avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la modification de la pièce" });
    }
};

export const deletePiece = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé. Seuls les admins peuvent supprimer des pièces." });
    }
    const idPiece = req.params.idPiece;
    try {
        const result = await pieceModel.deletePiece(idPiece);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pièce non trouvée" });
        }
        res.status(200).json({ message: "Pièce supprimée avec succès !" });
    } catch (error) {
        console.error(error);
        if (error.errno === 1451) {
            return res.status(400).json({ error: "Impossible de supprimer : cette pièce est liée à des ressources ou des recettes." });
        }
        res.status(500).json({ error: "Erreur serveur lors de la suppression de la pièce" });
    }
};
