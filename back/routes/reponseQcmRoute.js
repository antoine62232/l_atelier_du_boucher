import express from "express";
import * as reponseQcmController from "../controllers/reponseQcmController.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

router.post("/create", checkToken, reponseQcmController.createReponseQcm);
router.get("/all", reponseQcmController.getAllReponsesQcm);
router.get("/:id", reponseQcmController.getReponseQcmById);
router.get("/question/:id", reponseQcmController.getReponsesQcmByQuestion);
router.put("/update/:id", checkToken, reponseQcmController.updateReponseQcm);
router.delete("/delete/:id", checkToken, reponseQcmController.deleteReponseQcm);

export default router;