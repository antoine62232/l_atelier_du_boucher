import express from 'express';
import * as raceController from '../controllers/raceController.js';
import { checkToken } from '../middleware/checkToken.js';

const router = express.Router();

router.post('/create', checkToken, raceController.createRace);
router.get('/all', checkToken, raceController.getAllRaces);
router.get('/:id', checkToken, raceController.getRaceById);
router.get('/animal/:animalId', checkToken, raceController.getRaceByAnimal);
router.put('/update/:id', checkToken, raceController.updateRace);
router.delete('/delete/:id', checkToken, raceController.deleteRace);

export default router;
