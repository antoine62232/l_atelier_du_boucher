import * as animalModel from '../models/animalModel.js';

export const createAnimal = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès réservé aux admins." });
    }
    const { nomAnimal } = req.body;
    if (!nomAnimal) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs." });
    }

    try {
        const result = await animalModel.createAnimal(nomAnimal);
        res.status(201).json({ message: "Animal créé avec succès", id: result.insertId });
    } catch (error) {
        console.error("Erreur lors de la création de l'animal :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getAllAnimaux = async (req, res) => {
    try {
        const result = await animalModel.getAllAnimaux();
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération des animaux :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getAnimalById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await animalModel.getAnimalById(id);
        if (!result) {
            return res.status(404).json({ message: "Animal non trouvé" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'animal :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateAnimal = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès réservé aux admins." });
    }
    const id = req.params.id;
    const { nomAnimal } = req.body;
    if (!nomAnimal) {
        return res.status(400).json({ message: "Le nom est obligatoire." });
    }

    try {
        const result = await animalModel.updateAnimal(id, nomAnimal);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Animal non trouvé" });
        }
        res.status(200).json({ message: "Animal modifié avec succès" });
    } catch (error) {
        console.error("Erreur lors de la modification de l'animal :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const deleteAnimal = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès réservé aux admins." });
    }
    const id = req.params.id;
    try {
        const result = await animalModel.deleteAnimal(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Animal non trouvé" });
        }
        res.status(200).json({ message: "Animal supprimé avec succès" });
    } catch (error) {
        if (error.errno === 1451) {
            return res.status(400).json({ message: "L'animal est utilisé dans une partie" });
        }
        res.status(500).json({ message: "Erreur serveur" });
    }
};
