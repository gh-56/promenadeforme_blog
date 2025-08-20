import { Router } from 'express';
import { createUser, login, logout, getUserProfile, refresh } from '../controllers/users.js';
import multer from 'multer';
import { authMiddleware } from '../middlewares/auth.js';

const upload = multer({ dest: 'uploads/' });

const router = Router();

// POST /api/users/join
router.post('/join', upload.single('profileImage'), createUser);

// POST /api/users/login
router.post('/login', login);

// GET /api/users/refresh
router.get('/refresh', refresh);

// POST /api/users/logout
router.post('/logout', logout);

// GET /api/users/me
router.get('/me', authMiddleware, getUserProfile);

export default router;
