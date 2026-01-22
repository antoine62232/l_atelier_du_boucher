import connexion from '../config/bdd.js'

export const createRole = async (nomRole, descriptionRole) => {
    const create = "INSERT INTO roles (nomRole, descriptionRole) VALUES (?, ?);";
    const [result] = await connexion.query(create, [nomRole, descriptionRole]);
    return result;
};

export const getAllRoles = async () => {
    const select = "SELECT idRole, nomRole, descriptionRole FROM roles;";
    const [result] = await connexion.query(select);
    return result;
}

export const getRoleById = async (id) => {
    const selectById = "SELECT idRole, nomRole, descriptionRole FROM roles WHERE idRole = ?;";
    const [result] = await connexion.query(selectById, [id]);
    return result[0];
}

export const updateRole = async (id, nomRole, descriptionRole) => {
    const update = "UPDATE roles SET nomRole = ?, descriptionRole = ? WHERE idRole = ?;";
    const [result] = await connexion.query(update, [nomRole, descriptionRole, id]);
    return result;
}

export const deleteRole = async (id) => {
    const del = "DELETE FROM roles WHERE idRole = ?;";
    const [result] = await connexion.query(del, [id]);
    return result;
}
