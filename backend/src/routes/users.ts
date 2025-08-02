import { Router } from 'express';
import { createUser, login } from '../controllers/users.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

// POST /api/users/join
router.post('/join', upload.single('profileImage'), createUser);

// POST /api/users/login
router.post('/login', login);

export default router;
