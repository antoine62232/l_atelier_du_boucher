import express from "express";
import * as faqController from "../controllers/faqController.js";
import { checkToken } from "../middleware/checkToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/create", checkToken, checkRole(1), faqController.createFaq);
router.get("/all", faqController.getAllFaqs);
router.put("/update/:id", checkToken, checkRole(1), faqController.updateFaq);
router.delete("/delete/:id", checkToken, checkRole(1), faqController.deleteFaq);

export default router;