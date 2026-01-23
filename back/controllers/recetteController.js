import * as recetteModel from "../models/recetteModel.js";

export const createRecette = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès refusé" });
    }

    const { titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId } = req.body;

    if (!titre || !tempsPreparation || !tempsCuisson || !difficulte || !cout || !nbPersonnes || !pieceId) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs" });
    }

    try {
        const result = await recetteModel.createRecette(titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId);
        res.status(201).json({ message: "Recette créée avec succès", id: result.insertId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la création de la recette" });
    }
};

export const getAllRecettes = async (req, res) => {
    try {
        const recettes = await recetteModel.getAllRecettes();
        res.status(200).json(recettes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération des recettes" });
    }
};

export const getRecetteById = async (req, res) => {
    const id = req.params.id;
    try {
        const recette = await recetteModel.getRecetteById(id);
        if (!recette) {
            return res.status(404).json({ message: "Recette non trouvée" });
        }
        res.status(200).json(recette);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération de la recette" });
    }
};

export const updateRecette = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès refusé" });
    }

    const id = req.params.id;
    const { titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId } = req.body;

    try {
        const result = await recetteModel.updateRecette(id, titre, tempsPreparation, tempsCuisson, difficulte, cout, nbPersonnes, pieceId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Recette non trouvée" });
        }
        res.status(200).json({ message: "Recette modifiée avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la modification de la recette" });
    }
};

export const deleteRecette = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès refusé" });
    }

    const id = req.params.id;

    try {
        const result = await recetteModel.deleteRecette(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Recette non trouvée" });
        }
        res.status(200).json({ message: "Recette supprimée avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la suppression de la recette" });
    }
};