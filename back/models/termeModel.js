import connexion from '../config/bdd.js';

export const createTerme = async (nomTerme, definition, exemple) => {
    const query = "INSERT INTO termes (nomTerme, definition, exemple) VALUES (?, ?, ?);";
    const [result] = await connexion.query(query, [nomTerme, definition, exemple]);
    return result;
};

export const getAllTermes = async () => {
    const query = "SELECT idTerme, nomTerme, definition, exemple FROM termes ORDER BY nomTerme ASC;";
    const [result] = await connexion.query(query);
    return result;
};

export const getTermeNyId = async (idTerme) => {
    const query = "SELECT idTerme, nomTerme, definition, exemple FROM termes WHERE idTerme = ?;";
    const [result] = await connexion.query(query, [idTerme]);
    return result[0];
};

//Recherche d'un terme (Moteur de recherche)
export const searchTerme = async (recherche) => {
    const query = "SELECT idTerme, nomTerme, definition, exemple FROM termes WHERE nomTerme LIKE ?;";
    // % = tous les caractères avant et après la recherche
    const [result] = await connexion.query(query, [`%${recherche}%`]);
    return result;
};

// Modification d'un terme par l'administrateur
export const updateTerme = async (idTerme, nomTerme, definition, exemple) => {
    const query = "UPDATE termes SET nomTerme = ?, definition = ?, exemple = ? WHERE idTerme = ?;";
    const [result] = await connexion.query(query, [nomTerme, definition, exemple, idTerme]);
    return result;
};

// Suppression d'un terme par l'administrateur
export const deleteTerme = async (idTerme) => {
    const query = "DELETE FROM termes WHERE idTerme = ?;";
    const [result] = await connexion.query(query, [idTerme]);
    return result;
};
