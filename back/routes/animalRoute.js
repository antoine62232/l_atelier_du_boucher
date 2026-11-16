import express from 'express';
import * as animalController from '../controllers/animalController.js';
import { checkToken } from '../middleware/checkToken.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/create', checkToken, checkRole(1), animalController.createAnimal);
router.get('/all', checkToken, animalController.getAllAnimaux);
router.get('/:id', checkToken, animalController.getAnimalById);
router.put('/update/:id', checkToken, checkRole(1), animalController.updateAnimal);
router.delete('/delete/:id', checkToken, checkRole(1), animalController.deleteAnimal);

export default router;