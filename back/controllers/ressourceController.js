import * as ressourceModel from '../models/ressourceModel.js';

export const createRessource = async (req, res) => {
    const utilisateurId = req.user.id;
    const { typeTechnique, titre, urlVideo, descriptionTechnique, pieceId} = req.body;

    if (!typeTechnique || !titre || !pieceId) {
        return res.status(400).json({ error: "Titre, Type et Pièce sont requis" });
    }

    try {
        const result = await ressourceModel.createRessource(typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId);
        return res.status(201).json({ message: "Ressource créée avec succès !", id: result.insertId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur serveur lors de la création de la ressource" });
    }
};

export const getAllRessources = async (req, res) => {
    try {
        const result = await ressourceModel.getAllRessources();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des ressources" });
    }
};

export const getRessourceById = async (req, res) => {
    const idRessource = req.params.id;
    try {
        const result = await ressourceModel.getRessourceById(idRessource);
        if(!result) {
            return res.status(404).json({ error: "Ressource non trouvée" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de la ressource" });
    }
};

export const getRessourceByPiece = async (req, res) => {
    const pieceId = req.params.pieceId;
    try {
        const result = await ressourceModel.getRessourceByPiece(pieceId);
        if(!result) {
            return res.status(404).json({ message: "Aucune ressource trouvée pour cette pièce" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de la ressource" });
    }
};

export const getRessourceByPartie = async (req, res) => {
    const partieId = req.params.partieId;
    try {
        const result = await ressourceModel.getRessourceByPartie(partieId);
        if(!result) {
            return res.status(404).json({ message: "Aucune ressource trouvée pour cette partie" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de la ressource" });
    }
};

export const getRessourceByAnimal = async (req, res) => {
    const animalId = req.params.animalId;
    try {
        const result = await ressourceModel.getRessourceByAnimal(animalId);
        if(!result) {
            return res.status(404).json({ message: "Aucune ressource trouvée pour cet animal" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de la ressource" });
    }
};

export const updateRessource = async (req, res) => {
    const idRessource = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { typeTechnique, titre, urlVideo, descriptionTechnique, pieceId } = req.body;

    try {
        const ressource = await ressourceModel.getRessourceById(idRessource);
        if(!ressource) {
            return res.status(404).json({ error: "Ressource non trouvée" });
        }
        if(ressource.utilisateurId !== userId && userRole !== 1) {
            return res.status(403).json({ error: "Vous n'avez pas le droit de modifier cette ressource" });
        }
        await ressourceModel.updateRessource(idRessource, typeTechnique, titre, urlVideo, descriptionTechnique, pieceId);
        res.status(200).json({ message: "Ressource modifiée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la modification de la ressource" });
    }
};

export const deleteRessource = async (req, res) => {
    const idRessource = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const ressource = await ressourceModel.getRessourceById(idRessource);
        if(!ressource) {
            return res.status(404).json({ error: "Ressource non trouvée" });
        }
        if(ressource.utilisateurId !== userId && userRole !== 1) {
            return res.status(403).json({ error: "Vous n'avez pas le droit de supprimer cette ressource" });
        }
        await ressourceModel.deleteRessource(idRessource);
        res.status(200).json({ message: "Ressource supprimée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression de la ressource" });
    }
};