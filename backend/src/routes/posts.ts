import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  getPostByUser,
  updatePost,
  deletePost,
  getDraftPosts,
  getPostsByCategory,
} from '../controllers/posts.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// GET /api/posts/me
router.get('/me', authMiddleware, getPostByUser);

// GET /api/posts/drafts
router.get('/drafts', authMiddleware, getDraftPosts);

// POST /api/posts/category
router.get('/category/:categoryName', getPostsByCategory);

// GET /api/posts:id
router.get('/:id', getPostById);

// POST /api/posts
router.post('/', authMiddleware, createPost);

// GET /api/posts
router.get('/', getPosts);

// PATCH /api/posts:id
router.patch('/:id', authMiddleware, updatePost);

// DELETE /api/posts:id
router.delete('/:id', authMiddleware, deletePost);

export default router;
