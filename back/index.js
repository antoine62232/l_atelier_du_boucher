import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import roleRoute from './routes/roleRoute.js';
import ressourceRoute from './routes/ressourceRoute.js';
import termeRoute from './routes/termeRoute.js';
import avisRoute from './routes/avisRoute.js';
import tagRoute from './routes/tagRoute.js';
import pieceRoute from './routes/pieceRoute.js';
import partieRoute from './routes/partieRoute.js';
import animalRoute from './routes/animalRoute.js';
import raceRoute from './routes/raceRoute.js';
import questionRoute from './routes/questionRoute.js';
// Import de la connexion BDD (on s'assure qu'elle se lance)
import connexion from './config/bdd.js';

// Configuration
dotenv.config();
const app = express();

// Middleware
app.use(cors()); // Autorise le frontend à communiquer
app.use(express.json()); // Permet de lire le JSON dans req.body

// Routes
app.use('/api/users', userRoute);
app.use('/api/roles', roleRoute);
app.use('/api/avis', avisRoute);
app.use('/api/ressources', ressourceRoute);
app.use('/api/termes', termeRoute);
app.use('/api/tags', tagRoute);
app.use('/api/pieces', pieceRoute);
app.use('/api/parties', partieRoute);
app.use('/api/animaux', animalRoute);
app.use('/api/races', raceRoute);
app.use('/api/questions', questionRoute);
// Route de test 
app.get('/', (req, res) => {
    res.send("API L'Atelier du Boucher : En ligne 🥩");
});

// Lancement du serveur
app.listen(process.env.PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
    console.log(`🔗 http://localhost:${process.env.PORT}`);
});