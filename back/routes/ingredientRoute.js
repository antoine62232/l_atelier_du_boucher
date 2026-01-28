import express from "express";
import * as ingredientController from "../controllers/ingredientController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/create", checkToken, ingredientController.createIngredient);
router.get("/all", ingredientController.getAllIngredients);
router.get("/:id", ingredientController.getIngredientById);
router.put("/update/:id", checkToken, ingredientController.updateIngredient);
router.delete("/delete/:id", checkToken, ingredientController.deleteIngredient);

export default router;