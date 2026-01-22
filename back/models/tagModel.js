import connexion from '../config/bdd.js';

export const createTag = async (nomTag) => {
    const query = "INSERT INTO tags (nomTag) VALUES (?);";
    const [result] = await connexion.query(query, [nomTag]);
    return result;
};

export const getAllTags = async () => {
    const query = "SELECT idTag, nomTag FROM tags ORDER BY nomTag ASC;";
    const [result] = await connexion.query(query);
    return result;
};

export const getTagById = async (idTag) => {
    const query = "SELECT idTag, nomTag FROM tags WHERE idTag = ?;";
    const [result] = await connexion.query(query, [idTag]);
    return result[0];
};

export const updateTag = async (idTag, nomTag) => {
    const query = "UPDATE tags SET nomTag = ? WHERE idTag = ?;";
    const [result] = await connexion.query(query, [nomTag, idTag]);
    return result;
};

export const deleteTag = async (idTag) => {
    const query = "DELETE FROM tags WHERE idTag = ?;";
    const [result] = await connexion.query(query, [idTag]);
    return result;
};
