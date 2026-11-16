import express from "express";
import * as reponseQcmController from "../controllers/reponseQcmController.js";
import { checkToken } from "../middleware/checkToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/create", checkToken, checkRole(1), reponseQcmController.createReponseQcm);
router.get("/all", reponseQcmController.getAllReponsesQcm);
router.get("/:id", reponseQcmController.getReponseQcmById);
router.get("/question/:id", reponseQcmController.getReponsesQcmByQuestion);
router.put("/update/:id", checkToken, checkRole(1), reponseQcmController.updateReponseQcm);
router.delete("/delete/:id", checkToken, checkRole(1), reponseQcmController.deleteReponseQcm);

export default router;