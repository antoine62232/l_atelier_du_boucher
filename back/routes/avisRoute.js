import express from 'express';
import { checkToken } from '../middleware/checkToken.js';
import * as avisController from '../controllers/avisController.js';

const router = express.Router();

router.post('/create', checkToken, avisController.createAvis);
router.get('/all', avisController.getAllAvis);
router.get('/:id', avisController.getAvisByRessource);
router.put('/update/:id', checkToken, avisController.updateAvis);
router.delete('/delete/:id', checkToken, avisController.deleteAvis);

export default router;