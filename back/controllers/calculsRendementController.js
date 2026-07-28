import * as calculsRendementModel from "../models/calculsRendementModel.js";
import { calculerRendement } from "../utils/calculsRendement.js";

export const createCalcul = async (req, res) => {
    // Récupération des données
    const { pieceId, titreCalcul, poidsBrut, prixAchatKg, poidsNet, margeVisee, tauxTva, commentaire } = req.body;
    // Récupération de l'utilisateur
    const utilisateurId = req.user.id;
    // Vérification des données
    if (!pieceId || !titreCalcul || !poidsBrut || !prixAchatKg || !poidsNet || !margeVisee) {
        return res.status(400).json({ message: "Les champs obligatoires sont manquants" });
    }

    if (parseFloat(margeVisee) >= 100) {
        return res.status(400).json({ message: "La marge visée doit être inférieure à 100%" });
    }

    try {
        const { poidsPerte, resultatRendement, prixRevientKg, prixVenteConseilleKg, tva } =
            calculerRendement({ poidsBrut, poidsNet, prixAchatKg, margeVisee, tauxTva });

        // Préparation objet (Ordre des propriétés aligné sur la BDD pour la lisibilité)
        const calculData = {
            titreCalcul,
            poidsBrut: parseFloat(poidsBrut),
            prixAchatKg: parseFloat(prixAchatKg),
            poidsNet: parseFloat(poidsNet),
            poidsPerte: poidsPerte.toFixed(3),
            resultatRendement: resultatRendement.toFixed(2),
            margeVisee: parseFloat(margeVisee),
            tauxTVA: tva,
            prixRevientKg: prixRevientKg.toFixed(2),
            prixVenteConseilleKg: prixVenteConseilleKg.toFixed(2),
            commentaire: commentaire || null,
            utilisateurId,
            pieceId
        };

        // Appel du modèle
        const result = await calculsRendementModel.addCalcul(calculData);

        // Réponse
        res.status(201).json({
            message: "Calcul enregistré avec succès",
            idCalcul: result.insertId,
            donneesCalculees: calculData
        });

    } catch (error) {
        console.error("Erreur lors de l'enregistrement du calcul :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getCalculByUser = async (req, res) => {
    const idDemande = parseInt(req.params.id);
    const idConnecte = req.user.id;

    if (idDemande !== idConnecte) {
        return res.status(403).json({ error: "Accès interdit aux données d'un autre étudiant" });
    }
    try {
        const result = await calculsRendementModel.getHistoryByUser(idDemande);
        res.status(200).json(result);
    } catch (error) {
        console.error({ error: "Erreur lors de la récupération des calculs :" });
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const deleteCalcul = async (req, res) => {
    const idCalcul = req.params.id;
    const utilisateurId = req.user.id;

    try {
        const result = await calculsRendementModel.removeCalcul(idCalcul, utilisateurId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Calcul introuvable ou droits insuffisants" });
        }

        res.status(200).json({ message: "Calcul supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};