import * as searchModel from '../models/searchModel.js';

export const getGlobalSearch = async (req, res) => {
    const { q } = req.query; // On récupère le mot tapé dans l'URL (?q=mot)

    // Si la recherche est vide ou trop courte, on renvoie des tableaux vides
    if (!q || q.length < 2) {
        return res.status(200).json({ termes: [], pieces: [] });
    }

    try {
        const resultats = await searchModel.searchGlobal(q);
        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la recherche globale:", error);
        res.status(500).json({ message: "Erreur serveur lors de la recherche" });
    }
};