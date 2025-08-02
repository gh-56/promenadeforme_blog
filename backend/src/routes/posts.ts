import { Router } from 'express';
import { createPost, getPosts, getPostById } from '../controllers/posts.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// POST /api/posts
router.post('/', authMiddleware, createPost);

// GET /api/posts
router.get('/', getPosts);

// GET /api/posts:id
router.get('/:id', getPostById);

export default router;
