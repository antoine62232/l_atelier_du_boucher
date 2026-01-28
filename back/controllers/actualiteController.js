import * as actualiteModel from "../models/actualiteModel.js";
import fs from "fs";

export const createActualite = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }

    let imagePath = "";
    if (req.file) {
        imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (req.body.imageActualite) {
        imagePath = req.body.imageActualite;
    } else {
        imagePath = null;
    }


    const { titre, contenu, categorie, lienSource } = req.body;
    const utilisateurId = req.user.id;

    if (!titre || !contenu || !categorie) {
        return res.status(400).json({ message: "Titre, contenu et categorie sont obligatoires" });
    }

    try {
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
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la récupération de l'actualité" });
    }
};

export const updateActualite = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    const id = req.params.id;
    const { titre, contenu, imageActualite, categorie, lienSource } = req.body;

    try {
        const result = await actualiteModel.updateActualite(id, {titre, contenu, imageActualite, categorie, lienSource});
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Actualité non trouvée" });
        }
        return res.status(200).json({ message: "Actualité mise à jour avec succès", id: id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la mise à jour de l'actualité" });
    }
};

export const deleteActualite = async (req, res) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    const id = req.params.id;

    try {

        const actualite = await actualiteModel.getActualiteById(id);
        if (!actualite) {
            return res.status(404).json({ error: "Actualité non trouvée" });
        }

        if (actualite.imageActualite) {
            const nomFichier = actualite.imageActualite.split('/uploads/')[1];
            fs.unlink(`uploads/${nomFichier}`, (err) => {
                if (err) {
                    console.log("Erreur suppression image : ", err);
                } else {
                    console.log("Image supprimée avec succès");
                }
            });
        }

        const result = await actualiteModel.deleteActualite(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Erreur lors de la suppression de l'actualité." });
        }
        return res.status(200).json({ message: "Actualité et image supprimées avec succès" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la suppression de l'actualité" });
    }
};
