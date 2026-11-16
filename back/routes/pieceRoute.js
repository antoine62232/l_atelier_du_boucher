import express from 'express';
import * as pieceController from '../controllers/pieceController.js';
import { checkToken } from '../middleware/checkToken.js'
import { checkRole } from '../middleware/checkRole.js'

const router = express.Router();

router.post('/create', checkToken, checkRole(1), pieceController.createPiece);
router.get('/all', pieceController.getAllPieces);
router.get('/:id', pieceController.getPieceById);
router.get('/partie/:partieId', pieceController.getPiecesByPartie);
router.put('/update/:id', checkToken, checkRole(1), pieceController.updatePiece);
router.delete('/delete/:id', checkToken, checkRole(1), pieceController.deletePiece);

export default router;