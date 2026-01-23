import connexion from "../config/bdd.js";

export const createIngredient = async (nomIngredient) => {
    const query = `
    INSERT INTO ingredients (nomIngredient)
    VALUES (?)
    `;
    const [result] = await connexion.query(query, [nomIngredient]);
    return result;
};

export const getAllIngredients = async () => {
    const query = `
    SELECT idIngredient, nomIngredient FROM ingredients
    ORDER BY nomIngredient ASC
    `;
    const [result] = await connexion.query(query);
    return result;
};

export const getIngredientById = async (idIngredient) => {
    const query = `
    SELECT idIngredient, nomIngredient FROM ingredients
    WHERE idIngredient = ?
    `;
    const [result] = await connexion.query(query, [idIngredient]);
    return result[0];
};

export const updateIngredient = async (idIngredient, nomIngredient) => {
    const query = `
    UPDATE ingredients
    SET nomIngredient = ?
    WHERE idIngredient = ?
    `;
    const [result] = await connexion.query(query, [nomIngredient, idIngredient]);
    return result;
};

export const deleteIngredient = async (idIngredient) => {
    const query = `
    DELETE FROM ingredients
    WHERE idIngredient = ?
    `;
    const [result] = await connexion.query(query, [idIngredient]);
    return result;
};