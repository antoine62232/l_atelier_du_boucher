import * as favorisRessourceModel from '../models/favorisRessourceModel.js';

export const toggleFavori = async (req, res) => {
    const utilisateurId = req.user.id;
    const ressourceId = req.params.id;

    try {
        const existe = await favorisRessourceModel.checkFavori(utilisateurId, ressourceId);
        
        if (existe) {
            await favorisRessourceModel.removeFavori(utilisateurId, ressourceId);
            return res.status(200).json({ message: "Ressource retirée des favoris", isFavori: false });
        } else {
            await favorisRessourceModel.addFavori(utilisateurId, ressourceId);
            return res.status(201).json({ message: "Ressource ajoutée aux favoris", isFavori: true });
        }
    } catch (error) {
        console.error("Erreur toggle favori ressource :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const getMesFavoris = async (req, res) => {
    const utilisateurId = req.user.id;
    try {
        const favoris = await favorisRessourceModel.getFavorisByUser(utilisateurId);
        res.status(200).json(favoris);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des favoris" });
    }
};