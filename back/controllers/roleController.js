import * as roleModel from '../models/roleModel.js';

export const createRole = async (req, res) => {
    const { nomRole, descriptionRole } = req.body;

    if (!nomRole || !descriptionRole) {
        return res.status(400).json({ error: "Nom et description sont obligatoires" });
    }

    try {
        const result = await roleModel.createRole(nomRole, descriptionRole);
        res.status(201).json({ message: "Rôle créé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la création du rôle" });
    }
};

export const getAllRoles = async (req, res) => {
    try {
        const result = await roleModel.getAllRoles();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des rôles" });
    }
};

export const getRoleById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await roleModel.getRoleById(id);
        if (result.length === 0) {
            return res.status(404).json({ error: "Rôle non trouvé" });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération du rôle" });
    }
};

export const updateRole = async (req, res) => {
    const id = req.params.id;
    const { nomRole, descriptionRole } = req.body;
    try {
        const result = await roleModel.updateRole(id, nomRole, descriptionRole);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rôle non trouvé" });
        }
        res.status(200).json({ message: "Rôle mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour du rôle" });
    }
};

export const deleteRole = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await roleModel.deleteRole(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rôle non trouvé" });
        }
        res.status(200).json({ message: "Rôle supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression du rôle" });
    }
};

