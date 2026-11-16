import express from 'express';
import * as raceController from '../controllers/raceController.js';
import { checkToken } from '../middleware/checkToken.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/create', checkToken, checkRole(1), raceController.createRace);
router.get('/all', checkToken, raceController.getAllRaces);
router.get('/:id', checkToken, raceController.getRaceById);
router.get('/animal/:animalId', checkToken, raceController.getRaceByAnimal);
router.put('/update/:id', checkToken, checkRole(1), raceController.updateRace);
router.delete('/delete/:id', checkToken, checkRole(1), raceController.deleteRace);

export default router;
