import express from 'express';
import * as recetteIngredientController from '../controllers/recetteIngredientController.js';
import { checkToken } from '../middleware/checkToken.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/add', checkToken, checkRole(1), recetteIngredientController.addIngredient);
router.get('/:recetteId', recetteIngredientController.getAllIngredientsByRecette);
router.put('/update', checkToken, checkRole(1), recetteIngredientController.updateIngredient);
router.delete('/delete/:recetteId/:ingredientId', checkToken, checkRole(1), recetteIngredientController.deleteIngredient);

export default router;