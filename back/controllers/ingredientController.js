import * as ingredientModel from "../models/ingredientModel.js";

export const createIngredient = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès refusé" });
    }

    const { nomIngredient } = req.body;

    if (!nomIngredient) {
        return res.status(400).json({ message: "Le nom de l'ingrédient est obligatoire" });
    }

    try {
        const result = await ingredientModel.createIngredient(nomIngredient);
        res.status(201).json({ message: "Ingrédient créé avec succès", id: result.insertId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la création de l'ingrédient" });
    }
};

export const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await ingredientModel.getAllIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération des ingrédients" });
    }
};

export const getIngredientById = async (req, res) => {
    const id = req.params.id;
    try {
        const ingredient = await ingredientModel.getIngredientById(id);
        if (!ingredient) {
            return res.status(404).json({ message: "Ingrédient non trouvé" });
        }
        res.status(200).json(ingredient);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'ingrédient" });
    }
};

export const updateIngredient = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès refusé" });
    }

    const id = req.params.id;
    const { nomIngredient } = req.body;

    try {
        const result = await ingredientModel.updateIngredient(id, nomIngredient);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ingrédient non trouvé" });
        }
        res.status(200).json({ message: "Ingrédient modifié avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la modification de l'ingrédient" });
    }
};

export const deleteIngredient = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès refusé" });
    }

    const id = req.params.id;

    try {
        const result = await ingredientModel.deleteIngredient(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ingrédient non trouvé" });
        }
        res.status(200).json({ message: "Ingrédient supprimé avec succès" });
    } catch (error) {
        console.log(error);
        if ( error.errno === 1451) {
            return res.status(400).json({ message: "Impossible de supprimer : cet ingrédient est utilisé dans une recette." });
        }
        res.status(500).json({ message: "Erreur lors de la suppression de l'ingrédient" });
    }
};