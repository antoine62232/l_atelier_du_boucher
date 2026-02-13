import express from 'express';
import * as partieController from '../controllers/partieController.js';
import { checkToken } from '../middleware/checkToken.js';

const router = express.Router();

router.post('/create', checkToken, partieController.createPartie);
router.get('/all', partieController.getAllParties);
router.get('/:id', partieController.getPartieById);
router.get('/animal/:id', partieController.getPartieByAnimal);
router.put('/update/:id', checkToken, partieController.updatePartie);
router.delete('/delete/:id', checkToken, partieController.deletePartie);

export default router;