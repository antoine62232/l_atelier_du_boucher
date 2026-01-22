import * as avisModel from '../models/avisModel.js';

export const createAvis = async (req, res) => {
    const utilisateurId = req.user.id;
    const { note, commentaire, ressourceId } = req.body;


//Validation
if (!note || !ressourceId) {
    return res.status(400).json({ error: "La note et l'ID de la ressource sont obligatoires" });
}

if (note < 0 || note > 5) {
    return res.status(400).json({ error: "La note doit être comprise entre 0 et 5" });
}

try {
    const result = await avisModel.createAvis(note, commentaire, utilisateurId, ressourceId);
    return res.status(201).json({ message: "Avis publié avec succès !", id: result.insertId });
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur lors de la création de l'avis" });
}
};

//Voir tous les avis
export const getAllAvis = async (req, res) => {
    try {
        const result = await avisModel.getAllAvis();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des avis" });
    }
};

// Voir les avis d'une ressource
export const getAvisByRessource = async (req, res) => {
    const ressourceId = req.params.id;
    try {
        const result = await avisModel.getAvisByRessource(ressourceId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de l'avis" });
    }
};

// Modifier un avis
export const updateAvis = async (req, res) => {
    const idAvis = req.params.id;
    const { note, commentaire } = req.body;
    const utilisateurId = req.user.id;

    try {
        // Récupération de l'avis pour voir à qui il appartient
        const avis = await avisModel.getAvisById(idAvis);

        if (!avis) {
            return res.status(404).json({ error: "Avis non trouvé" });
        };
        // Vérification que l'utilisateur est le propriétaire de l'avis
        if (avis.utilisateurId !== utilisateurId) {
            return res.status(403).json({ error: "Vous n'avez pas le droit de modifier cet avis" });
        }

        await avisModel.updateAvis(idAvis, note, commentaire);
        res.status(200).json({ message: "Avis modifié avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la modification de l'avis" });
    }
}

export const deleteAvis = async (req, res) => {
    const idAvis = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const avis = await avisModel.getAvisById(idAvis);
        if (!avis) {
            return res.status(404).json({ error: "Avis non trouvé" });
        }
        if (avis.utilisateurId !== userId && userRole !== 1) {
            return res.status(403).json({ error: "Vous n'avez pas le droit de supprimer cet avis" });
        }
        await avisModel.deleteAvis(idAvis);
        res.status(200).json({ message: "Avis supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression de l'avis" });
    }
}
