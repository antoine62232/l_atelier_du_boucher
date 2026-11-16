import express from 'express';
import * as tagController from '../controllers/tagController.js';
import { checkToken } from '../middleware/checkToken.js'
import { checkRole } from '../middleware/checkRole.js'

const router = express.Router();

router.post('/create', checkToken, checkRole(1), tagController.createTag);
router.get('/all', tagController.getAllTags);
router.get('/:id', tagController.getTagById);
router.put('/update/:id', checkToken, checkRole(1), tagController.updateTag);
router.delete('/delete/:id', checkToken, checkRole(1), tagController.deleteTag);

export default router;
