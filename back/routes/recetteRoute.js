import express from "express";
import * as recetteController from "../controllers/recetteController.js";
import { checkToken } from "../middleware/checkToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/create", checkToken, checkRole(1), recetteController.createRecette);
router.get("/all", recetteController.getAllRecettes);
router.get("/:id", recetteController.getRecetteById);
router.put("/update/:id", checkToken, checkRole(1), recetteController.updateRecette);
router.delete("/delete/:id", checkToken, checkRole(1), recetteController.deleteRecette);

export default router;
