import express from 'express';
import * as partieController from '../controllers/partieController.js';
import { checkToken } from '../middleware/checkToken.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/create', checkToken, checkRole(1), partieController.createPartie);
router.get('/all', partieController.getAllParties);
router.get('/:id', partieController.getPartieById);
router.get('/animal/:id', partieController.getPartieByAnimal);
router.put('/update/:id', checkToken, checkRole(1), partieController.updatePartie);
router.delete('/delete/:id', checkToken, checkRole(1), partieController.deletePartie);

export default router;