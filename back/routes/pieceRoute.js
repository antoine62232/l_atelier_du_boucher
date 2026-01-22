import express from 'express';
import * as pieceController from '../controllers/pieceController.js';
import { checkToken } from '../middleware/checkToken.js'

const router = express.Router();

router.post('/create', checkToken, pieceController.createPiece);
router.get('/all', pieceController.getAllPieces);
router.get('/:id', pieceController.getPieceById);
router.get('/partie/:partieId', pieceController.getPiecesByPartie);
router.put('/update/:id', checkToken, pieceController.updatePiece);
router.delete('/delete/:id', checkToken, pieceController.deletePiece);

export default router;