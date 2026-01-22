import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware pour vérifier la validité du token
export const checkToken = (req, res, next) => {
    
    // Vérifier si le token est présent dans l'en-tête Authorization
    const token = req.headers['authorization'].split(' ')[1];

    // Vérifier si le token est présent
    if (!token) {
        return res.status(401).json({ error: "Token manquant." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalide." });
    }
}