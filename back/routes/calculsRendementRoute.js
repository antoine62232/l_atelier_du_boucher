import express from "express";
import * as calculsRendementController from "../controllers/calculsRendementController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/create", checkToken, calculsRendementController.createCalcul);
router.get("/user/:id", checkToken, calculsRendementController.getCalculByUser);
router.delete("/delete/:id", checkToken, calculsRendementController.deleteCalcul);

export default router;