import express from "express";
import * as questionController from "../controllers/questionController.js";
import { checkToken } from "../middleware/checkToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/create", checkToken, checkRole(1), questionController.createQuestion);
router.get("/all", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestionById);
router.put("/update/:id", checkToken, checkRole(1), questionController.updateQuestion);
router.delete("/delete/:id", checkToken, checkRole(1), questionController.deleteQuestion);

export default router;

