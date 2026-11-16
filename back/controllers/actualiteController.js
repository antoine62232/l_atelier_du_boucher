import * as actualiteModel from "../models/actualiteModel.js";
import { uploadImage, supprimerImage } from "../services/imageService.js";

export const createActualite = async (req, res) => {
    const { titre, contenu, categorie, lienSource } = req.body;
    const utilisateurId = req.user.id;

    if (!titre || !contenu || !categorie) {
        return res.status(400).json({ error: "Titre, contenu et categorie sont obligatoires" });
    }

    try {
        let imagePath = req.body.imageActualite || null;
        if (req.file) {
            imagePath = await uploadImage(req.file.buffer);
        }

        const result = await actualiteModel.createActualite({
            titre, 
            contenu, 
            imageActualite: imagePath, 
            categorie, 
            lienSource, 
            utilisateurId
        });
        return res.status(201).json({ message: "Actualité publiée avec succès", id: result.insertId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la publication de l'actualité" });
    }
};

export const getAllActualites = async (req, res) => {
    try {
        const result = await actualiteModel.getAllActualites();
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la récupération des actualités" });
    }
};

export const getActualiteById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await actualiteModel.getActualiteById(id);
        if (!result) {
            return res.status(404).json({ error: "Actualité non trouvée" });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la récupération de l'actualité" });
    }
};

export const updateActualite = async (req, res) => {
    const id = req.params.id;
    const { titre, contenu, categorie, lienSource } = req.body;

    try {
        const actualite = await actualiteModel.getActualiteById(id);
        if (!actualite) {
            return res.status(404).json({ error: "Actualité non trouvée" });
        }

        let imagePath = actualite.imageActualite;
        if (req.file) {
            imagePath = await uploadImage(req.file.buffer);
        } else if (req.body.imageActualite !== undefined) {
            imagePath = req.body.imageActualite;
        }

        const result = await actualiteModel.updateActualite(id, {titre, contenu, imageActualite: imagePath, categorie, lienSource});
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Actualité non trouvée" });
        }
        if (req.file) {
            await supprimerImage(actualite.imageActualite);
        }
        return res.status(200).json({ message: "Actualité mise à jour avec succès", id: id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la mise à jour de l'actualité" });
    }
};

export const deleteActualite = async (req, res) => {
    const id = req.params.id;

    try {

        const actualite = await actualiteModel.getActualiteById(id);
        if (!actualite) {
            return res.status(404).json({ error: "Actualité non trouvée" });
        }

        const result = await actualiteModel.deleteActualite(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Erreur lors de la suppression de l'actualité." });
        }
        await supprimerImage(actualite.imageActualite);
        return res.status(200).json({ message: "Actualité et image supprimées avec succès" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la suppression de l'actualité" });
    }
};
