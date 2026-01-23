import * as recetteIngredientModel from "../models/recetteIngredientModel.js";

export const addIngredient = async (req, res) => {
    if (req.user.role !== 1) return res.status(403).json({ error: "Accès refusé." });

    const { recetteId, ingredientId, quantiteValeur, unite } = req.body;

    if (!recetteId || !ingredientId || !quantiteValeur) {
        return res.status(400).json({ error: "Recette, Ingrédient et Quantité sont obligatoires." });
    }

    try {
        await recetteIngredientModel.addIngredientToRecette(recetteId, ingredientId, quantiteValeur, unite);
        res.status(201).json({ message: "Ingrédient ajouté à la recette." });
    } catch (error) {
        // Erreur 1062 = Doublon (si on essaie de mettre 2 fois le même ingrédient dans la même recette)
        if (error.errno === 1062) return res.status(400).json({ error: "Cet ingrédient est déjà dans la recette." });
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const getAllIngredientsByRecette = async (req, res) => {
    const id = req.params.recetteId;

    try {
        const ingredients = await recetteIngredientModel.getIngredientsByRecette(id);
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const updateIngredient = async (req, res) => {
    if (req.user.role !== 1) return res.status(403).json({ error: "Accès refusé." });

    const { recetteId, ingredientId, quantiteValeur, unite } = req.body;

    try {
        const result = await recetteIngredientModel.updateRecetteIngredient(recetteId, ingredientId, quantiteValeur, unite);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ingrédient non trouvé." });
        }
        res.status(200).json({ message: "Ingrédient modifié avec succès." });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
};

export const deleteIngredient = async (req, res) => {
    if (req.user.role !== 1) return res.status(403).json({ error: "Accès refusé." });

    // On récupère les données dans l'URL (ex: /api/recettesIngredients/1/2)
    const { recetteId, ingredientId } = req.params;

    try {
        const result = await recetteIngredientModel.deleteIngredientFromRecette(recetteId, ingredientId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Lien introuvable." });
        }
        res.status(200).json({ message: "Ingrédient retiré de la recette." });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
}
