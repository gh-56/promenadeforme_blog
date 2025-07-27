import { Router } from 'express';
import { createPost, getPosts, getPostById } from '../controllers/posts.js';

const router = Router();

// 새로운 글을 저장하는 API (POST)
router.post('/', createPost);

// 글 목록을 불러오는 API (GET)
router.get('/', getPosts);

// 선택한 글 목록 불러오는 API (GET)
router.get('/:id', getPostById);

export default router;
