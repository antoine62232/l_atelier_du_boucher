import connexion from "../config/bdd.js";

export const createActualite = async (donnees) => {
    const { titre, contenu, imageActualite, categorie, lienSource, utilisateurId } = donnees;
    const query =`
        INSERT INTO actualites 
        (titre, contenu, imageActualite, categorie, lienSource, utilisateurId)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [result] = await connexion.query(query, [titre, contenu, imageActualite, categorie, lienSource, utilisateurId]);
    return result;
};

export const getAllActualites = async () => {
    const query = `
        SELECT idActualite, titre, contenu, imageActualite, categorie, lienSource, datePublication, utilisateurId
        FROM actualites
        ORDER BY datePublication ASC
    `;
    const [result] = await connexion.query(query);
    return result;
};

export const getActualiteById = async (idActualite) => {
    const query = `
        SELECT idActualite, titre, contenu, imageActualite, categorie, lienSource, datePublication, utilisateurId
        FROM actualites
        WHERE idActualite = ?
    `;
    const [result] = await connexion.query(query, [idActualite]);
    return result[0];
};

export const updateActualite = async (idActualite, donnees) => {
    const { titre, contenu, imageActualite, categorie, lienSource } = donnees;
    const query = `
        UPDATE actualites
        SET titre = ?, contenu = ?, imageActualite = ?, categorie = ?, lienSource = ?
        WHERE idActualite = ?
    `;
    const [result] = await connexion.query(query, [titre, contenu, imageActualite, categorie, lienSource, idActualite]);
    return result;
};

export const deleteActualite = async (idActualite) => {
    const query = `
        DELETE FROM actualites
        WHERE idActualite = ?
    `;
    const [result] = await connexion.query(query, [idActualite]);
    return result;
};