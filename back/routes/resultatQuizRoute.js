import express from "express";
import * as resultatQuizController from "../controllers/resultatQuizController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/save", checkToken, resultatQuizController.createScore);
router.get("/mes-scores", checkToken, resultatQuizController.getScores);

export default router;