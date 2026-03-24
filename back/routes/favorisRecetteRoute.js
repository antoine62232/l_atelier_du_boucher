import express from 'express';
import * as favorisRecetteController from '../controllers/favorisRecetteController.js';
import { checkToken } from '../middleware/checkToken.js';

const router = express.Router();

router.post('/:id', checkToken, favorisRecetteController.toggleFavori);
router.get('/', checkToken, favorisRecetteController.getMesFavoris);

export default router;