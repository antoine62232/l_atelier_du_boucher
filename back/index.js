import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import de la connexion BDD (on s'assure qu'elle se lance)
import connexion from './config/bdd.js';

// Configuration
dotenv.config();
const app = express();

// Middleware
app.use(cors()); // Autorise le frontend à communiquer
app.use(express.json()); // Permet de lire le JSON dans req.body

// Route de test 
app.get('/', (req, res) => {
    res.send("API L'Atelier du Boucher : En ligne 🥩");
});

// Lancement du serveur
app.listen(process.env.PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
    console.log(`🔗 http://localhost:${process.env.PORT}`);
});