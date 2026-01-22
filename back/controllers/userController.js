import * as userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createUser = async (req, res) => {
    const { nom, prenom, email, motDePasse, confirmationMotDePasse } = req.body;

    if (!motDePasse || !confirmationMotDePasse) {
        return res.status(400).json({ error: "Les mots de passe sont obligatoires" });
    }

    if (motDePasse !== confirmationMotDePasse) {
        return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
    }

    try {
        const hashPassword = await bcrypt.hash(motDePasse, 10);
        const result = await userModel.createUser(nom, prenom, email, hashPassword);
        res.status(201).json({ 
            message: "Utilisateur créé avec succès", 
            idUtilisateur: result.insertId,
            roleId: 2 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const result = await userModel.getAllUsers();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
};

export const loginUser = async (req, res) => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
        return res.status(400).json({ error: "Email et mot de passe requis." });
    }

    try {
        // 2. Chercher l'utilisateur
        const user = await userModel.getUserByEmail(email);
        
        if (!user) {
            // Par sécurité, on ne dit pas si c'est l'email ou le mdp qui est faux
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        // 3. Vérifier le mot de passe (Comparaison du texte clair vs Hash BDD)
        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);

        if (!isMatch) {
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        // 4. Générer le Token JWT (Le fameux laisser-passer)
        // On y stocke l'ID et le Rôle (pratique pour le Front)
        const token = jwt.sign(
            { id: user.idUtilisateur, role: user.roleId }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' } // Le token expire dans 24h
        );

        // 5. Réponse au client
        res.status(200).json({
            message: "Connexion réussie",
            token: token,
            user: {
                id: user.idUtilisateur,
                nom: user.nom,
                prenom: user.prenom,
                role: user.roleId
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la connexion." });
    }
};

export const getProfileUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await userModel.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération du profil" });
    }
};

export const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await userModel.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de l'utilisateur" });
    }
};

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { nom, prenom, email } = req.body;

    if (!nom || !prenom || !email) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires" });        
    }
    try {
        const result = await userModel.updateUser(id, nom, prenom, email);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'utilisateur" });
    }
};

export const updateRoleUser = async (req, res) => {
    const id = req.params.id;
    const { nom, prenom, email, roleId } = req.body;

    if (!nom || !prenom || !email || !roleId) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires" });        
    }
    try {
        const result = await userModel.updateRoleUser(id, nom, prenom, email, roleId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'utilisateur" });
    }
};

export const updatePasswordUser = async (req, res) => {
    const id = req.params.id;
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
        return res.status(400).json({ error: "Les mots de passe sont obligatoires" });
    }

    try {
        const user = await userModel.getPasswordById(id);

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(ancienMotDePasse, user.motDePasse);

        if (!isMatch) {
            return res.status(401).json({ error: "Identifiants incorrects" });
        }

        const nouveauHash = await bcrypt.hash(nouveauMotDePasse, 10);

        await userModel.updatePasswordUser(id, nouveauHash);
        
        res.status(200).json({ message: "Mot de passe mis à jour avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour du mot de passe" });
    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await userModel.deleteUser(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression de l'utilisateur" });
    }
};
