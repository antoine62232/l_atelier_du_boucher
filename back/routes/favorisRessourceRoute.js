import express from 'express';
import * as favorisRessourceController from '../controllers/favorisRessourceController.js';
import { checkToken } from '../middleware/checkToken.js';

const router = express.Router();

router.post('/:id', checkToken, favorisRessourceController.toggleFavori);
router.get('/', checkToken, favorisRessourceController.getMesFavoris);

export default router;