import { Router } from 'express';
import {
  createUser,
  login,
  logout,
  getUserProfile,
  refresh,
  updateUser,
} from '../controllers/users.js';
import { authMiddleware, refreshMiddleware } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';

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
router.get('/me', refreshMiddleware, getUserProfile);

// PATCH /api/users/me
router.patch('/me', authMiddleware, updateUser);

export default router;
