import * as userController from '../controllers/userController.js';
import express from 'express';
import { checkToken } from '../middleware/checkToken.js';
import { checkRole, checkSelfOrAdmin } from '../middleware/checkRole.js';

const router = express.Router();

// Routes publiques
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:id/:token', userController.resetPassword);

// Routes connectées
router.get('/profile', checkToken, userController.getProfileUser);
router.get('/all', checkToken, checkRole(1), userController.getAllUsers);
router.get('/:id', checkToken, checkSelfOrAdmin, userController.getUserById);

router.put('/update/:id', checkToken, checkSelfOrAdmin, userController.updateUser);
router.put('/password/:id', checkToken, checkSelfOrAdmin, userController.updatePasswordUser);
router.put('/admin/:id', checkToken, checkRole(1), userController.updateRoleUser);
router.delete('/delete/:id', checkToken, checkSelfOrAdmin, userController.deleteUser);

export default router;