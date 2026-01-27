import express from "express";
import * as actualiteController from "../controllers/actualiteController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/create", checkToken, actualiteController.createActualite);
router.get("/all", checkToken, actualiteController.getAllActualites);
router.get("/:id", checkToken, actualiteController.getActualiteById);
router.put("/update/:id", checkToken, actualiteController.updateActualite);
router.delete("/delete/:id", checkToken, actualiteController.deleteActualite);

export default router;
