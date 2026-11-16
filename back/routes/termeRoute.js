import express from 'express';
import * as termeController from '../controllers/termeController.js';
import { checkToken } from '../middleware/checkToken.js'
import { checkRole } from '../middleware/checkRole.js'

const router = express.Router();

router.post('/create', checkToken, checkRole(1), termeController.createTerme);
router.get('/all', termeController.getAllTermes);
router.get('/search', termeController.searchTerme);
router.get('/:id', checkToken, termeController.getTermeById);
router.put('/update/:id', checkToken, checkRole(1), termeController.updateTerme);
router.delete('/delete/:id', checkToken, checkRole(1), termeController.deleteTerme);


export default router;