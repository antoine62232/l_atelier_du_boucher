import * as roleController from '../controllers/roleController.js';
import express from 'express';
import {checkToken} from '../middleware/checkToken.js';
import {checkRole} from '../middleware/checkRole.js';

const router = express.Router();

router.post('/create', checkToken, checkRole(1), roleController.createRole);
router.get('/all', checkToken, checkRole(1), roleController.getAllRoles);
router.get('/:id', checkToken, checkRole(1), roleController.getRoleById);
router.put('/update/:id', checkToken, checkRole(1), roleController.updateRole);
router.delete('/delete/:id', checkToken, checkRole(1), roleController.deleteRole);

export default router;
