import express from "express";
import * as ingredientController from "../controllers/ingredientController.js";
import { checkToken } from "../middleware/checkToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/create", checkToken, checkRole(1), ingredientController.createIngredient);
router.get("/all", ingredientController.getAllIngredients);
router.get("/:id", ingredientController.getIngredientById);
router.put("/update/:id", checkToken, checkRole(1), ingredientController.updateIngredient);
router.delete("/delete/:id", checkToken, checkRole(1), ingredientController.deleteIngredient);

export default router;