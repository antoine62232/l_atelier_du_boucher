import express from 'express';
import * as termeController from '../controllers/termeController.js';
import { checkToken } from '../middleware/checkToken.js'

const router = express.Router();

router.post('/create', checkToken, termeController.createTerme);
router.get('/all', checkToken, termeController.getAllTermes);
router.get('/search', checkToken, termeController.searchTerme);
router.get('/:id', checkToken, termeController.getTermeById);
router.put('/update/:id', checkToken, termeController.updateTerme);
router.delete('/delete/:id', checkToken, termeController.deleteTerme);


export default router;