import connexion from '../config/bdd.js';

export const createAvis = async (note, commentaire, utilisateurId, ressourceId) => {
    const create = "INSERT INTO avis (note, commentaire, utilisateurId, ressourceId) VALUES (?, ?, ?, ?);";
    const [result] = await connexion.query(create, [note, commentaire, utilisateurId, ressourceId]);
    return result;
};

export const getAllAvis = async () => {
    const select = "SELECT note, commentaire, utilisateurId, ressourceId FROM avis;";
    const [result] = await connexion.query(select);
    return result;
}

// Lire les avis d'une ressource avec le nom et prénom de l'utilisateur
export const getAvisByRessource = async (ressourceId) => {
    const select = `
    SELECT note, commentaire, utilisateurId, ressourceId, utilisateurs.nom, utilisateurs.prenom
    FROM avis
    JOIN utilisateurs ON avis.utilisateurId = utilisateurs.idUtilisateur
    WHERE avis.ressourceId = ?
    ORDER BY avis.dateAvis DESC
    `;
    const [result] = await connexion.query(select, [ressourceId]);
    return result;
}

//Récupérer un avis spécifique
export const getAvisById = async (idAvis) => {
    const select = "SELECT note, commentaire, utilisateurId, ressourceId FROM avis WHERE idAvis = ?;";
    const [result] = await connexion.query(select, [idAvis]);
    return result[0];
}

export const updateAvis = async (idAvis, note, commentaire) => {
    const update = "UPDATE avis SET note = ?, commentaire = ? WHERE idAvis = ?;";
    const [result] = await connexion.query(update, [note, commentaire, idAvis]);
    return result;
}

export const deleteAvis = async (idAvis) => {
    const del = "DELETE FROM avis WHERE idAvis = ?;";
    const [result] = await connexion.query(del, [idAvis]);
    return result;
}
