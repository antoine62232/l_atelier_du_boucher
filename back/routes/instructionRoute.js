import express from "express";
import * as instructionController from "../controllers/instructionController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/add", checkToken, instructionController.addInstruction);
router.get("/:recetteId", instructionController.getInstructionsByRecette);
router.put("/update/:id", checkToken, instructionController.updateInstruction);
router.delete("/delete/:id", checkToken, instructionController.deleteInstruction);

export default router;
