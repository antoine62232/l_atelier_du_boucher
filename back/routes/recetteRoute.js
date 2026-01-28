import express from "express";
import * as recetteController from "../controllers/recetteController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/create", checkToken, recetteController.createRecette);
router.get("/all", recetteController.getAllRecettes);
router.get("/:id", recetteController.getRecetteById);
router.put("/update/:id", checkToken, recetteController.updateRecette);
router.delete("/delete/:id", checkToken, recetteController.deleteRecette);

export default router;
