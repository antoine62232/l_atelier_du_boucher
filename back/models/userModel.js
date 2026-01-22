import connexion from '../config/bdd.js';

// Création utilisateur
export const createUser = async (nom, prenom, email, motDePasse) => {
    const create = "INSERT INTO utilisateurs (nom, prenom, email, motDePasse, roleId) VALUES (?, ?, ?, ?, ?);";
    const [result] = await connexion.query(create, [nom, prenom, email, motDePasse, 2]);
    return result;
}

// Récupération de tous les utilisateurs
export const getAllUsers = async () => {
    const select = "SELECT idUtilisateur, nom, prenom, email, dateInscription, roleId FROM utilisateurs;";
    const [result] = await connexion.query(select);
    return result;
}

// Récupération utilisateur par ID
export const getUserById = async (id) => {
    const selectById = "SELECT idUtilisateur, nom, prenom, email, dateInscription, roleId FROM utilisateurs WHERE idUtilisateur = ?";
    const [result] = await connexion.query(selectById, [id]);
    return result[0];
}

// Récupération mot de passe utilisateur par ID
export const getPasswordById = async (id) => {
    const selectPasswordById = "SELECT motDePasse FROM utilisateurs WHERE idUtilisateur = ?";
    const [result] = await connexion.query(selectPasswordById, [id]);
    return result[0];
}

// Récupération utilisateur par email
export const getUserByEmail = async (email) => {
    const selectByEmail = "SELECT idUtilisateur, nom, prenom, email, motDePasse, dateInscription, roleId FROM utilisateurs WHERE email = ?";
    const [result] = await connexion.query(selectByEmail, [email]);
    return result[0];
}

// Modification infos utilisateur
export const updateUser = async (idUtilisateur, nom, prenom, email) => {
    const update = "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ? WHERE idUtilisateur = ?";
    const [result] = await connexion.query(update, [nom, prenom, email, idUtilisateur]);
    return result;
}

// Modification infos utilisateur par l'admin (y compris le rôle)
export const updateRoleUser = async (idUtilisateur, nom, prenom, email, roleId) => {
    const update = "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, roleId = ? WHERE idUtilisateur = ?";
    const [result] = await connexion.query(update, [nom, prenom, email, roleId, idUtilisateur]);
    return result;
}

// Modification mot de passe utilisateur
export const updatePasswordUser = async (idUtilisateur, nouveauHash) => {
    const update = "UPDATE utilisateurs SET motDePasse = ? WHERE idUtilisateur = ?";
    const [result] = await connexion.query(update, [nouveauHash, idUtilisateur]);
    return result;
}

// Suppression utilisateur
export const deleteUser = async (idUtilisateur) => {
    const del = "DELETE FROM utilisateurs WHERE idUtilisateur = ?";
    const [result] = await connexion.query(del, [idUtilisateur]);
    return result;
}

