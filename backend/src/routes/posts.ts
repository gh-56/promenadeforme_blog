import { Router } from 'express';
import { createPost, getPosts, getPostById } from '../controllers/posts.js';

const router = Router();

// POST /api/posts
router.post('/', createPost);

// GET /api/posts
router.get('/', getPosts);

// GET /api/posts:id
router.get('/:id', getPostById);

export default router;
