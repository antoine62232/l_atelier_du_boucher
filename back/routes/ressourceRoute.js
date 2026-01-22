import express from 'express';
import * as ressourceController from '../controllers/ressourceController.js';
import { checkToken} from '../middleware/checkToken.js';

const router = express.Router();

router.post('/create', checkToken, ressourceController.createRessource);
router.get('/all', ressourceController.getAllRessources);
router.get('/:id', ressourceController.getRessourceById);
router.get('/piece/:pieceId', ressourceController.getRessourceByPiece);
router.get('/partie/:partieId', ressourceController.getRessourceByPartie);
router.get('/animal/:animalId', ressourceController.getRessourceByAnimal);
router.put('/update/:id', checkToken, ressourceController.updateRessource);
router.delete('/delete/:id', checkToken, ressourceController.deleteRessource);

export default router;