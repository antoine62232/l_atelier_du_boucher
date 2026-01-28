import connexion from "../config/bdd.js";

export const createContact = async (nom, prenom, email, objet, message, utilisateurId) => {
    const requete = `
    INSERT INTO contacts (nom, prenom, email, objet, message, utilisateurId) 
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await connexion.query(requete, [nom, prenom, email, objet, message, utilisateurId]);
    return result;
};

export const getAllContacts = async () => {
    const query = `
    SELECT idContact, nom, prenom, email, objet, message, dateEnvoi, statut, utilisateurId
    FROM contacts
    ORDER BY dateEnvoi DESC
    `;
    const [result] = await connexion.query(query);
    return result;
};

// Mettre à jour le statut (ex: "lu", "traité")
export const updateStatutContact = async (idContact, statut) => {
    const query = `
    UPDATE contacts
    SET statut = ?
    WHERE idContact = ?
    `;
    const result = await connexion.query(query, [statut, idContact]);
    return result;
};

export const deleteContact = async (idContact) => {
    const query = `
    DELETE FROM contacts
    WHERE idContact = ?
    `;
    const result = await connexion.query(query, [idContact]);
    return result;
};