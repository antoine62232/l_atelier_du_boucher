import express from "express";
import * as contactController from "../controllers/contactController.js";
import { checkToken } from "../middleware/checkToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/create", contactController.createContact);
router.get("/all", checkToken, checkRole(1), contactController.getAllContacts);
router.put("/update/:id", checkToken, checkRole(1), contactController.updateStatutContact);
router.delete("/delete/:id", checkToken, checkRole(1), contactController.deleteContact);

export default router;
