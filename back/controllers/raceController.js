import * as raceModel from "../models/raceModel.js";

export const createRace = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const { nomRace, classification, animalId } = req.body;

    if (!nomRace || !classification || !animalId) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs" });
    }

    try {
        const result = await raceModel.createRace(nomRace, classification, animalId);
        res.status(201).json({ message: "Race créée avec succès", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la création de la race" });
    }
};

export const getAllRaces = async (req, res) => {
    try {
        const result = await raceModel.getAllRaces();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des races" });
    }
};

export const getRaceById = async (req, res) => {
    try {
        const result = await raceModel.getRaceById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "Race non trouvée" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération de la race" });
    }
};

export const getRaceByAnimal = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await raceModel.getRaceByAnimal(id);
        if (!result) {
            return res.status(404).json({ error: "Race non trouvée" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des races" });
    }
};

export const updateRace = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const id = req.params.id;
    const { nomRace, classification, animalId } = req.body;

    if (!nomRace || !classification || !animalId) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs" });
    }

    try {
        const result = await raceModel.updateRace(id, nomRace, classification, animalId);
        if (!result) {
            return res.status(404).json({ error: "Race non trouvée" });
        }
        res.status(200).json({ message: "Race modifiée avec succès", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la modification de la race" });
    }
};

export const deleteRace = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const id = req.params.id;
    try {
        const result = await raceModel.deleteRace(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Race non trouvée" });
        }
        res.status(200).json({ message: "Race supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression de la race" });
    }
};
