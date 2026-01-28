import express from "express";
import * as questionController from "../controllers/questionController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/create", checkToken, questionController.createQuestion);
router.get("/all", questionController.getAllQuestions);
router.get("/:id", questionController.getQuestionById);
router.put("/update/:id", checkToken, questionController.updateQuestion);
router.delete("/delete/:id", checkToken, questionController.deleteQuestion);

export default router;

