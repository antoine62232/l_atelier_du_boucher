import express from "express";
import * as faqController from "../controllers/faqController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/create", checkToken, faqController.createFaq);
router.get("/all", faqController.getAllFaqs);
router.put("/update/:id", checkToken, faqController.updateFaq);
router.delete("/delete/:id", checkToken, faqController.deleteFaq);

export default router;