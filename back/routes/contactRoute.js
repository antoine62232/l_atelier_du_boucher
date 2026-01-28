import express from "express";
import * as contactController from "../controllers/contactController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/create", contactController.createContact);
router.get("/all", checkToken, contactController.getAllContacts);
router.put("/update/:id", checkToken, contactController.updateStatutContact);
router.delete("/delete/:id", checkToken, contactController.deleteContact);

export default router;
