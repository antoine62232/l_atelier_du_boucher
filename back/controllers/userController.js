import * as userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../services/emailService.js';

dotenv.config();

export const createUser = async (req, res) => {
    const { nom, prenom, email, motDePasse, confirmationMotDePasse } = req.body;

    if (!nom || !prenom || !email || !motDePasse || !confirmationMotDePasse) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format d'email invalide" });
    }

    if (motDePasse.length < 8) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
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
        const user = await userModel.getUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);

        if (!isMatch) {
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        const token = jwt.sign(
            { id: user.idUtilisateur, role: user.roleId }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

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
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
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
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
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
        if (result.affectedRows === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
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
        if (result.affectedRows === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'utilisateur" });
    }
};

export const updatePasswordUser = async (req, res) => {
    const id = req.params.id;
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse || nouveauMotDePasse.length < 8) {
        return res.status(400).json({ error: "Mot de passe manquant ou trop court" });
    }

    try {
        const user = await userModel.getPasswordById(id);
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const isMatch = await bcrypt.compare(ancienMotDePasse, user.motDePasse);
        if (!isMatch) return res.status(401).json({ error: "Identifiants incorrects" });

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
        if (result.affectedRows === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression de l'utilisateur" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.getUserByEmail(email);

        if (!user) {
            return res.status(200).json({ error: "Si l'email existe, un lien de réinitialisation a été envoyé." });
        }

        const secret = process.env.JWT_SECRET + user.motDePasse;
        
        const payload = {
            id: user.idUtilisateur,
            email: user.email
        };
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        
        const link = `${process.env.FRONTEND_URL}/reset-password/${user.idUtilisateur}/${token}`;

        const subject = "Réinitialisation de votre mot de passe - L'Atelier du Boucher";
        const textMessage = `Bonjour ${user.prenom},\n\nVous avez demandé à réinitialiser votre mot de passe.\nCliquez ici : ${link}\n\nCe lien expire dans 15 minutes.`;
        const htmlMessage = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #8A1C25;">Réinitialisation de mot de passe</h2>
                <p>Bonjour <strong>${user.prenom}</strong>,</p>
                <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte.</p>
                <p>Si c'est bien vous, cliquez sur le bouton ci-dessous (valable 15 minutes) :</p>
                <div style="margin: 20px 0;">
                    <a href="${link}" style="background-color: #8A1C25; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Changer mon mot de passe</a>
                </div>
                <p style="font-size: 0.9em; color: #666;">Si le bouton ne fonctionne pas, copiez ce lien : <br/>${link}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
                <p style="font-size: 0.8em; color: #999;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
            </div>
        `;

        await sendEmail(email, subject, textMessage, htmlMessage);
        res.status(200).json({ message: "Si l'email existe, un lien de réinitialisation a été envoyé." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de l'envoi de l'email" });
    }
};

export const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { nouveauMotDePasse } = req.body;

    try {
        if (!nouveauMotDePasse || nouveauMotDePasse.length < 8) {
            return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caractères" });
        }

        const userPasswordData = await userModel.getPasswordById(id);
        
        if (!userPasswordData) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        const secret = process.env.JWT_SECRET + userPasswordData.motDePasse;

        try {
            jwt.verify(token, secret);
            
            const nouveauHash = await bcrypt.hash(nouveauMotDePasse, 10);
            await userModel.updatePasswordUser(id, nouveauHash);

            res.status(200).json({ message: "Mot de passe modifié avec succès !" });

        } catch (err) {
            return res.status(400).json({ error: "Le lien est invalide ou a expiré." });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};