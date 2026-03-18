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
import reponseQcmRoute from './routes/reponseQcmRoute.js';
import recetteRoute from './routes/recetteRoute.js';
import ingredientRoute from './routes/ingredientRoute.js';
import recetteIngredientRoute from './routes/recetteIngredientRoute.js';
import instructionRoute from './routes/instructionRoute.js';
import calculsRendementRoute from './routes/calculsRendementRoute.js'; 
import actualiteRoute from './routes/actualiteRoute.js';
import contactRoute from './routes/contactRoute.js';
import faqRoute from './routes/faqRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import searchRoute from './routes/searchRoute.js';
// Import de la connexion BDD (on s'assure qu'elle se lance)
import connexion from './config/bdd.js';

// Configuration
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/reponses-qcm', reponseQcmRoute);
app.use('/api/recettes', recetteRoute);
app.use('/api/ingredients', ingredientRoute);
app.use('/api/recettes-ingredients', recetteIngredientRoute);
app.use('/api/instructions', instructionRoute);
app.use('/api/calculs-rendement', calculsRendementRoute);
app.use('/api/actualites', actualiteRoute);
app.use('/api/contacts', contactRoute);
app.use('/api/faq', faqRoute);
app.use('/api/search', searchRoute);

app.get('/', (req, res) => {
    res.send("API L'Atelier du Boucher : En ligne 🥩");
});

// Lancement du serveur
app.listen(process.env.PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
    console.log(`🔗 http://localhost:${process.env.PORT}`);
});