import * as contactModel from "../models/contactModel.js";

export const createContact = async (req, res) => {
    const { nom, prenom, email, objet, message } = req.body;

    const utilisateurId = req.body.utilisateurId || null;

    if (!email || !objet || !message) {
        return res.status(400).json({ error: "Email, objet et message sont obligatoires" });
    }
    try {
        const result = await contactModel.createContact(nom, prenom, email, objet, message, utilisateurId);
        res.status(201).json({ message: "Votre message a bien été envoyé.",  id: result.insertId });
    } catch (error) {
        console.error("Erreur contact :", error);
        res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
};

export const getAllContacts = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    try {
        const contacts = await contactModel.getAllContacts();
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Erreur lors de la récupération des contacts :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des contacts" });
    }
};

export const updateStatutContact = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const { id } = req.params;
    const { statut } = req.body;
    try {
        const result = await contactModel.updateStatutContact(id, statut);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Message non trouvé" });
        }
        res.status(200).json({ message: "Statut mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du statut" });
    }
};

export const deleteContact = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Accès non autorisé" });
    }
    const { id } = req.params;
    try {
        const result = await contactModel.deleteContact(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Message non trouvé" });
        }
        res.status(200).json({ message: "Message supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du message :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du message" });
    }
};


