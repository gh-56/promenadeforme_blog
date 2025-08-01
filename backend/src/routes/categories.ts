import { Router } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.js';

const router = Router();

// POST /api/categories
router.post('/', createCategory);

// GET /api/categories
router.get('/', getCategories);

// PATCH /api/categories:id
router.patch('/:id', updateCategory);

// DELETE /api/categories:id
router.delete('/:id', deleteCategory);

export default router;
