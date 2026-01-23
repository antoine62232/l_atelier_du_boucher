import * as instructionModel from "../models/instructionModel.js";

export const addInstruction = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé." });
    }
    
    const { ordreEtape, descriptionEtape, recetteId } = req.body;

    if (!ordreEtape || !descriptionEtape || !recetteId) {
        return res.status(400).json({ error: "Tous les champs doivent être remplis." });
    }
    
    try {
        const result = await instructionModel.createInstruction(ordreEtape, descriptionEtape, recetteId);
        res.status(201).json({ message: "Instruction ajoutée avec succès.", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de l'ajout de l'instruction." });
    }
};

export const getInstructionsByRecette = async (req, res) => {

    // Ici le paramètre recetteId est récupéré de la route
    const recetteId = req.params.recetteId;
    
    try {
        const result = await instructionModel.getInstructionsByRecette(recetteId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des instructions." });
    }
};

export const updateInstruction = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé." });
    }
    
    const { ordreEtape, descriptionEtape } = req.body;
    const id = req.params.id;
    
    try {
        const result = await instructionModel.updateInstruction(id, ordreEtape, descriptionEtape);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Instruction non trouvée." });
        }
        res.status(200).json({ message: "Instruction mise à jour avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de l'instruction." });
    }
};

export const deleteInstruction = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès refusé." });
    }
    
    const id = req.params.id;
    
    try {
        const result = await instructionModel.deleteInstruction(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Instruction non trouvée." });
        }
        res.status(200).json({ message: "Instruction supprimée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de l'instruction." });
    }
};


