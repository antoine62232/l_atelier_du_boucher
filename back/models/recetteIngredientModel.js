import connexion from "../config/bdd.js";

// Ajouter un ingrédient à une recette
export const addIngredientToRecette = async (recetteId, ingredientId, quantiteValeur, unite) => {
    const query = `
    INSERT INTO recettesIngredients (recetteId, ingredientId, quantiteValeur, unite)
    VALUES (?, ?, ?, ?)
    `;
    const [result] = await connexion.query(query, [recetteId, ingredientId, quantiteValeur, unite]);
    return result;
};

// Récupérer les ingrédients d'une recette
export const getIngredientsByRecette = async (recetteId) => {
    const query = `
    SELECT recettesIngredients.recetteId, recettesIngredients.ingredientId, recettesIngredients.quantiteValeur, recettesIngredients.unite, ingredients.nomIngredient
    FROM recettesIngredients
    JOIN ingredients ON recettesIngredients.ingredientId = ingredients.idIngredient
    WHERE recettesIngredients.recetteId = ?
    `;
    const [result] = await connexion.query(query, [recetteId]);
    return result;
};

// Mettre à jour un ingrédient dans une recette
export const updateRecetteIngredient = async (recetteId, ingredientId, quantiteValeur, unite) => {
    const query = `
    UPDATE recettesIngredients
    SET quantiteValeur = ?, unite = ?
    WHERE recetteId = ? AND ingredientId = ?
    `;
    const [result] = await connexion.query(query, [quantiteValeur, unite, recetteId, ingredientId]);
    return result;
};

// Retirer un ingrédient d'une recette
export const deleteIngredientFromRecette = async (recetteId, ingredientId) => {
    const query = `
    DELETE FROM recettesIngredients
    WHERE recetteId = ? AND ingredientId = ?
    `;
    const [result] = await connexion.query(query, [recetteId, ingredientId]);
    return result;
};


