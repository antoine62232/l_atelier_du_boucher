import * as calculsRendementModel from "../models/calculsRendementModel.js";

export const createCalcul = async (req, res) => {
    // Récupération des données
    const { pieceId, titreCalcul, poidsBrut, prixAchatKg, poidsNet, margeVisee, tauxTva, commentaire} = req.body;
    // Récupération de l'utilisateur
    const utilisateurId = req.user.id;
    // Vérification des données
    if (!pieceId || !titreCalcul || !poidsBrut || !prixAchatKg || !poidsNet || !margeVisee || !tauxTva || !commentaire) {
        return res.status(400).json({ message: "Toutes les données sont obligatoires" });
    }
    
    try {
        // Conversion
        const pb = parseFloat(poidsBrut);
        const pn = parseFloat(poidsNet);
        const pa = parseFloat(prixAchatKg);
        const mv = parseFloat(margeVisee);
        const tva = tauxTva ? parseFloat(tauxTva) : 5.50;

        // Calculs
        const poidsPerte = pb - pn;
        const resultatRendement = (pn / pb) * 100;
        const prixRevientKg = (pb * pa) / pn;
        const prixVenteHt = prixRevientKg / (1 - mv / 100);
        const prixVenteConseilleKg = prixVenteHt * (1 + (tva / 100));

        // Préparation objet (Ordre des propriétés aligné sur la BDD pour la lisibilité)
        const calculData = {
            titreCalcul,
            poidsBrut: pb,
            prixAchatKg: pa,
            poidsNet: pn,
            poidsPerte: poidsPerte.toFixed(3),
            resultatRendement: resultatRendement.toFixed(2),
            margeVisee: mv,
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
        console.error({error: "Erreur lors de la récupération des calculs :"});
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