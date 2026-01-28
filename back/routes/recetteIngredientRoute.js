import express from 'express';
import * as recetteIngredientController from '../controllers/recetteIngredientController.js';
import { checkToken } from '../middleware/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, recetteIngredientController.addIngredient);
router.get('/:recetteId', checkToken, recetteIngredientController.getAllIngredientsByRecette);
router.put('/update', checkToken, recetteIngredientController.updateIngredient);
router.delete('/delete/:recetteId/:ingredientId', checkToken, recetteIngredientController.deleteIngredient);

export default router;