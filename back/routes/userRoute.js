import * as userController from '../controllers/userController.js';
import express from 'express';
import { checkToken } from '../middleware/checkToken.js';

const router = express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile', checkToken, userController.getProfileUser);
router.get('/all', checkToken, userController.getAllUsers);
router.get('/:id', checkToken, userController.getUserById);
router.put('/update/:id', checkToken, userController.updateUser);
router.put('/password/:id', checkToken, userController.updatePasswordUser);
router.put('/admin/:id', checkToken, userController.updateRoleUser);
router.delete('/delete/:id', checkToken, userController.deleteUser);

export default router;
