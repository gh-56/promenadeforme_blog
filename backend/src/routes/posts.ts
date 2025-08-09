import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/posts.js';
import { authMiddleware } from '../middlewares/auth.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

// POST /api/posts
router.post('/', authMiddleware, upload.array('images'), createPost);

// GET /api/posts
router.get('/', getPosts);

// GET /api/posts:id
router.get('/:id', getPostById);

// PATCH /api/posts:id
router.patch('/:id', authMiddleware, updatePost);

// DELETE /api/posts:id
router.delete('/:id', authMiddleware, deletePost);

export default router;
