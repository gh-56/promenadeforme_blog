import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/multer';
import { uploadImage } from '../controllers/images.js';

const router = Router();

// POST /api/images/upload
router.post('/upload', authMiddleware, upload.single('images'), uploadImage);

export default router;
