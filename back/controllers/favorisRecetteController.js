import * as favorisRecetteModel from '../models/favorisRecetteModel.js';

export const toggleFavori = async (req, res) => {
    const utilisateurId = req.user.id;
    const recetteId = req.params.id;

    try {
        const existe = await favorisRecetteModel.checkFavori(utilisateurId, recetteId);
        
        if (existe) {
            await favorisRecetteModel.removeFavori(utilisateurId, recetteId);
            return res.status(200).json({ message: "Recette retirée des favoris", isFavori: false });
        } else {
            await favorisRecetteModel.addFavori(utilisateurId, recetteId);
            return res.status(201).json({ message: "Recette ajoutée aux favoris", isFavori: true });
        }
    } catch (error) {
        console.error("Erreur toggle favori recette :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const getMesFavoris = async (req, res) => {
    const utilisateurId = req.user.id;
    try {
        const favoris = await favorisRecetteModel.getFavorisByUser(utilisateurId);
        res.status(200).json(favoris);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des favoris" });
    }
};