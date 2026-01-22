import * as roleController from '../controllers/roleController.js';
import express from 'express';
import {checkToken} from '../middleware/checkToken.js';

const router = express.Router();

router.post('/create', checkToken, roleController.createRole);
router.get('/all', checkToken, roleController.getAllRoles);
router.get('/:id', checkToken, roleController.getRoleById);
router.put('/update/:id', checkToken, roleController.updateRole);
router.delete('/delete/:id', checkToken, roleController.deleteRole);

export default router;
