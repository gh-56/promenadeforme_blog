import { Router } from 'express';
import { createPost } from '../controllers/posts.js';

const router = Router();

// 새로운 글을 저장하는 API (POST)
router.post('/', createPost);

export default router;
