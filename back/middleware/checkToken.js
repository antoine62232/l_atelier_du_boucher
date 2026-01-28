import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware pour vérifier la validité du token
export const checkToken = (req, res, next) => {
    // On récupère le header complet de manière sécurisé
    const authHeader = req.headers['authorization'];
    const token = authHeader &&authHeader.split(' ')[1];

    // Vérifier si le token est présent
    if (!token) {
        return res.status(401).json({ error: "Token manquant ou format incorrect." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalide." });
    }
}