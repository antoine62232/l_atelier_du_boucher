import express from 'express';
import * as tagController from '../controllers/tagController.js';
import { checkToken } from '../middleware/checkToken.js'

const router = express.Router();

router.post('/create', checkToken, tagController.createTag);
router.get('/all', tagController.getAllTags);
router.get('/:id', tagController.getTagById);
router.put('/update/:id', checkToken, tagController.updateTag);
router.delete('/delete/:id', checkToken, tagController.deleteTag);

export default router;
