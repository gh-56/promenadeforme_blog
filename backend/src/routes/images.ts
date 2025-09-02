import { Router } from 'express';
import { upload } from '../middlewares/multer';
import { uploadImage, uploadProfileImage } from '../controllers/images.js';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// POST /api/images/upload/posts
router.post(
  '/upload/posts',
  authMiddleware,
  upload.array('images'),
  uploadImage,
);

// POST /api/images/upload/profile
router.post(
  '/upload/profile',
  upload.single('profileImage'),
  uploadProfileImage,
);

export default router;
