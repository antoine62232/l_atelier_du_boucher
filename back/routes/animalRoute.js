import express from 'express';
import * as animalController from '../controllers/animalController.js';
import { checkToken } from '../middleware/checkToken.js';

const router = express.Router();

router.post('/create', checkToken, animalController.createAnimal);
router.get('/all', checkToken, animalController.getAllAnimaux);
router.get('/:id', checkToken, animalController.getAnimalById);
router.put('/update/:id', checkToken, animalController.updateAnimal);
router.delete('/delete/:id', checkToken, animalController.deleteAnimal);

export default router;