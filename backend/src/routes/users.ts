import { Router } from 'express';
import { createUser, login } from '../controllers/users.js';

const router = Router();

// POST /api/users/join
router.post('/join', createUser);

// POST /api/users/login
router.post('/login', login);

export default router;
