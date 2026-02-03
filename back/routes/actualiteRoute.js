import express from "express";
import * as actualiteController from "../controllers/actualiteController.js";
import { checkToken } from "../middleware/checkToken.js";
import multer from "../middleware/multer-config.js";

const router = express.Router();

router.post("/create", checkToken, multer, actualiteController.createActualite);
router.get("/all", actualiteController.getAllActualites);
router.get("/:id", actualiteController.getActualiteById);
router.put("/update/:id", checkToken, multer, actualiteController.updateActualite);
router.delete("/delete/:id", checkToken, actualiteController.deleteActualite);

export default router;
