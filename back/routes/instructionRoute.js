import express from "express";
import * as instructionController from "../controllers/instructionController.js";
import { checkToken } from "../middleware/checkToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/add", checkToken, checkRole(1), instructionController.addInstruction);
router.get("/:recetteId", instructionController.getInstructionsByRecette);
router.put("/update/:id", checkToken, checkRole(1), instructionController.updateInstruction);
router.delete("/delete/:id", checkToken, checkRole(1), instructionController.deleteInstruction);

export default router;
