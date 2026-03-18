import express from 'express';
import * as searchController from '../controllers/searchController.js';

const router = express.Router();

// Route publique pour la recherche (GET /api/search?q=mot)
router.get('/', searchController.getGlobalSearch);

export default router;