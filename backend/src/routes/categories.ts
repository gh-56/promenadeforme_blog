import { Router } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// POST /api/categories
router.post('/', authMiddleware, createCategory);

// GET /api/categories
router.get('/', authMiddleware, getCategories);

// PATCH /api/categories:id
router.patch('/:id', authMiddleware, updateCategory);

// DELETE /api/categories:id
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
